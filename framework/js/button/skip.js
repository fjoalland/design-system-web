class ButtonSkip {
    constructor () {
        document
            .querySelectorAll('.ds44-skiplinks--link')
            .forEach((skipElement) => {
                MiscEvent.addListener('click', this.go.bind(this), skipElement);
            });
    }

    go (evt) {
        evt.stopPropagation();
        evt.preventDefault();

        const id = evt.currentTarget.getAttribute('href');
        const focusElement = document.querySelector(id);
        if (!focusElement) {
            return;
        }

        MiscAccessibility.setFocus(focusElement);
    }
}

// Singleton
new ButtonSkip();
