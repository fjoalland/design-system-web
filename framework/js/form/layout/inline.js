class FormLayoutInline extends FormLayoutAbstract {
    constructor () {
        super('form[data-is-inline="true"]');
    }

    ajaxSubmit (objectIndex, formData) {
        const object = this.objects[objectIndex];

        // Show loader
        MiscEvent.dispatch('loader:requestShow');

        // Get the inline data from the back office
        MiscRequest.send(
            object.formElement.getAttribute('action'),
            this.inlineSuccess.bind(this, objectIndex),
            this.inlineError.bind(this, objectIndex),
            formData
        )
    }

    inlineSuccess (objectIndex, response) {
        this.showInlineData(objectIndex, response);
        if (
            response &&
            response.message
        ) {
            this.notification(objectIndex, null, response.message, response.status);
        }
        MiscEvent.dispatch('loader:requestHide');
    }

    inlineError (objectIndex, response) {
        if (
            response &&
            response.message
        ) {
            this.notification(objectIndex, null, response.message, response.status);
        }
        MiscEvent.dispatch('loader:requestHide');
    }

    showInlineData (objectIndex, inlineData) {
        const object = this.objects[objectIndex];

        const destinationElement = document.querySelector(object.formElement.getAttribute('data-result-destination'));
        if (!destinationElement) {
            return;
        }

        destinationElement.innerHTML = inlineData.content_html;
    }
}

new FormLayoutInline();
