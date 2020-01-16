'use strict';

class OverlaySrcFocus {

	constructor() {
		// Aouter un event listener sur les boutons qui ouvrent un overlay / modale
		if (document.querySelector('*[data-open-overlay="true"]') !== null) {
			document.querySelectorAll('*[data-open-overlay="true"]').forEach((element) => {
                element.addEventListener('click', () => {
                    this.designElementAsOverlaySrc(element);
                })
            });
		}

		document.addEventListener('overlay:hide', () => { this.removeDesignatedOverlaySrc() });
		document.addEventListener('modal:hide', () => { this.removeDesignatedOverlaySrc() });
	}

	// Ajoute un attribut à un élément pour le désigner en tant que source d'une ouverture d'overlay
	designElementAsOverlaySrc(element) {
		if (element !== null) element.setAttribute("data-src-overlay","true");
	}

	// Retire l'attribut désignant un élément comme source d'ouverture d'overlay et focus sur cet élément
	removeDesignatedOverlaySrc() {
		let itDesignatedElem = document.querySelector('*[data-src-overlay="true"]');
		if (itDesignatedElem !== null) {
			itDesignatedElem.removeAttribute("data-src-overlay");
			itDesignatedElem.focus();
		}
	}

}

// Singleton
new OverlaySrcFocus();