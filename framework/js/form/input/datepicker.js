class FormInputDatepicker extends FormInputAbstract {
    constructor() {
        super('.ds44-datepicker__shape', 'datepicker');
    }

    create(element) {
        super.create(element);

        // Create corresponding hidden input to store the value
        let valueElement = document.createElement('input');
        valueElement.classList.add('ds44-input-value');
        valueElement.setAttribute('type', 'hidden');
        element.parentNode.insertBefore(valueElement, element);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];

        object.valueElement = valueElement;
        object.inputElements = element.querySelectorAll('input[type="text"]');

        object.inputElements.forEach((inputElement) => {
            MiscEvent.addListener('focus', this.focus.bind(this, objectIndex), inputElement);
            MiscEvent.addListener('blur', this.blur.bind(this, objectIndex), inputElement);
        });
    }

    write(objectIndex) {
        const object = this.objects[objectIndex];
        if (!object.textElement) {
            return;
        }
        if (!object.textElement.contains(document.activeElement)) {
            return;
        }

        this.record(objectIndex);
        this.showHideResetButton(objectIndex);
        this.enableDisableLinkedField(objectIndex);
    }

    reset(objectIndex) {
        const object = this.objects[objectIndex];

        object.inputElements[0].value = null;
        object.inputElements[1].value = null;
        object.inputElements[2].value = null;

        super.reset(objectIndex);
    }

    disableElements(objectIndex) {
        const object = this.objects[objectIndex];

        object.inputElements[0].value = null;
        object.inputElements[1].value = null;
        object.inputElements[2].value = null;

        super.disableElements(objectIndex);
    }

    focus(objectIndex) {
        super.focus(objectIndex);

        const object = this.objects[objectIndex];
        if (!object.textElement) {
            return;
        }

        object.textElement.classList.add('show');
    }

    blur(objectIndex) {
        super.blur(objectIndex);

        if (!this.isEmpty(objectIndex)) {
            return;
        }

        const object = this.objects[objectIndex];
        if (!object.textElement) {
            return;
        }

        object.textElement.classList.remove('show');
    }

    getText(objectIndex) {
        const object = this.objects[objectIndex];

        const dateYear = parseInt(object.inputElements[2].value, 10) || '';
        const dateMonth = parseInt(object.inputElements[1].value, 10) || '';
        const dateDay = parseInt(object.inputElements[0].value, 10) || '';
        const text = dateYear + '-' + dateMonth + '-' + dateDay;
        if (text === '--') {
            return null;
        }

        return text;
    }

    record(objectIndex, evt) {
        if (evt) {
            evt.preventDefault();
        }

        const object = this.objects[objectIndex];
        const dateText = this.getText(objectIndex);
        if (
            !dateText ||
            !dateText.match(/^(19|20)\d\d([- /.])(0?[1-9]|1[012])\2(0?[1-9]|[12][0-9]|3[01])$/)
        ) {
            // Not nicely formatted
            this.setData(objectIndex);

            return;
        }

        const dateYear = parseInt(object.inputElements[2].value, 10);
        const dateMonth = (parseInt(object.inputElements[1].value, 10) - 1);
        const dateDay = parseInt(object.inputElements[0].value, 10);
        const date = new Date(dateYear, dateMonth, dateDay);
        if (
            date.getTime() !== date.getTime() ||
            date.getFullYear() !== dateYear ||
            date.getMonth() !== dateMonth ||
            date.getDate() !== dateDay
        ) {
            // If the date object is invalid it
            // will return 'NaN' on getTime()
            // and NaN is never equal to itself.
            this.setData(objectIndex);

            return;
        }

        this.setData(
            objectIndex,
            {
                'value': dateText
            }
        )
    }
}

// Singleton
new FormInputDatepicker();
