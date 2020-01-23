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
            for (let index in classNames) {
                element.classList.add(classNames[index]); // IE 10+
            }
        } else {
            element.className += ' ' + classNames.join(' '); // IE 8+
        }
    }

    static removeClasses(element, classNames) {
        if (typeof classNames === 'string') {
            classNames = [classNames];
        }

        for (let index in classNames) {
            if (element.classList) {
                element.classList.remove(classNames[index]); // IE 10+
            } else {
                element.className = element.className.replace(classNames[index], ''); // IE 8+
            }
        }
    }

    static hasClass(element, className) {
        if (element.classList) {
            return element.classList.contains(className); // IE 10+
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className); // IE 8+ ?
        }
    }

    static getOffset(element) {
        let rect = element.getBoundingClientRect();
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
            'top': rect.top + scrollTop,
            'left': rect.left + scrollLeft
        };
    }
}
