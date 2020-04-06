class FormLayoutSearch {
    constructor () {
        this.objects = [];

        document
            .querySelectorAll('.ds44-facette form')
            .forEach((element) => {
                this.create(element);
            });
    }

    create (element) {
        const object = {
            'id': MiscUtils.generateId(),
            'containerElement': element.closest('.ds44-facette'),
            'formElement': element,
            'parameters': {},
            'searchData': {},
            'hasSearched': false
        };
        this.objects.push(object);
        const objectIndex = (this.objects.length - 1);

        // Bind events
        MiscEvent.addListener('form:submit', this.submit.bind(this, objectIndex), object.formElement);
        MiscEvent.addListener('search:refresh', this.search.bind(this, objectIndex));
        object.containerElement
            .querySelectorAll('.ds44-js-toggle-search-view')
            .forEach((searchToggleViewElement) => {
                MiscEvent.addListener('click', this.toggleSearchView.bind(this, objectIndex), searchToggleViewElement);
            });

        // Initialization
        if (!this.loadFromUrl(objectIndex)) {
            this.loadFromDom(objectIndex);
        }
    }

    submit (objectIndex, evt) {
        if (!evt) {
            evt = {};
        }
        if (!evt.detail) {
            evt.detail = {};

        }
        evt.detail.reset = true;

        const object = this.objects[objectIndex];
        object.hasSearched = true;
        this.search(objectIndex, evt);
    }

    loadFromUrl (objectIndex) {
        const object = this.objects[objectIndex];

        // Get the data from the url
        const hashParameters = MiscUrl.getHashParameters();
        if (hashParameters) {
            // Save search parameters for further refinements
            object.parameters = hashParameters;

            // Ask other modules to set the parameters
            this.setFields(object.parameters);

            // Start search
            object.hasSearched = true;
            this.search(objectIndex, { 'detail': { 'parameters': object.parameters } });

            return true;
        }

        return false;
    }

    loadFromDom (objectIndex) {
        const object = this.objects[objectIndex];

        // Get the data from the dom
        if (window.searchData) {
            if (window.searchData.parameters) {
                // Save search parameters for further refinements
                object.parameters = window.searchData.parameters;

                // Ask other modules to set the parameters
                this.setFields(object.parameters);

                // Set url with the search parameters
                MiscUrl.setHashParameters(object.parameters);

                // Start search
                object.hasSearched = true;
                this.search(objectIndex, { 'detail': { 'parameters': object.parameters } });

                return true;
            }

            // Reset search parameters
            object.parameters = {};

            // Save response data
            object.searchData = this.formatSearchData(window.searchData, object.parameters);

            // Show search data straight away, without starting a search
            object.hasSearched = true;
            this.showSearchData(objectIndex);
        }

        return false;
    }

    setFields (parameters) {
        window.addEventListener('load', ((parameters) => {
            for (let key in parameters) {
                if (!parameters.hasOwnProperty(key)) {
                    continue;
                }

                try {
                    const data = JSON.parse(parameters[key]);
                    const fieldElement = document.querySelector('[name="' + key + '"], [data-name="' + key + '"]');
                    if (fieldElement) {
                        MiscEvent.dispatch('field:set', data, fieldElement.closest('.ds44-form__checkbox_container, ds44-form__radio_container, .ds44-form__container'));
                    }
                } catch (ex) {
                }
            }
        }).bind(this, parameters));
    }

    search (objectIndex, evt) {
        const object = this.objects[objectIndex];

        if (!object.hasSearched) {
            return;
        }

        if (
            !evt ||
            !evt.detail ||
            (
                !evt.detail.parameters &&
                !evt.detail.next
            )
        ) {
            return;
        }

        // Show loader
        MiscEvent.dispatch('loader:requestShow');

        // Manage parameters
        const options = {};
        if (evt.detail.next) {
            // Go to next set of results
            object.parameters.page = parseInt(object.searchData.pageIndex, 10) + 1;
            options.addUp = true;
        } else {
            // Refine search
            if (evt.detail.reset === true) {
                // New search
                object.parameters = evt.detail.parameters;
                options.zoom = true;
            } else {
                // Mix current and new search
                object.parameters = Object.assign({}, object.parameters, evt.detail.parameters);
            }
        }

        // Set url with the search parameters
        MiscUrl.setHashParameters(object.parameters);

        // Get the search data from the back office
        MiscRequest.send(
            object.formElement.getAttribute('action'),
            this.searchSuccess.bind(this, objectIndex, options),
            this.searchError.bind(this, objectIndex, options),
            object.parameters
        )
    }

    searchSuccess (objectIndex, options, response) {
        const object = this.objects[objectIndex];

        // Save search data
        object.searchData = this.formatSearchData(
            response,
            object.parameters,
            (options.addUp ? object.searchData.results : null)
        );

        object.containerElement.classList.remove('ds44-facette-mobile-expanded');
        this.showSearchData(objectIndex, options);
        MiscEvent.dispatch('loader:requestHide');
    }

    searchError (objectIndex, options) {
        MiscEvent.dispatch('loader:requestHide');
    }

    showSearchData (objectIndex, options = {}) {
        const object = this.objects[objectIndex];

        MiscEvent.dispatch('search:update', Object.assign({}, object.searchData, options));
    }

    formatSearchData (response, parameters, oldResults = null) {
        let results = [];
        if (oldResults) {
            results = oldResults;
        }
        results = results.concat(response['result']);

        let searchText = [];
        for (let key in parameters) {
            if (!parameters.hasOwnProperty(key)) {
                continue;
            }

            let data = parameters[key];
            try {
                data = JSON.parse(data);
            } catch (ex) {
            }
            searchText.push(data.value);
        }

        return {
            'pageIndex': response['page-index'] || 0,
            'nbResultsPerPage': response['nb-result-per-page'] || response['max-result'],
            'nbResults': response['nb-result'],
            'maxResults': response['max-result'],
            'results': results,
            'newResults': response['result'],
            'searchText': searchText.join(' ')
        };
    }

    toggleSearchView (objectIndex) {
        const object = this.objects[objectIndex];

        if (object.containerElement.classList.contains('ds44-facette-mobile-expanded')) {
            object.containerElement.classList.remove('ds44-facette-mobile-expanded')
        } else {
            object.containerElement.classList.add('ds44-facette-mobile-expanded')
        }
    }
}

new FormLayoutSearch();
