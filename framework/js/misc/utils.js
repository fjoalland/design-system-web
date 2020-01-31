'use strict';

class Utils {
    static fusionneKeyPressedWithClicked(event) {
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            event.target.click();
        }
    }

    static getPositionY(element) {
        var yPosition = 0;

        while (element) {
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return yPosition;
    }

    // Ajoute le style css "display: none" sur un élément après un timer
    static timerDisplayNone(element, timer) {
        setTimeout(function () {
            element.style.display = 'none';
        }, timer);
    }

    static timerClass(element, className, value, timer) {
        setTimeout(function () {
            element.style[className] = value;
        }, timer);
    }
}
