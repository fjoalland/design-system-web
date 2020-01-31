class Overlay {
    constructor() {
        this.triggerElement = null;
        this.modal = null;

        this.hideListener = this.hide.bind(this);
        this.focusOutListener = this.focusOut.bind(this);
        this.clickOutListener = this.clickOut.bind(this);

        // Events
        MiscEvent.addListener('overlay:showCloseButtons', this.showCloseButtons.bind(this));
        MiscEvent.addListener('overlay:hideCloseButtons', this.hideCloseButtons.bind(this));
        MiscEvent.addListener('keyUp:escape', this.hideListener);

        // Ajouter un event listener sur les boutons qui ouvrent un overlay / modale
        document
            .querySelectorAll('[data-js="ds44-modal"]')
            .forEach((element) => {
                MiscEvent.addListener('click', this.show.bind(this), element);
            });
        document
            .querySelectorAll('.ds44-btnOverlay--closeOverlay')
            .forEach((element) => {
                MiscEvent.addListener('click', this.hideListener, element);
            });
    }

    // Ouvre un overlay
    show(evt) {
        if(evt) {
            evt.stopPropagation();
        }

        if(this.modal) {
            this.hide();
        }

        const modalId = evt.currentTarget.getAttribute('data-target');
        if (!modalId) {
            return;
        }

        // Get corresponding modal
        const modal = document.querySelector(modalId);
        if (!modal) {
            return;
        }

        // Get corresponding close button
        const closeButton = modal.querySelector('[data-js="ds44-modal-action-close"]');
        if (!closeButton) {
            return;
        }

        // Record the element that triggered the overlay
        this.triggerElement = evt.currentTarget;
        this.modal = modal;

        // Show modal
        document.body.style.overflow = 'hidden';
        this.modal.classList.add('show');

        // Set focus in modal
        const firstField = this.modal.querySelector('input, button, textarea, a, select')
        if (firstField) {
            MiscEvent.dispatch('focus:set', {'element': firstField});
        } else {
            MiscEvent.dispatch('focus:set', {'element': closeButton});
        }

        this.hideCloseButtons(closeButton);
        MiscEvent.dispatch('accessibility:show', {'element': this.modal});
        MiscEvent.dispatch('focus:addLoop', {'element': this.modal});
        MiscEvent.dispatch('overlay:show', {'element': this.modal});

        MiscEvent.addListener('click', this.hideListener, closeButton);
        MiscEvent.addListener('focusout', this.focusOutListener, this.modal);
        MiscEvent.addListener('click', this.clickOutListener, document.body);
    }

    // Ferme tous les overlays, et ajoute un focus sur le bouton qui a ouvert le dernier overlay affiché
    hide(evt) {
        if(evt) {
            evt.stopPropagation();
        }

        // Get current modal
        if(!this.modal) {
            return;
        }

        // Get corresponding close button
        const closeButton = this.modal.querySelector('[data-js="ds44-modal-action-close"]');
        if (!closeButton) {
            return;
        }

        MiscEvent.removeListener('click', this.hideListener, closeButton);
        MiscEvent.removeListener('focusout', this.focusOutListener, this.modal);
        MiscEvent.removeListener('click', this.clickOutListener, document.body);

        MiscEvent.dispatch('accessibility:hide', {'element': this.modal});
        MiscEvent.dispatch('focus:removeLoop');

        document.body.style.overflow = null;
        this.modal.classList.remove('show');
        this.showCloseButtons();

        if (this.triggerElement) {
            MiscEvent.dispatch('focus:set', {'element': this.triggerElement})
        }

        this.triggerElement = null;
        this.modal = null;

        MiscEvent.dispatch('overlay:hide');
    }

    // Ré-afficher tous les boutons 'fermer'
    showCloseButtons() {
        document
            .querySelectorAll('.ds44-btnOverlay--closeOverlay')
            .forEach((element) => {
                element.style.display = 'block';
            });
    }

    // Cacher tous les boutons 'Fermer' sauf le bouton de la modale actuelle
    hideCloseButtons(evt, currentElement) {
        if (!currentElement) {
            if (
                !evt ||
                !evt.detail ||
                !evt.detail.element
            ) {
                return;
            }

            currentElement = evt.detail.element
        }

        document
            .querySelectorAll('.ds44-btnOverlay--closeOverlay')
            .forEach((element) => {
                if (element == currentElement) {
                    element.style.display = 'block';
                } else {
                    element.style.display = 'none';
                }
            });
    }

    focusOut(evt) {
        evt.stopPropagation();

        if (!evt.target || !this.modal.contains(evt.target)) {
            this.modal.querySelector('input, button, textarea, a, select').focus();
            return;
        }

        MiscEvent.dispatch('focus:set', {'element': this.modal});
    }

    clickOut(evt) {
        if (evt.target && this.modal.contains(evt.target)) {
            return;
        }

        this.hide();
    }
}

// Singleton
new Overlay();
