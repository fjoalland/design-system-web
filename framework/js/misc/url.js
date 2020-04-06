class MiscUrl {
    static getHashParameters () {
        return MiscUrl.urlToJson('#');
    }

    static setHashParameters (parameters = {}) {
        let newUrl = document.location.href.split('#')[0];

        const sortedParameters = {};
        Object.keys(parameters).sort().forEach(function (key) {
            sortedParameters[key] = parameters[key];
        });

        document.location.href = newUrl + '#' + MiscUrl.jsonToUrl(parameters);
    }

    static buildUrlData (urlData, data, parentKey) {
        if (
            data &&
            typeof data === 'object' &&
            !(data instanceof Date) &&
            !(data instanceof File)
        ) {
            Object.keys(data).forEach(key => {
                MiscUrl.buildUrlData(urlData, data[key], parentKey ? `${parentKey}[${key}]` : key);
            });

            return;
        }

        const value = (data == null ? '' : data);
        urlData.append(parentKey, value);
    }

    static jsonToUrl (data) {
        const urlData = new URLSearchParams();
        MiscUrl.buildUrlData(urlData, data);
        return urlData;
    }

    static urlToJson (separator = '?') {
        const url = document.location.href
        if (
            url.indexOf(separator) === -1 ||
            url.indexOf(separator) === (url.length - 1)
        ) {
            // No hash
            return null;
        }

        const chunks = decodeURI(url.slice(url.indexOf(separator) + 1)).split('&');
        const params = {};
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i].split('=');

            const matches = chunk[0].match("\\[[^\\]]*\\]")
            if (matches[0]) {
                const propertyName = chunk[0].replace(matches[0], '')
                const attributeName = matches[0].replace('[', '').replace(']', '')

                if (typeof params[propertyName] === 'undefined') {
                    params[propertyName] = {};
                }
                params[propertyName][attributeName] = chunk[1];
            } else {
                params[chunk[0]] = chunk[1];
            }
        }

        return params;
    }
}
