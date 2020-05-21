class MiscAccessibility {
    static getEnabledElementsSelector () {
        return ['a[href]', 'link[href]', 'button', 'textarea', 'input:not([type="hidden"])', 'select', 'object', 'area'].map(selector => selector + ':not([disabled])');
    }

    static getProtectedElementsSelector () {
        return ['i', 'sup', 'svg', 'hr'];
    }

    // Fonction qui va forcer le focus à faire une boucle sur un élément
    // en ajoutant deux inputs 'hidden' qui peuvent être focus, au début
    // et à la fin
    static addFocusLoop (element) {
        MiscAccessibility.removeFocusLoop();

        if (!element) {
            return;
        }

        const focusableElements = element.querySelectorAll(MiscAccessibility.getEnabledElementsSelector());
        if (!focusableElements.length) {
            return;
        }

        // Add class to first and last focusable elements
        focusableElements[0].classList.add('ds44-tmpFirstFocus');
        focusableElements[focusableElements.length - 1].classList.add('ds44-tmpLastFocus');

        // Create first hidden focus element
        const fakeFirstElement = document.createElement('span');
        fakeFirstElement.classList.add('ds44-tmpFocusHidden');
        fakeFirstElement.setAttribute('tabindex', '0');
        element.prepend(fakeFirstElement);

        // Create last hidden focus element
        const fakeLastElement = document.createElement('span');
        fakeLastElement.classList.add('ds44-tmpFocusHidden');
        fakeLastElement.setAttribute('tabindex', '0');
        element.appendChild(fakeLastElement);

        // Add events
        MiscEvent.addListener('focus', MiscAccessibility.setFocus.bind(this, null, '.ds44-tmpLastFocus'), fakeFirstElement);
        MiscEvent.addListener('focus', MiscAccessibility.setFocus.bind(this, null, '.ds44-tmpFirstFocus'), fakeLastElement);
    }

    // Delete loop elements
    static removeFocusLoop () {
        document
            .querySelectorAll('.ds44-tmpFocusHidden')
            .forEach((element) => {
                element.remove();
            })

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
    static setFocus (element, selector) {
        if (!element && selector) {
            element = document.querySelector(selector);
        }
        if (element) {
            element.focus();
        }
    }

    static show (element, isChild = false) {
        if (!element) {
            // No element
            return;
        }

        if (
            MiscAccessibility.getProtectedElementsSelector().indexOf(element.tagName.toLowerCase()) !== -1 ||
            element.getAttribute('data-a11y-exclude') === 'true'
        ) {
            // Protected element
            return;
        }

        if (!isChild) {
            // Is parent element
            element.removeAttribute('aria-hidden');
        } else if (element.getAttribute('aria-hidden') === 'true') {
            // Is child element, stop bubbling if the element is hidden
            return;
        }
        if (
            element.closest(MiscAccessibility.getEnabledElementsSelector()) === element &&
            element.getAttribute('tabindex') === '-1'
        ) {
            element.removeAttribute('tabindex');
        }

        Array.from(element.children).map((childElement) => {
            MiscAccessibility.show(childElement, true);
        });
    }

    static hide (element, isChild = false) {
        if (!element) {
            // No element
            return;
        }

        if (
            MiscAccessibility.getProtectedElementsSelector().indexOf(element.tagName.toLowerCase()) !== -1 ||
            element.getAttribute('data-a11y-exclude') === 'true'
        ) {
            // Protected element
            return;
        }

        if (!isChild) {
            // Is parent element
            element.setAttribute('aria-hidden', true);
        } else if (element.getAttribute('aria-hidden') === 'true') {
            // Is child element, stop bubbling if the element is hidden
            return;
        }
        if (element.closest(MiscAccessibility.getEnabledElementsSelector()) === element) {
            element.setAttribute('tabindex', '-1');
        }

        Array.from(element.children).map((childElement) => {
            MiscAccessibility.hide(childElement, true);
        });
    }

    static flattenText (text) {
        return text.replace(/\n/gi, ' ').replace(/[ ]+/gi, ' ').trim();
    }
}
