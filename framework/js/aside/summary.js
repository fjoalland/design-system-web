class AsideSummary {
    constructor () {
        this.borderTop = 20;
        this.isMoving = false;
        this.containerElement = document.querySelector('.ds44-js-aside-summary');
        if (!this.containerElement) {
            return;
        }
        this.summaryElement = this.containerElement.querySelector('.ds44-box');
        if (!this.summaryElement) {
            return;
        }

        MiscEvent.addListener('scroll', this.scroll.bind(this), window);
        MiscEvent.addListener('resize', this.resize.bind(this), window);
        this.summaryElement
            .querySelectorAll('.ds44-list--puces a')
            .forEach((aElement) => {
                MiscEvent.addListener('click', this.goTo.bind(this), aElement);
            });

        this.scroll();
    }

    scroll () {
        const scrollTop = this.getScrollTop();
        if (scrollTop > MiscUtils.getPositionY(this.containerElement) - this.getTop()) {
            this.isMoving = true;
            this.summaryElement.style.position = 'fixed';
            this.setStyle();
        } else {
            this.isMoving = false;
            this.summaryElement.style.position = 'static';
            this.summaryElement.style.width = null;
            this.summaryElement.style.top = null;
        }

        // Highlight sections
        let activeAElement = null;
        const headerHeight = document.querySelector('.ds44-header').offsetHeight;
        this.summaryElement
            .querySelectorAll('.ds44-list--puces a')
            .forEach((aElement) => {
                aElement.classList.remove('active');

                const sectionId = aElement.getAttribute('href').replace(/^#/, '');
                const sectionElement = document.querySelector('#' + sectionId);
                if(sectionElement) {
                    const sectionElementStyle = sectionElement.currentStyle || window.getComputedStyle(sectionElement);
                    const startTop = MiscUtils.getPositionY(sectionElement) + parseInt(sectionElementStyle.marginTop, 10);
                    const stopTop = startTop + sectionElement.offsetHeight + parseInt(sectionElementStyle.marginBottom, 10);
                    if((scrollTop + headerHeight) >= startTop && (scrollTop + headerHeight) <= stopTop) {
                        activeAElement = aElement
                    }
                }
            });
        if(activeAElement) {
            activeAElement.classList.add('active');
        }
    }

    resize () {
        this.scroll();
    }

    setStyle () {
        this.summaryElement.style.width = this.containerElement.offsetWidth + 'px';
        this.summaryElement.style.top = this.getTop() + 'px';
    }

    getTop () {
        const top = this.borderTop + document.querySelector('.ds44-header').offsetHeight;
        const maximumTop = MiscUtils.getPositionY(this.containerElement) + this.containerElement.offsetHeight - top - this.summaryElement.offsetHeight;
        if (this.getScrollTop() > maximumTop) {
            this.summaryElement.style.position = 'absolute';
            return this.containerElement.offsetHeight - this.summaryElement.offsetHeight;
        }

        this.summaryElement.style.position = 'fixed';
        return Math.min(maximumTop, top);
    }

    getScrollTop () {
        return (document.documentElement.scrollTop || document.body.scrollTop);
    }

    goTo (evt) {
        evt.stopPropagation();
        evt.preventDefault();

        const aElement = evt.currentTarget;
        const sectionId = aElement.getAttribute('href').replace(/^#/, '');
        const sectionElement = document.querySelector('#' + sectionId);
        if(sectionElement) {
            const headerElement = document.querySelector('.ds44-header');
            let headerHeight = document.querySelector('.ds44-header');
            if(headerElement.classList.contains('hidden')) {
                headerElement.classList.remove('hidden');
                headerHeight = headerElement.offsetHeight;
                headerElement.classList.add('hidden');
            } else {
                headerHeight = headerElement.offsetHeight;
            }

            const scrollTo = MiscUtils.getPositionY(sectionElement);
            if(this.getScrollTop() > scrollTo) {
                // Going up, the header will show
                MiscUtils.scrollTo(scrollTo - headerHeight);
            } else {
                // Going up, the header will hide
                MiscUtils.scrollTo(scrollTo);
            }

        }
    }
}

// Singleton
new AsideSummary();
