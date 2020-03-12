class MapStandard {
    constructor() {
        this.objects = [];

        let linkElement = document.createElement('link');
        linkElement.setAttribute('href', 'https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css');
        linkElement.setAttribute('rel', 'stylesheet');
        document.head.appendChild(linkElement);

        let scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', 'https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js');
        scriptElement.setAttribute('type', 'text/javascript');
        document.head.appendChild(scriptElement);
        MiscEvent.addListener(
            'load',
            (() => {
                window.mapboxgl.accessToken = 'pk.eyJ1IjoiemF6aWZmaWMiLCJhIjoiY2s3bmtxYXh2MDNqZzNkdDc3NzJ0aGdqayJ9.TuhsI1ZKXwKSGw2F3bVy5g';

                document
                    .querySelectorAll('.ds44-js-map')
                    .forEach((element) => {
                        this.create(element);
                    });
            }).bind(this),
            scriptElement
        );
    }

    create(element) {
        const object = {
            'id': MiscUtils.generateId(),
            'mapElement': element
        };
        object.mapElement.setAttribute('id', object.id);
        object.map = new window.mapboxgl.Map({
            container: object.id,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-1.8157647, 47.2780468],
            zoom: 8
        });
        this.objects.push(object);
    }
}

// Singleton
new MapStandard();
