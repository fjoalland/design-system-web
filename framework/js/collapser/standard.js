class CollapserStandard {
    constructor() {
        MiscEvent.addListener('keyUp:escape', this.hide.bind(this));

        //Bind event on click
        document
            .querySelectorAll('.ds44-collapser_button')
            .forEach((element) => {
                this.hide(null, element);

                MiscEvent.addListener('click', this.showHide.bind(this), element);
            });
    }

    showHide(evt) {
        const element = evt.currentTarget;
        if (element.classList.contains('show')) {
            // Hide
            this.hide(null, element)
        } else {
            // Show
            this.show(null, element)
        }
    }

    show(evt, element) {
        if (
            !element &&
            evt &&
            evt.detail &&
            evt.detail.element
        ) {
            element = evt.detail.element
        }

        if (!element) {
            return;
        }

        const panel = element.nextElementSibling;
        const buttonLabel = element.querySelector('span.visually-hidden');
        if (buttonLabel) {
            buttonLabel.innerText = 'Replier';
        }
        element.classList.add('show');
        element.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = (panel.style.maxHeight ? null : panel.scrollHeight + 60 + 'px');
        MiscAccessibility.show(panel, true);
        panel.style.visibility = 'visible';
    }

    hide(evt, element) {
        if (!element) {
            if (
                evt &&
                evt.detail &&
                evt.detail.element
            ) {
                element = evt.detail.element
            } else if (
                evt.type === 'keyUp:escape' &&
                document.activeElement
            ) {
                const collapserElement = document.activeElement.closest('.ds44-collapser_element');
                if (collapserElement) {
                    element = collapserElement.querySelector('.ds44-collapser_button')
                }
            }
        }

        if (!element) {
            return;
        }

        const panel = element.nextElementSibling;
        const buttonLabel = element.querySelector('span.visually-hidden');
        if (buttonLabel) {
            buttonLabel.innerText = 'Déplier';
        }
        element.classList.remove('show');
        element.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        MiscAccessibility.hide(panel, true);
        panel.style.visibility = 'hidden';
    }
}

// Singleton
new CollapserStandard();
