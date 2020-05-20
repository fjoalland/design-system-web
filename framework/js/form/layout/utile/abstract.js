class FormLayoutUtileAbstract extends FormLayoutAbstract {
    constructor (selector) {
        super(selector);

        this.submitSuccessText = MiscTranslate._('USEFUL_REQUEST_THANK_YOU');
    }

    ajaxSubmit (objectIndex, formData) {
        const object = this.objects[objectIndex];

        // Show loader
        MiscEvent.dispatch('loader:requestShow');

        // Add other details to parameters
        formData.url = { 'value': document.location.href };
        formData.title = { 'value': document.title };
        formData.date = {
            'value': (new Date()).toLocaleString(
                'fr-FR',
                {
                    'timeZone': 'UTC',
                    'timeZoneName': 'short'
                }
            )
        };

        // Get the results from the back office
        MiscRequest.send(
            object.formElement.getAttribute('action'),
            this.submitSuccess.bind(this, objectIndex),
            this.submitError.bind(this, objectIndex),
            formData
        );
    }

    submitSuccess (objectIndex) {
        const object = this.objects[objectIndex];

        const parentElement = object.formElement.closest('.ds44-inner-container');
        if (!parentElement) {
            MiscEvent.dispatch('loader:requestHide');

            return;
        }

        // Empty parent
        parentElement.innerHTML = '';

        // Show message
        const gridElement = document.createElement('div');
        gridElement.classList.add('grid-1-small-1');
        gridElement.classList.add('ds44-grid12-offset-1');
        gridElement.classList.add('s44-box');
        parentElement.appendChild(gridElement);

        const centerElement = document.createElement('div');
        centerElement.classList.add('col');
        centerElement.classList.add('txtcenter');
        gridElement.appendChild(centerElement);

        const textElement = document.createElement('div');
        textElement.classList.add('h4-like');
        textElement.setAttribute('aria-live', 'polite');
        textElement.innerHTML = this.submitSuccessText;
        centerElement.appendChild(textElement);

        // Hide loader
        MiscEvent.dispatch('loader:requestHide');
    }

    submitError (objectIndex) {
        const object = this.objects[objectIndex];

        // Show error notification in form
        const messageId = MiscUtils.generateId();
        this.notification(objectIndex, messageId, MiscTranslate._('FORM_GENERAL_ERROR'));

        // Add aria described by to textarea
        const textareaElement = object.formElement.querySelector('textarea');
        if (textareaElement) {
            textareaElement.setAttribute('aria-describedby', messageId);
        }

        // Hide loader
        MiscEvent.dispatch('loader:requestHide');
    }
}
