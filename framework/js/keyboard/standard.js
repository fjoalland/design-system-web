class KeyboardStandard {
    constructor () {
        MiscEvent.addListener('keyup', this.keyUp.bind(this));
        MiscEvent.addListener('keypress', this.keyPress.bind(this));
        MiscEvent.addListener('keydown', this.keyDown.bind(this));
    }

    keyDown (evt) {
        if (!evt.key) {
            return;
        }

        MiscEvent.dispatch('keyDown:*');
        MiscEvent.dispatch('keyDown:' + (evt.key === ' ' ? 'Spacebar' : evt.key).toLowerCase());
    }

    keyPress (evt) {
        if (!evt.key) {
            return;
        }

        MiscEvent.dispatch('keyPress:*');
        MiscEvent.dispatch('keyPress:' + (evt.key === ' ' ? 'Spacebar' : evt.key).toLowerCase());

        this.disableSpaceBarScroll(evt);
    }

    keyUp (evt) {
        if (!evt.key) {
            return;
        }

        MiscEvent.dispatch('keyUp:*');
        MiscEvent.dispatch('keyUp:' + (evt.key === ' ' ? 'Spacebar' : evt.key).toLowerCase());
    }

    disableSpaceBarScroll (evt) {
        if (evt.key === ' ' || evt.key === 'Spacebar') {
            evt.preventDefault();
        }
    }
}

// Singleton
new KeyboardStandard();
