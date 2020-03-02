class CarouselSlideshow extends CarouselAbstract {
    constructor() {
        super('.swipper-carousel-wrap.swipper-carousel-slideshow');
    }

    create(wrapElement) {
        super.create(wrapElement);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];

        const autoplayButtonElement = object.wrapElement.querySelector('button:last-child');
        if (autoplayButtonElement) {
            MiscEvent.addListener('click', this.startStop.bind(this, objectIndex), autoplayButtonElement);
        }
    }

    getSwiperParameters(object) {
        const swiperParameters = super.getSwiperParameters(object);
        swiperParameters.effect = 'fade';
        swiperParameters.autoplay = {
            'delay': 5000
        }

        return swiperParameters;
    }

    startStop(objectIndex, evt) {
        const object = this.objects[objectIndex];

        const iconElement = evt.currentTarget.querySelector('i')
        if (object.swiper.autoplay.running) {
            object.swiper.autoplay.stop();
            if (iconElement) {
                iconElement.classList.add('icon-play');
                iconElement.classList.remove('icon-pause');
            }

            return;
        }

        object.swiper.autoplay.start();
        if (iconElement) {
            iconElement.classList.add('icon-pause');
            iconElement.classList.remove('icon-play');
        }
    }

    slide(objectIndex, direction) {
        super.slide(objectIndex, direction);

        const object = this.objects[objectIndex];
        if (!object.swiper.autoplay.running) {
            object.swiper.autoplay.start();
        }
    }
}

// Singleton
new CarouselSlideshow();
