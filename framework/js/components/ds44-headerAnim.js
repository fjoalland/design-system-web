
(function (window) {
	function ds44_headerAnim() {
		var _ds44_headerAnim = {};
	
	    // Sur le focus au clavier d'un élément caché sous le header,
	    //effectuer un scroll vers le haut pour que l'élément soit affiché
	    _ds44_headerAnim.checkFocusPosition= function() {
	    	var header = document.querySelector(".ds44-header");
	    	if (header == undefined) return;
	    	
	    	document.addEventListener('keyup', (event) => {
	    		if (event.key === "Tab") {
	    			var activeElement = document.activeElement;
	    			if (header.contains(activeElement)) return;
	    			var threshold = header.classList.contains("hidden") ? header.getBoundingClientRect().bottom + 100 : header.getBoundingClientRect().bottom;
	    			if (activeElement.getBoundingClientRect().top < threshold) {
	    				window.scrollBy(0, (150 - activeElement.getBoundingClientRect().top) * -1);
	    			}
	    		}
	    	});
	    }

	    // Gérer le comportement du header en fonction des scrolls
	    // Source : https://codepen.io/tutsplus/pen/WNerWWp
	    _ds44_headerAnim.enableScrollActions = function() {
			var lastScroll = 0;
			var header = document.querySelector(".ds44-header");
			if (header == undefined) return;

			var headerHeight = header.offsetHeight;

	    	window.addEventListener("scroll", () =>{
	    		setTimeout(function() {
	    			const currentScroll = window.pageYOffset;
	    			var body = document.querySelector("body");
	    			var bodyTopCoordinate = body.getBoundingClientRect().top + parseInt(body.style.paddingTop);

					if (currentScroll == 0) {
						header.classList.remove("hidden");
						header.removeAttribute("aria-hidden");
						if (document.activeElement == document.querySelector("html"))  {
							setTimeout(function() {
						      document.querySelector('.ds44-btn--menu').focus();
						    }, 100);
						}
						return;
					}

					if (currentScroll > lastScroll && !header.classList.contains("hidden")
							&& currentScroll > headerHeight) {
						// Scroll vers le bas, uniquement si le haut de page est 
						// en dessous de la hauteur du header
						header.classList.add("hidden");
						header.setAttribute("aria-hidden", "true");
					} else if (currentScroll < lastScroll && header.classList.contains("hidden")) {
						// up
						header.classList.remove("hidden");
						header.removeAttribute("aria-hidden");
					}

					lastScroll = currentScroll;
	    		}, 100)
	    	});
	    }

	    return _ds44_headerAnim;
	}
	if (typeof (window.ds44_headerAnim) === 'undefined') {
        window.ds44_headerAnim = ds44_headerAnim();
    }
})(window);

if (document.querySelector(".ds44-blocBandeau") != undefined) {
	ds44_headerAnim.checkFocusPosition();
	ds44_headerAnim.enableScrollActions();
}


