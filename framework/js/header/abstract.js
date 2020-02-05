class Header {
    constructor() {
        this.lastScroll = 0;
        this.isTabEnabled = true;

        // Bind events
        MiscEvent.addListener('scroll', this.scroll.bind(this), window);
        MiscEvent.addListener('overlay:show', this.hide.bind(this));
        MiscEvent.addListener('overlay:hide', this.show.bind(this));
        MiscEvent.addListener('menu:show', this.hide.bind(this));
        MiscEvent.addListener('menu:hide', this.show.bind(this));
        MiscEvent.addListener('keyUp:tab', this.checkFocusPosition.bind(this));

        this.show();
    }

    // Sur le focus au clavier d'un élément caché sous le header, effectuer un scroll vers le haut pour que l'élément soit affiché
    checkFocusPosition() {
        if (this.isTabEnabled) {
            const header = document.querySelector('header .ds44-header');
            const activeElement = document.activeElement;
            if (
                !header ||
                header.contains(activeElement)
            ) {
                return;
            }

            let headerBottom = header.getBoundingClientRect().bottom;
            if (header.classList.contains('hidden')) {
                headerBottom += 100;
            }

            const activeElementBoundingClientRect = activeElement.getBoundingClientRect();
            if (activeElementBoundingClientRect.top < headerBottom) {
                window.scrollBy(0, -(150 - activeElementBoundingClientRect.top));
            }
        }
    }

    // Gérer le comportement du header en fonction des scrolls
    scroll() {
        const header = document.querySelector('header .ds44-header');
        if (!header) {
            return;
        }

        const currentScroll = window.pageYOffset;
        if (currentScroll === 0) {
            header.classList.remove('hidden');
            MiscAccessibility.show(header.querySelector('.ds44-container-large'));
            if (document.activeElement === document.querySelector('html')) {
                MiscAccessibility.setFocus(document.querySelector('header .ds44-btn--menu'));
            }
            return;
        }

        if (
            currentScroll > this.lastScroll &&
            !header.classList.contains('hidden') &&
            currentScroll > header.offsetHeight
        ) {
            // Scroll vers le bas, uniquement si le haut de page est
            // en dessous de la hauteur du header
            header.classList.add('hidden');
            MiscAccessibility.hide(header.querySelector('.ds44-container-large'));
        } else if (
            currentScroll < this.lastScroll &&
            header.classList.contains('hidden')
        ) {
            // up
            header.classList.remove('hidden');
            MiscAccessibility.show(header.querySelector('.ds44-container-large'));
        }

        this.lastScroll = currentScroll;
    }

    show() {
        this.isTabEnabled = true;

        MiscAccessibility.show(document.querySelector('header'));
        MiscAccessibility.hide(document.querySelector('header .ds44-blocMenu'));
    }

    hide() {
        this.isTabEnabled = false;

        MiscAccessibility.hide(document.querySelector('header'));
        MiscAccessibility.show(document.querySelector('header .ds44-blocMenu'));
    }
}

// Singleton
new Header();
