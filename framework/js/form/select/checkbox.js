class FormSelectCheckbox extends FormSelect {
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

        if (selects.length > 0) {
            super(
                selects,
                'selectCheckbox'
            );
        }
    }

    create(element) {
        super.create(element);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];
        if (object.selectListElement) {
            object.selectListElement
                .querySelectorAll('.ds44-select-list_elem input')
                .forEach((listInputElement) => {
                    MiscEvent.addListener('change', this.select.bind(this, objectIndex), listInputElement);
                });
        }
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
                    listElement.setAttribute('aria-selected', 'true');
                    listInputElement.setAttribute('aria-checked', 'true');
                } else {
                    listElement.classList.remove('selected_option');
                    listElement.removeAttribute('aria-selected');
                    listInputElement.removeAttribute('aria-checked');
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
new FormSelectCheckbox();
