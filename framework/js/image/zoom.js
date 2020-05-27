class ImageZoom {
    constructor () {
        document
            .querySelectorAll('.ds44-imgLoupe')
            .forEach((magnifyContainerElement) => {
                this.create(magnifyContainerElement);
            });
    }

    create (magnifyContainerElement) {
        const imageElement = magnifyContainerElement.querySelector('img');
        if (!imageElement) {
            return;
        }

        magnifyContainerElement.style.backgroundImage = `url('${imageElement.getAttribute('src')}')`;
        MiscEvent.addListener('mousemove', this.zoom.bind(this), magnifyContainerElement);
    }

    zoom (evt) {
        const zoomer = evt.currentTarget;
        const offsetX = (evt.offsetX ? evt.offsetX : evt.touches[0].pageX);
        const offsetY = (evt.offsetY ? evt.offsetY : evt.touches[0].pageY);
        const x = offsetX / zoomer.offsetWidth * 100;
        const y = offsetY / zoomer.offsetHeight * 100;
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
    }
}

// Singleton
new ImageZoom();
