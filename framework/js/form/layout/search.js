class FormLayoutSearch extends FormLayoutAbstract {
    constructor () {
        super('.ds44-facette form');
    }

    create (formElement) {
        super.create(formElement);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];

        object.containerElement = formElement.closest('.ds44-facette');
        object.parameters = {};
        object.searchData = {};
        object.hasSearched = false;
    }

    initialize () {
        // Initialize each object
        for (let objectIndex = 0; objectIndex < this.objects.length; objectIndex++) {
            const object = this.objects[objectIndex];

            // Bind events
            MiscEvent.addListener('search:refresh', this.search.bind(this, objectIndex));
            object.containerElement
                .querySelectorAll('.ds44-js-toggle-search-view')
                .forEach((searchToggleViewElement) => {
                    MiscEvent.addListener('click', this.toggleSearchView.bind(this, objectIndex), searchToggleViewElement);
                });
        }

        super.initialize();
    }

    start (objectIndex) {
        if (
            !this.loadFromDom(objectIndex) &&
            !this.loadFromUrl(objectIndex)
        ) {
            super.start(objectIndex);
        }
    }

    loadFromDom (objectIndex) {
        // Get the data from the dom
        if (!window.searchData) {
            return false;
        }

        const object = this.objects[objectIndex];

        // Reset search parameters
        object.parameters = (window.searchData.parameters || {});

        // Save response data
        object.searchData = this.formatSearchData(window.searchData, object.parameters);

        // Show search data straight away, without starting a search
        object.hasSearched = true;
        this.showSearchData(objectIndex);

        return true;
    }

    loadFromUrl (objectIndex) {
        const object = this.objects[objectIndex];

        if (object.formElement.getAttribute('data-legacy-url') === 'true') {
            this.loadFromUrlSuccess(objectIndex, MiscUrl.getHashParameters());

            return true;
        }

        const searchId = MiscUrl.getSeoHashParameters().pop();
        if (!searchId) {
            return false;
        }

        if (MiscUtils.isInDevMode) {
            // Get the search data from the local storage
            const searchData = window.sessionStorage.getItem('search_' + searchId);
            if (!searchData) {
                return false;
            }

            this.loadFromUrlSuccess(objectIndex, JSON.parse(searchData));

            return true;
        }

        // Get the search data from the back office
        MiscRequest.send(
            object.formElement.getAttribute('data-search-url'),
            this.loadFromUrlSuccess.bind(this, objectIndex),
            () => {
            },
            {
                'id': searchId
            }
        );

        return true;
    }

    loadFromUrlSuccess (objectIndex, response) {
        for (const objectName in response) {
            if (!response.hasOwnProperty(objectName)) {
                continue;
            }

            MiscEvent.dispatch('field:' + objectName + ':set', response[objectName]);
        }

        super.start(objectIndex);
    }

    ajaxSubmit (objectIndex, formData) {
        const evt = {
            detail: {
                parameters: formData || {},
                reset: true
            }
        };

        const object = this.objects[objectIndex];
        object.hasSearched = true;
        this.search(objectIndex, evt);
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

        // Get the search data from the back office
        MiscRequest.send(
            object.formElement.getAttribute('action'),
            this.searchSuccess.bind(this, objectIndex, options),
            this.searchError.bind(this, objectIndex),
            object.parameters
        )
    }

    searchSuccess (objectIndex, options, response) {
        if (
            response &&
            response.message
        ) {
            this.notification(objectIndex, null, response.message, response.status);
        }

        const object = this.objects[objectIndex];

        // Save search data
        object.searchData = this.formatSearchData(
            response,
            object.parameters,
            (options.addUp ? object.searchData.results : null)
        );

        // Set url with the search parameters
        this.setSearchHash(objectIndex, response.id);

        object.containerElement.classList.remove('ds44-facette-mobile-expanded');
        this.showSearchData(objectIndex, options);
        MiscEvent.dispatch('loader:requestHide');
    }

    searchError (objectIndex, response) {
        if (
            response &&
            response.message
        ) {
            this.notification(objectIndex, null, response.message, response.status);
        }
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
            if (data.text) {
                searchText.push(data.text);
            }
        }

        return {
            'pageIndex': response['page-index'] || 0,
            'nbResultsPerPage': response['nb-result-per-page'] || response['max-result'],
            'nbResults': response['nb-result'],
            'maxNbResults': response['max-result'],
            'results': results,
            'newResults': response['result'],
            'searchText': searchText.join(', ')
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

    async setSearchHash (objectIndex, searchId) {
        const object = this.objects[objectIndex];

        if (MiscUtils.isInDevMode) {
            // In dev mode, generate the search id and use the local storage to store the search data
            // as there is no back end
            const parameters = JSON.stringify(object.parameters);
            searchId = await MiscUtils.digestMessage(parameters);
            window.sessionStorage.setItem('search_' + searchId, parameters);
        } else if (!searchId) {
            return;
        }

        if (object.formElement.getAttribute('data-legacy-url') === 'true') {
            MiscUrl.setHashParameters(object.parameters);
        } else {
            MiscUrl.setSeoHashParameters(object.parameters, searchId);
        }
    }
}

new FormLayoutSearch();
