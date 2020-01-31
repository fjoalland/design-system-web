class Keyboard {
    constructor() {
        MiscEvent.addListener('keyup', this.keyUp.bind(this));
        MiscEvent.addListener('keydown', this.keyDown.bind(this));
    }

    keyUp(evt) {
        if (!evt.key) {
            return;
        }

        MiscEvent.dispatch('keyUp:' + evt.key.toLowerCase());
    }

    keyDown(evt) {
        if (!evt.key) {
            return;
        }

        MiscEvent.dispatch('keyDown:' + evt.key.toLowerCase());
    }
}

// Singleton
new Keyboard();
