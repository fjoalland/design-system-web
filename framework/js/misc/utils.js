class MiscUtils {
    static getPositionY(element) {
        let yPosition = 0;

        while (element) {
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return yPosition;
    }

    static timerClass(element, className, value, timer) {
        setTimeout(function () {
            element.style[className] = value;
        }, timer);
    }

    static generateId() {
        return 'id' + Math.random().toString(36).substring(2, 15);
    }

    static isValuesAllowed(currentValues, valuesAllowed) {
        if (typeof currentValues === 'object' && currentValues.value !== undefined) {
            if (!valuesAllowed.includes(currentValues.value)) {
                return false;
            }

            return true;
        }

        if (typeof currentValues === 'object') {
            const valuesIntersection = (valuesAllowed.filter(value => currentValues.includes(value)));
            if (valuesIntersection.length === 0) {
                return false;
            }

            return true;
        }

        if (!valuesAllowed.includes(currentValues)) {
            return false;
        }

        return true;
    }
}
