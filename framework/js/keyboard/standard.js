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

        // Make the space bar or enter act like a mouse click
        const clickableElement = this.getClickableElement(evt);
        if (clickableElement) {
            clickableElement.dispatchEvent(new MouseEvent('mousedown', {
                'bubbles': true,
                'cancelable': true
            }));
            clickableElement.dispatchEvent(new MouseEvent('mouseup', {
                'bubbles': true,
                'cancelable': true
            }));
            clickableElement.click();

            evt.stopPropagation();
            evt.preventDefault();

            return false;
        }
    }

    keyPress (evt) {
        if (!evt.key) {
            return;
        }

        MiscEvent.dispatch('keyPress:*');
        MiscEvent.dispatch('keyPress:' + (evt.key === ' ' ? 'Spacebar' : evt.key).toLowerCase());
    }

    keyUp (evt) {
        if (!evt.key) {
            return;
        }

        MiscEvent.dispatch('keyUp:*');
        MiscEvent.dispatch('keyUp:' + (evt.key === ' ' ? 'Spacebar' : evt.key).toLowerCase());
    }

    getClickableElement (evt) {
        if (!document.activeElement) {
            return null;
        }

        if (evt.key === ' ' || evt.key === 'Spacebar') {
            return document.activeElement.closest('a') ||
                document.activeElement.closest('button') ||
                document.activeElement.closest('[tabindex="0"]');
        }

        if (evt.key === 'Enter') {
            return document.activeElement.closest('[role="option"]');
        }

        return null;
    }
}

// Singleton
new KeyboardStandard();
