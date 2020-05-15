class ButtonSticky {
    constructor () {
        this.buttons = [];
        document
            .querySelectorAll('.ds44-js-button-sticky')
            .forEach((buttonElement) => {
                this.buttons.push({
                    'element': buttonElement,
                    'isMoving': false
                });
            });
        if (this.buttons.length === 0) {
            return;
        }

        this.footerElement = document.querySelector('footer');
        if (!this.footerElement) {
            return;
        }

        this.maximumTop = null;
        this.minimumTop = null;

        this.resize();

        MiscEvent.addListener('scroll', this.scroll.bind(this), window);
        MiscEvent.addListener('resize', this.resize.bind(this), window);
        MiscEvent.addListener('load', this.resize.bind(this), window);
        window.setTimeout(this.resize.bind(this), 1000);
    }

    scroll () {
        const scrollTop = MiscUtils.getScrollTop();
        for (let i = 0; i < this.buttons.length; i++) {
            const button = this.buttons[i];

            if (scrollTop > this.maximumTop) {
                button.isMoving = true;
                button.element.style.bottom = -(this.maximumTop - scrollTop) + 'px';
            } else if (scrollTop < this.minimumTop) {
                button.isMoving = true;
                button.element.style.bottom = -(this.minimumTop - scrollTop) + 'px';
            } else if (button.isMoving) {
                button.isMoving = false;
                button.element.style.bottom = '0px';
            }
        }
    }

    resize () {
        this.minimumTop = window.innerHeight;
        this.maximumTop = document.body.offsetHeight - window.innerHeight - this.footerElement.offsetHeight;

        this.scroll();
    }
}

// Singleton
new ButtonSticky();
