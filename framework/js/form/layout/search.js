class FormLayoutSearch {
    constructor() {
        this.url = '/plugins/ChartePlugin/types/PortletQueryForeach/displayResult.jsp';
        this.objects = [];

        document
            .querySelectorAll('.ds44-facette form')
            .forEach((element) => {
                this.create(element);
            });
    }

    create(element) {
        const object = {
            'id': MiscUtils.generateId(),
            'formElement': element,
            'parameters': {},
            'results': []
        };
        this.objects.push(object);
        const objectIndex = (this.objects.length - 1);

        // Bind events
        MiscEvent.addListener('form:submit', this.submit.bind(this, objectIndex), object.formElement);
        MiscEvent.addListener('search:refresh', this.search.bind(this, objectIndex), object.formElement);

        // Initialization
        if (!this.loadFromUrl(objectIndex)) {
            this.loadFromDom(objectIndex);
        }
    }

    submit(objectIndex, evt) {
        if (!evt) {
            evt = {};
        }
        if (!evt.detail) {
            evt.detail = {};

        }
        evt.detail.reset = true;

        this.search(evt, objectIndex);
    }

    loadFromUrl(objectIndex) {
        const object = this.objects[objectIndex];

        // Get the data from the url
        const hashParameters = MiscUrl.getHashParameters();
        if (hashParameters) {
            // Save search parameters for further refinements
            object.parameters = hashParameters;

            // Ask other modules to set the parameters
            MiscEvent.dispatch('search:set-parameters', object.parameters);

            return true;
        }

        return false;
    }

    loadFromDom(objectIndex) {
        const object = this.objects[objectIndex];

        // Get the data from the dom
        if (window.searchData) {
            if (window.searchData.parameters) {
                // Save search parameters for further refinements
                object.parameters = window.searchData.parameters;

                // Ask other modules to set the parameters
                MiscEvent.dispatch('search:set-parameters', object.parameters);

                // Set url with the search parameters
                MiscUrl.setHashParameters(object.parameters);

                return true;
            }

            // Reset search parameters
            object.parameters = {};

            // Save results
            object.results = window.searchData.results;

            // Show results straight away, without starting a search
            this.showResults(objectIndex);
        }

        return false;
    }

    search(evt, objectIndex) {
        const object = this.objects[objectIndex];

        if (
            !evt ||
            !evt.detail ||
            !evt.detail.parameters
        ) {
            return;
        }

        // Show loader
        MiscEvent.dispatch('loader:requestShow');

        // Manage parameters
        if (evt.detail.reset === true) {
            // New search
            object.parameters = evt.detail.parameters;
        } else {
            // Mix current and new search
            object.parameters = Object.assign({}, object.parameters, evt.detail.parameters);
        }

        // Set url with the search parameters
        MiscUrl.setHashParameters(object.parameters);

        // Get the results from the back office
        MiscRequest.send(
            this.url,
            this.searchSuccess.bind(this, objectIndex),
            this.searchError.bind(this, objectIndex),
            object.parameters,
            'POST'
        )
    }

    searchSuccess(objectIndex, response) {
        const object = this.objects[objectIndex];

        // Save results
        object.results = response.results;

        this.showResults(objectIndex);
        MiscEvent.dispatch('loader:requestHide');
    }

    searchError(objectIndex) {
        MiscEvent.dispatch('loader:requestHide');
    }

    showResults(objectIndex) {
        const object = this.objects[objectIndex];

        MiscEvent.dispatch('search:update', object.results);
    }
}

new FormLayoutSearch();
