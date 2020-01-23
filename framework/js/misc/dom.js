'use strict';

class MiscDom {
    static getAttribute(element, attributeName, defautValue = null) {
        if (!element || !attributeName) {
            return defautValue;
        }

        return (element.hasAttribute(attributeName) === true ? element.getAttribute(attributeName) : defautValue);
    }

    static addClasses(element, classNames) {
        if (typeof classNames === 'string') {
            classNames = [classNames];
        }

        if (element.classList) {
            for(let index in classNames) {
                element.classList.add(classNames[index]); // IE 10+
            }
        } else {
            element.className += ' ' + classNames.join(' '); // IE 8+
        }
    }

    static hasClass(element, className) {
        if (element.classList) {
            return element.classList.contains(className); // IE 10+
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className); // IE 8+ ?
        }
    }
}
