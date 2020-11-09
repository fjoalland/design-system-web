class CarouselStandard extends CarouselAbstract {
    constructor () {
        super('.swipper-carousel-wrap:not(.swipper-carousel-slideshow)');
    }

    showSlide (slideElement) {
        super.showSlide(slideElement);

        const aElement = slideElement.querySelector('a');
        if (!aElement) {
            slideElement.setAttribute('tabindex', '0');
        }
    }

    hideSlide (slideElement) {
        super.hideSlide(slideElement);

        const aElement = slideElement.querySelector('a');
        if (!aElement) {
            slideElement.removeAttribute('tabindex');
        }
    }
}

// Singleton
new CarouselStandard();
