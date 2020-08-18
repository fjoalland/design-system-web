class MapMarker extends MapAbstract {
    constructor () {
        super('.ds44-js-map:not([data-geojson-mode="dynamic"])');
    }

    create (element) {
        super.create(element);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];

        object.markers = [];
    }

    afterLoad (objectIndex) {
        super.afterLoad(objectIndex);

        const object = this.objects[objectIndex];

        object.isMapReady = true;
        object.map.on('moveend', this.move.bind(this, objectIndex));
        if (object.newResults) {
            this.show(objectIndex);
        }
    }

    move (objectIndex, evt) {
        if (!evt.originalEvent) {
            return;
        }

        const object = this.objects[objectIndex];
        if (!object.isVisible) {
            return;
        }

        const mapBounds = object.map.getBounds();
        MiscEvent.dispatch(
            'search:refresh',
            {
                'parameters': {
                    'map': {
                        'nw': mapBounds.getNorthWest().toArray(),
                        'sw': mapBounds.getSouthWest().toArray(),
                        'ne': mapBounds.getNorthEast().toArray(),
                        'se': mapBounds.getSouthEast().toArray()
                    }
                }
            });
    }

    show (objectIndex) {
        const object = this.objects[objectIndex];

        // Remove existing markers
        if (!object.addUp) {
            for (let i = 0; i < object.markers.length; i++) {
                object.markers[i].remove();
            }
            object.markers = [];
        }

        // Add new markers
        let hasBoundingBox = false;
        const boundingBox = {
            longitude: {
                min: null,
                max: null
            },
            latitude: {
                min: null,
                max: null
            }
        };
        for (let resultIndex in object.newResults) {
            if (!object.newResults.hasOwnProperty(resultIndex)) {
                continue;
            }

            const result = object.newResults[resultIndex];
            if (
                !result.metadata ||
                !result.metadata.lat ||
                !result.metadata.long ||
                !result.metadata.html_marker
            ) {
                continue;
            }

            // Create a marker
            hasBoundingBox = true;
            const lngLat = [
                result.metadata.long,
                result.metadata.lat
            ];
            const markerElement = document.createElement('div');
            markerElement.setAttribute('id', 'search-marker-' + result.id);
            markerElement.setAttribute('data-id', result.id);
            markerElement.className = 'ds44-map-marker';
            MiscEvent.addListener('mouseenter', this.focus.bind(this), markerElement);
            MiscEvent.addListener('mouseleave', this.blur.bind(this), markerElement);
            const popup = new window.mapboxgl
                .Popup({ offset: 25 })
                .setHTML(result.metadata.html_marker);
            object.markers.push(new window.mapboxgl
                .Marker(markerElement)
                .setLngLat(lngLat)
                .setPopup(popup)
                .addTo(object.map));
            popup.on('open', ((resultId, evt) => {
                MiscEvent.addListener('click', this.popupClick.bind(this, resultId), evt.target.getElement())
            }).bind(this, result.id));
            const mapboxMarkerElement = object.markers[object.markers.length - 1].getElement();
            if (mapboxMarkerElement) {
                mapboxMarkerElement.removeAttribute('tabindex');
            }

            if (boundingBox.longitude.min === null) {
                boundingBox.longitude.min = result.metadata.long;
            } else {
                boundingBox.longitude.min = Math.min(result.metadata.long, boundingBox.longitude.min);
            }
            if (boundingBox.longitude.max === null) {
                boundingBox.longitude.max = result.metadata.long;
            } else {
                boundingBox.longitude.max = Math.max(result.metadata.long, boundingBox.longitude.max);
            }
            if (boundingBox.latitude.min === null) {
                boundingBox.latitude.min = result.metadata.lat;
            } else {
                boundingBox.latitude.min = Math.min(result.metadata.lat, boundingBox.latitude.min);
            }
            if (boundingBox.latitude.max === null) {
                boundingBox.latitude.max = result.metadata.lat;
            } else {
                boundingBox.latitude.max = Math.max(result.metadata.lat, boundingBox.latitude.max);
            }
        }

        if (object.zoom && hasBoundingBox) {
            // Zoom the map
            object.zoom = false;
            object.map.fitBounds(
                [
                    [
                        boundingBox.longitude.min,
                        boundingBox.latitude.min
                    ],
                    [
                        boundingBox.longitude.max,
                        boundingBox.latitude.max
                    ]
                ],
                {
                    padding: 50,
                    maxZoom: 15
                }
            );
        }

        if (
            object.isGeojsonLoaded &&
            object.mapElement.getAttribute('data-geojson-refine') === 'true'
        ) {
            this.showGeojson(objectIndex);
        }
    }

    afterLoadGeojson (objectIndex) {
        const object = this.objects[objectIndex];

        object.isGeojsonLoaded = true;
        if (object.mapElement.getAttribute('data-geojson-refine') === 'true') {
            this.showGeojson(objectIndex);
        }
    }

    getGeojsonIds (objectIndex) {
        const object = this.objects[objectIndex];

        const geojsonIds = [];
        for (let resultIndex in object.newResults) {
            if (!object.newResults.hasOwnProperty(resultIndex)) {
                continue;
            }

            const result = object.newResults[resultIndex];
            if (
                !result.metadata ||
                !result.metadata.lat ||
                !result.metadata.long ||
                !result.metadata.html_marker
            ) {
                continue;
            }

            // Get corresponding geojson
            if (result.metadata.geojson_id) {
                geojsonIds.push(result.metadata.geojson_id);
            }
        }

        return geojsonIds;
    }

    focus (evt) {
        const id = evt.currentTarget.getAttribute('data-id');
        MiscEvent.dispatch('search:focus', { 'id': id });
    }

    blur (evt) {
        const id = evt.currentTarget.getAttribute('data-id');
        MiscEvent.dispatch('search:blur', { 'id': id });
    }

    resultFocus (evt) {
        if (
            !evt ||
            !evt.detail ||
            !evt.detail.id
        ) {
            return;
        }

        const resultElement = document.querySelector('#search-marker-' + evt.detail.id);
        if (resultElement) {
            resultElement.classList.add('active');
        }
    }

    resultBlur (evt) {
        if (
            !evt ||
            !evt.detail ||
            !evt.detail.id
        ) {
            return;
        }

        const resultElement = document.querySelector('#search-marker-' + evt.detail.id);
        if (resultElement) {
            resultElement.classList.remove('active');
        }
    }
}

// Singleton
new MapMarker();
