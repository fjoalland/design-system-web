'use strict';

class Footer {
    constructor() {
        MiscEvent.addListener('overlay:show', this.showOverlay.bind(this));
        MiscEvent.addListener('overlay:hide', this.hideOverlay.bind(this));
    }

    showOverlay() {
        MiscEvent.dispatch('accessibility:hide', {'element': document.querySelector('footer')});
    }

    hideOverlay() {
        MiscEvent.dispatch('accessibility:show', {'element': document.querySelector('footer')});
    }
}

// Singleton
new Footer();
