class Collapser {
    constructor() {
        MiscEvent.addListener('keyUp:escape', this.close.bind(this));
    }

    close(evt) {
        let collapserElement = null;
        if (
            evt.currentTarget &&
            evt.currentTarget.closest
        ) {
            collapserElement = evt.currentTarget.closest('.ds44-collapser');
        }

        if (
            !collapserElement ||
            (
                evt.type !== 'keyUp:escape' ||
                !collapserElement.contains(document.activeElement)
            )
        ) {
            return;
        }

        // Close
    }
}

// Singleton
new Collapser();
