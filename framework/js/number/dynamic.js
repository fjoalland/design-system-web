class NumberDynamic {
    constructor () {
        this.duration = 3000; // Seconds
        this.increment = 100;

        MiscEvent.addListener('scroll', this.scroll.bind(this), window);
        MiscEvent.addListener('resize', this.scroll.bind(this), window);
        window.setTimeout(this.scroll.bind(this), 100);
    }

    scroll () {
        document
            .querySelectorAll('.ds44-js-dynamic-number:not(.started)')
            .forEach((dynamicNumberElement) => {
                if (!dynamicNumberElement.getAttribute('data-stop')) {
                    return;
                }

                const positionY = MiscUtils.getPositionY(dynamicNumberElement);
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                const scrollTop = MiscUtils.getScrollTop();
                const scrollBottom = scrollTop + viewportHeight;

                if (
                    positionY > scrollTop &&
                    positionY < scrollBottom
                ) {
                    this.start(dynamicNumberElement);
                }
            });
    }

    start (dynamicNumberElement) {
        dynamicNumberElement.classList.add('started');

        const start = parseFloat(dynamicNumberElement.getAttribute('data-start') || 0);
        const stop = parseFloat(dynamicNumberElement.getAttribute('data-stop'));
        const languageIso = (MiscTranslate.getLanguage() === 'fr' ? 'fr-FR' : 'en-GB');
        const isInteger = (stop === parseInt(stop, 10));
        const fractionDigits = (isInteger ? 0 : 1);

        let value = start;
        for (let i = 0; i <= this.duration; i = (i + this.increment)) {
            window.setTimeout(
                ((dynamicNumberElement, value, languageIso, fractionDigits) => {
                    return () => {
                        dynamicNumberElement.innerText = new Intl.NumberFormat(
                            languageIso,
                            {
                                minimumFractionDigits: fractionDigits,
                                maximumFractionDigits: fractionDigits
                            }
                        ).format(value);
                    }
                })(dynamicNumberElement, value, languageIso, fractionDigits),
                this.easeInQuad(i, 0, this.duration, this.duration)
            );

            value += ((stop - start) / (this.duration / this.increment));
        }
    }

    easeInQuad (t, b, c, d) {
        return c * (t /= d) * t + b;
    }
}

// Singleton
new NumberDynamic();
