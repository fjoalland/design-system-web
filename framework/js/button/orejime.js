class ButtonOrejime {
    constructor () {
        MiscEvent.addListener('load', this.initialize.bind(this), window);
    }

    initialize () {
        if (window.orejime) {
            document
                .querySelectorAll('.ds44-js-orejime-show')
                .forEach((buttonElement) => {
                    MiscEvent.addListener('click', this.show.bind(this), buttonElement);
                });
            document
                .querySelectorAll('.ds44-js-orejime-reset')
                .forEach((buttonElement) => {
                    MiscEvent.addListener('click', this.reset.bind(this), buttonElement);
                });
        }
    }

    show () {
        window.orejime.show();
    }

    reset () {
        window.orejime.internals.manager.resetConsent();
        document.location.reload();
    }
}

// Singleton
new ButtonOrejime();
