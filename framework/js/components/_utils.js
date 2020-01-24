'use strict';

class Utils {

    constructor() {}

    // Ajoute la classe "show" sur un élément après un timer
    static timerShow(elem, timer) {
        setTimeout(function() {
            elem.classList.add('show');
        }, timer);
    }

    // Ajoute le style css "display: none" sur un élément après un timer
    static timerDisplayNone(elem, timer) {
        setTimeout(function() {
            elem.style.display = 'none';
        }, timer);
    }

    static timerClass(elem, className, value, timer) {
        setTimeout(function() {
            elem.style[className] = value;
        }, timer);
    }

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

}