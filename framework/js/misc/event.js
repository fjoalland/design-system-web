class MiscEvent {
    static dispatch (type, data, target = document) {
        const options = { cancelable: true };
        if (data) {
            options.detail = data;
        }
        target.dispatchEvent(new CustomEvent(type, options));
    }

    static addListener (type, callback, target = document) {
        target.addEventListener(type, callback, false);
    }

    static removeListener (type, callback, target = document) {
        target.removeEventListener(type, callback, false);
    }
}
