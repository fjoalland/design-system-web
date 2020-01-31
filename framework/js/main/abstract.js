'use strict';

class Main {
    constructor() {
        MiscEvent.addListener('overlay:show', this.showOverlay.bind(this));
        MiscEvent.addListener('overlay:hide', this.hideOverlay.bind(this));
    }

    showOverlay() {
        MiscEvent.dispatch('accessibility:hide', {'element': document.querySelector('main')});
    }

    hideOverlay() {
        MiscEvent.dispatch('accessibility:show', {'element': document.querySelector('main')});
    }
}

// Singleton
new Main();
