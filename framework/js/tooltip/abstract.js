'use strict';

class Tooltip {
    constructor() {
        // Variables
        this.TOOLTIP_SIMPLE = 'js-simple-tooltip';
        this.TOOLTIP_SIMPLE_CONTAINER = 'simpletooltip_container';
        this.TOOLTIP_SIMPLE_RAW = 'simpletooltip';
        this.TOOLTIP_SIMPLE_LABEL_ID = 'label_simpletooltip_';
        this.TOOLTIP_DATA_TEXT = 'data-simpletooltip-text';
        this.TOOLTIP_DATA_PREFIX_CLASS = 'data-simpletooltip-prefix-class';
        this.TOOLTIP_DATA_CONTENT_ID = 'data-simpletooltip-content-id';

        // Build tooltips in DOM
        this.createTooltips();

        // Add events
        ['mouseenter', 'focus', 'mouseleave', 'blur', 'keydown']
            .forEach(eventName => {
                document.body.addEventListener(eventName, this.showHide.bind(this), true);
            });
    }

    createTooltips() {
        document
            .querySelectorAll('.' + this.TOOLTIP_SIMPLE)
            .forEach((tooltipElement) => {
                const randomId = Math.random().toString(32).slice(2, 12);
                let text = MiscDom.getAttribute(tooltipElement, this.TOOLTIP_DATA_TEXT, '');
                const prefixClassName = MiscDom.getAttribute(tooltipElement, this.TOOLTIP_DATA_PREFIX_CLASS, '');
                const contentId = MiscDom.getAttribute(tooltipElement, this.TOOLTIP_DATA_CONTENT_ID, '');
                const id = this.TOOLTIP_SIMPLE_LABEL_ID + randomId;

                // Attach the tooltip position
                tooltipElement.setAttribute('aria-describedby', id);

                // Create wrapper
                const wrapperClassName = [prefixClassName, this.TOOLTIP_SIMPLE_CONTAINER].filter(Boolean).join('-');
                const wrapper = document.createElement('span');
                wrapper.classList.add(wrapperClassName);
                tooltipElement.parentNode.insertBefore(wrapper, tooltipElement);
                wrapper.appendChild(tooltipElement);

                const className = [prefixClassName, this.TOOLTIP_SIMPLE_RAW].filter(Boolean).join('-');
                // If there is no content but an id we try to fetch dat content id
                if (!text && contentId) {
                    const contentFromId = document.getElementById(contentId);
                    if (contentFromId) {
                        text = contentFromId.innerHTML;
                    }
                }

                wrapper.insertAdjacentHTML(
                    'beforeend',
                    '<span class="' + className + ' ' + this.TOOLTIP_SIMPLE + '" id="' + id + '" role="tooltip" aria-hidden="true">' + text + '</span>'
                );
            });
    }

    showHide(evt) {
        if (evt.target.classList.contains(this.TOOLTIP_SIMPLE) === true) {
            let tooltipLauncher = evt.target;
            let item = document.getElementById(tooltipLauncher.getAttribute('aria-describedby'));
            if (!item) {
                return;
            }

            const eventType = evt.type;
            if (eventType === 'mouseenter' || eventType === 'focus') {
                // Show
                item.setAttribute('aria-hidden', 'false');
            } else if (eventType === 'mouseleave' || eventType === 'blur' || (eventType === 'keydown' && evt.keyCode === 27)) {
                // Hide
                item.setAttribute('aria-hidden', 'true');
            }
        }
    }
}

new Tooltip();
