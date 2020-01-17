class MiscEvent {
    static dispatch(type, data, target = document) {
        target.dispatchEvent(new CustomEvent(type, (data ? {"detail": data} : null)));
    }

    static addListener(type, callback, target = document) {
        target.addEventListener(type, callback, false);
    }
}
