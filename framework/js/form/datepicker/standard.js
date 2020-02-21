class FormDatepickerStandard extends FormInputAbstract {
    constructor() {
        super('.ds44-datepicker__shape', 'datepicker');
    }

    create(element) {
        super.create(element);

        // Create corresponding hidden input to store the value
        let valueElement = document.createElement('input');
        valueElement.classList.add('ds44-input-value');
        valueElement.setAttribute('type', 'hidden');
        valueElement.setAttribute('aria-hidden', 'true');
        element.parentNode.insertBefore(valueElement, element);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];

        object.valueElement = valueElement;
        object.inputElements = element.querySelectorAll('input[type="number"]');
        object.isRequired = (element.getAttribute('data-required') === 'true');

        MiscEvent.addListener('click', this.focusIn.bind(this, objectIndex), object.labelElement);
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

    showHideResetButton(objectIndex) {
        const object = this.objects[objectIndex];
        if (!object.resetButton) {
            return;
        }

        if (this.getDateText(objectIndex) === '--') {
            // Hide reset button
            object.resetButton.style.display = 'none';
        } else {
            // Hide reset button
            object.resetButton.style.display = 'block';
        }
    }

    reset(objectIndex) {
        const object = this.objects[objectIndex];

        object.inputElements[0].value = null;
        object.inputElements[1].value = null;
        object.inputElements[2].value = null;

        super.reset(objectIndex);
    }

    focusIn(objectIndex) {
        const object = this.objects[objectIndex];
        if (!object.inputElements[0]) {
            return;
        }

        MiscAccessibility.setFocus(object.inputElements[0]);
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
        const object = this.objects[objectIndex];

        if (this.getDateText(objectIndex) !== '--') {
            if (
                object.inputElements[0].value &&
                object.inputElements[1].value &&
                object.inputElements[2].value
            ) {
                this.checkValidity(objectIndex);
            }

            return;
        }

        if (!object.labelElement) {
            return;
        }
        if (!object.textElement) {
            return;
        }

        object.labelElement.classList.remove(this.labelClassName);
        object.textElement.classList.remove('show');
    }

    getDateText(objectIndex) {
        const object = this.objects[objectIndex];

        const dateYear = parseInt(object.inputElements[2].value, 10) || '';
        const dateMonth = parseInt(object.inputElements[1].value, 10) || '';
        const dateDay = parseInt(object.inputElements[0].value, 10) || '';
        return dateYear + '-' + dateMonth + '-' + dateDay;
    }

    record(objectIndex, evt) {
        if (evt) {
            evt.preventDefault();
        }

        const object = this.objects[objectIndex];
        if (!object.valueElement) {
            return;
        }
        ;

        const dateText = this.getDateText(objectIndex);
        if (!dateText.match(/^(19|20)\d\d([- /.])(0?[1-9]|1[012])\2(0?[1-9]|[12][0-9]|3[01])$/)) {
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

    checkValidity(objectIndex) {
        this.removeInvalid(objectIndex);

        const object = this.objects[objectIndex];
        if (!object.textElement) {
            return;
        }

        if (
            object.isRequired &&
            !object.textElement.classList.contains('ds44-inputDisabled') &&
            !this.getData(objectIndex)
        ) {
            this.invalid(objectIndex);

            return false;
        }

        return true;
    }
}

// Singleton
new FormDatepickerStandard();
