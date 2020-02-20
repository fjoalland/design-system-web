class FormInputStandard extends FormFieldAbstract {
    constructor() {
        super(
            'input[type="text"]:not([aria-autocomplete="list"]), ' +
            'input[type="email"]:not([aria-autocomplete="list"]), ' +
            'input[type="number"]:not([aria-autocomplete="list"]):not([data-is-date])',
            'inputStandard'
        );
    }
}

// Singleton
new FormInputStandard();
