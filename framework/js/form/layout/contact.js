class FormLayoutContact {
    constructor () {
        const formElement = document.querySelector('#overlay-qui-contacter-rech form');
        if (!formElement) {
            return;
        }

        MiscEvent.addListener('form:submit', this.submit.bind(this), formElement);
    }

    submit (evt) {
        if (
            !evt ||
            !evt.detail ||
            !evt.detail.parameters
        ) {
            return;
        }

        // Show loader
        MiscEvent.dispatch('loader:requestShow');

        // Get the contact data from the back office
        MiscRequest.send(
            evt.currentTarget.getAttribute('action'),
            this.contactSuccess.bind(this, evt.currentTarget),
            this.contactError.bind(this, evt.currentTarget),
            evt.detail.parameters
        )
    }

    contactSuccess (formElement, response) {
        this.showContactData(formElement, response);
        MiscEvent.dispatch('loader:requestHide');
    }

    contactError (formElement) {
        MiscEvent.dispatch(
            'form:notification',
            {
                'id': MiscUtils.generateId(),
                'type': 'error',
                'message': MiscTranslate._('FORM_GENERAL_ERROR')
            },
            formElement
        );
        MiscEvent.dispatch('loader:requestHide');
    }

    showContactData (formElement, contactData) {
        const destinationElement = document.querySelector(formElement.getAttribute('data-result-destination'));
        if(!destinationElement) {
            return;
        }

        destinationElement.innerHTML = contactData.content_html;
    }
}

new FormLayoutContact();
