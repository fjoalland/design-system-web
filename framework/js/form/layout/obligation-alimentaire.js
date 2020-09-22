class FormLayoutObligationAlimentaire extends FormLayoutAbstract {
    constructor () {
        super('#ds44-js-soa-form');

        this.templateElement = document.querySelector('#ds44-js-soa-template');
        this.containerElement = document.querySelector('#ds44-js-soa-container');
        if (
            !this.templateElement ||
            !this.containerElement
        ) {
            return;
        }

        this.add();

        const addElement = document.querySelector('#ds44-js-soa-add');
        if (addElement) {
            MiscEvent.addListener('click', this.add.bind(this), addElement);
        }
        const deleteElement = document.querySelector('#ds44-js-soa-delete');
        if (deleteElement) {
            MiscEvent.addListener('click', this.delete.bind(this), deleteElement);
        }
    }

    add () {
        const itemNumber = this.containerElement.querySelectorAll('.ds44-js-soa-item').length;
        const idNumber = itemNumber * 2;

        const cloneElement = document.importNode(this.templateElement.content, true);
        cloneElement.childNodes.forEach((childElement) => {
            if (!childElement.innerHTML) {
                return;
            }

            childElement.innerHTML = childElement.innerHTML
                .replace(/ds44-js-soa-template-field-1/gi, 'ds44-js-soa-field-' + idNumber)
                .replace(/ds44-js-soa-template-field-2/gi, 'ds44-js-soa-field-' + (idNumber + 1));
            if (childElement.classList.contains('ds44-js-soa-item')) {
                childElement.setAttribute('id', 'ds44-js-soa-item-' + itemNumber)
            }
        });
        cloneElement.querySelector('.ds44-js-soa-number').innerText = itemNumber + 1;

        this.containerElement.append(cloneElement);

        const selectorPrefix = '#ds44-js-soa-container #ds44-js-soa-item-' + itemNumber;
        MiscEvent.dispatch('field:add', {
            'selector': selectorPrefix + ' input[type="text"]:not([aria-autocomplete="list"]):not([data-is-date])',
            'category': 'inputStandard'
        });
        MiscEvent.dispatch('field:add', {
            'selector': selectorPrefix + ' .ds44-selectDisplay.ds44-js-select-standard',
            'category': 'selectStandard'
        });

        const deleteElement = document.querySelector('#ds44-js-soa-delete');
        if (deleteElement && itemNumber === 1) {
            deleteElement.classList.remove('ds44-none');
        }
    }

    delete () {
        const itemElements = this.containerElement.querySelectorAll('.ds44-js-soa-item');
        const itemNumber = itemElements.length;
        if (itemNumber <= 1) {
            return;
        }
        const lastItemElement = itemElements[itemNumber - 1];

        const selectorPrefix = '#ds44-js-soa-container #' + lastItemElement.getAttribute('id');
        MiscEvent.dispatch('field:destroy', {
            'selector': selectorPrefix + ' input[type="text"]:not([aria-autocomplete="list"]):not([data-is-date])',
            'category': 'inputStandard'
        });
        MiscEvent.dispatch('field:destroy', {
            'selector': selectorPrefix + ' .ds44-selectDisplay.ds44-js-select-standard',
            'category': 'selectStandard'
        });

        lastItemElement.remove();

        const deleteElement = document.querySelector('#ds44-js-soa-delete');
        if (deleteElement && itemNumber === 2) {
            deleteElement.classList.add('ds44-none');
        }
    }

    ajaxSubmit (objectIndex, formData) {
        const object = this.objects[objectIndex];
        if (!object) {
            return;
        }

        console.log(formData)
    }
}

// Singleton
new FormLayoutObligationAlimentaire();
