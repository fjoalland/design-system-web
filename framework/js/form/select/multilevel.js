class FormSelectMultilevel extends FormSelectCheckbox {
    constructor() {
        const selects = [];
        document
            .querySelectorAll('.ds44-selectDisplay')
            .forEach((element) => {
                let formContainer = element.closest('.ds44-form__container');
                if (!formContainer) {
                    return;
                }

                if (
                    !formContainer.querySelector('.ds44-select-container .ds44-select-list_elem input[type="checkbox"]') ||
                    !formContainer.querySelector('.ds44-select-container .ds44-collapser')
                ) {
                    return
                }

                // Has checkbox buttons and collapsers, this is a multilevel select
                selects.push(element);
            });

        super(
            selects,
            'selectMultilevel'
        );
    }

    create(element) {
        super.create(element);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];
        if (object.selectListElement) {
            object.selectListElement
                .querySelectorAll('.ds44-select__categ input')
                .forEach((listInputElement) => {
                    MiscEvent.addListener('change', this.selectCategory.bind(this), listInputElement);
                });
        }

        const flexContainerElement = object.containerElement.querySelector('.ds44-flex-container');
        const checkAllElement = flexContainerElement.querySelector('button:first-child');
        if (checkAllElement) {
            MiscEvent.addListener('click', this.checkAll.bind(this, objectIndex), checkAllElement);
        }
        const uncheckAllElement = flexContainerElement.querySelector('button:last-child');
        if (uncheckAllElement) {
            MiscEvent.addListener('click', this.uncheckAll.bind(this, objectIndex), uncheckAllElement);
        }

        // Remove data-url attribute as multilevel select do not exist yet
        object.textElement.removeAttribute('data-url');
    }

    select(objectIndex, evt) {
        super.select(objectIndex, evt);

        const selectListElement = evt.currentTarget.closest('.ds44-list');
        if (!selectListElement) {
            return;
        }

        // Manage categories checkboxes
        let allChecked = true;
        let allNotChecked = true;
        selectListElement
            .querySelectorAll('.ds44-select-list_elem input')
            .forEach((listInputElement) => {
                if (listInputElement.checked) {
                    allNotChecked = false;
                } else {
                    allChecked = false;
                }
            });

        // Check or uncheck category checkbox
        const collapserElement = selectListElement.closest('.ds44-collapser_element');
        if (!collapserElement) {
            return;
        }

        const collapserElementInput = collapserElement.querySelector('.ds44-select__categ input');
        if (!collapserElementInput) {
            return;
        }

        if (allChecked) {
            collapserElementInput.checked = true;
            collapserElementInput.classList.remove('ds44-chkInder');
        } else if (allNotChecked) {
            collapserElementInput.checked = false;
            collapserElementInput.classList.remove('ds44-chkInder');
        } else {
            collapserElementInput.checked = false;
            collapserElementInput.classList.add('ds44-chkInder');
        }
    }

    selectCategory(evt) {
        const categoryInputElement = evt.currentTarget;
        const collapserElement = categoryInputElement.closest('.ds44-collapser_element');
        if (!collapserElement) {
            return;
        }

        // Check or uncheck category checkbox
        categoryInputElement.classList.remove('ds44-chkInder');

        // Check or uncheck children checkbox
        collapserElement
            .querySelectorAll('.ds44-collapser_content .ds44-select-list_elem')
            .forEach((listElement) => {
                const listInputElement = listElement.querySelector('input');

                listInputElement.checked = categoryInputElement.checked;
                if (listInputElement.checked) {
                    listElement.classList.add('selected_option');
                } else {
                    listElement.classList.remove('selected_option');
                }
            });
    }

    checkAll(objectIndex) {
        const object = this.objects[objectIndex];

        if (!object.selectListElement) {
            return;
        }

        object.selectListElement
            .querySelectorAll('.ds44-select__categ input')
            .forEach((categoryInputElement) => {
                categoryInputElement.checked = true;
                MiscEvent.dispatch('change', null, categoryInputElement);
            });
    }

    uncheckAll(objectIndex) {
        const object = this.objects[objectIndex];

        if (!object.selectListElement) {
            return;
        }

        object.selectListElement
            .querySelectorAll('.ds44-select__categ input')
            .forEach((categoryInputElement) => {
                categoryInputElement.checked = false;
                MiscEvent.dispatch('change', null, categoryInputElement);
            });
    }
}

// Singleton
new FormSelectMultilevel();
