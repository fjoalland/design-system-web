'use strict';

class MiscDom {
    static getAttribute(element, attributeName, defautValue = null) {
        if(!element || !attributeName) {
            return defautValue;
        }

        return (element.hasAttribute(attributeName) === true ? element.getAttribute(attributeName) : defautValue);
    }
}
