'use strict';

class SearchEngine {
    searchUrl = '/plugins/ChartePlugin/types/PortletQueryForeach/displayResult.jsp';
    searchElement = 'body';

    constructor() {
        // Bind events
        MiscEvent.addListener('search:refresh', this.search.bind(this));

        // Initialization
        if (!this.loadFromUrl()) {
            this.loadFromDom();
        }
    }

    loadFromUrl() {
        // Get the data from the url
        const hashParameters = MiscUrl.getHashParameters();
        if (hashParameters) {
            MiscEvent.dispatch(
                'search:set-parameters',
                {
                    "reload": true,
                    "parameters": hashParameters
                }
            );

            return true;
        }

        return false;
    }

    loadFromDom() {
        // Get the data from the dom
        if (window.searchData) {
            if (window.searchData.parameters) {
                MiscEvent.dispatch(
                    'search:set-parameters',
                    {
                        "reload": false,
                        "parameters": window.searchData.parameters
                    }
                );
            }
            this.showResults(window.searchData.results);

            return true;
        }

        return false;
    }

    search(evt) {
        // Get the results from the back office
        this.showLoader();
        MiscRequest.send(
            this.searchUrl,
            this.searchSuccess.bind(this),
            this.searchError.bind(this),
            evt.detail,
            'POST'
        )
    }

    searchSuccess(response) {
        this.showResults(response);
        this.hideLoader();
    }

    searchError() {
        this.hideLoader();
    }

    showLoader() {
        const searchElement = document.querySelector(this.searchElement);
        if (!searchElement) {
            return;
        }

        const searchLoader = document.createElement('div');
        searchLoader.className = 'ds44-search-loader';
        searchLoader.innerText = 'Loading !!!';
        searchElement.append(searchLoader)
    }

    hideLoader() {
        const searchLoader = document.querySelector('.ds44-search-loader');
        if (!searchLoader) {
            return;
        }

        searchLoader.remove();
    }

    showResults(results) {
        MiscEvent.dispatch('search:update', results);
    }
}

new SearchEngine();
