class FormUtileYes extends FormUtileAbstract {
    constructor() {
        super('#ds44-choiceY form');

        this.submitSuccessText = 'Content que cette page vous ait été utile ! Merci.';
    }
}

// Singleton
new FormUtileYes();
