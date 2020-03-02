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

    startStop(objectIndex) {
        const object = this.objects[objectIndex];

        if (object.swiper.autoplay.running) {
            this.stop(objectIndex);

            return;
        }

        this.start(objectIndex);
    }

    start(objectIndex) {
        const object = this.objects[objectIndex];
        const autoplayButtonElement = object.wrapElement.querySelector('button:last-child');
        if (!autoplayButtonElement) {
            return;
        }

        object.swiper.autoplay.start();

        const iconElement = autoplayButtonElement.querySelector('i');
        if (iconElement) {
            iconElement.classList.add('icon-pause');
            iconElement.classList.remove('icon-play');
        }

        const spanElement = autoplayButtonElement.querySelector('span');
        if (spanElement) {
            spanElement.innerText = spanElement.innerText.replace('Lancer ', 'Arrêter ');
        }
    }

    stop(objectIndex) {
        const object = this.objects[objectIndex];
        const autoplayButtonElement = object.wrapElement.querySelector('button:last-child');
        if (!autoplayButtonElement) {
            return;
        }

        object.swiper.autoplay.stop();

        const iconElement = autoplayButtonElement.querySelector('i');
        if (iconElement) {
            iconElement.classList.add('icon-play');
            iconElement.classList.remove('icon-pause');
        }

        const spanElement = autoplayButtonElement.querySelector('span');
        if (spanElement) {
            spanElement.innerText = spanElement.innerText.replace('Arrêter ', 'Lancer ');
        }
    }

    slide(objectIndex, direction) {
        super.slide(objectIndex, direction);

        const object = this.objects[objectIndex];
        if (!object.swiper.autoplay.running) {
            this.start(objectIndex);
        }
    }
}

// Singleton
new CarouselSlideshow();
