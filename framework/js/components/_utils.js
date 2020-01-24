'use strict';

class Utils {

    constructor() {}

    static fusionneKeyPressedWithClicked(event) {
      if(event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        event.target.click();
      }
    }

    static getPositionY(element) {
        var yPosition = 0;

        while(element) {
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return yPosition;
    }

    static accessibilityHide(element) {
        if (!element) return;
        element.setAttribute('aria-hidden', 'true');
        element.setAttribute('tab-index', '-1');
    }

    static accessibilityShow(element) {
        if (!element) return;
        element.removeAttribute('aria-hidden');
        element.removeAttribute('tab-index');
    }

}