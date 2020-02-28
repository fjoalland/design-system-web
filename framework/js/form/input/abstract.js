class FormInputAbstract extends FormFieldAbstract {
    create(element) {
        super.create(element);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];

        object.textElement = element;
        object.valueElement = element;
        object.inputElements = [element];
        object.labelElement = MiscDom.getPreviousSibling(element, 'span');
        object.resetButton = MiscDom.getNextSibling(element, '.ds44-reset');

        if (object.labelElement) {
            object.labelElement.classList.remove(this.labelClassName);
        }

        MiscEvent.addListener('focus', this.focus.bind(this, objectIndex), element);
        MiscEvent.addListener('blur', this.blur.bind(this, objectIndex), element);
        MiscEvent.addListener('invalid', this.invalid.bind(this, objectIndex), element);
        MiscEvent.addListener('keyUp:*', this.write.bind(this, objectIndex));
        if (object.resetButton) {
            MiscEvent.addListener('click', this.reset.bind(this, objectIndex), object.resetButton);
        }
        if (object.labelElement) {
            MiscEvent.addListener('click', this.focusOnTextElement.bind(this, objectIndex), object.labelElement);
        }
    }

    write(objectIndex) {
        const object = this.objects[objectIndex];
        if (!object.textElement) {
            return;
        }
        if (object.textElement !== document.activeElement) {
            return;
        }

        this.showHideResetButton(objectIndex);
        this.enableDisableLinkedField(objectIndex);
    }

    reset(objectIndex) {
        this.setData(objectIndex);
        this.showHideResetButton(objectIndex);
        this.enableDisableLinkedField(objectIndex);
        this.focusOnTextElement(objectIndex);
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

        this.blur(objectIndex);
        this.showHideResetButton(objectIndex);
    }

    showHideResetButton(objectIndex) {
        const object = this.objects[objectIndex];
        if (!object.resetButton) {
            return;
        }

        if (!this.getText(objectIndex)) {
            // Hide reset button
            object.resetButton.style.display = 'none';
        } else {
            // Hide reset button
            object.resetButton.style.display = 'block';
        }
    }

    setData(objectIndex, data = null) {
        const object = this.objects[objectIndex];
        if (!object.valueElement) {
            return;
        }

        object.valueElement.value = ((data && data.value) ? data.value : null);
    }

    getText(objectIndex) {
        return this.getData(objectIndex);
    }

    isValid(inputElement) {
        let isValid = true;
        const validityStates = inputElement.validity;
        for (let key in validityStates) {
            if (validityStates[key] && key !== 'valueMissing') {
                isValid = false;
                break;
            }
        }

        return isValid;
    }

    isEmpty(objectIndex) {
        const object = this.objects[objectIndex];

        let isEmpty = !this.getText(objectIndex);
        object.inputElements.forEach((inputElement) => {
            isEmpty = (isEmpty && this.isValid(inputElement));
        });
        return isEmpty;
    }

    focusOnTextElement(objectIndex) {
        const object = this.objects[objectIndex];

        MiscAccessibility.setFocus(object.inputElements[0]);
    }

    focus(objectIndex) {
        const object = this.objects[objectIndex];

        if (object.labelElement) {
            object.labelElement.classList.add(this.labelClassName);
        }
    }

    blur(objectIndex) {
        if (!this.isEmpty(objectIndex)) {
            return;
        }

        const object = this.objects[objectIndex];
        if (!object.labelElement) {
            return;
        }

        object.labelElement.classList.remove(this.labelClassName);
    }

    removeInvalid(objectIndex) {
        const object = this.objects[objectIndex];
        if (!object.textElement) {
            return;
        }

        let elementError = object.containerElement.querySelector('.ds44-errorMsg-container');
        if (elementError) {
            elementError.remove();
        }

        object.inputElements.forEach((inputElement) => {
            inputElement.removeAttribute('aria-invalid');
        });
        object.textElement.classList.remove('ds44-error');
    }

    invalid(objectIndex) {
        const object = this.objects[objectIndex];
        if (!object.textElement) {
            return;
        }

        this.showErrorMessage(objectIndex);

        object.inputElements.forEach((inputElement) => {
            inputElement.setAttribute('aria-invalid', 'true');
        });
        object.textElement.classList.add('ds44-error');
    }
}
