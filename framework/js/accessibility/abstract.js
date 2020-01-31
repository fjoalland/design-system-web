class Accessibility {
    constructor() {
        // Variables
        this.fakeFirstElement = null;
        this.fakeLastElement = null;

        // Listeners
        this.goToFirstListener = this.setFocus.bind(this, null, '.ds44-tmpFirstFocus');
        this.goToLastListener = this.setFocus.bind(this, null, '.ds44-tmpLastFocus');

        // Events
        MiscEvent.addListener('focus:set', this.setFocus.bind(this));
        MiscEvent.addListener('focus:addLoop', this.addFocusLoop.bind(this));
        MiscEvent.addListener('focus:removeLoop', this.removeFocusLoop.bind(this));
        MiscEvent.addListener('accessibility:show', this.show.bind(this));
        MiscEvent.addListener('accessibility:hide', this.hide.bind(this));
        MiscEvent.addListener('overlay:show', this.hideAll.bind(this));
        MiscEvent.addListener('overlay:hide', this.showAll.bind(this));

        // Set tab index in page
        document
            .querySelectorAll('[aria-hidden="true"]')
            .forEach((element) => {
                this.disableTabIndex(element);
            });
    }

    static getEnabledElementsSelector() {
        return ['a[href]', 'link', 'button', 'textarea', 'input', 'select', 'object'].map(selector => selector + ':not([disabled])');
    }

    // Fonction qui va forcer le focus à faire une boucle sur un élément
    // en ajoutant deux inputs 'hidden' qui peuvent être focus, au début
    // et à la fin
    addFocusLoop(evt) {
        this.removeFocusLoop();

        if (
            !evt ||
            !evt.detail ||
            !evt.detail.element
        ) {
            return;
        }

        const element = evt.detail.element;
        const focusableElements = element.querySelectorAll(Accessibility.getEnabledElementsSelector());
        if (!focusableElements.length) {
            return;
        }

        // Add class to first and last focusable elements
        focusableElements[0].classList.add('ds44-tmpFirstFocus');
        focusableElements[focusableElements.length - 1].classList.add('ds44-tmpLastFocus');

        // Create first hidden focus element
        this.fakeFirstElement = document.createElement('span');
        this.fakeFirstElement.classList.add('ds44-tmpFocusHidden');
        this.fakeFirstElement.setAttribute('tabindex', '0');
        element.prepend(this.fakeFirstElement);

        // Create last hidden focus element
        this.fakeLastElement = document.createElement('span');
        this.fakeLastElement.classList.add('ds44-tmpFocusHidden');
        this.fakeLastElement.setAttribute('tabindex', '0');
        element.appendChild(this.fakeLastElement);

        // Add events
        MiscEvent.addListener('focus', this.goToLastListener, this.fakeFirstElement);
        MiscEvent.addListener('focus', this.goToFirstListener, this.fakeLastElement);
    }

    // Delete loop elements
    removeFocusLoop() {
        if (this.fakeFirstElement) {
            MiscEvent.removeListener('focus', this.goToLastListener, this.fakeFirstElement);
            this.fakeFirstElement.parentNode.removeChild(this.fakeFirstElement);
            this.fakeFirstElement = null;
        }

        if (this.fakeLastElement) {
            MiscEvent.removeListener('focus', this.goToFirstListener, this.fakeLastElement);
            this.fakeLastElement.parentNode.removeChild(this.fakeLastElement);
            this.fakeLastElement = null;
        }

        const firstFocusableElement = document.querySelector('.ds44-tmpFirstFocus');
        if (firstFocusableElement) {
            firstFocusableElement.classList.remove('ds44-tmpFirstFocus');
        }

        const lastFocusableElement = document.querySelector('.ds44-tmpLastFocus');
        if (lastFocusableElement) {
            lastFocusableElement.classList.remove('ds44-tmpLastFocus');
        }
    }

    // Mettre le focus sur un élément précis
    setFocus(evt, selector) {
        let element = null;
        if (
            evt &&
            evt.detail &&
            evt.detail.element
        ) {
            element = evt.detail.element
        }
        if (!element && selector) {
            element = document.querySelector(selector);
        }
        if (element) {
            element.focus();
        }
    }

    // Effectue les actions liées à la méthode toggleMainHeaderFooterAriaHidden
    showAll(evt) {
        let targetElement = document;
        if (evt && evt.detail && evt.detail.targetElement) {
            targetElement = evt.detail.targetElement;
        }

        // On retire l'attribut tabindex sur le main et ses sous-éléments interactifs
        targetElement
            .querySelectorAll(Accessibility.getEnabledElementsSelector())
            .forEach((focusableElement) => {
                this.show(null, focusableElement);
            });
    }

    // Effectue les actions liées à la méthode toggleMainHeaderFooterAriaHidden
    hideAll(evt) {
        let targetElement = document;
        let currentElement = null;
        if (evt && evt.detail) {
            if (evt.detail.targetElement) {
                targetElement = evt.detail.targetElement;
            }
            if (evt.detail.element) {
                currentElement = evt.detail.element;
            }
        }

        // On ajoute tabindex=-1 sur le main et ses sous-éléments interactifs
        targetElement
            .querySelectorAll(Accessibility.getEnabledElementsSelector())
            .forEach((focusableElement) => {
                if (
                    !currentElement ||
                    !currentElement.contains(focusableElement)
                ) {
                    // On ignore les éléments du bloc à exclure
                    this.hide(null, focusableElement);
                }
            });
    }

    show(evt, element) {
        if(!element) {
            if (
                !evt ||
                !evt.detail ||
                !evt.detail.element
            ) {
                return;
            }

            element = evt.detail.element;
        }

        element.removeAttribute('aria-hidden');
        this.enableTabIndex(element)
    }

    hide(evt, element) {
        if(!element) {
            if (
                !evt ||
                !evt.detail ||
                !evt.detail.element
            ) {
                return;
            }

            element = evt.detail.element;
        }

        element.setAttribute('aria-hidden', 'true');
        this.disableTabIndex(element);
    }

    enableTabIndex(element) {
        if (
            !element ||
            element.nodeType != Node.ELEMENT_NODE ||
            element.getAttribute('aria-hidden') == 'true'
        ) {
            return;
        }

        element.removeAttribute('tabindex');
        element.childNodes.forEach((childElement) => {
            this.enableTabIndex(childElement);
        });
    }

    disableTabIndex(element) {
        if (
            !element ||
            element.nodeType != Node.ELEMENT_NODE
        ) {
            return;
        }

        element.setAttribute('tabindex', '-1');
        element.childNodes.forEach((childElement) => {
            this.disableTabIndex(childElement);
        });
    }

    // Supprime l'attribut 'tabindex' des éléments focusables d'un élément
    enableAllTabIndexes(element) {
        if (element == null) {
            return;
        }

        element
            .querySelectorAll(Accessibility.getEnabledElementsSelector())
            .forEach((focusableElement) => {
                MiscEvent.dispatch('accessibility:show', {'element': focusableElement});
            });
    }

    // Passe l'attribut 'tabindex' des éléments 'focusables' d'un élément à -1
    disableAllTabIndexes(element) {
        if (element == null) {
            return;
        }

        element
            .querySelectorAll(Accessibility.getEnabledElementsSelector())
            .forEach((focusableElement) => {
                MiscEvent.dispatch('accessibility:hide', {'element': focusableElement});
            });
    }
}

// Singleton
new Accessibility();
