class MiscUtils {
    static getPositionY (element) {
        let yPosition = 0;

        while (element) {
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return yPosition;
    }

    static generateId () {
        return 'id' + Math.random().toString(36).substring(2, 15);
    }

    static isInDevMode () {
        return (document.location.hostname === 'localhost');
    }

    static merge (obj) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {
            if (source) {
                for (const prop in source) {
                    if (
                        source[prop] &&
                        source[prop].constructor === Object
                    ) {
                        if (!obj[prop] || obj[prop].constructor === Object) {
                            obj[prop] = obj[prop] || {};
                            MiscUtils.merge(obj[prop], source[prop]);
                        } else {
                            obj[prop] = source[prop];
                        }
                    } else {
                        obj[prop] = source[prop];
                    }
                }
            }
        });
        return obj;
    }
}
