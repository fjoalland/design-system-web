class FormStandard {
    constructor() {
        this.hasBeenChecked = false;
        this.validationCategories = {
            'inputStandard': null,
            'inputAutocomplete': null,
            'textarea': null,
            'checkbox': null,
            'radio': null,
            'selectStandard': null,
            'selectRadio': null,
            'selectCheckbox': null,
            'selectMultilevel': null
        };

        document
            .querySelectorAll('form')
            .forEach((element) => {
                element.setAttribute('novalidate', 'true');

                MiscEvent.addListener('submit', this.submit.bind(this), element);
                MiscEvent.addListener('form:validation', this.validation.bind(this), element);
            });
    }

    validation(evt) {
        // This function will be fired by each component category so they can tell if they are valid or not
        this.hasBeenChecked = true;

        if (
            !evt ||
            !evt.detail ||
            evt.detail.category === undefined ||
            evt.detail.isValid === undefined
        ) {
            return;
        }

        // Mark the component category as answered
        let isFinished = true;
        this.validationCategories[evt.detail.category] = {
            'isValid': evt.detail.isValid,
            'data': evt.detail.data
        };
        for (let category in this.validationCategories) {
            if (this.validationCategories[category] === null) {
                isFinished = false;
                break;
            }
        }

        // All the component categories answered the call, we can carry on with the form validation
        if (isFinished) {
            MiscEvent.dispatch('submit', null, evt.currentTarget);
        }
    }

    submit(evt) {
        // Submission is in two steps :
        //  - First we ask the form components if they are valid through event dispatching
        //  - Then, once everyone came back, we make a decision on the form validity
        try {
            const element = evt.currentTarget;

            if (!this.hasBeenChecked) {
                // Check the form components
                evt.stopPropagation();
                evt.preventDefault();

                MiscEvent.dispatch('form:validate', {'formElement': element});

                return false;
            }
            this.hasBeenChecked = false;

            // Check if the components are all valid
            let isValid = true;
            let data = {};
            for (let category in this.validationCategories) {
                if (
                    !this.validationCategories[category] ||
                    this.validationCategories[category].isValid !== true
                ) {
                    isValid = false;
                } else if (this.validationCategories[category].data) {
                    data = Object.assign(data, this.validationCategories[category].data);
                }
                this.validationCategories[category] = null;
            }
            if (!isValid) {
                // At least one was not valid
                evt.stopPropagation();
                evt.preventDefault();

                // Focus on first error field
                const firstErrorField = element.querySelector('[aria-invalid="true"]');
                if (firstErrorField) {
                    MiscAccessibility.setFocus(firstErrorField);
                }

                return false;
            }

            // Organize data
            const formattedData = {};
            for (let dataKey in data) {
                let dataValue = data[dataKey];

                try {
                    // Try if it is JSON
                    dataValue = JSON.parse(dataValue);
                } catch (ex) {
                }
                formattedData[dataKey] = dataValue
            }

            if (element.getAttribute('data-is-ajax') === 'true') {
                // Ajax submission
                MiscEvent.dispatch(
                    'search:refresh',
                    {
                        'parameters': formattedData,
                        'reset': true
                    });

                return;
            }

            // Regular submission
            const formData = MiscForm.jsonToFormData(formattedData);
            for (var [key, value] of formData.entries()) {
                let hiddenInputElement = document.createElement('input');
                hiddenInputElement.setAttribute('type', 'hidden');
                hiddenInputElement.setAttribute('name', key);
                hiddenInputElement.value = value;
                element.appendChild(hiddenInputElement);
            }
            element.submit();
        } catch (ex) {
            evt.stopPropagation();
            evt.preventDefault();

            return false;
        }
    }
}

// Singleton
new FormStandard();
