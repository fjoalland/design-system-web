class MapSearch extends MapAbstract {
    constructor () {
        super('.ds44-js-map');
    }

    create (element) {
        super.create(element);

        const objectIndex = (this.objects.length - 1);
        const object = this.objects[objectIndex];
        object.parentElement = element.closest('.ds44-mapResults');
        object.containerElement = element.closest('.ds44-mapResults-container');
        object.newResults = null;
        object.zoom = false;
        object.addUp = false;
        object.isVisible = true;
        object.isMoving = false;
        object.maximumTop = null;

        MiscEvent.addListener('search:update', this.search.bind(this, objectIndex));
        MiscEvent.addListener('resize', this.resize.bind(this, objectIndex), window);
        MiscEvent.addListener('scroll', this.scroll.bind(this, objectIndex), window);

        // Show results at startup for mobiles
        const breakpoint = window.matchMedia('(max-width: 767px)');
        if (breakpoint.matches) {
            const resultsElement = object.mapElement.closest('.ds44-results.ds44-results--mapVisible')
            if (resultsElement) {
                this.toggleView(objectIndex);
            }
        }
    }

    afterLoad (objectIndex) {
        const object = this.objects[objectIndex];

        object.map.addControl(new window.mapboxgl.NavigationControl(), 'bottom-right');
        object.map.addControl(new window.mapboxgl.FullscreenControl(), 'bottom-left');
        object.map.addControl(new window.MapboxLanguage({ defaultLanguage: 'fr' }));
        object.map.setLayoutProperty('country-label', 'text-field', ['get', 'name_fr']);

        MiscEvent.addListener('fullscreenchange', this.translateMap.bind(this, objectIndex));
        this.translateMap(objectIndex);

        document
            .querySelectorAll('.ds44-js-toggle-map-view')
            .forEach((mapToggleViewElement) => {
                MiscEvent.addListener('click', this.toggleView.bind(this, objectIndex), mapToggleViewElement);
            });

        object.map.on('moveend', this.move.bind(this, objectIndex));
        if (object.newResults) {
            this.show(objectIndex);
        }
    }

    translateMap (objectIndex) {
        const object = this.objects[objectIndex];

        const mapCanvasElement = object.mapElement.querySelector('.mapboxgl-canvas');
        if (mapCanvasElement) {
            mapCanvasElement.setAttribute('role', 'img');
            mapCanvasElement.setAttribute('aria-label', MiscTranslate._('MAP_CANVAS'));
        }

        const mapLogoElement = object.mapElement.querySelector('.mapboxgl-ctrl-logo');
        if (mapLogoElement) {
            mapLogoElement.removeAttribute('aria-label');
            mapLogoElement.setAttribute('title', MiscTranslate._('MAP_LOGO'));

            let spanElement = mapLogoElement.querySelector('.visually-hidden');
            if (!spanElement) {
                spanElement = document.createElement('span')
                spanElement.classList.add('visually-hidden');
                mapLogoElement.appendChild(spanElement);
            }
            spanElement.innerText = MiscTranslate._('MAP_LOGO');
        }

        const mapImproveMapElement = object.mapElement.querySelector('.mapbox-improve-map');
        if (mapImproveMapElement) {
            mapImproveMapElement.setAttribute('title', MiscTranslate._('MAP_IMPROVE_NEW_WINDOW'));
            mapImproveMapElement.innerText = MiscTranslate._('MAP_IMPROVE');

            let currentElement = mapImproveMapElement;
            while((currentElement = MiscDom.getPreviousSibling(currentElement))) {
                currentElement.setAttribute('title', MiscTranslate._('TOS_OF') + ' ' + currentElement.innerText + ' - ' + MiscTranslate._('NEW_WINDOW'));
            }
        }

        const mapFullScreenElement = object.mapElement.querySelector('.mapboxgl-ctrl-fullscreen');
        if (mapFullScreenElement) {
            mapFullScreenElement.removeAttribute('aria-label');
            mapFullScreenElement.setAttribute('title', MiscTranslate._('MAP_FULLSCREEN'));

            let spanElement = mapFullScreenElement.querySelector('.visually-hidden');
            if (!spanElement) {
                spanElement = document.createElement('span')
                spanElement.classList.add('visually-hidden');
                mapFullScreenElement.appendChild(spanElement);
            }
            spanElement.innerText = MiscTranslate._('MAP_FULLSCREEN');
        }

        const mapShrinkElement = object.mapElement.querySelector('.mapboxgl-ctrl-shrink');
        if (mapShrinkElement) {
            mapShrinkElement.removeAttribute('aria-label');
            mapShrinkElement.setAttribute('title', MiscTranslate._('MAP_SHRINK'));

            let spanElement = mapShrinkElement.querySelector('.visually-hidden');
            if (!spanElement) {
                spanElement = document.createElement('span')
                spanElement.classList.add('visually-hidden');
                mapShrinkElement.appendChild(spanElement);
            }
            spanElement.innerText = MiscTranslate._('MAP_SHRINK');
        }

        const mapZoomInElement = object.mapElement.querySelector('.mapboxgl-ctrl-zoom-in');
        if (mapZoomInElement) {
            mapZoomInElement.removeAttribute('aria-label');
            mapZoomInElement.setAttribute('title', MiscTranslate._('MAP_ZOOM_IN'));

            let spanElement = mapZoomInElement.querySelector('.visually-hidden');
            if (!spanElement) {
                spanElement = document.createElement('span')
                spanElement.classList.add('visually-hidden');
                mapZoomInElement.appendChild(spanElement);
            }
            spanElement.innerText = MiscTranslate._('MAP_ZOOM_IN');
        }

        const mapZoomOutElement = object.mapElement.querySelector('.mapboxgl-ctrl-zoom-out');
        if (mapZoomOutElement) {
            mapZoomOutElement.removeAttribute('aria-label');
            mapZoomOutElement.setAttribute('title', MiscTranslate._('MAP_ZOOM_OUT'));

            let spanElement = mapZoomOutElement.querySelector('.visually-hidden');
            if (!spanElement) {
                spanElement = document.createElement('span')
                spanElement.classList.add('visually-hidden');
                mapZoomOutElement.appendChild(spanElement);
            }
            spanElement.innerText = MiscTranslate._('MAP_ZOOM_OUT');
        }

        const mapCompassElement = object.mapElement.querySelector('.mapboxgl-ctrl-compass');
        if (mapCompassElement) {
            mapCompassElement.removeAttribute('aria-label');
            mapCompassElement.setAttribute('title', MiscTranslate._('MAP_REORIENTATE'));

            let spanElement = mapCompassElement.querySelector('.visually-hidden');
            if (!spanElement) {
                spanElement = document.createElement('span')
                spanElement.classList.add('visually-hidden');
                mapCompassElement.appendChild(spanElement);
            }
            spanElement.innerText = MiscTranslate._('MAP_REORIENTATE');
        }
    }

    search (objectIndex, evt) {
        const object = this.objects[objectIndex];
        object.newResults = evt.detail.newResults;
        object.zoom = evt.detail.zoom;
        object.addUp = evt.detail.addUp;

        if (object.isMapReady) {
            this.show(objectIndex);
        }
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
        const lngLats = [];
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
            const lngLat = [
                result.metadata.long,
                result.metadata.lat
            ];
            const markerElement = document.createElement('div');
            markerElement.setAttribute('id', 'search-marker-' + result.id);
            markerElement.className = 'ds44-map-marker';
            MiscEvent.addListener('mouseenter', this.focus.bind(this), markerElement);
            MiscEvent.addListener('mouseleave', this.blur.bind(this), markerElement);
            object.markers.push(
                new window.mapboxgl
                    .Marker(markerElement)
                    .setLngLat(lngLat)
                    .setPopup(
                        new window.mapboxgl
                            .Popup({ offset: 25 })
                            .setHTML(result.metadata.html_marker)
                    )
                    .addTo(object.map)
            );
            lngLats.push([
                result.metadata.long,
                result.metadata.lat
            ]);
        }

        if (
            object.zoom &&
            (lngLats.length > 0)
        ) {
            // Zoom the map
            object.zoom = false;
            object.map.fitBounds(
                lngLats,
                {
                    'maxZoom': 10
                }
            );
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

    toggleView (objectIndex) {
        const object = this.objects[objectIndex];

        const resultsElement = object.mapElement.closest('.ds44-results')
        if (resultsElement) {
            const mapToggleViewElements = resultsElement.querySelectorAll('.ds44-js-toggle-map-view');
            if (resultsElement.classList.contains('ds44-results--mapVisible')) {
                resultsElement.classList.remove('ds44-results--mapVisible')
                object.isVisible = false;

                if (object.parentElement) {
                    MiscAccessibility.hide(object.parentElement);
                }

                mapToggleViewElements.forEach((mapToggleViewElement) => {
                    const text = mapToggleViewElement.innerText.replace(MiscTranslate._('HIDE') + ' ', MiscTranslate._('SHOW') + ' ');
                    mapToggleViewElement.querySelector('span').innerHTML = text;
                    mapToggleViewElement.setAttribute('title', text);
                    if (!mapToggleViewElement.closest('.ds44-mapResults-container')) {
                        MiscAccessibility.setFocus(mapToggleViewElement);
                    }
                });
            } else {
                resultsElement.classList.add('ds44-results--mapVisible')
                object.isVisible = true;
                this.resize(objectIndex);

                if (object.parentElement) {
                    MiscAccessibility.show(object.parentElement);
                }

                mapToggleViewElements.forEach((mapToggleViewElement) => {
                    const text = mapToggleViewElement.innerText.replace(MiscTranslate._('SHOW') + ' ', MiscTranslate._('HIDE') + ' ');
                    mapToggleViewElement.querySelector('span').innerHTML = text;
                    mapToggleViewElement.setAttribute('title', text);
                    if (mapToggleViewElement.closest('.ds44-mapResults-container')) {
                        MiscAccessibility.setFocus(mapToggleViewElement);
                    }
                });
            }
        }
    }

    focus (evt) {
        const resultId = evt.currentTarget.getAttribute('id').replace('search-marker-', 'search-result-');
        const resultElement = document.querySelector('#' + resultId);
        if (resultElement) {
            resultElement.classList.add('active');
        }
    }

    blur (evt) {
        const resultId = evt.currentTarget.getAttribute('id').replace('search-marker-', 'search-result-');
        const resultElement = document.querySelector('#' + resultId);
        if (resultElement) {
            resultElement.classList.remove('active');
        }
    }

    resize (objectIndex) {
        window.setTimeout(this.resizeMap.bind(this, objectIndex), 200);
        window.setTimeout(this.resizeMap.bind(this, objectIndex), 600);
        window.setTimeout(this.resizeMap.bind(this, objectIndex), 1000);
    }

    resizeMap (objectIndex) {
        const object = this.objects[objectIndex];

        object.map.resize();

        this.scroll(objectIndex);
    }

    scroll (objectIndex) {
        const object = this.objects[objectIndex];
        const scrollTop = this.getScrollTop();
        const enableScrolling = (object.parentElement.offsetHeight > object.containerElement.offsetHeight);

        const oldContainerElementHeight = object.containerElement.offsetHeight;
        if (enableScrolling) {
            let mapHeight = (
                Math.min(MiscUtils.getPositionY(object.parentElement) + object.parentElement.offsetHeight, (scrollTop + this.getScreenHeight())) -
                Math.max((scrollTop + MiscDom.getHeaderHeight()), MiscUtils.getPositionY(object.parentElement))
            );
            object.containerElement.style.height = mapHeight + 'px';
        } else {
            object.containerElement.style.height = null;
        }
        if (oldContainerElementHeight !== object.containerElement.offsetHeight) {
            if (object.map && object.map.resize) {
                object.map.resize();
            }
        }

        object.maximumTop = MiscUtils.getPositionY(object.parentElement) + object.parentElement.offsetHeight - object.containerElement.offsetHeight;
        const top = this.getTop(objectIndex);
        if (
            enableScrolling &&
            scrollTop > MiscUtils.getPositionY(object.parentElement) - top
        ) {
            if (!object.isMoving) {
                object.containerElement.style.width = object.parentElement.offsetWidth + 'px';
                object.isMoving = true;
            }

            if (scrollTop > this.getMaximumTop(objectIndex)) {
                object.containerElement.style.position = 'absolute';
            } else {
                object.containerElement.style.position = 'fixed';
            }
            object.containerElement.style.top = top + 'px';
        } else if (object.isMoving) {
            object.isMoving = false;

            object.containerElement.style.top = null;
            object.containerElement.style.position = 'static';
            object.containerElement.style.width = null;
        }
    }

    getScrollTop () {
        return (document.documentElement.scrollTop || document.body.scrollTop);
    }

    getScreenHeight () {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    getTop (objectIndex) {
        const object = this.objects[objectIndex];

        if (this.getScrollTop() > this.getMaximumTop(objectIndex)) {
            return object.parentElement.offsetHeight - object.containerElement.offsetHeight;
        }

        return Math.min(this.getMaximumTop(objectIndex), MiscDom.getHeaderHeight());
    }

    getMaximumTop (objectIndex) {
        const object = this.objects[objectIndex];

        return object.maximumTop - MiscDom.getHeaderHeight();
    }
}

// Singleton
new MapSearch();
