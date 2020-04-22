class MarkerStandard {
    constructor () {
        this.MARKER_SIMPLE = 'js-simple-marker';
        this.MARKER_SIMPLE_CONTAINER = 'simplemarker_container';
        this.MARKER_SIMPLE_RAW = 'simplemarker';
        this.MARKER_SIMPLE_LABEL_ID = 'label_simplemarker_';
        this.MARKER_DATA_TEXT = 'data-simplemarker-text';
        this.MARKER_DATA_PREFIX_CLASS = 'data-simplemarker-prefix-class';
        this.MARKER_DATA_CONTENT_ID = 'data-simplemarker-content-id';
        this.ATTR_DESCRIBEDBY = 'aria-describedby';
        this.ATTR_ROLE = 'role';
        this.ROLE = 'marker';
        this.DATA_HASH_ID = 'data-hashmarker-id';

        // Create markers
        document
            .querySelectorAll('.' + this.MARKER_SIMPLE)
            .forEach(this.create.bind(this));

        // Bind events
        ['mouseenter', 'focus', 'mouseleave', 'blur']
            .forEach(eventType => {
                document.body.addEventListener(eventType, this.showHide.bind(this), true);
            });
        MiscEvent.addListener('keyDown:escape', this.hideAll.bind(this));
    }

    create (element) {
        const hashId = Math.random().toString(32).slice(2, 12);
        const prefixClassName = MiscDom.getAttribute(element, this.MARKER_DATA_PREFIX_CLASS);
        const contentId = MiscDom.getAttribute(element, this.MARKER_DATA_CONTENT_ID);

        // Set marker attributes
        element.setAttribute(this.DATA_HASH_ID, hashId);
        element.setAttribute(this.ATTR_DESCRIBEDBY, this.MARKER_SIMPLE_LABEL_ID + hashId);

        // Put the marker in a wrapper
        const wrapperClassName = [prefixClassName, this.MARKER_SIMPLE_CONTAINER].filter(Boolean).join('-');
        const wrapper = document.createElement('span');
        MiscDom.addClasses(wrapper, wrapperClassName);
        wrapper.setAttribute(this.DATA_HASH_ID, hashId);
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);

        // Determine the MARKER bubble content
        let content = MiscDom.getAttribute(element, this.MARKER_DATA_TEXT);
        if (!content && contentId) {
            const contentFromId = document.getElementById(contentId);
            if (contentFromId) {
                content = contentFromId.innerHTML;
            }
        }

        // Create marker bubble
        const bubbleClassName = [prefixClassName, this.MARKER_SIMPLE_RAW].filter(Boolean).join('-');
        const bubble = document.createElement('div');
        bubble.setAttribute('id', this.MARKER_SIMPLE_LABEL_ID + hashId);
        MiscDom.addClasses(bubble, [bubbleClassName, this.MARKER_SIMPLE]);
        bubble.setAttribute(this.ATTR_ROLE, this.ROLE);
        MiscAccessibility.hide(bubble, true);
        bubble.setAttribute(this.DATA_HASH_ID, hashId);
        bubble.innerHTML = content;

        wrapper.appendChild(bubble);
    }

    showHide (evt) {
        const element = evt.target;

        // Determine the marker button and its corresponding event types
        let markerButton = null;
        let showEventType = null;
        let hideEventType = null;
        if (MiscDom.hasClass(element, this.MARKER_SIMPLE) === true) {
            markerButton = element;
            showEventType = 'focus';
            hideEventType = 'blur';
        } else if (MiscDom.hasClass(element, this.MARKER_SIMPLE_CONTAINER) === true) {
            markerButton = element.querySelector('[' + this.ATTR_DESCRIBEDBY + ']');
            showEventType = 'mouseenter';
            hideEventType = 'mouseleave';
        }
        if (!markerButton) {
            return;
        }

        // Get the corresponding marker bubble
        const markerBubble = document.getElementById(MiscDom.getAttribute(markerButton, this.ATTR_DESCRIBEDBY));
        if (!markerBubble) {
            return;
        }

        if (evt.type === showEventType) {
            // Show marker bubble
            MiscAccessibility.show(markerBubble, true);

            // Remove positioning
            MiscDom.removeClasses(markerBubble, ['bottom', 'left']);
            markerBubble.style.width = '';

            // Determine positioning
            const markerBubbleOffset = MiscDom.getOffset(markerBubble);
            if (markerBubbleOffset.top < 10) {
                // Put it below if not enough room above
                MiscDom.addClasses(markerBubble, 'bottom');
            }
            if ((markerBubbleOffset.left + markerBubble.offsetWidth) > (window.innerWidth - 10)) {
                // Put it on the left if not enough room on the right
                MiscDom.addClasses(markerBubble, 'left');

                // If there's not enough room on the left hand side, crop the width
                if (markerBubble.offsetWidth > markerBubbleOffset.left) {
                    markerBubble.style.width = (markerBubbleOffset.left + 40) + 'px';
                }
            }
        } else if (evt.type === hideEventType) {
            // Hide marker bubble
            MiscAccessibility.hide(markerBubble, true);
        }
    }

    hideAll () {
        document
            .querySelectorAll('.' + this.MARKER_SIMPLE + '.' + this.MARKER_SIMPLE_RAW)
            .forEach((markerBubble) => {
                // Hide marker bubble
                MiscAccessibility.hide(markerBubble, true);
            })
    }
}

// Singleton
new MarkerStandard();
