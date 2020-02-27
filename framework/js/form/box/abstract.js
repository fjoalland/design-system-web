class FormBoxAbstract extends FormFieldAbstract {
    constructor(category) {
        super(
            '.ds44-form__' + category + '_container',
            category
        );

        this.errorMessage = 'Veuillez cocher au moins un élément';
    }

    create(element) {
        super.create(element);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];

        object.inputElements = element.querySelectorAll('input[type="' + this.category + '"]');

        object.inputElements.forEach((inputElement) => {
            MiscEvent.addListener('click', this.toggleCheck.bind(this, objectIndex), inputElement);
        });
    }

    enableElements(objectIndex, evt) {
        const object = this.objects[objectIndex];

        object.inputElements.forEach((inputElement) => {
            inputElement.removeAttribute('disabled');
        });
    }

    disableElements(objectIndex) {
        const object = this.objects[objectIndex];

        object.inputElements.forEach((inputElement) => {
            inputElement.setAttribute('disabled', 'true');
        });
    }

    toggleCheck(objectIndex) {
        const object = this.objects[objectIndex];

        object.inputElements.forEach((inputElement) => {
            if (inputElement.checked) {
                inputElement.setAttribute('aria-checked', 'true');
            } else {
                inputElement.removeAttribute('aria-checked');
            }
        });

        this.enableDisableLinkedField(objectIndex);
    }

    setData(objectIndex, data = null) {
        const object = this.objects[objectIndex];

        object.inputElements.forEach((inputElement) => {
            if (
                data &&
                data.values &&
                data.values.includes(inputElement.value)
            ) {
                inputElement.checked = true;
                inputElement.setAttribute('aria-checked', 'true');
            } else {
                inputElement.checked = false;
                inputElement.removeAttribute('aria-checked');
            }
        });
    }

    getData(objectIndex) {
        const object = this.objects[objectIndex];

        const inputElementValues = [];
        object.inputElements.forEach((inputElement) => {
            if (inputElement.checked) {
                inputElementValues.push(inputElement.value);
            }
        });
        if (inputElementValues.length === 0) {
            return null;
        }

        let data = {};
        data[object.name] = inputElementValues;

        return data;
    }

    removeInvalid(objectIndex) {
        const object = this.objects[objectIndex];

        let errorElement = object.containerElement.querySelector('.ds44-errorMsg-container');
        if (errorElement) {
            errorElement.remove();
        }

        object.inputElements.forEach((inputElement) => {
            inputElement.classList.remove('ds44-boxError');
        });
    }

    invalid(objectIndex) {
        const object = this.objects[objectIndex];

        this.showErrorMessage(objectIndex);

        object.inputElements.forEach((inputElement) => {
            inputElement.classList.add('ds44-boxError');
        });
    }
}
