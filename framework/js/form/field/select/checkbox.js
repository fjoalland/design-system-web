class FormFieldSelectCheckbox extends FormFieldSelectAbstract {
    constructor(selector, category) {
        if(selector && category) {
            super(
                selector,
                category
            );

            return;
        }

        const selects = [];
        document
            .querySelectorAll('.ds44-selectDisplay')
            .forEach((element) => {
                let formContainer = element.closest('.ds44-form__container');
                if (!formContainer) {
                    return;
                }

                if(
                    !formContainer.querySelector('.ds44-select-container .ds44-select-list_elem input[type="checkbox"]') ||
                    formContainer.querySelector('.ds44-select-container .ds44-collapser')
                ) {
                    return
                }

                // Has checkbox buttons and no collapser, this is a checkbox select
                selects.push(element);
            });

        super(
            selects,
            'selectCheckbox'
        );
    }

    setListElementEvents(listElement, objectIndex) {
        const listInputElement = listElement.querySelector('input');
        if(!listInputElement) {
            return;
        }

        MiscEvent.addListener('change', this.select.bind(this, objectIndex), listInputElement);
    }

    getListItems(parentElement) {
        let previousItem = null;
        let nextItem = null;
        const selectedListItem = parentElement.querySelector('.ds44-select-list_elem input:focus');
        if(selectedListItem) {
            previousItem = MiscDom.getPreviousSibling(selectedListItem.closest('.ds44-select-list_elem'));
            if(previousItem) {
                previousItem = previousItem.querySelector('input');
            }
            nextItem = MiscDom.getNextSibling(selectedListItem.closest('.ds44-select-list_elem'));
            if(nextItem) {
                nextItem = nextItem.querySelector('input');
            }
        }
        return {
            'first': parentElement.querySelector('.ds44-select-list_elem:first-child input'),
            'selected': selectedListItem,
            'last': parentElement.querySelector('.ds44-select-list_elem:last-child input'),
            'next': nextItem,
            'previous': previousItem
        };
    }

    getListElement(object, key, value) {
        let elementSelectListItem = super.getListElement(object, key, value);
        elementSelectListItem.removeAttribute('tabindex');
        elementSelectListItem.innerHTML = null;

        let containerElement = document.createElement('div');
        containerElement.classList.add('ds44-form__container');
        containerElement.classList.add('ds44-checkBox-radio_list');
        elementSelectListItem.appendChild(containerElement);

        const id = 'name-check-form-element-' + MiscUtils.generateId();
        let inputElement = document.createElement('input');
        inputElement.classList.add('ds44-checkbox');
        inputElement.setAttribute('id', id);
        inputElement.setAttribute('type', 'checkbox');
        inputElement.setAttribute('value', key);
        containerElement.appendChild(inputElement);

        let labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.classList.add('ds44-boxLabel');
        labelElement.innerHTML = value;
        containerElement.appendChild(labelElement);

        return elementSelectListItem;
    }

    select(objectIndex, evt) {
        evt.preventDefault();

        const object = this.objects[objectIndex];
        if (!object.textElement) {
            return;
        }
        if (!object.selectListElement) {
            return;
        }

        const currentItem = evt.currentTarget.closest('.ds44-select-list_elem');
        const currentListInputElement = currentItem.querySelector('input');

        object.selectListElement
            .querySelectorAll('.ds44-select-list_elem')
            .forEach((listElement) => {
                let listInputElement = listElement.querySelector('input');
                if (
                    (
                        evt.type === 'mousedown' &&
                        (
                            (
                                listInputElement === currentListInputElement &&
                                !listInputElement.checked
                            ) ||
                            (
                                listInputElement !== currentListInputElement &&
                                listInputElement.checked
                            )
                        )
                    ) ||
                    (
                        evt.type === 'change' &&
                        listInputElement.checked
                    )
                ) {
                    listElement.classList.add('selected_option');
                } else {
                    listElement.classList.remove('selected_option');
                }
            });
    }

    getDomData(listElement) {
        return {
            'value': listElement.querySelector('input').getAttribute('value'),
            'text': listElement.querySelector('label').textContent
        };
    }
}

// Singleton
new FormFieldSelectCheckbox();
