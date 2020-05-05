class MapAbstract {
    constructor (selector) {
        this.objects = [];
        this.mapLanguageLoaded = false;
        this.mapLoaded = false;

        document
            .querySelectorAll(selector)
            .forEach((element) => {
                this.create(element);
            });

        let linkElement = document.createElement('link');
        linkElement.setAttribute('href', 'https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css');
        linkElement.setAttribute('rel', 'stylesheet');
        document.head.appendChild(linkElement);

        let scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-language/v0.10.1/mapbox-gl-language.js');
        scriptElement.setAttribute('type', 'text/javascript');
        document.head.appendChild(scriptElement);
        MiscEvent.addListener(
            'load',
            ((selector) => {
                this.mapLanguageLoaded = true;

                this.mapLoad(selector);
            }).bind(this, selector),
            scriptElement
        );

        scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', 'https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js');
        scriptElement.setAttribute('type', 'text/javascript');
        document.head.appendChild(scriptElement);
        MiscEvent.addListener(
            'load',
            ((selector) => {
                this.mapLoaded = true;

                window.mapboxgl.accessToken = 'pk.eyJ1IjoiemF6aWZmaWMiLCJhIjoiY2s3bmtxYXh2MDNqZzNkdDc3NzJ0aGdqayJ9.TuhsI1ZKXwKSGw2F3bVy5g';

                this.mapLoad(selector);
            }).bind(this, selector),
            scriptElement
        );
    }

    create (element) {
        const object = {
            'id': MiscUtils.generateId(),
            'mapElement': element,
            'markers': [],
            'isMapReady': false
        };
        object.mapElement.setAttribute('id', object.id);
        this.objects.push(object);
    }

    mapLoad (selector) {
        if (
            this.mapLanguageLoaded &&
            this.mapLoaded
        ) {
            document
                .querySelectorAll(selector)
                .forEach((element) => {
                    this.load(element);
                });
        }
    }

    load (element) {
        for (let objectIndex = 0; objectIndex < this.objects.length; objectIndex++) {
            const object = this.objects[objectIndex];

            if (object.id === element.getAttribute('id')) {
                object.isMapReady = true;
                object.map = new window.mapboxgl.Map({
                    container: object.id,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [-1.8157647, 47.2780468],
                    zoom: 8
                });
                object.map.on('load', this.afterLoad.bind(this, objectIndex));

                break;
            }
        }
    }

    afterLoad (objectIndex) {
        // Add geojson if included
        const object = this.objects[objectIndex];

        const geoJson = window.MAP_GEOJSON;
        if (
            geoJson &&
            geoJson.type === 'FeatureCollection'
        ) {
            for (let i = 0; i < geoJson.features.length; i++) {
                const feature = geoJson.features[i];
                const id = 'feature-' + i;

                // Add geojson to map
                object.map.addSource(id, {
                    'type': 'geojson',
                    'data': {
                        'type': feature.type,
                        'geometry': feature.geometry,
                        'properties': feature.properties
                    }
                });
                object.map.addLayer({
                    'id': id + '-fill',
                    'type': 'fill',
                    'source': id,
                    'paint': {
                        'fill-color': feature.properties.fill,
                        'fill-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            1,
                            feature.properties['fill-opacity'] || 0.4
                        ]
                    }
                });
                object.map.addLayer({
                    'id': id + '-line',
                    'type': 'line',
                    'source': id,
                    'paint': {
                        'line-color': feature.properties.stroke,
                        'line-opacity': feature.properties['stroke-opacity'] || 0.4,
                        'line-width': feature.properties['stroke-width'] || 1
                    }
                });
                object.map.on('click', id + '-fill', this.showAreaPopup.bind(this, objectIndex));
                object.map.on('mouseenter', id + '-fill', this.mouseEnterArea.bind(this, objectIndex));
                object.map.on('mouseleave', id + '-fill', this.mouseLeaveArea.bind(this, objectIndex));
            }
        }
    }

    showAreaPopup (objectIndex, evt) {
        const object = this.objects[objectIndex];

        new window.mapboxgl.Popup()
            .setLngLat(evt.lngLat)
            .setHTML(evt.features[0].properties.description)
            .addTo(object.map);
    }

    mouseEnterArea (objectIndex, evt) {
        const object = this.objects[objectIndex];

        object.map.getCanvas().style.cursor = 'pointer';
    }

    mouseLeaveArea (objectIndex, evt) {
        const object = this.objects[objectIndex];

        object.map.getCanvas().style.cursor = '';
    }
}
