class AccessibilityFocus {
    constructor() {
        // Variables
        this.fakeFirstFocus = null;
        this.fakeLastFocus = null;

        // Listeners
        this.goToFirstListener = this.set.bind(this, '.ds44-tmpFirstFocus');
        this.goToLastListener = this.set.bind(this, '.ds44-tmpLastFocus');

        // Events
        MiscEvent.addListener('focus:addLoop', this.addLoop.bind(this));
        MiscEvent.addListener('focus:removeLoop', this.removeLoop.bind(this));
    }

    static getEnabledElementsSelector() {
        return ['a[href]', 'link', 'button', 'textarea', 'input', 'select', 'object'].map(selector => selector + ':not([disabled])');
    }

    static getFocusableElementsSelector() {
        return ['a[href]', 'link', 'button', 'textarea', 'input', 'select', 'object', '[tabindex]'].map(selector => selector + ':not([tabindex="-1"])');
    }

    // Fonction qui va forcer le focus à faire une boucle sur un élément
    // en ajoutant deux inputs "hidden" qui peuvent être focus, au début
    // et à la fin
    addLoop(evt) {
        this.removeLoop();

        if(
            !evt ||
            !evt.detail ||
            !evt.detail.element
        ) {
            return;
        }

        const element = evt.detail.element;
        const focusableElements = element.querySelectorAll(AccessibilityFocus.getEnabledElementsSelector());
        if (!focusableElements.length) {
            return;
        }

        // Add class to first and last focusable elements
        focusableElements[0].classList.add('ds44-tmpFirstFocus');
        focusableElements[focusableElements.length - 1].classList.add('ds44-tmpLastFocus');

        // Create first hidden focus element
        this.fakeFirstFocus = document.createElement('span');
        this.fakeFirstFocus.classList.add('ds44-tmpFocusHidden');
        this.fakeFirstFocus.setAttribute('tabindex', '0');
        element.prepend(this.fakeFirstFocus);

        // Create last hidden focus element
        this.fakeLastFocus = document.createElement('span');
        this.fakeLastFocus.classList.add('ds44-tmpFocusHidden');
        this.fakeLastFocus.setAttribute('tabindex', '0');
        element.appendChild(this.fakeLastFocus);

        // Add events
        MiscEvent.addListener('focus', this.goToLastListener, this.fakeFirstFocus);
        MiscEvent.addListener('focus', this.goToFirstListener, this.fakeLastFocus);
    }

    // Delete loop elements
    removeLoop() {
        if (this.fakeFirstFocus) {
            MiscEvent.removeListener('focus', this.goToLastListener, this.fakeFirstFocus);
            this.fakeFirstFocus = null;
        }

        if (this.fakeLastFocus) {
            MiscEvent.removeListener('focus', this.goToFirstListener, this.fakeLastFocus);
            this.fakeLastFocus = null;
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

    // Remettre le focus sur un élément précis
    set(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.focus();
        }
    }
}

// Singleton
new AccessibilityFocus();
