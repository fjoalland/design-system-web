class FormLayoutInline {
    constructor () {
        this.objects = [];

        document
            .querySelectorAll('form[data-is-inline="true"]')
            .forEach((formElement) => {
                this.create(formElement);
            });
    }

    create (element) {
        const object = {
            'id': MiscUtils.generateId(),
            'formElement': element
        };
        this.objects.push(object);
        const objectIndex = (this.objects.length - 1);

        // Bind events
        MiscEvent.addListener('form:submit', this.submit.bind(this, objectIndex), object.formElement);
    }

    submit (objectIndex, evt) {
        if (
            !evt ||
            !evt.detail ||
            !evt.detail.parameters
        ) {
            return;
        }

        const object = this.objects[objectIndex];

        // Show loader
        MiscEvent.dispatch('loader:requestShow');

        // Get the inline data from the back office
        MiscRequest.send(
            object.formElement.getAttribute('action'),
            this.inlineSuccess.bind(this, objectIndex),
            this.inlineError.bind(this, objectIndex),
            evt.detail.parameters
        )
    }

    inlineSuccess (objectIndex, response) {
        this.showInlineData(objectIndex, response);
        MiscEvent.dispatch('loader:requestHide');
    }

    inlineError (objectIndex) {
        const object = this.objects[objectIndex];

        MiscEvent.dispatch(
            'form:notification',
            {
                'id': MiscUtils.generateId(),
                'type': 'error',
                'message': MiscTranslate._('FORM_GENERAL_ERROR')
            },
            object.formElement
        );
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
