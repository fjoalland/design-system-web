class Overlay {
    constructor() {
        // Events
        MiscEvent.addListener('overlay:close', this.close.bind(this));
    }

    // Ferme tous les overlays, et ajoute un focus sur le bouton qui a ouvert le dernier overlay affiché
    close() {
        MiscEvent.dispatch('focus:removeLoop');

        document.querySelector('body').style.overflow = null;
        Utils.accessibilityShow(document.querySelector('header#topPage'));

        document
            .querySelectorAll('.ds44-overlay')
            .forEach((overlay) => {
                overlay.classList.remove('show');
                Utils.accessibilityHide(overlay);
                // Ré-afficher tous les boutons 'fermer'
                Buttons.displayAllCloseBtns();
            });

        document
            .querySelectorAll('.ds44-btn--menu, .ds44-overlay--navNiv1 .ds44-ds44-menuBtn')
            .forEach((btn) => {
                btn.setAttribute('aria-expanded', 'false');
            });

        toggleMainHeaderFooterAriaHidden(null);


        let itDesignatedElem = document.querySelector('[data-src-overlay="true"]');
        if (!itDesignatedElem) {
            return;
        }
        itDesignatedElem.removeAttribute('data-src-overlay');
        itDesignatedElem.focus();
    }
}

// Singleton
new Overlay();
