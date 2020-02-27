class TabUtile extends TabAbstract {
    constructor() {
        super('.js-tabs.ds44-choiceYN');
    }

    getDefaultTabHandle(containerElement) {
        return null;
    }

    changeTab(tabHandleElement, tabPanelElement) {
        super.changeTab(tabHandleElement, tabPanelElement);

        tabHandleElement
            .parentElement
            .querySelectorAll('.js-tablist__link')
            .forEach((tabHandleElement) => {
                tabHandleElement.classList.remove('ds44-bgDark');
            });

        tabHandleElement.classList.add('ds44-bgDark');

        if (tabHandleElement.getAttribute('href') === '#ds44-choiceY') {
            MiscAccessibility.setFocus(document.querySelector('#ds44-choiceY #form-bloc-utils-YN'));
        } else if (tabHandleElement.getAttribute('href') === '#ds44-choiceN') {
            MiscAccessibility.setFocus(document.querySelector('#ds44-choiceN .h4-like'));
        }
    }
}

// Singleton
new TabUtile();
