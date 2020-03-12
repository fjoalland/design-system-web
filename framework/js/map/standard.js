class MapStandard {
    constructor() {
        this.accessToken = 'pk.eyJ1IjoiemF6aWZmaWMiLCJhIjoiY2s3bmtxYXh2MDNqZzNkdDc3NzJ0aGdqayJ9.TuhsI1ZKXwKSGw2F3bVy5g';
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
        this.objects.push(object);
        const objectIndex = (this.objects.length - 1);

        // Initialization
        window.mapboxgl.accessToken = this.accessToken;
        let map = new window.mapboxgl.Map({
            container: object.id,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.5, 40],
            zoom: 9
        });
    }
}

// Singleton
new MapStandard();
