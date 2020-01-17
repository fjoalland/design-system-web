class MiscUrl {
    static getHashParameters() {
        const url = document.location.href;
        if (
            url.indexOf('#') === -1 ||
            url.indexOf('#') === (url.length - 1)
        ) {
            // No hash
            return null;
        }

        // Has a hash
        return url
            .slice(url.indexOf('#') + 1)
            .split('&')
            .reduce(
                (params, hash) => {
                    const split = hash.split('=');
                    const key = split.shift();
                    const value = split.join('=');
                    return Object.assign(
                        params,
                        {
                            [key]: (value ? window.decodeURIComponent(value) : null)
                        }
                    );
                },
                {}
            );
    }
}
