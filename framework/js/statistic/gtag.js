class StatisticGtag {
    constructor () {
        MiscEvent.addListener('statistic:gtag:event', this.sendEvent.bind(this));
    }

    sendEvent (evt) {
        if (
            !evt ||
            !evt.detail ||
            !evt.detail.data ||
            !evt.detail.statistic ||
            !evt.detail.statistic.name ||
            !evt.detail.statistic.category ||
            !evt.detail.statistic.action
        ) {
            return;
        }

        const gtagEvent = {
            'event': evt.detail.statistic.name,
            'eventCategory': evt.detail.statistic.category,
            'eventAction': this.populate(evt.detail.statistic.action, evt.detail.data)
        };
        if (evt.detail.statistic.label) {
            gtagEvent.eventLabel = this.populate(evt.detail.statistic.label, evt.detail.data);
        }
        if (MiscUtils.isInDevMode()) {
            console.log('Event gtag: ' + JSON.stringify(gtagEvent));
        } else {
            window.dataLayer.push(gtagEvent);
        }
    }

    populate (input, data) {
        for (const key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }

            const value = data[key].value;
            if (typeof value === 'object') {
                continue;
            }

            input = input.replace('$' + key, value);
        }

        return input;
    }
}

// Singleton
new StatisticGtag();
