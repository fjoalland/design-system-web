class SimulatorObligationAlimentaire {
    constructor () {
        this.templateElement = document.querySelector('#ds44-js-simulateur-obligation-alimentaire-template');
        this.containerElement = document.querySelector('#ds44-js-simulateur-obligation-alimentaire-container');
        if (
            !this.templateElement ||
            !this.containerElement
        ) {
            return;
        }

        this.add();

        const addElement = document.querySelector('#ds44-js-simulateur-obligation-alimentaire-add');
        if (addElement) {
            MiscEvent.addListener('click', this.add.bind(this), addElement);
        }
        const deleteElement = document.querySelector('#ds44-js-simulateur-obligation-alimentaire-delete');
        if (deleteElement) {
            MiscEvent.addListener('click', this.delete.bind(this), deleteElement);
        }
        const calculateElement = document.querySelector('#ds44-js-simulateur-obligation-alimentaire-calculate');
        if (calculateElement) {
            MiscEvent.addListener('click', this.calculate.bind(this), calculateElement);
        }
    }

    add () {
        const number = this.containerElement.querySelectorAll('.ds44-js-soa-item').length;
        const idNumber = number * 2;

        const cloneElement = document.importNode(this.templateElement.content, true);
        cloneElement.childNodes.forEach((childElement) => {
            if (!childElement.innerHTML) {
                return;
            }

            childElement.innerHTML = childElement.innerHTML
                .replace(/ds44-js-soa-template-field-1/gi, 'ds44-js-soa-field-' + idNumber)
                .replace(/ds44-js-soa-template-field-2/gi, 'ds44-js-soa-field-' + (idNumber + 1))
                .replace(/ds44-js-soa-template-tooltip-1/gi, 'ds44-js-soa-tooltip-' + idNumber)
                .replace(/ds44-js-soa-template-tooltip-2/gi, 'ds44-js-soa-tooltip-' + (idNumber + 1));
            if (childElement.classList.contains('ds44-js-soa-item')) {
                childElement.setAttribute('id', 'ds44-js-soa-item-' + number)
            }
        });
        cloneElement.querySelector('.ds44-js-soa-number').innerText = number + 1;

        this.containerElement.append(cloneElement);

        const selectorPrefix = '#ds44-js-simulateur-obligation-alimentaire-container #ds44-js-soa-item-' + number;
        MiscEvent.dispatch('field:add', {
            'selector': selectorPrefix + ' input[type="text"]:not([aria-autocomplete="list"]):not([data-is-date])',
            'category': 'inputStandard'
        });
        MiscEvent.dispatch('field:add', {
            'selector': selectorPrefix + ' .ds44-selectDisplay.ds44-js-select-standard',
            'category': 'selectStandard'
        });
        MiscEvent.dispatch('tooltip:add');
    }

    delete () {
        const itemElements = this.containerElement.querySelectorAll('.ds44-js-soa-item');
        if (itemElements.length <= 1) {
            return;
        }
        const lastItemElement = itemElements[itemElements.length - 1];

        const selectorPrefix = '#ds44-js-simulateur-obligation-alimentaire-container #' + lastItemElement.getAttribute('id');
        MiscEvent.dispatch('field:destroy', {
            'selector': selectorPrefix + ' input[type="text"]:not([aria-autocomplete="list"]):not([data-is-date])',
            'category': 'inputStandard'
        });
        MiscEvent.dispatch('field:destroy', {
            'selector': selectorPrefix + ' .ds44-selectDisplay.ds44-js-select-standard',
            'category': 'selectStandard'
        });

        lastItemElement.remove();
    }

    calculate () {

    }
}

// Singleton
new SimulatorObligationAlimentaire();
