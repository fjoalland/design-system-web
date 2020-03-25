class ButtonQuestion {
    constructor () {
        this.buttonElement = document.querySelector('.ds44-js-button-question');
        if (!this.buttonElement) {
            return;
        }

        this.footerElement = document.querySelector('footer .ds44-bgGray');
        if (!this.footerElement) {
            return;
        }
        
        this.isMoving = false;
        this.maximumTop = null;

        this.resize();

        MiscEvent.addListener('scroll', this.scroll.bind(this), window);
        MiscEvent.addListener('resize', this.resize.bind(this), window);
        MiscEvent.addListener('load', this.resize.bind(this), window);
        window.setTimeout(this.resize.bind(this), 1000);
    }

    scroll () {
        const scrollTop = this.getScrollTop();
        if (scrollTop > this.maximumTop) {
            this.isMoving = true;

            this.buttonElement.style.bottom = -(this.maximumTop - scrollTop) + 'px';
        } else if (this.isMoving) {
            this.isMoving = false;

            this.buttonElement.style.bottom = '0px';
        }
    }

    resize () {
        this.maximumTop = document.body.offsetHeight - window.innerHeight - this.footerElement.offsetHeight;

        this.scroll();
    }

    getScrollTop () {
        return (document.documentElement.scrollTop || document.body.scrollTop);
    }
}

// Singleton
new ButtonQuestion();
