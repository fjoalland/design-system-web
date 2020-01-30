class MiscRequest {
    static send(url, successCallback, errorCallback, parameters = null, method = 'GET') {
        const xhr = new XMLHttpRequest();
        xhr.open(method.toUpperCase(), url, true);
        xhr.onreadystatechange = () => {
            try {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this.response(xhr, successCallback);

                        return;
                    }

                    this.response(xhr, errorCallback);
                }
            } catch (ex) {
                console.log(ex);

                this.response(xhr, errorCallback);
            }
        };
        if (
            parameters &&
            typeof parameters === 'object'
        ) {
            if (method.toLowerCase() === 'get') {
                console.log('Parameters will not follow through on a GET method request')
            }
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.send(JSON.stringify(parameters));
        } else {
            xhr.send(parameters);
        }

        return xhr;
    }

    static response(xhr, callback) {
        if (callback) {
            if (
                xhr &&
                xhr.getResponseHeader('content-type').toLowerCase() === 'application/json'
            ) {
                callback(JSON.parse(xhr.response));

                return;
            }

            callback(xhr.response);
        }
    }
}
