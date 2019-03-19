/* plugins/ToolsPlugin/js/accessibleCheckbox.js */

!function ($) {
	$(function(){
		
		var replaceCheckboxes=function(event){
			// Pas de fausse checkbox ni les images de fond sont désactivées
			if(plugin.tools.images.backgroundImageHidden()) return;
			
			// Fonction de démarrage => Pour chaque checkbox
			$("input[type=checkbox]").each(function() {
				var $input = $(this);
				
				// Ajout de la classe false-input
				$input.addClass("false-input");
				
				// Récupération du label associé
				var id = $input.attr("id");
				var $label = $("label[for="+id+"]");
				
				// On ajoute la classe checkbox-label
				// Et checked si la case est cocher
				$label.addClass("checkbox-label");
				if ($input.prop("checked")) $label.addClass("checked");	
			});
			
			// Ajout/retrait d'un filet gris suivant le focus
			$("input[type=checkbox]").focus(function() {
				var $input = $(this);
				var id = $input.attr("id");
				var $label = $("label[for="+id+"]");
				
				$label.addClass("on");
			}).blur(function(){
				var $input = $(this);
				var id = $input.attr("id");
				var $label = $("label[for="+id+"]");
				
				$label.removeClass("on");
			});
			
			$("input[type=checkbox]").on("change", function() {
				var $input = $(this);
				var id = $input.attr("id");
				var $label = $("label[for="+id+"]");
				
			    if ($input.prop("checked")) $label.addClass("checked");
			    else $label.removeClass("checked");      
			});
			
			$("input[type=checkbox]").on('keydown', function(event) {
				var $input = $(this);
				var id = $input.attr("id");
				var $label = $("label[for="+id+"]");
				
				if(event.keyCode == 13) {
					$label.click();
					event.stopPropagation();
				}
			});
	}

	$(document).ready(function(){
		replaceCheckboxes();
	});

	// On rappelle la fonction après des appels Ajax : dans le cas du pager notamment.
	Event.observe(document, 'refresh:after',  replaceCheckboxes, false);	
	
})



}(window.jQuery);
/* plugins/ToolsPlugin/js/detectImagesDisabled.js */

/*
 * Fonction vérifiant la désactivation des images pour inclure un CSS alternatif
 */
'plugin.tools.images.'.namespace();

plugin.tools.images.imageHidden = function() {
	return (document.getElementById("flag").offsetWidth !== 1);
}

plugin.tools.images.backgroundImageHidden = function() {
	return (jQuery("#flag").css("background-image") === "none");
}

window.onload = function noimage() {
	// L'image de test doit avoir une largeur de 1px (on vérifie que l'on a bien cette taille)
	if (plugin.tools.images.imageHidden()) {
		
		var baseUrl = document.getElementsByTagName("base")[0].href;
		
		if(baseUrl) {
			var cssUrl = baseUrl + "plugins/ToolsPlugin/css/imagesDisabled.css";
			
			// Ajout du CSS dans ce cas
			var objHead = document.getElementsByTagName('head');
			var objCSS = objHead[0].appendChild(document.createElement('link'));
			objCSS.rel = 'stylesheet';
			objCSS.href = cssUrl;
			objCSS.type = 'text/css';
		}
	}
}
/* plugins/ToolsPlugin/js/doCarousel.js */

!function($){
	$(document).ready(function() {
		
		var playing = true;
		var clickArrow = false;

		// Initialisation
		$(".carousel").carousel({
			interval: 7000,
			pause: '' //Argument vide pour retirer la pause sur 'hover' (et qui relance le cycle après un mouseover)
		});
	
		// Pause du défilement lors du focus sur un lien du carousel
		$(".carousel a").focus(function(event) {
			$link = $(this);
			$carousel = $link.parents(".carousel");
			carouselPause($carousel);
		});
		
		

		// Gestion de la pagination
		$(".carousel").find(".carousel-pager a.pager-link").click(function() {
			// Récupération du lien de page et carousel
			$link = $(this);
			$carousel = $link.parents(".carousel");
			
		
			// Pour voir le focus lors de la pagination
			clickArrow = true;
			
			// Récupération de la page
			var page = parseInt($link.attr("data-page"));
			
			// On déplace le slider
			if(!isNaN(page)) {
				carouselPause($carousel);
				$carousel.carousel(page);
			}
			
			// Eviter de suivre le lien
			return false;
		});
		
		// Bouton suivant
		$(".carousel").find(".right-button").click(function() {
			$link = $(this);
			$carousel = $link.parents(".carousel");
		
			clickArrow = true;
			carouselPause($carousel);
			$carousel.carousel("next");
			
			return false;
		});

		
		// Bouton précédent
		$(".carousel").find(".left-button").click(function() {
			$link = $(this);
			$carousel = $link.parents(".carousel");
			
			clickArrow = true;
			carouselPause($carousel);
			$carousel.carousel("prev");
			
			return false;
		});

		
		// Bouton pause ou lecture
		$(".carousel").find(".pause-play").click(function() {
			$link = $(this);
			$carousel = $link.parents(".carousel");
			toogleCarousel($carousel);
			
			return false;
		});
		
		
		// * Encadrement des images actives
		$(".carousel").bind("slid", function() {
			$carousel = $(this);
			
			var $itemActive = $carousel.find(".item.active");
			var currentIndex = $itemActive.index();
			
			// * Ajout d'un title sur le numéro ainsi qu'une classe de soulignement			
			
			// On retire "- Elément actif" sur tous les liens ainsi que sur le soulignement
			$(".carousel-pager a.pager-link").each(function() {
				var $a = $(this);
				
				// Retrait de la classe
				$a.removeClass("underline");
				
				// Retait du contenu - Elément actif
				var title = $a.attr("title");
				$a.attr("title", title.replace("- Elément actif", ""));
			});
		
			// On ajoute "- Elément actif" à l'élément actif
			var pagerIndex = $itemActive.index();
			var $pagerActif = $(".carousel-pager a[data-page=" + pagerIndex + "]");
			
			if($pagerActif) {
				var currentTitle = $pagerActif.attr("title");
				$pagerActif.addClass("underline");
				$pagerActif.attr("title", currentTitle + " - Elément actif");
			}
			
			
			// Focus uniquement si on a utilisé les flèches
			if(clickArrow) {
				var id = "carousel-slid-focus";
				
				var $aForFocus = $itemActive.find("h2 a, h3 a");
				
				if($aForFocus.length != 0) {
					$aForFocus.get(0).focus();
				} else {
					// On a aucun lien pour le focus, on créait ce lien manuellement !
					// On retire la précédente ancre
					$("#" + id).remove();
					
					// Création du lien pour le focus
					$a = $("<a id=\"" + id + "\" href=\"#\" class=\"hide-accessible\">Début de l'élément du diaporama</a>");
					
					// On met le focus sur le <a> directement après l'élément
					$itemActive.prepend($a);
					$a.focus();
				}
				
				clickArrow = false;
			}
			
			// Ajout de l'encadrement
			$currentImage = $($carousel.find(".carousel-pager img")[currentIndex]);
			if($currentImage) {
				$carousel.find(".carousel-pager img").removeClass("active-img");
				$currentImage.addClass("active-img");
			}
		});
		
		
		// ** Fonction de mise en pause
		function toogleCarousel($carousel) {
			
			// Pause ou lecture
			if(playing) carouselPause($carousel);
			else carouselPlay($carousel);
		}
		
		
		// ** Fonction de mise en pause
		function carouselPause($carousel) {
			// On arrête le carousel
			$carousel.carousel('pause');
			
			// On change le bouton
			$carousel.find(".pause-play img.play").show();
			$carousel.find(".pause-play img.pause").hide();
			
			playing = false;
		}
		
		
		// ** Fonction de mise en lecture
		function carouselPlay($carousel) {
			// On ranime le carousel
			$carousel.carousel('cycle');
			
			// On change le bouton
			$carousel.find(".pause-play img.play").hide();
			$carousel.find(".pause-play img.pause").show();
			
			playing = true;
		}
	});
}(window.jQuery);
/* plugins/ToolsPlugin/js/doCarouselApp.js */

!function($){
	$(document).ready(function() {
		
		var playing = true;
		var clickArrow = false;

		// Initialisation
		$(".carousel-app").carousel({
			interval: 0,
			pause: '' //Argument vide pour retirer la pause sur 'hover' (et qui relance le cycle après un mouseover)
		});
	
		// Pause du défilement lors du focus sur un lien du carousel
		$(".carousel-app a").focus(function(event) {
			$link = $(this);
			$carousel = $link.parents(".carousel-app");
			carouselPause($carousel);
		});
		
		
		// Gestion de la pagination
		$(".carousel-app").find(".carousel-pager a.pager-link").click(function() {
			// Récupération du lien de page et carousel
			$link = $(this);
			$carousel = $link.parents(".carousel-app");
			
		
			// Pour voir le focus lors de la pagination
			clickArrow = true;
			
			// Récupération de la page
			var page = parseInt($link.attr("data-page"));
			
			// On déplace le slider
			if(!isNaN(page)) {
				carouselPause($carousel);
				$carousel.carousel(page);
			}
			
			// Eviter de suivre le lien
			return false;
		});
		
		// Bouton suivant
		$(".carousel-app").find(".right-button").click(function() {
			$link = $(this);
			$carousel = $link.parents(".carousel-app");
		
			clickArrow = true;
			carouselPause($carousel);
			$carousel.carousel("next");
			
			return false;
		});

		
		// Bouton précédent
		$(".carousel-app").find(".left-button").click(function() {
			$link = $(this);
			$carousel = $link.parents(".carousel-app");
			
			clickArrow = true;
			carouselPause($carousel);
			$carousel.carousel("prev");
			
			return false;
		});

		
		// Bouton pause ou lecture
		$(".carousel-app").find(".pause-play").click(function() {
			$link = $(this);
			$carousel = $link.parents(".carousel-app");
			toogleCarousel($carousel);
			
			return false;
		});
		
		
		// * Encadrement des images actives
		$(".carousel-app").bind("slid", function() {
			$carousel = $(this);
			
			var $itemActive = $carousel.find(".item.active");
			var currentIndex = $itemActive.index();
			
			// * Ajout d'un title sur le numéro ainsi qu'une classe de soulignement			
			
			// On retire "- Elément actif" sur tous les liens ainsi que sur le soulignement
			$(".carousel-pager a.pager-link").each(function() {
				var $a = $(this);
				
				// Retrait de la classe
				$a.removeClass("underline");
				
				// Retait du contenu - Elément actif
				var title = $a.attr("title");
				$a.attr("title", title.replace("- Elément actif", ""));
			});
		
			// On ajoute "- Elément actif" à l'élément actif
			var pagerIndex = $itemActive.index();
			var $pagerActif = $(".carousel-pager a[data-page=" + pagerIndex + "]");
			
			if($pagerActif) {
				var currentTitle = $pagerActif.attr("title");
				$pagerActif.addClass("underline");
				$pagerActif.attr("title", currentTitle + " - Elément actif");
			}
			
			
			// Focus uniquement si on a utilisé les flèches
			if(clickArrow) {
				var id = "carousel-slid-focus";
				
				var $aForFocus = $itemActive.find("h2 a, h3 a");
				
				if($aForFocus.length != 0) {
					$aForFocus.get(0).focus();
				} else {
					// On a aucun lien pour le focus, on créait ce lien manuellement !
					// On retire la précédente ancre
					$("#" + id).remove();
					
					// Création du lien pour le focus
					$a = $("<a id=\"" + id + "\" href=\"#\" class=\"hide-accessible\">Début de l'élément du diaporama</a>");
					
					// On met le focus sur le <a> directement après l'élément
					$itemActive.prepend($a);
					$a.focus();
				}
				
				clickArrow = false;
			}
			
			// Ajout de l'encadrement
			$currentImage = $($carousel.find(".carousel-pager img")[currentIndex]);
			if($currentImage) {
				$carousel.find(".carousel-pager img").removeClass("active-img");
				$currentImage.addClass("active-img");
			}
		});
		
		
		// ** Fonction de mise en pause
		function toogleCarousel($carousel) {
			
			// Pause ou lecture
			if(playing) carouselPause($carousel);
			else carouselPlay($carousel);
		}
		
		
		// ** Fonction de mise en pause
		function carouselPause($carousel) {
			// On arrête le carousel
			$carousel.carousel('pause');
			
			// On change le bouton
			$carousel.find(".pause-play img.play").show();
			$carousel.find(".pause-play img.pause").hide();
			
			playing = false;
		}
		
		
		// ** Fonction de mise en lecture
		function carouselPlay($carousel) {
			// On ranime le carousel
			$carousel.carousel('cycle');
			
			// On change le bouton
			$carousel.find(".pause-play img.play").hide();
			$carousel.find(".pause-play img.pause").show();
			
			playing = true;
		}
	});
}(window.jQuery);
/* plugins/ToolsPlugin/js/initTouchClasses.js */

!function ($) {
	$(function(){
		// 1 - On active les classes si on a du JS
		$("<style>").prop("type", "text/css").html(".show-js-inline { display: inline !important; } .show-js-block { display: block !important; }").appendTo("head");
		
		
		// On ferme les menus qui ont la classe close-toggle-phone => seulement sur les téléphones
		if(window.innerWidth <= 768) {
			var $toggleTouch = $(".close-toggle-phone");
			
			$toggleTouch.parent().find(".targetArrow").toggle(false);
			$toggleTouch.find(".spr-chevron-blanc-on").hide();
			$toggleTouch.find(".spr-chevron-blanc-off").show();
		}
		
		// 2 - On ferme les menus qui ont la classe close-toggle
		var $toggleTouch = $(".close-toggle");
		$toggleTouch.parent().find(".targetArrow").toggle(false);
		$toggleTouch.find(".spr-chevron-blanc-on").hide();
		$toggleTouch.find(".spr-chevron-blanc-off").show();

		
		// 3 - Création de la règle
		// On regarde si on est dans un terminal avec la gestion des évènement touch
		// Note : Modernizr.touch n'est pas inclus dans JCMS
		var isTouch = 'ontouchstart' in window || 'onmsgesturechange' in window || "ontouchstart" in document.documentElement;
		
		//Si on est sur une tablette (+ vérification de la taille car IE Edge et Chrome 43+ possèdent la gestion des événement touch)
		if(isTouch && window.matchMedia("(max-width:768px)").matches) {
			// On cache ou affiche en tactile
			$("<style>").prop("type", "text/css").html(".hide-touch { display: none !important; } .show-touch-inline { display: inline !important; } .show-touch-block { display: block !important; } " +
					".hide-not-touch { display: inherit; }  .show-not-touch-inline, .show-not-touch-block { display: none; }").appendTo("head");
		} else {
			// On cache ou affiche en non tactile
			$("<style>").prop("type", "text/css").html(".hide-not-touch { display: none !important; }  .show-not-touch-inline { display: inline !important; } .show-not-touch-block { display: block !important; }" +
					".hide-touch { display: inherit; } .show-touch-inline, .show-touch-block { display: none; } ").appendTo("head");
		}
		
		
		// 4 - Affichage des messages alternatifs si les images de fond sont désactivées
		if(plugin.tools.images.backgroundImageHidden()) {
			$("<style>").prop("type", "text/css").html(".show-background-image-disabled { display: inline !important; }").appendTo("head");
		}
		
	})
}(window.jQuery);
/* plugins/ToolsPlugin/js/jalios-modal-cg44.js */

/*
 * Toutes les modifications faites sont précédés de // *** 
 */
!function ($) {
    
  // ------------------------------------------
  //  PRIVATE: Register
  // ------------------------------------------
  
  // Action regexp
  var pattern = /modal/i;
  
  
  // Debug function
  var callback = function(event){
  
    // Skip loop event
    if (event && event.skip == 'modal'){ return; }
  
    // Check event
    var broker = $.jalios.Event.match(event, 'broker', pattern, true, true);
    if (!broker){ return; }
    
    // Element
    var elm = broker.source.currentTarget;
    
    // *** Ajout d'une option si c'est une modale du Conseil Général et précisions de sa couleur
    brocker.options.isModalCg = false;

    var $event = $(event.currentTarget);
    
    if($event) {
    	// Modal Cg44
    	if($event.hasClass("modal-cg")) brocker.options.isModalCg = true;
    	
    	// Couleur (blanc par défaut)
    	brocker.options.color = $event.attr("data-color") || "#FFFFFF";
    }
    
    // Call show() function
    $.jalios.ui.Modal.open(elm, broker.options);
    
  }
  
  var fallback = function(event){ 
    // Skip loop event
    if (event.skip == 'modal'){ return; }
    
    // Prevent click
    event.preventDefault();
    
    // Prevent propagation
    event.stopPropagation();
    
    // Prevent other handlers
    event.stopImmediatePropagation();
    
    // Call show() function
    
    // *** Ajout d'une option si c'est une modale du Conseil Général
    var opt = {};
    opt.isModalCg = false;
    
    
    var $event = $(event.currentTarget);
    if($event) {
    	if($event.hasClass("modal-cg")) opt.isModalCg = true;
    	
    	// Couleur (blanc par défaut)
    	opt.color = $event.attr("data-color") || "#FFFFFF";
    }
    
    $.jalios.ui.Modal.open(event.currentTarget, opt);
    
  }
  
  var register = function(){
    
    // Register to broker
    $(document).on("jalios:broker", callback);
    
    // Register fallback
    $(document).on('click', 'A.modal',       fallback);
    $(document).on('click', ':button.modal', fallback);
    $(document).on('click', ':submit.modal', fallback);
    
    // Register to Ajax-Refresh
    $(document).on('jalios:refresh', function(event){
      
    	
      var refresh = $.jalios.Event.match(event, 'refresh', 'after');
      
      if (!refresh){ return; }
      if (!refresh.target){ return; }
      
      refresh.target.each(function(){    	  
        jQuery.jalios.ui.Modal.upgrade(this);
      });
    });
  }
  
  // ------------------------------------------
  //  PUBLIC
  // ------------------------------------------
  
  // Namespace
  if (!$.jalios)      { $.jalios    = {}; }
  if (!$.jalios.ui)   { $.jalios.ui = {}; }
  
  
  /**
   * Manage Jalios Modals using Bootstrap framework.
   * <br/><br/>
   * 
   * <h5>Trigger</h5>
   * The trigger will be treadted as an Ajax-Refresh trigger for a given Modal. All ajax-refresh features applies.
   * <ul>
   *   <li>Must have class <code>modal</code> or attribute <code>data-jalios-action="modal"</code></li>
   *   <li>Classes <code>alert</code>, <code>confirm</code>, <code>prompt</code>, <code>warning</code> open a custom modal</li>
   *   <li>FIXME: data-jalios-modal="keyboard, static, ..."</li>
   *   <li>FIXME: prompt.jsp vs enter key</li>
   *   <li>FIXME; Resize on ajax-refresh </li>
   * </ul>
   * 
   * <h5>Data</h5>
   * <code>$.jalios.ui.Modal.latest</code> is an object with latest modal information.
   * <ul>
   *   <li>trigger: the trigger opening the modal</li>
   *   <li>value: information given by <code>$.jalios.ui.Modal.close()</code></li>
   * </ul>
   * 
   * <h5>Events</h5>
   * An event <code>jalios:modal</code> is trigged when a modal is closed with the following information.
   * <ul>
   *   <li>modal.type: closed is the event type</li>
   *   <li>modal.latest: references to <code>$.jalios.ui.Modal.latest</code></li>
   * </ul>
   * 
   * @namespace $.jalios.ui.Modal
   * @copyright Jalios SA
   * @see $.jalios.DataBroker
   * @see $.jalios.AjaxRefresh
   * 
   * @example
   * 
   * &lt;%@ include file='/jcore/doInitPage.jsp' %&gt;
   * 
   * &lt;% if (hasParameter("opSubmit")) { %&gt;
   *   &lt;%-- request.setAttribute("modal.redirect", "customRedirect.jsp"); --%&gt;
   *   &lt;%@ include file="/jcore/modal/modalRedirect.jspf" %&gt;
   * &lt;% } %&gt;
   * 
   * &lt;% 
   * if (hasParameter("opRefresh")) { 
   *   String text = getUntrustedStringParameter("text", "");
   *   jcmsContext.setInfoMsg("Your text: " + encodeForHTML(text));
   * }
   * %&gt;
   * 
   * &lt;div class="ajax-refresh-div"&gt;
   *   &lt;a href="debug/modal.jsp" class="ajax-refresh-url" style="display:none"&gt;&lt;/a&gt;
   *   &lt;form action="debug/modal.jsp" method="post" name="editForm"&gt;
   *   &lt;div class="modal-form" style="width:500px;"&gt;
   *   
   *     &lt;div class="modal-header"&gt;
   *       &lt;img src="images/jalios/logos/powered-by-jalios.gif" class="visual"/&gt;  
   *       &lt;h3&gt;Example of form modal&lt;/h3&gt;
   *     &lt;/div&gt;
   *   
   *     &lt;%--  
   *       int step = formHandler.getFormStep(); 
   *       int stepCount = formHandler.getFormStepCount();
   *       String stepPrefixProp = "jcmsplugin...steps.";
   *     %&gt;&lt;%@ include file='/jcore/doSteps.jspf' --%&gt;
   * 
   *     &lt;div class="modal-body"&gt;
   *       &lt;%@ include file='/jcore/doMessageBox.jsp' %&gt;
   *       &lt;div class="info"&gt;The introduction...&lt;/div&gt;
   * 
   *       &lt;input name="text" value="Enter some text" /&gt;
   *     &lt;/div&gt;
   *     
   *     &lt;div class="modal-footer"&gt;
   *       &lt;%-- @ include file='/jcore/doStepButtons.jspf' --%&gt;
   *       &lt;a href="#" class="ajax-refresh"&gt;Refresh Link&lt;/a&gt;
   *       &lt;input type="submit" class="btn" name="opCancel" onclick="return JCMS.window.Modal.close(false);" value="&lt;%= glp("ui.com.btn.cancel") %&gt;"/&gt;
   *       &lt;input type="submit" class="btn ajax-refresh" name="opRefresh" value="&lt;%= glp("ui.com.btn.refresh") %&gt;" /&gt;
   *       &lt;input type="submit" class="btn btn-primary ajax-refresh" name="opSubmit" value="&lt;%= glp("ui.com.btn.save") %&gt;" /&gt;
   *     &lt;/div&gt;
   *   &lt;/div&gt;
   *   &lt;/form&gt;
   *   
   *   &lt;%@ include file='/jcore/doAjaxFooter.jspf' %&gt;
   * &lt;/div&gt;
   * 
   */
  
  $.jalios.ui.Modal = {

    latest: {}, 
    
    /**
     * Open a modal to a given URL
     * <ul>
     *   <li>A common modal is created or reused</li>
     *   <li>An Ajax-Refresh is performed on modal with the given URL</li>
     * </ul>
     * 
     * Options
     * <ul>
     *   <li>callback</li>
     * </ul>
     * 
     * @param {string} url the url to access
     * @param {object} options (optional)
     */
    openFromUrl: function(url, options){
  	
      // Build modal if needed
      var $modal =  $.jalios.ui.Modal.getModal();
      
      // *** Suppression du test de vérification et qu'il s'agit d'une modal CG
      if(!$modal || !$modal.exists()) { return; }
      
      // Reset modal's data
      $.jalios.ui.Modal.latest = options || {}
      
      // Show modal
      $modal.modal('show');
      
      // Show perform ajax-refresh
      var opts = $.extend(true, {}, {
        'url'    : url,
        'noscroll'  : true,
        'nohistory' : true
      }, options);
      opts.callback = false;
      $modal.refresh(opts);
    },
    
    /**
     * Open a modal to a given Trigger
     * <ul>
     *   <li>A common modal is created or reused</li>
     *   <li>An Ajax-Refresh is performed on modal with the given trigger</li>
     * </ul>
     * 
     * <h5>Custom classes:</h5>
     * <ul>
     *   <li><code>alert</code>: simple alert (ok)</li>
     *   <li><code>confirm</code>: simple confirm (ok/cancel)</li>
     *   <li><code>prompt</code>: simple prompt (ok/cancel/input)</li>
     *   <li><code>warning</code>: simple warnint (ok/cancel)</li>
     * </ul>
     * These custom class append a <code>msg-box</code> class to modal.
     * 
     * <h5>Images:</h5>
     * IMG source ending with jpg|jpeg|gif|png|bmp will open a custom modal (image.jsp).
     * The class <code>ajax-lazy-chunk</code> on a refreshed content trigger resize of the modal after loading.
     * 
     * <h5>IFrame:</h5>
     * Tags with a <code>rel</code> attribute will open a custom modal ({rel}.jsp).
     * <ul>
     *   <li><code>rel="iframe"</code>: open an iframe in a modal</li>
     * </ul>
     * 
     * <h5>data-*</h5>
     * The attribute <code>data-jalios-modal-url</code> is a workaround when <code>data-jalios-ajax-refresh-url</code> can't be used.
     * (Modal could be opened on DIV's clicks)
     * 
     * <ul>
     *   <li>FIXME: Handle CtxMenu Trigger</li>
     * </ul>
     * 
     * @param {element} trigger the trigger 
     * @param {object} options (optional)
     */
    open: function(trigger, options){ 
      if (!trigger){ return false; }

      var $trigger = $(trigger);

      // Case 0: Do not open Modal in a Modal
      if ($trigger.closest('DIV.modal').exists()){
        $.console.warn('[Modal]','Cannont open a Modal in a Modal');
        return;
      }
      
      $.jalios.ui.Modal.latest = options || {}
      $.jalios.ui.Modal.latest.trigger = $trigger;
      
      // Build modal // *** Avec l'ajout des options
      var $modal =  $.jalios.ui.Modal.getModal(options);
      if (!$modal || !$modal.exists()){ return; }
      
      // Case 1: Dialog Message
      var url    = false;
      var helper = false;
           if ($trigger.hasClass('alert'))  { url = 'jcore/modal/alert.jsp';   helper = true; } 
      else if ($trigger.hasClass('confirm')){ url = 'jcore/modal/confirm.jsp'; helper = true; } 
      else if ($trigger.hasClass('prompt')) { url = 'jcore/modal/prompt.jsp';  helper = true; } 
      else if ($trigger.hasClass('warning')){ url = 'jcore/modal/warning.jsp'; helper = true; }

      // Set helper data
      if (helper){
        var msg = $trigger.attr('title') || $trigger.attr('data-jalios-text');
        url += msg ? '?msg='+ $.jalios.Http.encode(msg) : '';
        $modal.addClass('modal-msg');
      }
      
      // Case 2: Modal images
      var href = $trigger.get(0).href; // fix bug DEVJCMS-5 : DO NOT use $elm.attr('href')   
      if (href && href.match(new RegExp('(jpg|jpeg|gif|png|bmp)([?][^?]+)*$','img'))) {
        url = 'jcore/modal/image.jsp?url='+  $.jalios.Http.encode(href);
        // In Iframe, display image in a popup
        // FIXME if Util.isInIFrame() Popup.popupWindow(tag.href, tag.readAttribute('title') || tag.href, 640, 480);
      }
      
      // Case 3: Handle data-jalios-modal-url hack when data-jalios-ajax-refresh-url is not available
      var href = $trigger.attr('data-jalios-modal-url');
      if (href){
        url = href;
      }
      
      // Case 4: Url has been forced and override value
      if (options && options.url){
        url = options.url;
      }
      
      // Handle IFrame
      // *** Ajout de data-rel pour la validation W3C // HACK JCMS => rel="iframe" u
      var rel = $trigger.attr('data-rel') || $trigger.attr('rel');
      if (rel){
        var title = $.jalios.Http.encode($trigger.attr('title'));
        // **** Récupération du titre
        window.iframeTitle = unescape($trigger.attr('title'));
        url = 'jcore/modal/'+rel.toLowerCase()+'.jsp?url='+  $.jalios.Http.encode(href);
      }
      
      // Show modal
      $modal.modal('show');

      // Show perform ajax-refresh
      var opts = $.extend(true, {}, {
       'target'     : '#jalios-modal', 
        'url'       : url,
        'noscroll'  : true,
        'nohistory' : true,
        'waiting'   : $trigger.hasClass('modal-waiting')
      }, options);
      
      //opts.callback = false;
      
      // *** Ajout du bouton de fermeture en callback si on est dans une modale du Conseil Général	  
      if(options.isModalCg) {
		opts.callback = function($trigger) {
		
			// On bloque le focus à la modale
			$("#jalios-modal").attr("tabindex","-1");
			
			// On ajoute le bouton
			$("#jalios-modal").prepend("<div class='close-button'>"+
		  		"<button  style=\"background-color:"+options.color+";\" onClick='jQuery.jalios.ui.Modal.close(true);' name='close'><img src='s.gif' class='spr-modal-close' alt='Fermer'/></button>" +
		  		"</div>");
			
			// Et on le focus sur le bouton
			$("#jalios-modal").find(".close-button button").focus();
		}
	  }
      
      $trigger.refresh(opts);
      
    },
    
    /**
     * Open a prompt dialog with given message and call the callback with the given value. 
     * 
     * @param {string} msg the message to display
     * @param {string} callback the callback to call (optional) 
     * @param {string} defvalue the default value to fill prompt (optional)
     */
    prompt: function(msg, callback, defvalue){
    	
      // Build URL
      var url = 'jcore/modal/prompt.jsp?msg='+ $.jalios.Http.encode(msg);
      
      // Append default value to url
      if (defvalue){
        url += '&defValue='+defvalue;
      }
      
      // Open a modal to the given URL
      $.jalios.ui.Modal.openFromUrl(url, { 
        'callback': callback,
        'value' : defvalue
      });
      
      
      
      return false;
    },
    
    /**
     * Open a confirm dialog with given message and call the callback with the given value. 
     * 
     * @param {string} msg the message to display
     * @param {string} callback the callback to call (optional) 
     * @param {boolean} reverse the condition (optional) 
     */
    confirm: function(msg, callback, reverse){
      
      // Build URL
      var url = 'jcore/modal/confirm.jsp?msg='+ $.jalios.Http.encode(msg);
      
      // Open a modal to the given URL
      $.jalios.ui.Modal.openFromUrl(url, { 
        'callback': function(value){ 
          if (value  && !reverse){ callback(value); }
          if (!value &&  reverse){ callback(value); }
        }
      });
      
      return false;
    },
    
    /**
     * Open an alert dialog with given message and call the callback with the given value. 
     * 
     * @param {string} msg the message to display
     * @param {string} callback the callback to call (optional) 
     */
    alert: function(msg, callback){
      
      // Build URL
      var url  = 'jcore/modal/alert.jsp?msg='+ $.jalios.Http.encode(msg);
      var opts = {};
      
      if (callback){
        opts['callback'] = function(value){ callback(value); }
      }
      
      // Open a modal to the given URL
      $.jalios.ui.Modal.openFromUrl(url, opts);
      return false;
    },
    
    confirmInModal: function(trigger, callback){
      var $trigger = $(trigger);
      var $modal   = $trigger.closest('DIV.modal');
      var text  = $trigger.attr('title') || $trigger.attr('data-jalios-text') || I18N.glp("msg.js.confirm");
      var html  = '<div class="modal-confirm fade"><div class="confirm-buttons">'
                + '<a href="#" class="btn btn-cancel">'+I18N.glp("com.lbl.cancel")+'</a>&nbsp;'
                + '<a href="#" class="btn btn-danger">'+I18N.glp("com.lbl.ok")+'</a>'
                + '</div>'+'<h4>'+text+'</h4>'
                + '</div>';

      var $html = $(html);           
      $html.appendTo($modal).delay(300).queue(function(next){ $(this).addClass('in'); next(); })

      // OK - Cancel
      $html.find('.btn-cancel, .btn-danger').on('click', function(event){ 
        event.preventDefault();
        var $w = $(event.currentTarget).closest('.modal-confirm');
        var $that = $(this);
        $w.removeClass('in').delay(500).queue(function(next){ 
          callback($that.hasClass('btn-danger'));
          $w.remove(); 
          next();
        });
      });
    },
    
    /**
     * Close the current modal and store in <code>$.jalios.ui.Modal.latest.value</code> the given value.
     * 
     * @param value the value to store.
     * 
     * @example
     * <button onClick="$.jalios.ui.Modal.close(true)" />
     */
    close: function(value){

      $.jalios.ui.Modal.latest.value = value;
      $('#jalios-modal').modal('hide');
      
      return false;
    },
    
    /**
     * Close the current modal and reload the page.
     * @param {string} url to use for reload (optional)
     */
    closeAndReload: function(url){
      $.jalios.ui.Modal.close();
      if (url){
        $.jalios.Browser.redirect(url);
      } else {
        $.jalios.Browser.reload();
      }
      return false;
    },
    
    /**
     * Close the current modal and trigger an ajax-refresh on the wrapper.
     * Should use closeAndFollow() that will trigger a click on trigger (with skip modal and call to next actions (like ajax-refresh)
     */
    closeAndRefresh: function(){
      $.jalios.ui.Modal.close();
      $.jalios.AjaxRefresh.refreshTarget($.jalios.ui.Modal.latest.trigger);
      return false;
    },
    
    /**
     * Close the current modal and follow link/button event.
     * <ul>
     *   <li>Link are called with parameter value=...</li>
     *   <li>Input/Button 'submit' are submited with their name and input hidden value</li>
     *   <li>Form are submited with their name and input hidden value</li>
     * </ul>
     * 
     * @param {string} value the value to set (optional) 
     */
    closeAndFollow: function(value){
    
      $.jalios.ui.Modal.close(value);

      // Do not follow if it is an ajax-refresh confirm (kludge)
      if ($.jalios.ui.Modal.latest.callback){
        return false;
      }
      
      $.jalios.DOM.follow($.jalios.ui.Modal.latest.trigger, 'modal', 'value', value);
      return false;
    },
    
    /**
     * Returns the Common Modal
     * @return modal
     */
    getModal : function(opt){

      var options = opt || {};
      var $modal = $('#jalios-modal');
      if ($modal.exists()){
        
        // Do not open a modal when already open    	
    	if ($modal.data('modal').isShown){
          $.console.warn('[Modal]','Cannont open a Modal when a modal is already opened'); 
          return; 
        }
        
        // Hide elements before refresh
        $modal.children().hide().remove('A.ajax-refresh-url'); 
        
        // Clean modal (used as targer)
        $modal.prop('class','modal fade ajax-refresh-div').css('width','').css('marginLeft','').removeAttr('data-jalios-ajax-refresh-url');
        
        // *** On ajoute le design dans le cas d'une modale du Cg44 qui existe déjà
        if(options.isModalCg) {
        	$modal.addClass("jalios-modal-cg44");
        	$modal.css("border-color", options.color);
        	
        } else {
        	$modal.removeClass("jalios-modal-cg44");
        	$modal.css("border-color", "");
        }
        
        return $modal;
      }
      
      // hide fade
      $modal = $('<div id="jalios-modal" class="modal fade ajax-refresh-div"></div>').appendTo('BODY');
      
      // *** On ajoute le design dans le cas d'une modale du Cg44
      if(options.isModalCg) {
	    $modal.addClass("jalios-modal-cg44");
      	$modal.css("border-color", options.color);
      } else {
      	$modal.removeClass("jalios-modal-cg44");
      	$modal.css("border-color", "");
      }

      $modal.modal({ keyboard: true, backdrop: 'static' });
      
      // Add class name
      $modal.on('shown', function(event){
    	  $('BODY').addClass('modal-displayed');
      });
      $modal.on('hide', function(event){
        // Remove class name
        $('BODY').removeClass('modal-displayed');
        
        // Fire an event on hidden
        var event = jQuery.Event("jalios:modal");
        event.modal = {};
        event.modal.type    = 'closed';
        event.modal.latest  = $.jalios.ui.Modal.latest;
        $(document).trigger(event);
        
        // Fire to the callback
        if ($.jalios.ui.Modal.latest.callback){
          $.jalios.ui.Modal.latest.callback($.jalios.ui.Modal.latest.value);
        }
      });
      
      $modal.on('click', '.modal-steps A', function(event){
        // Prevent click
        event.preventDefault();
        
        // Prevent propagation
        event.stopPropagation();
        
        // Prevent other handlers
        event.stopImmediatePropagation();
      });
      
      return $modal;
    },
    
    /**
     * Upgrade old <code>modalForm</code> to new bootstrap modal.
     * 
     * @param {element} context the page context to upgrade (optional) 
     */
    upgrade: function(context){
    
      $('.modalForm', context || document).each(function(){
        
        var $this = $(this);
        // modalForm => modal-form
        $this.addClass('modal-form'); // .removeClass('modalForm')
        
        // H1 => modal-header H3
        $this.children('H1').each(function(){ $(this).replaceWith('<div class="modal-header"><h3>'+$(this).html()+'</h3></div>') });
      
        // .bigIcon => .visual in modal-header
        $this.children('.bigIcon').removeClass('bigIcon').addClass('visual').insertBefore($this.find('.modal-header H3'));
      
        // .content => modal-body
        var $content = $this.children('.content').removeClass('content').addClass('modal-body');
        
        // buttons => modal-footer 
        $content.find('.buttons').removeClass('buttons').addClass('modal-footer').appendTo($this);
        
        // Detach form
        var $form = $content.find('FORM').detach();
        if ($form.exists()){
         // modal-body += FORM
          $content.html($content.html() + $form.html());
        
          // modal-form <==> FORM
          $this.html($form.html($this.html()));
        }
      });
            
      // IE Hack to pull footer until right
      $('.modal-form .modal-footer', context || document).each(function(){
        $(this).append("<img src='s.gif' class='pull-right' alt=''/>");
      });
      
      // Handle Lazy Chunk
      $(context || '.modal').find('.ajax-lazy-chunk').on('load', function(){
        $.jalios.ui.Modal.fixWidth('#jalios-modal');
      });
      
      // FIXME: Bind resize event
      // Check overrided width => See: pull request (https://github.com/twitter/bootstrap/pull/4886)
      $.jalios.ui.Modal.fixWidth(context);
      
      // Kludge to handle width set in classes instead of inline !!!
      $.jalios.ui.Modal.fixWidth.delay(1, context);
	},
    
    fixWidth: function(context){
      var $modal = $(context || '.modal');
      var $this  = $modal.children('div, form').first();
      var width  = $this.width() || $modal.width();
      
      
      // **** Mise à jour de la scrollbar si elle existe
      var $context = $(context);
      
      // Handle iFrame case
      var $iframe = $this.find('IFRAME');
      if ($iframe.exists()){
    	  
    	  // *** Ajout du titre
		  if($modal.hasClass("jalios-modal-cg44")) {
			  if(window.iframeTitle) {
				  $iframe.attr("title", window.iframeTitle);
				  delete window.iframeTitle;
			  } else {
				  $iframe.attr("title", "");
			  }
		  } else {
			  $iframe.attr("title", ""); 
		  }
		  
        try { 
        	width = $iframe[0].contentWindow.document.body.offsetWidth;
        } catch (ex){ 
          $iframe = false; 
          $.console.warn("[modal] Can't read iFrame properties",ex);  
        }        
      }
      
      // Set margin and width
      var $modal = $this.closest('.modal')
      
      // *** Pas de correction du centrage pour une modale du Conseil Général
      if(!$modal.hasClass("jalios-modal-cg44")) {
    	  
          if ($iframe && $iframe.exists()){
              $modal.css('width', (width+18)+'px');
          }
    	  $modal.css('marginLeft', -width/2+'px');
      }
      
    } 
  }
  
  // Plugin initialization on DOM ready
  $(document).ready(function($) {
    register();
  });
  
}(window.jQuery);

//------------------------------------------
//DEPRECATED
//------------------------------------------

var deprecatedModal = function(fctn){
jQuery.console.warn("[Deprecated] "+fctn+": JCMS requires the new Modal framework");
jQuery.console.stacktrace();
}

JCMS                       = window.JCMS || {};
JCMS.window                = JCMS.window || {};
JCMS.window.Modal          = JCMS.window.Modal || {};
JCMS.window.Modal.close    = jQuery.jalios.ui.Modal.close;
JCMS.window.Modal.relocate = function(){ deprecatedModal('Modal.relocate'); };

JCMS.window.Modal.showJSP = function(jsp, callback, params){
deprecatedModal('Modal.showJSP');

if (typeof params == "object"){
jsp += '?'  + jQuery.param(params, true);
}
jQuery.jalios.ui.Modal.openFromUrl(jsp , { 'callback' : callback});
}


JCMS.window.Modal.confirm = function(msg, func, usage){
deprecatedModal('Modal.confirm');
jQuery.jalios.ui.Modal.confirm(msg , func);
}


//
//This function prompts the given message and provide a text input. 
//Then, if the user confirms (OK button), it execute a javascript
//function.
//
//@param msg the message to prompt.
//@param func the function to execute.
//@param defvalue the default value of the text input.
//@deprecated use isntead jQuery.jalios.ui.Modal
//
function promptJSAction(msg , func, defvalue){
deprecatedModal('promptJSAction');
jQuery.jalios.ui.Modal.prompt(msg , func, defvalue);
}

//
//This function prompts the given message and provide a text input. 
//Then, if the user confirms (OK button), it redirect on the given 
//URL with the input value bound to the given parameter.
//
//@param msg the message to prompt.
//@param url the url to redirect on.
//@param param the name of the parameter used to provide the input value
//@param defvalue the default value of the text input.
//@deprecated use isntead jQuery.jalios.ui.Modal
//
function promptAction(msg , url, param, defvalue){
deprecatedModal('promptAction');

jQuery.jalios.ui.Modal.prompt(msg , function(value){
if (value === false){ return; }
jQuery.jalios.Browser.redirect(jQuery.jalios.Http.getUrlWithUpdatedParam(url, param, value));
}, defvalue);
}

//
//This function prompts the given message and execute given function if the user confirms (OK button)
//@param msg the message to prompt.
//@param func the function to run.
//@deprecated use isntead jQuery.jalios.ui.Modal
//
function confirmJSAction(msg, func) {
deprecatedModal('confirmJSAction');

jQuery.jalios.ui.Modal.confirm(msg , func);
}

//
//This function prompts the given message and redirect on the given URL if the user confirms (OK button)
//@param msg the message to prompt.
//@param url the url to redirect on.
//@deprecated use isntead jQuery.jalios.ui.Modal
//
function confirmAction(msg, url) {
deprecatedModal('confirmAction');

jQuery.jalios.ui.Modal.confirm(msg , function(){
jQuery.jalios.Browser.redirect(url);
});

return false;
}

//
//This function prompts the given message and redirect on the given URL if the user does not confirm (Cancel button)
//@param msg the message to prompt.
//@param url the url to redirect on.
//@deprecated use isntead JCMS.window.Modal
//
function confirmNoAction(msg, url) {
deprecatedModal('confirmNoAction');

jQuery.jalios.ui.Modal.confirm(msg , function(){
jQuery.jalios.Browser.redirect(url);
}, true);
}
/* plugins/ToolsPlugin/js/modalKeepFocus.js */

!function ($) {
	$(function(){
		
		// Enregistrement du focus lors du click sur un lien de modal
		$(document.body).on( "click", ".modal.modal-cg", function(event) {
			window.currentFocus = $(event.target)[0];
		});
		
		
		// Restauration du focus lors de la fermeture de la modale
		// Note : on ne peut pas se fier sur l'évènement Boostrap car 
		// ce dernier ne nous parvient pas tout le temps (pour des raisons inconnues)
		$(document.body).on("click", "#jalios-modal.jalios-modal-cg44 .close-button", function (event) {
			if(window.currentFocus) {
				window.currentFocus.focus();
				delete window.currentFocus;
			}
		});
	})
}(window.jQuery);
/* plugins/ToolsPlugin/js/shareSocialNetwork.js */

!function ($) {
	$(function(){
		
				
		function partageRefreshTitle(){
			var valopen='Ouvrir';
			var valclose='Fermer';
	
			
		    $(".dropdown-partage").click(function () {
		    	var menuItem=$(".dropdown-partage");    	
		    	if(menuItem.hasClass("open")) {
		    		var currentTitle=menuItem.find("a").prop('title');
		    		currentTitle=currentTitle.replace(valclose, valopen);
		    		menuItem.find("a.dropdown-toggle").prop('title',currentTitle); 
		    	}else{    		     		
		    		var currentTitle=menuItem.find("a").prop('title');
		    		currentTitle=currentTitle.replace(valopen, valclose);
		    		menuItem.find("a.dropdown-toggle").prop('title',currentTitle);  		
		    	}  	
		     });
			  
	
			$(document).mouseup(function (e){
			    var container = $(".dropdown-partage");
			    if (container.has(e.target).length === 0) {
			    	var menuItem=$(".dropdown-partage");
			    	if(menuItem.hasClass("open")) {
			    		var currentTitle=menuItem.find("a").prop('title');
			    		currentTitle=currentTitle.replace(valclose, valopen);
			    		menuItem.find("a.dropdown-toggle").prop('title',currentTitle); 
			    	}
			    }        
			});
		}
		
		Event.observe(document, 'refresh:after', function() { partageRefreshTitle(); });
		partageRefreshTitle();
		
		// Partage Facebook avec minifieur
		$(".share-link.facebook").click(function(e) {
			var $this = $(this);
			var urlToShare = document.location.href;

			// On gère le cas où l'on est dans une modale
			// L'url à raccourcir est alors le contenu de l'attribut href
			if($this.parents("#jalios-modal").length > 0) urlToShare = $this.attr("data-url");
			
			var facebookUrl = removeParameter($this.attr("href"));
			
			gapi.client.load('urlshortener', 'v1', function() {
				var request = gapi.client.urlshortener.url.insert({
					'resource': { 'longUrl': urlToShare }
				});
				var resp = request.execute(function(resp) {
					if (!resp.error) {
						window.open(facebookUrl + "?u=" + resp.id, 'Facebook', 'width=626,height=436');
					}
				});
			});
			
			return false;
		});
		
		
		
		// Twitter avec minifieur
		$(".share-link.twitter").click(function(e) {
			var $this = $(this);
			var urlToShare = document.location.href;

			// On gère le cas où l'on est dans une modale
			// L'url à raccourcir est alors le contenu de l'attribut href
			if($this.parents("#jalios-modal").length > 0) urlToShare = $this.attr("data-url");
			
			var twitterUrl = removeParameter($this.attr("href"));
			var site = "loireatlantique";
			if($this.attr("data-site") != null) {
				site = $this.attr("data-site");
			}
			
			gapi.client.load('urlshortener', 'v1', function() {
				var request = gapi.client.urlshortener.url.insert({
					'resource': { 'longUrl': urlToShare }
				});
				var resp = request.execute(function(resp) {
					if (!resp.error) {
						window.open(twitterUrl + "?url=" + resp.id + "&amp;tw_p=tweetbutton&text="+document.title+" via @" + site, 'Twitter', 'width=626,height=436');
					}
				});
			});
			
			
			return false;
		});
		
		
		
		// Google+ sans minifieur
		$(".share-link.google-plus").click(function(e) {
			var $this = $(this);
			var urlToShare = $this.attr("href");

    		window.open(urlToShare, 'GooglePlus', 'width=626,height=436');
		   
		    return false;
		});
		
		
		
		
		// Pinterest
		$(".share-link.pinterest").click(function(e) {
			var $this = $(this);
			var url = $this.attr("href");
			
			// On gÃ¨re le cas oÃ¹ les mÃ©ta-datas sont dans la modale
			var $metaDataContainer = $("#jalios-modal.jalios-modal-cg44");
			if($metaDataContainer.length == 0) $metaDataContainer = $("head");
			
			// On ajoute la description et l'image
			var title = $metaDataContainer.find("meta[property='og:title']").attr("content");
			var img = $metaDataContainer.find("meta[property='og:image']").attr("content");
			var description = $metaDataContainer.find("meta[property='og:description']").attr("content");
			
			// Ajout de l'image
			url += "&media=";
			url += img || "";
			
			// Ajout de la description
			url += "&description=";
			url += title+" - " || "";
			url += description || "";
			
			// Nouvelle fenÃªtre
			window.open(url, 'Pinterest', 'width=626,height=436');
			
			return false;
		});
		
		
		// Fonction de retrait des paramÃ¨tres de l'URL
		function removeParameter(url) {
			var parameterBeginIndex = url.indexOf("?");
		    if( parameterBeginIndex != -1) {
		    	url = url.substr(0, parameterBeginIndex);
		    }
		    return url;
		}
		
	})
}(window.jQuery);
/* plugins/ToolsPlugin/js/slideBarSkinable.js */

!function ($) {
  $(function(){
	  
	$("body").on("click", ".openingArrow", function(event){
		event.stopPropagation();
		toggleBar(this, false, false);
		return false;
	});


    $(".focus-link").keydown(function(event) {
        // Déclenchement de l'action uniquement dans le cas d'un appui sur la touche "entrée"
        // Ou alors sur la flèche directionnelle droite ou bas
        if(event.keyCode == 39) {
            toggleBar(this, true, false);
        }
    });
    
	$(".focus-link").click(function(event) {
		// On évite d'embêter openingArrow
		event.stopPropagation();

		toggleBar(this, true, false);
		return false;
	});
	
	$(".focus-link-chapitre").keydown(function(event) {
        // Déclenchement de l'action uniquement dans le cas d'un appui sur la touche "entrée"
        // Ou alors sur la flèche directionnelle droite ou bas
        if(event.keyCode == 39) {
            toggleBarChapitre(this, true, false);
        }
    });
    
	$(".focus-link-chapitre").click(function(event) {
		// On évite d'embêter openingArrow
		event.stopPropagation();

		toggleBarChapitre(this, true, false);
		return false;
	});

	 
	/**
	 * 3 paramètres
	 * 	- l'objet qui a reçu le clic/focus
	 *  - S'agit du lien de focus
	 *  - Possibilité de préciser de ne pas fermer le menu (valable pour le focus)
	 *  
	 */
    function toggleBar(_this, focusLink, openOnly) {    	
    	var $this = $(_this);
    	var $parent = $this.parent();
    	
    	// Cas spécial pour le lien focus-link
    	if(focusLink) $parent = $this.parents(".openingArrow").parent();
    	
    	var openOnly = openOnly || false;
    	var isClose = $parent.find(".spr-chevron-blanc-off").is(":visible");
    	
    	if(focusLink) {
    		// On ouvre le menu s'il était fermé
    		if(isClose) {
    			$this.parents(".openingArrow").parent().find("div.targetArrow").slideToggle("fast");
    		} else {
    			// Si le bloc était ouvert, on l'ouvre sauf si la variable nous dit l'inverse
    			if(!openOnly) {
    				$this.parents(".openingArrow").parent().find("div.targetArrow").slideToggle("fast");
    			} else {
    				// On évite le changement d'images
    				return false;
    			}
    		}
    	} else {
    		$parent.find("div.targetArrow").slideToggle("fast");
    	}
    	
    	// Changement d'icône
    	if(isClose){    		
    		$parent.find(".spr-chevron-blanc-on").show();
    		$parent.find(".spr-chevron-blanc-off").hide();
    		
    		//Inversion du texte
    		$parent.find(".show-title-text").addClass("hidden");
    		$parent.find(".hide-title-text").removeClass("hidden");
    		
    	} else {
    		$parent.find(".spr-chevron-blanc-on").hide();
    		$parent.find(".spr-chevron-blanc-off").show();
    		
    		//Inversion du texte
    		$parent.find(".hide-title-text").addClass("hidden");
    		$parent.find(".show-title-text").removeClass("hidden");
    	}
    	
    }
    
    /**
	 * 3 paramètres
	 * 	- l'objet qui a reçu le clic/focus
	 *  - S'agit du lien de focus
	 *  - Possibilité de préciser de ne pas fermer le menu (valable pour le focus)
	 *  
	 */
    function toggleBarChapitre(_this, focusLink, openOnly) {    	
    	var $this = $(_this);
    	var $parent = $this.parent();
    	
    	// Cas spécial pour le lien focus-link
    	if(focusLink) $parent = $this.parents(".openingArrow").parent();
    	
    	var openOnly = openOnly || false;
    	var isClose = $parent.find(".spr-chevron-noir-off").is(":visible");
    	
    	if(focusLink) {
    		// On ouvre le menu s'il était fermé
    		if(isClose) {
    			$this.parents(".openingArrow").parent().find("div.targetArrow").slideToggle("fast");
    		} else {
    			// Si le bloc était ouvert, on l'ouvre sauf si la variable nous dit l'inverse
    			if(!openOnly) {
    				$this.parents(".openingArrow").parent().find("div.targetArrow").slideToggle("fast");
    			} else {
    				// On évite le changement d'images
    				return false;
    			}
    		}
    	} else {
    		$parent.find("div.targetArrow").slideToggle("fast");
    	}
    	
    	// Changement d'icône
    	if(isClose){    		
    		$parent.find(".spr-chevron-noir-on").show();
    		$parent.find(".spr-chevron-noir-off").hide();
    		
    		//Inversion du texte
    		$parent.find(".show-title-text").addClass("hidden");
    		$parent.find(".hide-title-text").removeClass("hidden");
    		
    	} else {
    		$parent.find(".spr-chevron-noir-on").hide();
    		$parent.find(".spr-chevron-noir-off").show();
    		
    		//Inversion du texte
    		$parent.find(".hide-title-text").addClass("hidden");
    		$parent.find(".show-title-text").removeClass("hidden");
    	}
    	
    }
    
    
    /* On ferme les menus au début pour ceux qui ont la classe close-at-beginning */
    $(".targetArrow.close-at-beginning").hide();
    
  //Ouvrir par défaut les div ayant cette classe
    $(".targetArrow.open-at-beginning").show( "fast", function() {
        // Animation complete.
    	$(".spr-chevron-noir-on").show();
		$(".spr-chevron-noir-off").hide();
		
		//Inversion du texte
		$(".hide-title-text").removeClass("hidden");
		$(".show-title-text").addClass("hidden");
      });
  })
}(window.jQuery)
/* plugins/ToolsPlugin/js/iframeresizer/iframe-standard.js */

var isFrameLoaded = false; 

jQuery( document ).ready(function() {
	insertIframe(iframeId, iframeUrlService, true);
});

function insertIframe(serviceName, url, isSandboxed) {
	
	var sandbox_attr = '';
	if (isSandboxed) sandbox_attr = "sandbox='allow-same-origin allow-top-navigation allow-forms allow-scripts'";

	var strIframe = "<div id='iframe-loader-" + serviceName + "'><img src='plugins/ToolsPlugin/images/ajax-loader.gif' alt='Chargement du module en cours...'/></div><div id='iframe-box-" + serviceName + "' style='display:none'><iframe frameborder='0' border='0' src='" + url + "' "+ sandbox_attr + " width='100%' scrolling='no'></iframe></div>";
	jQuery('#iframe-placeholder-' + serviceName).html(strIframe);
	jQuery('#iframe-placeholder-' + serviceName + ' iframe').iFrameSizer({
		log                    : false,  // For development
		contentWindowBodyMargin: 0,     // Set the default browser body margin style (in px)
		doHeight               : true,  // Calculates dynamic height
		doWidth                : false, // Calculates dynamic width
		interval               : 32,    // interval in ms to recalculate body height, 0 to disable refreshing
		enablePublicMethods    : true,  // Enable methods within iframe hosted page 
		autoWindowResize       : true,  // Trigering resize on window.change event
		callback: function(messageData){
				// First message ?
				if(!isFrameLoaded) {
					console.log("isFrameLoaded");
					isFrameLoaded = true; 
					jQuery('#iframe-box-' + serviceName).show();
					jQuery('#iframe-loader-' + serviceName).remove();
				}
			},
		breadcrumbcallback: function(breadcrumbData){
					return;
				}
			});

	// Test du bon chargement de la page
	isFrameLoaded = false;
	setTimeout(function(){
		if(!isFrameLoaded)
		{
			jQuery('#iframe-loader-' + serviceName).html("Erreur de chargement. Contenu non disponible.");
		}
	}, 5000);
}
/* plugins/ToolsPlugin/js/iframeresizer/iframeResizer.contentWindow.js */

/*
 * File: iframeSizer.contentWindow.js
 * Desc: Include this file in any page being loaded into an iframe
 *       to force the iframe to resize to the content size.
 * Requires: jquery.iframeSizer.js on host page.
 * Author: David J. Bradshaw - dave@bradshaw.net
 * Contributor: Jure Mav - jure.mav@gmail.com
 * Date: 2013-06-14
 */

(function() {

	var
		myID	= '',
		target	= null,
		height	= 1,
		width	= 1,
		base	= 10,
		logging = false,
		msgID	= '[iFrameSizer]',  //Must match host page msg ID
		msgIdBreadcrumb	= '[iFrameBreadcrumb]', //Must match iframe msg ID
		firstRun = true,
		msgIdLen= msgID.length;

	try{

		function addEventListener(e,func){
			if (window.addEventListener){
				window.addEventListener(e,func, false);
			} else if (window.attachEvent){
				window.attachEvent('on'+e,func);
			}
		}

		function formatLogMsg(msg){
			return msgID + '[' + myID + ']' + ' ' + msg;
		}

		function log(msg){
			if (logging && window.console){
				console.log(formatLogMsg(msg));
			}
		}

		function warn(msg){
			if (window.console){
				console.warn(formatLogMsg(msg));
			}
		}

		function receiver(event) {
			function init(){

				function strBool(str){
					return 'true' === str ? true : false;
				}

				function setMargin(){
					document.body.style.margin = bodyMargin+'px';
					log('Body margin set to '+bodyMargin+'px');

				}

                function setHeightAuto(){
                    // Bug fix for infinity resizing of iframe
                    document.documentElement.style.height = 'auto';
                    document.body.style.height = 'auto';
                    log('HTML & body height set to "auto"');
                }

				function initWindowListener(){
					addEventListener('resize', function(){
						sendSize('resize','Window resized');
					});
				}

				var data = event.data.substr(msgIdLen).split(':');

				myID             = data[0];
				bodyMargin       = parseInt(data[1],base);
				doWidth          = strBool(data[2]);
				logging          = strBool(data[3]);
				interval         = parseInt(data[4],base);
				publicMethods    = strBool(data[5]);
				autoWindowResize = strBool(data[6]);
				target           = event.source;

				log('Initialising iframe');

				setMargin();
				setHeightAuto();
				if ( autoWindowResize ) {
					initWindowListener();
					setupMutationObserver();
				}

				if (publicMethods){
					setupPublicMethods();
				}

				sendBreadCrumb();
			}

			function initInterval(){
				if ( 0 !== interval ){
					log('setInterval: '+interval);
					setInterval(function(){
						sendSize('interval','setInterval: '+interval);
					},interval);
				}
			}

			function getOffset(dimension){
				return parseInt(document.body['offset'+dimension],base);
			}

			function sendSize(type,calleeMsg, customHeight, customWidth){

				function sendMsg(){
					var msg = myID + ':' + height + ':' + width  + ':' + type;
					target.postMessage( msgID + msg, '*' );
					log( 'Sending msg to host page (' + msg + ')' );
				}

				var
					currentHeight = (customHeight !== undefined)  ? customHeight : getOffset('Height') + 2*bodyMargin,
					currentWidth  = (customWidth  !== undefined)  ? customWidth  : getOffset('Width')  + 2*bodyMargin,
					msg;

				if ((height !== currentHeight) || (doWidth && (width !== currentWidth))){
					height = currentHeight;
					width = currentWidth;
					log( 'Trigger event: ' + calleeMsg );

					sendMsg();
				}
			}

			function sendBreadCrumb(){

				var msg = myID + ':' + window.location.href + ':' + document.title;
				target.postMessage( msgIdBreadcrumb + msg, '*' );
				log( 'Sending breadcrumb msg to host page (' + msg + ')' );

			}


			function setupPublicMethods(){
				log( 'Enabling public methods' );

				window.iFrameSizer = {
					trigger: function(customHeight, customWidth){
						sendSize('jsTrigger','window.iFrameSizer.trigger()', customHeight, customWidth);
					},
					close: function(){
						sendSize('close','window.iFrameSizer.close()', 0, 0);
					}
				};
			}

			function setupMutationObserver(){

				function createMutationObserver(){
					var
						target = document.querySelector('body'),

						config = {
							childList: true, 
							attributes: true, 
							characterData: true, 
							subtree: true, 
							attributeOldValue: false, 
							characterDataOldValue: false
						},

						observer = new MutationObserver(function(mutations) {
							mutations.forEach(function(mutation) {
								sendSize( 'mutationObserver','mutationObserver: ' + mutation.target + ' ' + mutation.type );
							});
						});

					log('Setup MutationObserver');

					observer.observe(target, config);
				}

				var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

				if (MutationObserver)
					createMutationObserver();
				else {
					log('MutationObserver not supported in this browser!');
					initInterval();
				}
			}
				

			var bodyMargin,doWidth;

			if (msgID === event.data.substr(0,msgIdLen) && firstRun){ //Check msg ID
				init();
				sendSize('init','Init message from host page');
				firstRun = false;
			}
		}
		addEventListener('message', receiver);
	}
	catch(e){
		warn(e);
	}

})();

/* plugins/ToolsPlugin/js/iframeresizer/jquery.iframeResizer.js */

/*
 * File: jquery.iframeSizer.js
 * Desc: Force cross domain iframes to size to content.
 * Requires: iframeSizer.contentWindow.js to be loaded into the target frame.
 * Author: David J. Bradshaw - dave@bradshaw.net
 * Contributor: Jure Mav - jure.mav@gmail.com
 * Date: 2013-06-14
 */
( function($) {

	var
		msgId              = '[iFrameSizer]', //Must match iframe msg ID
		msgIdBreadcrumb	   = '[iFrameBreadcrumb]', //Must match iframe msg ID
		msgIdLen           = msgId.length,
		msgIdBreadcrumbLen = msgIdBreadcrumb.length,
		count              = 0,
		settings           = {},
		defaults           = {
			log                     : false,
			contentWindowBodyMargin : 8,
			doHeight                : true,
			doWidth                 : false,
			interval                : 0,
			enablePublicMethods     : false,
			autoWindowResize        : true,
			callback                : function(){},
			breadcrumbcallback		: function(){}
		};


	function setupRAF(){
		var
			vendors = ['moz', 'webkit', 'o', 'ms'],
			x;

		// Remove vendor prefixing if prefixed and break early if not
		for (x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		}

		// If not supported then just call callback
		if (!window.requestAnimationFrame){
			log(' RequestAnimationFrame not supported');
			window.requestAnimationFrame = function(callback){
				callback();
			};
		}

	}

	function log(msg){
		if (settings && settings.log && window.console){
			console.log(msgId + '[Host page]' + msg);
		}
	}

	setupRAF();

	$(window).bind('message',function(event){

		function receiver(msg) {
			function resize(){
				function setDimension(dimension){
					window.requestAnimationFrame(function(){
						messageData.iframe.style[dimension] = messageData[dimension] + 'px';
						log(
							' ' + messageData.iframe.id +
							' ' + dimension +
							' set to ' + messageData[dimension] + 'px'
						);
					});
				}

				if(settings.doHeight){
					setDimension('height');
				}

				if(settings.doWidth){
					setDimension('width');
				}
			}

			function processMsg(){

				var data	= msg.substr(msgIdLen).split(':');

				messageData = {
					iframe: document.getElementById(data[0]),
					height: data[1],
					width:  data[2],
					type:   data[3]
				};

				if ('close' === messageData.type){
					log('iFrame '+messageData.iframe.id+' removed.');
					$(messageData.iframe).remove();
				}
				else
					resize();
			}

			function processMsgBreadCrumb(){

				var data	= msg.substr(msgIdBreadcrumbLen).split(':');

				messageData = {
					url: data[0],
					title: data[1]
				};
			}

			var messageData = {};

			//check message is for us.
			if (msgId === '' + msg.substr(0,msgIdLen)){
				processMsg();
				settings.callback(messageData);
			}

			if (msgIdBreadcrumb === '' + msg.substr(0,msgIdBreadcrumbLen)){
				settings.breadcrumbcallback(messageData);
			}

			
		}

		receiver(event.originalEvent.data);
	});


	$.fn.iFrameSizer = function(options){

		settings = $.extend( {}, defaults, options );

		return this.each(function(){
			function isIframe(){
				return iframe.contentWindow ? true : false;
			}

			//We have to call trigger twice, as we can not be sure if all 
			//iframes have completed loading when this code runs.
			function init(){
				iframe.style.overflow = 'hidden';
				iframe.scrolling = 'no';

				$(iframe).bind('load',function(){
					trigger('iFrame.onload');
				});
				trigger('init');
			}

			function trigger(calleeMsg){

				function ensureHasId(){
					if (''===iframe.id){
						iframe.id = 'iFrameSizer' + count++;
						log(' Added missing iframe ID: '+iframe.id);
					}
				}

				function postMessageToIframe(){
					var msg = iframe.id +
							':' + settings.contentWindowBodyMargin +
							':' + settings.doWidth +
							':' + settings.log +
							':' + settings.interval +
							':' + settings.enablePublicMethods +
							':' + settings.autoWindowResize;
					log('[' + calleeMsg + '] Sending init msg to iframe ('+msg+')');
					iframe.contentWindow.postMessage( msgId + msg, '*' );
				}

				ensureHasId();
				postMessageToIframe();
			}

			var iframe = this;

			if (isIframe()){
				init();
			}
		});
	};

})( window.jQuery );

/* plugins/ToolsPlugin/js/video/videoControl.js */

/**
 * -----------------------------------------------------------------
 *
 *  Plugin's JavaScript sample.
 * 
 *  To include this file :
 *   - in a JSP : jcmsContext.addJavaScript("plugins/{Name}/js/plugin.js");
 *   - or in Java : implements PortalPolicyFilter.setupHeaders()
 * 
 *  You should use JSLint (http://www.jslint.com/) to ensure 
 *  you have a nice and clean JavaScript code.
 * 
 *  More information at :
 *  - http://jqueryboilerplate.com/
 *  - http://docs.jquery.com/Plugins/Authoring
 *  - See Bootstrap's code sample for advanced object wrapper
 * 
 * -----------------------------------------------------------------
 */
!function($){
	$(document).ready(function() {
		//var liensChapitres = $('.lienChapitre a');
		
	    
		$('.lienChapitre a').on('click',function (e) {
	        //e.preventDefault();
	        var videoId = $(this).attr('data-videoId');
	        var videoUrl = $(this).attr('data-videoUrl');
	        gotoVideoTime(videoId,videoUrl);
	    });	

		
		function gotoVideoTime(videoId,videoUrl){
			/* Le changement de l'attibut "data" de la balise "<object>" ne fonctionne pas sur certains navigateurs (Chrome)
			 * L'idée est de supprimer la balise object et de la recréer dans le DOM, sous le parent adhoc.
			 */
			var obj = $(videoId);
			
			// Récupération du parent de la balise <object>
			var parent = obj.parent();
	
			// On clone la balise <object>, on supprime l'<object> puis on rajoute le clone dans le parent.
			var newobj    = $(obj).clone();
			$(obj).remove();
			$(newobj).attr('data', videoUrl);
			$(parent).append(newobj);
			
		}
});
	
	
}(window.jQuery);

/* plugins/CorporateIdentityPlugin/js/doCarousel.js */

!function($){
	$(document).ready(function() {
		
		var playing = true;
		var clickArrow = false;

		// Initialisation
		$(".carousel").carousel({
			interval: 7000,
			pause: '' //Argument vide pour retirer la pause sur 'hover' (et qui relance le cycle après un mouseover)
		});
	
		// Pause du défilement lors du focus sur un lien du carousel
		/*$(".carousel a").focus(function(event) {
			$link = $(this);
			$carousel = $link.parents(".carousel");
			carouselPause($carousel);
		});*/
		

		
		// Gestion de la pagination
		$(".carousel").find(".carousel-pager a.pager-link").click(function() {
			// Récupération du lien de page et carousel
			$link = $(this);
			$carousel = $link.parents(".carousel");
			
		
			// Pour voir le focus lors de la pagination
			clickArrow = true;
			
			// Récupération de la page
			var page = parseInt($link.attr("data-page"));
			
			// On déplace le slider
			if(!isNaN(page)) {
				carouselPause($carousel);
				$carousel.carousel(page);
			}
			
			// Eviter de suivre le lien
			return false;
		});
		
		// Bouton suivant
		$(".carousel").find(".right-button").click(function() {
			$link = $(this);
			$carousel = $link.parents(".carousel");
		
			clickArrow = true;
			carouselPause($carousel);
			$carousel.carousel("next");
			
			return false;
		});

		
		// Bouton précédent
		$(".carousel").find(".left-button").click(function() {
			$link = $(this);
			$carousel = $link.parents(".carousel");
			
			clickArrow = true;
			carouselPause($carousel);
			$carousel.carousel("prev");
			
			return false;
		});

		
		// Bouton pause ou lecture
		$(".carousel").find(".pause-play").click(function() {
			$link = $(this);
			$carousel = $link.parents(".carousel");
			toogleCarousel($carousel);
			
			return false;
		});
		
		
		// * Encadrement des images actives
		$(".carousel").bind("slid", function() {
			$carousel = $(this);
			
			var $itemActive = $carousel.find(".item.active");
			var currentIndex = $itemActive.index();
			
			// * Ajout d'un title sur le numéro ainsi qu'une classe de soulignement			
			
			// On retire "- Elément actif" sur tous les liens ainsi que sur le soulignement
			$(".carousel-pager a.pager-link").each(function() {
				var $a = $(this);
				
				// Retrait de la classe
				$a.removeClass("underline");
				
				// Retait du contenu - Elément actif
				var title = $a.attr("title");
				$a.attr("title", title.replace("- Elément actif", ""));
			});
		
			// On ajoute "- Elément actif" à l'élément actif
			var pagerIndex = $itemActive.index();
			var $pagerActif = $(".carousel-pager a[data-page=" + pagerIndex + "]");
			
			if($pagerActif) {
				var currentTitle = $pagerActif.attr("title");
				$pagerActif.addClass("underline");
				$pagerActif.attr("title", currentTitle + " - Elément actif");
			}
			
			
			// Focus uniquement si on a utilisé les flèches
			if(clickArrow) {
				var id = "carousel-slid-focus";
				
				var $aForFocus = $itemActive.find("h2 a, h3 a");
				

				
				if($aForFocus.length != 0) {
					$aForFocus.get(0).focus();
				} else {
					// On a aucun lien pour le focus, on créait ce lien manuellement !
					// On retire la précédente ancre
					$("#" + id).remove();
					
					// Création du lien pour le focus
					$a = $("<a id=\"" + id + "\" href=\"#\" class=\"hide-accessible\">Début de l'élément du diaporama</a>");
					
					// On met le focus sur le <a> directement après l'élément
					$itemActive.prepend($a);
					$a.focus();
				}
				
				clickArrow = false;
			}
			
			// Ajout de l'encadrement
			$currentImage = $($carousel.find(".carousel-pager img")[currentIndex]);
			if($currentImage) {
				$carousel.find(".carousel-pager img").removeClass("active-img");
				$currentImage.addClass("active-img");
			}
		});
		
		
		// ** Fonction de mise en pause
		function toogleCarousel($carousel) {
			
			// Pause ou lecture
			if(playing) carouselPause($carousel);
			else carouselPlay($carousel);
		}
		
		
		// ** Fonction de mise en pause
		function carouselPause($carousel) {
			// On arrête le carousel
			$carousel.carousel('pause');
			
			// On change le bouton
			$carousel.find(".pause-play img.play").show();
			$carousel.find(".pause-play img.pause").hide();
			
			playing = false;
		}
		
		
		// ** Fonction de mise en lecture
		function carouselPlay($carousel) {
			// On ranime le carousel
			$carousel.carousel('cycle');
			
			// On change le bouton
			$carousel.find(".pause-play img.play").hide();
			$carousel.find(".pause-play img.pause").show();
			
			playing = true;
		}
	});
}(window.jQuery);
/* plugins/CorporateIdentityPlugin/js/scrollTop.js */

!function($){
	
	$(document).ready(function(){
		$(window).scroll(function(){
			if($(this).scrollTop() > 300){
				$(".back-to-top").fadeIn();
			}else{
				$(".back-to-top").fadeOut();
			}
		});
		
		$(".back-to-top").click(function(){
			$("html, body").animate({scrollTop:0},800);
			return false;
		});
	});
	
}(window.jQuery);
/* plugins/CorporateIdentityPlugin/js/slideBarSkinable.js */

!function ($) {
  $(function(){
    var $window = $(window)
    
    $(".openingArrow").click(function () {
    	var $this = $(this);
    	
    	$this.parent().find("div.targetArrow").slideToggle("fast");
    	
    	
    	if($this.find("img").hasClass("spr-chevron-blanc-on")){
    		
    		$img = $this.find("img.spr-chevron-blanc-on");
    		
    		$img.removeClass("spr-chevron-blanc-on");
    		$img.addClass("spr-chevron-blanc-off");
    		
    		//Inversion du texte
    		$this.find(".hide-title-text").addClass("hidden");
    		$this.find(".show-title-text").removeClass("hidden");
    		
    	} else if($this.find("img").hasClass("spr-chevron-blanc-off")){
    		
    		$img = $this.find("img.spr-chevron-blanc-off");
    		
    		//Inversion du texte
    		$this.find(".show-title-text").addClass("hidden");
    		$this.find(".hide-title-text").removeClass("hidden");
    		
    		$img.removeClass("spr-chevron-blanc-off");
    		$img.addClass("spr-chevron-blanc-on");
    		
    		
    	}
    });

    //Ouvrir par défaut les div ayant cette classe
    $(".targetArrow.open-at-beginning").show( "fast", function() {
        // Animation complete.
    	$(".spr-chevron-blanc-on").show();
		$(".spr-chevron-blanc-off").hide();
		
		//Inversion du texte
		$(".hide-title-text").removeClass("hidden");
		$(".show-title-text").addClass("hidden");
      });
    
  })
}(window.jQuery)
/* plugins/CorporateIdentityPlugin/js/slideBarWelcomeSection.js */

!function ($) {
  $(function(){
	  
	$(".clickable-part").click(function(event) { toogleBar(this, false); return false; });
	$(".focus-link-welcome").click(function(event) { toogleBar(this, false); return false;});
    $(".focus-link-welcome").focus(function(event) { toogleBar(this, true); return false;});
    
    // On ferme au chargement sauf si class d'un des parent est doNotCloseAfterLoad
    $(".menu-welcome-section-container .level-2").each(function(){
    	if(!$(this).parents().hasClass("doNotCloseAfterLoad")) {
        	$(this).hide();
    	}
    });

 
    function toogleBar(_this, isFocus) {
    	// On regarde si le bloc est ouvert ou fermé
    	var $this = $(_this);
    	var open = $this.parents(".level-1").children(".level-2").is(":visible");

    	// On ne ferme pas le menu avec la nvigation au clavier
    	if(isFocus && open) return false;
    		
		$this.parents(".level-1").children(".level-2").slideToggle("fast");
		
		
    	if(!open) {
    		$this.find("img.spr-chevron-blanc-off").hide();
    		$this.find("img.spr-chevron-blanc-on").show();
    	} else {
    		$this.find("img.spr-chevron-blanc-off").show();
    		$this.find("img.spr-chevron-blanc-on").hide();
    	}
    	
    	return false;
    }
  })
}(window.jQuery);
/* plugins/CorporateIdentityPlugin/js/columnizer/filterBar.js */

!function($) {
	// Plugin initialization on DOM ready
	$(document).ready(function($) {
		// Browser.isIE9() de JCMS ne filtre pas bien les versions d'Internet Explorer...
		if(jQuery.browser.msie && !(jQuery.browser.version == "9.0")) return;
		
			
		$checkboxes = $(".thematics-filter-container .checkboxes");

		$checkboxes.find("ul").easyListSplitter({
			colNumber : 3
		});

		$checkboxes.find("ul").css({
			"float" : "left",
			"margin" : "0 3px 0 3px"
		});
		$checkboxes.append("<div class=\"clear\"></div>");
	});
}(window.jQuery);
/* plugins/CorporateIdentityPlugin/js/columnizer/footer.js */

!function($) {
	// Plugin initialization on DOM ready
	$(document).ready(function($) {
		// Browser.isIE9() de JCMS ne filtre pas bien les versions d'Internet Explorer...
		if(jQuery.browser.msie && !(jQuery.browser.version == "9.0")) return;
		
		$checkboxes = $("footer .knowAllAboutDepartment");

		$checkboxes.find("ul").easyListSplitter({
			colNumber : 3
		});

		$checkboxes.find("ul").css({
			"float" : "left",
			"width" : "25%"
		});
		
		$checkboxes.append("<div class=\"clear\"></div>");
	});
}(window.jQuery);
/* plugins/CorporateIdentityPlugin/js/columnizer/jquery.easyListSplitter.js */

/*
 * 	easyListSplitter 1.0.2 - jQuery Plugin
 *	written by Andrea Cima Serniotti	
 *	http://www.madeincima.eu
 *
 *	Copyright (c) 2010 Andrea Cima Serniotti (http://www.madeincima.eu)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 
 /*
	To activate the plugin add the following code to your own js file:
	
	$('.your-list-class-name').easyListSplitter({ 
			colNumber: 3,
			direction: 'horizontal'
	});
	
 */

var j = 1;
 
(function(jQuery) {
	jQuery.fn.easyListSplitter = function(options) {
	
	var defaults = {			
		colNumber: 2, // Insert here the number of columns you want. Consider that the plugin will create the number of cols requested only if there are enough items in the list.
		direction: 'vertical'
	};
			
	this.each(function() {
		
		var obj = jQuery(this);
		var settings = jQuery.extend(defaults, options);
		var totalListElements = jQuery(this).children('li').size();
		var baseColItems = Math.ceil(totalListElements / settings.colNumber);
		var listClass = jQuery(this).attr('class');
		
		// -------- Create List Elements given colNumber ------------------------------------------------------------------------------
		
		for (i=1;i<=settings.colNumber;i++)
		{	
			if(i==1){
				jQuery(this).addClass('listCol1').wrap('<div class="listContainer'+j+'"></div>');
			} else if(jQuery(this).is('ul')){ // Check whether the list is ordered or unordered
				jQuery(this).parents('.listContainer'+j).append('<ul class="listCol'+i+'"></ul>');
			} else{
				jQuery(this).parents('.listContainer'+j).append('<ol class="listCol'+i+'"></ol>');
			}
				jQuery('.listContainer'+j+' > ul,.listContainer'+j+' > ol').addClass(listClass);
		}
		
		var listItem = 0;
		var k = 1;
		var l = 0;	
		
		if(settings.direction == 'vertical'){ // -------- Append List Elements to the respective listCol  - Vertical -------------------------------
			
			jQuery(this).children('li').each(function(){
				listItem = listItem+1;
				if (listItem > baseColItems*(settings.colNumber-1) ){
					jQuery(this).parents('.listContainer'+j).find('.listCol'+settings.colNumber).append(this);
				} 
				else {
					if(listItem<=(baseColItems*k)){
						jQuery(this).parents('.listContainer'+j).find('.listCol'+k).append(this);
					} 
					else{
						jQuery(this).parents('.listContainer'+j).find('.listCol'+(k+1)).append(this);
						k = k+1;
					}
				}
			});
			
			jQuery('.listContainer'+j).find('ol,ul').each(function(){
				if(jQuery(this).children().size() == 0) {
				jQuery(this).remove();
				}
			});	
			
		} else{  // -------- Append List Elements to the respective listCol  - Horizontal ----------------------------------------------------------
			
			jQuery(this).children('li').each(function(){
				l = l+1;

				if(l <= settings.colNumber){
					jQuery(this).parents('.listContainer'+j).find('.listCol'+l).append(this);
					
				} else {
					l = 1;
					jQuery(this).parents('.listContainer'+j).find('.listCol'+l).append(this);
				}				
			});
		}
		
		jQuery('.listContainer'+j).find('ol:last,ul:last').addClass('last'); // Set class last on the last UL or OL	
		j = j+1;
		
	});
	};
})(jQuery);
/* plugins/CorporateIdentityPlugin/js/columnizer/pqfSameTopic.js */

!function($) {
	// Plugin initialization on DOM ready
	$(document).ready(function($) {
		// Browser.isIE9() de JCMS ne filtre pas bien les versions d'Internet Explorer...
		if(jQuery.browser.msie && !(jQuery.browser.version == "9.0")) return;
		
		$div = $(".same-topic-container");

		$div.find("ul").easyListSplitter({
			colNumber : 2
		});

		$div.find("ul").css({
			"float" : "left",
			"width": "50%"
		});
		// Ajout du clear avant le lien
		$div.find(".link").prepend("<div class=\"clear\"></div>");
	});
}(window.jQuery);
/* plugins/CorporateIdentityPlugin/js/custom-scrollbar-plugin/jquery.mCustomScrollbar.min.js */

(function(c){var b={init:function(e){var f={set_width:false,set_height:false,horizontalScroll:false,scrollInertia:950,mouseWheel:true,mouseWheelPixels:"auto",autoDraggerLength:true,autoHideScrollbar:false,snapAmount:null,snapOffset:0,scrollButtons:{enable:false,scrollType:"continuous",scrollSpeed:"auto",scrollAmount:40},advanced:{updateOnBrowserResize:true,updateOnContentResize:false,autoExpandHorizontalScroll:false,autoScrollOnFocus:true,normalizeMouseWheelDelta:false},contentTouchScroll:true,callbacks:{onScrollStart:function(){},onScroll:function(){},onTotalScroll:function(){},onTotalScrollBack:function(){},onTotalScrollOffset:0,onTotalScrollBackOffset:0,whileScrolling:function(){}},theme:"light"},e=c.extend(true,f,e);return this.each(function(){var m=c(this);if(e.set_width){m.css("width",e.set_width)}if(e.set_height){m.css("height",e.set_height)}if(!c(document).data("mCustomScrollbar-index")){c(document).data("mCustomScrollbar-index","1")}else{var t=parseInt(c(document).data("mCustomScrollbar-index"));c(document).data("mCustomScrollbar-index",t+1)}m.wrapInner("<div class='mCustomScrollBox mCS-"+e.theme+"' id='mCSB_"+c(document).data("mCustomScrollbar-index")+"' style='position:relative; height:100%; overflow:hidden; max-width:100%;' />").addClass("mCustomScrollbar _mCS_"+c(document).data("mCustomScrollbar-index"));var g=m.children(".mCustomScrollBox");if(e.horizontalScroll){g.addClass("mCSB_horizontal").wrapInner("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />");var k=g.children(".mCSB_h_wrapper");k.wrapInner("<div class='mCSB_container' style='position:absolute; left:0;' />").children(".mCSB_container").css({width:k.children().outerWidth(),position:"relative"}).unwrap()}else{g.wrapInner("<div class='mCSB_container' style='position:relative; top:0;' />")}var o=g.children(".mCSB_container");if(c.support.touch){o.addClass("mCS_touch")}o.after("<div class='mCSB_scrollTools' style='position:absolute;'><div class='mCSB_draggerContainer'><div class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' style='position:relative;'></div></div><div class='mCSB_draggerRail'></div></div></div>");var l=g.children(".mCSB_scrollTools"),h=l.children(".mCSB_draggerContainer"),q=h.children(".mCSB_dragger");if(e.horizontalScroll){q.data("minDraggerWidth",q.width())}else{q.data("minDraggerHeight",q.height())}if(e.scrollButtons.enable){if(e.horizontalScroll){l.prepend("<a class='mCSB_buttonLeft' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonRight' oncontextmenu='return false;'></a>")}else{l.prepend("<a class='mCSB_buttonUp' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonDown' oncontextmenu='return false;'></a>")}}g.bind("scroll",function(){if(!m.is(".mCS_disabled")){g.scrollTop(0).scrollLeft(0)}});m.data({mCS_Init:true,mCustomScrollbarIndex:c(document).data("mCustomScrollbar-index"),horizontalScroll:e.horizontalScroll,scrollInertia:e.scrollInertia,scrollEasing:"mcsEaseOut",mouseWheel:e.mouseWheel,mouseWheelPixels:e.mouseWheelPixels,autoDraggerLength:e.autoDraggerLength,autoHideScrollbar:e.autoHideScrollbar,snapAmount:e.snapAmount,snapOffset:e.snapOffset,scrollButtons_enable:e.scrollButtons.enable,scrollButtons_scrollType:e.scrollButtons.scrollType,scrollButtons_scrollSpeed:e.scrollButtons.scrollSpeed,scrollButtons_scrollAmount:e.scrollButtons.scrollAmount,autoExpandHorizontalScroll:e.advanced.autoExpandHorizontalScroll,autoScrollOnFocus:e.advanced.autoScrollOnFocus,normalizeMouseWheelDelta:e.advanced.normalizeMouseWheelDelta,contentTouchScroll:e.contentTouchScroll,onScrollStart_Callback:e.callbacks.onScrollStart,onScroll_Callback:e.callbacks.onScroll,onTotalScroll_Callback:e.callbacks.onTotalScroll,onTotalScrollBack_Callback:e.callbacks.onTotalScrollBack,onTotalScroll_Offset:e.callbacks.onTotalScrollOffset,onTotalScrollBack_Offset:e.callbacks.onTotalScrollBackOffset,whileScrolling_Callback:e.callbacks.whileScrolling,bindEvent_scrollbar_drag:false,bindEvent_content_touch:false,bindEvent_scrollbar_click:false,bindEvent_mousewheel:false,bindEvent_buttonsContinuous_y:false,bindEvent_buttonsContinuous_x:false,bindEvent_buttonsPixels_y:false,bindEvent_buttonsPixels_x:false,bindEvent_focusin:false,bindEvent_autoHideScrollbar:false,mCSB_buttonScrollRight:false,mCSB_buttonScrollLeft:false,mCSB_buttonScrollDown:false,mCSB_buttonScrollUp:false});if(e.horizontalScroll){if(m.css("max-width")!=="none"){if(!e.advanced.updateOnContentResize){e.advanced.updateOnContentResize=true}}}else{if(m.css("max-height")!=="none"){var s=false,r=parseInt(m.css("max-height"));if(m.css("max-height").indexOf("%")>=0){s=r,r=m.parent().height()*s/100}m.css("overflow","hidden");g.css("max-height",r)}}m.mCustomScrollbar("update");if(e.advanced.updateOnBrowserResize){var i,j=c(window).width(),u=c(window).height();c(window).bind("resize."+m.data("mCustomScrollbarIndex"),function(){if(i){clearTimeout(i)}i=setTimeout(function(){if(!m.is(".mCS_disabled")&&!m.is(".mCS_destroyed")){var w=c(window).width(),v=c(window).height();if(j!==w||u!==v){if(m.css("max-height")!=="none"&&s){g.css("max-height",m.parent().height()*s/100)}m.mCustomScrollbar("update");j=w;u=v}}},150)})}if(e.advanced.updateOnContentResize){var p;if(e.horizontalScroll){var n=o.outerWidth()}else{var n=o.outerHeight()}p=setInterval(function(){if(e.horizontalScroll){if(e.advanced.autoExpandHorizontalScroll){o.css({position:"absolute",width:"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:o.outerWidth(),position:"relative"}).unwrap()}var v=o.outerWidth()}else{var v=o.outerHeight()}if(v!=n){m.mCustomScrollbar("update");n=v}},300)}})},update:function(){var n=c(this),k=n.children(".mCustomScrollBox"),q=k.children(".mCSB_container");q.removeClass("mCS_no_scrollbar");n.removeClass("mCS_disabled mCS_destroyed");k.scrollTop(0).scrollLeft(0);var y=k.children(".mCSB_scrollTools"),o=y.children(".mCSB_draggerContainer"),m=o.children(".mCSB_dragger");if(n.data("horizontalScroll")){var A=y.children(".mCSB_buttonLeft"),t=y.children(".mCSB_buttonRight"),f=k.width();if(n.data("autoExpandHorizontalScroll")){q.css({position:"absolute",width:"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:q.outerWidth(),position:"relative"}).unwrap()}var z=q.outerWidth()}else{var w=y.children(".mCSB_buttonUp"),g=y.children(".mCSB_buttonDown"),r=k.height(),i=q.outerHeight()}if(i>r&&!n.data("horizontalScroll")){y.css("display","block");var s=o.height();if(n.data("autoDraggerLength")){var u=Math.round(r/i*s),l=m.data("minDraggerHeight");if(u<=l){m.css({height:l})}else{if(u>=s-10){var p=s-10;m.css({height:p})}else{m.css({height:u})}}m.children(".mCSB_dragger_bar").css({"line-height":m.height()+"px"})}var B=m.height(),x=(i-r)/(s-B);n.data("scrollAmount",x).mCustomScrollbar("scrolling",k,q,o,m,w,g,A,t);var D=Math.abs(q.position().top);n.mCustomScrollbar("scrollTo",D,{scrollInertia:0,trigger:"internal"})}else{if(z>f&&n.data("horizontalScroll")){y.css("display","block");var h=o.width();if(n.data("autoDraggerLength")){var j=Math.round(f/z*h),C=m.data("minDraggerWidth");if(j<=C){m.css({width:C})}else{if(j>=h-10){var e=h-10;m.css({width:e})}else{m.css({width:j})}}}var v=m.width(),x=(z-f)/(h-v);n.data("scrollAmount",x).mCustomScrollbar("scrolling",k,q,o,m,w,g,A,t);var D=Math.abs(q.position().left);n.mCustomScrollbar("scrollTo",D,{scrollInertia:0,trigger:"internal"})}else{k.unbind("mousewheel focusin");if(n.data("horizontalScroll")){m.add(q).css("left",0)}else{m.add(q).css("top",0)}y.css("display","none");q.addClass("mCS_no_scrollbar");n.data({bindEvent_mousewheel:false,bindEvent_focusin:false})}}},scrolling:function(h,p,m,j,w,e,A,v){var k=c(this);if(!k.data("bindEvent_scrollbar_drag")){var n,o;if(c.support.msPointer){j.bind("MSPointerDown",function(H){H.preventDefault();k.data({on_drag:true});j.addClass("mCSB_dragger_onDrag");var G=c(this),J=G.offset(),F=H.originalEvent.pageX-J.left,I=H.originalEvent.pageY-J.top;if(F<G.width()&&F>0&&I<G.height()&&I>0){n=I;o=F}});c(document).bind("MSPointerMove."+k.data("mCustomScrollbarIndex"),function(H){H.preventDefault();if(k.data("on_drag")){var G=j,J=G.offset(),F=H.originalEvent.pageX-J.left,I=H.originalEvent.pageY-J.top;D(n,o,I,F)}}).bind("MSPointerUp."+k.data("mCustomScrollbarIndex"),function(x){k.data({on_drag:false});j.removeClass("mCSB_dragger_onDrag")})}else{j.bind("mousedown touchstart",function(H){H.preventDefault();H.stopImmediatePropagation();var G=c(this),K=G.offset(),F,J;if(H.type==="touchstart"){var I=H.originalEvent.touches[0]||H.originalEvent.changedTouches[0];F=I.pageX-K.left;J=I.pageY-K.top}else{k.data({on_drag:true});j.addClass("mCSB_dragger_onDrag");F=H.pageX-K.left;J=H.pageY-K.top}if(F<G.width()&&F>0&&J<G.height()&&J>0){n=J;o=F}}).bind("touchmove",function(H){H.preventDefault();H.stopImmediatePropagation();var K=H.originalEvent.touches[0]||H.originalEvent.changedTouches[0],G=c(this),J=G.offset(),F=K.pageX-J.left,I=K.pageY-J.top;D(n,o,I,F)});c(document).bind("mousemove."+k.data("mCustomScrollbarIndex"),function(H){if(k.data("on_drag")){var G=j,J=G.offset(),F=H.pageX-J.left,I=H.pageY-J.top;D(n,o,I,F)}}).bind("mouseup."+k.data("mCustomScrollbarIndex"),function(x){k.data({on_drag:false});j.removeClass("mCSB_dragger_onDrag")})}k.data({bindEvent_scrollbar_drag:true})}function D(G,H,I,F){if(k.data("horizontalScroll")){k.mCustomScrollbar("scrollTo",(j.position().left-(H))+F,{moveDragger:true,trigger:"internal"})}else{k.mCustomScrollbar("scrollTo",(j.position().top-(G))+I,{moveDragger:true,trigger:"internal"})}}if(c.support.touch&&k.data("contentTouchScroll")){if(!k.data("bindEvent_content_touch")){var l,B,r,s,u,C,E;p.bind("touchstart",function(x){x.stopImmediatePropagation();l=x.originalEvent.touches[0]||x.originalEvent.changedTouches[0];B=c(this);r=B.offset();u=l.pageX-r.left;s=l.pageY-r.top;C=s;E=u});p.bind("touchmove",function(x){x.preventDefault();x.stopImmediatePropagation();l=x.originalEvent.touches[0]||x.originalEvent.changedTouches[0];B=c(this).parent();r=B.offset();u=l.pageX-r.left;s=l.pageY-r.top;if(k.data("horizontalScroll")){k.mCustomScrollbar("scrollTo",E-u,{trigger:"internal"})}else{k.mCustomScrollbar("scrollTo",C-s,{trigger:"internal"})}})}}if(!k.data("bindEvent_scrollbar_click")){m.bind("click",function(F){var x=(F.pageY-m.offset().top)*k.data("scrollAmount"),y=c(F.target);if(k.data("horizontalScroll")){x=(F.pageX-m.offset().left)*k.data("scrollAmount")}if(y.hasClass("mCSB_draggerContainer")||y.hasClass("mCSB_draggerRail")){k.mCustomScrollbar("scrollTo",x,{trigger:"internal",scrollEasing:"draggerRailEase"})}});k.data({bindEvent_scrollbar_click:true})}if(k.data("mouseWheel")){if(!k.data("bindEvent_mousewheel")){h.bind("mousewheel",function(H,J){var G,F=k.data("mouseWheelPixels"),x=Math.abs(p.position().top),I=j.position().top,y=m.height()-j.height();if(k.data("normalizeMouseWheelDelta")){if(J<0){J=-1}else{J=1}}if(F==="auto"){F=100+Math.round(k.data("scrollAmount")/2)}if(k.data("horizontalScroll")){I=j.position().left;y=m.width()-j.width();x=Math.abs(p.position().left)}if((J>0&&I!==0)||(J<0&&I!==y)){H.preventDefault();H.stopImmediatePropagation()}G=x-(J*F);k.mCustomScrollbar("scrollTo",G,{trigger:"internal"})});k.data({bindEvent_mousewheel:true})}}if(k.data("scrollButtons_enable")){if(k.data("scrollButtons_scrollType")==="pixels"){if(k.data("horizontalScroll")){v.add(A).unbind("mousedown touchstart MSPointerDown mouseup MSPointerUp mouseout MSPointerOut touchend",i,g);k.data({bindEvent_buttonsContinuous_x:false});if(!k.data("bindEvent_buttonsPixels_x")){v.bind("click",function(x){x.preventDefault();q(Math.abs(p.position().left)+k.data("scrollButtons_scrollAmount"))});A.bind("click",function(x){x.preventDefault();q(Math.abs(p.position().left)-k.data("scrollButtons_scrollAmount"))});k.data({bindEvent_buttonsPixels_x:true})}}else{e.add(w).unbind("mousedown touchstart MSPointerDown mouseup MSPointerUp mouseout MSPointerOut touchend",i,g);k.data({bindEvent_buttonsContinuous_y:false});if(!k.data("bindEvent_buttonsPixels_y")){e.bind("click",function(x){x.preventDefault();q(Math.abs(p.position().top)+k.data("scrollButtons_scrollAmount"))});w.bind("click",function(x){x.preventDefault();q(Math.abs(p.position().top)-k.data("scrollButtons_scrollAmount"))});k.data({bindEvent_buttonsPixels_y:true})}}function q(x){if(!j.data("preventAction")){j.data("preventAction",true);k.mCustomScrollbar("scrollTo",x,{trigger:"internal"})}}}else{if(k.data("horizontalScroll")){v.add(A).unbind("click");k.data({bindEvent_buttonsPixels_x:false});if(!k.data("bindEvent_buttonsContinuous_x")){v.bind("mousedown touchstart MSPointerDown",function(y){y.preventDefault();var x=z();k.data({mCSB_buttonScrollRight:setInterval(function(){k.mCustomScrollbar("scrollTo",Math.abs(p.position().left)+x,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var i=function(x){x.preventDefault();clearInterval(k.data("mCSB_buttonScrollRight"))};v.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",i);A.bind("mousedown touchstart MSPointerDown",function(y){y.preventDefault();var x=z();k.data({mCSB_buttonScrollLeft:setInterval(function(){k.mCustomScrollbar("scrollTo",Math.abs(p.position().left)-x,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var g=function(x){x.preventDefault();clearInterval(k.data("mCSB_buttonScrollLeft"))};A.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",g);k.data({bindEvent_buttonsContinuous_x:true})}}else{e.add(w).unbind("click");k.data({bindEvent_buttonsPixels_y:false});if(!k.data("bindEvent_buttonsContinuous_y")){e.bind("mousedown touchstart MSPointerDown",function(y){y.preventDefault();var x=z();k.data({mCSB_buttonScrollDown:setInterval(function(){k.mCustomScrollbar("scrollTo",Math.abs(p.position().top)+x,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var t=function(x){x.preventDefault();clearInterval(k.data("mCSB_buttonScrollDown"))};e.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",t);w.bind("mousedown touchstart MSPointerDown",function(y){y.preventDefault();var x=z();k.data({mCSB_buttonScrollUp:setInterval(function(){k.mCustomScrollbar("scrollTo",Math.abs(p.position().top)-x,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var f=function(x){x.preventDefault();clearInterval(k.data("mCSB_buttonScrollUp"))};w.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",f);k.data({bindEvent_buttonsContinuous_y:true})}}function z(){var x=k.data("scrollButtons_scrollSpeed");if(k.data("scrollButtons_scrollSpeed")==="auto"){x=Math.round((k.data("scrollInertia")+100)/40)}return x}}}if(k.data("autoScrollOnFocus")){if(!k.data("bindEvent_focusin")){h.bind("focusin",function(){h.scrollTop(0).scrollLeft(0);var x=c(document.activeElement);if(x.is("input,textarea,select,button,a[tabindex],area,object")){var G=p.position().top,y=x.position().top,F=h.height()-x.outerHeight();if(k.data("horizontalScroll")){G=p.position().left;y=x.position().left;F=h.width()-x.outerWidth()}if(G+y<0||G+y>F){k.mCustomScrollbar("scrollTo",y,{trigger:"internal"})}}});k.data({bindEvent_focusin:true})}}if(k.data("autoHideScrollbar")){if(!k.data("bindEvent_autoHideScrollbar")){h.bind("mouseenter",function(x){h.addClass("mCS-mouse-over");d.showScrollbar.call(h.children(".mCSB_scrollTools"))}).bind("mouseleave touchend",function(x){h.removeClass("mCS-mouse-over");if(x.type==="mouseleave"){d.hideScrollbar.call(h.children(".mCSB_scrollTools"))}});k.data({bindEvent_autoHideScrollbar:true})}}},scrollTo:function(e,f){var i=c(this),o={moveDragger:false,trigger:"external",callbacks:true,scrollInertia:i.data("scrollInertia"),scrollEasing:i.data("scrollEasing")},f=c.extend(o,f),p,g=i.children(".mCustomScrollBox"),k=g.children(".mCSB_container"),r=g.children(".mCSB_scrollTools"),j=r.children(".mCSB_draggerContainer"),h=j.children(".mCSB_dragger"),t=draggerSpeed=f.scrollInertia,q,s,m,l;if(!k.hasClass("mCS_no_scrollbar")){i.data({mCS_trigger:f.trigger});if(i.data("mCS_Init")){f.callbacks=false}if(e||e===0){if(typeof(e)==="number"){if(f.moveDragger){p=e;if(i.data("horizontalScroll")){e=h.position().left*i.data("scrollAmount")}else{e=h.position().top*i.data("scrollAmount")}draggerSpeed=0}else{p=e/i.data("scrollAmount")}}else{if(typeof(e)==="string"){var v;if(e==="top"){v=0}else{if(e==="bottom"&&!i.data("horizontalScroll")){v=k.outerHeight()-g.height()}else{if(e==="left"){v=0}else{if(e==="right"&&i.data("horizontalScroll")){v=k.outerWidth()-g.width()}else{if(e==="first"){v=i.find(".mCSB_container").find(":first")}else{if(e==="last"){v=i.find(".mCSB_container").find(":last")}else{v=i.find(e)}}}}}}if(v.length===1){if(i.data("horizontalScroll")){e=v.position().left}else{e=v.position().top}p=e/i.data("scrollAmount")}else{p=e=v}}}if(i.data("horizontalScroll")){if(i.data("onTotalScrollBack_Offset")){s=-i.data("onTotalScrollBack_Offset")}if(i.data("onTotalScroll_Offset")){l=g.width()-k.outerWidth()+i.data("onTotalScroll_Offset")}if(p<0){p=e=0;clearInterval(i.data("mCSB_buttonScrollLeft"));if(!s){q=true}}else{if(p>=j.width()-h.width()){p=j.width()-h.width();e=g.width()-k.outerWidth();clearInterval(i.data("mCSB_buttonScrollRight"));if(!l){m=true}}else{e=-e}}var n=i.data("snapAmount");if(n){e=Math.round(e/n)*n-i.data("snapOffset")}d.mTweenAxis.call(this,h[0],"left",Math.round(p),draggerSpeed,f.scrollEasing);d.mTweenAxis.call(this,k[0],"left",Math.round(e),t,f.scrollEasing,{onStart:function(){if(f.callbacks&&!i.data("mCS_tweenRunning")){u("onScrollStart")}if(i.data("autoHideScrollbar")){d.showScrollbar.call(r)}},onUpdate:function(){if(f.callbacks){u("whileScrolling")}},onComplete:function(){if(f.callbacks){u("onScroll");if(q||(s&&k.position().left>=s)){u("onTotalScrollBack")}if(m||(l&&k.position().left<=l)){u("onTotalScroll")}}h.data("preventAction",false);i.data("mCS_tweenRunning",false);if(i.data("autoHideScrollbar")){if(!g.hasClass("mCS-mouse-over")){d.hideScrollbar.call(r)}}}})}else{if(i.data("onTotalScrollBack_Offset")){s=-i.data("onTotalScrollBack_Offset")}if(i.data("onTotalScroll_Offset")){l=g.height()-k.outerHeight()+i.data("onTotalScroll_Offset")}if(p<0){p=e=0;clearInterval(i.data("mCSB_buttonScrollUp"));if(!s){q=true}}else{if(p>=j.height()-h.height()){p=j.height()-h.height();e=g.height()-k.outerHeight();clearInterval(i.data("mCSB_buttonScrollDown"));if(!l){m=true}}else{e=-e}}var n=i.data("snapAmount");if(n){e=Math.round(e/n)*n-i.data("snapOffset")}d.mTweenAxis.call(this,h[0],"top",Math.round(p),draggerSpeed,f.scrollEasing);d.mTweenAxis.call(this,k[0],"top",Math.round(e),t,f.scrollEasing,{onStart:function(){if(f.callbacks&&!i.data("mCS_tweenRunning")){u("onScrollStart")}if(i.data("autoHideScrollbar")){d.showScrollbar.call(r)}},onUpdate:function(){if(f.callbacks){u("whileScrolling")}},onComplete:function(){if(f.callbacks){u("onScroll");if(q||(s&&k.position().top>=s)){u("onTotalScrollBack")}if(m||(l&&k.position().top<=l)){u("onTotalScroll")}}h.data("preventAction",false);i.data("mCS_tweenRunning",false);if(i.data("autoHideScrollbar")){if(!g.hasClass("mCS-mouse-over")){d.hideScrollbar.call(r)}}}})}if(i.data("mCS_Init")){i.data({mCS_Init:false})}}}function u(w){this.mcs={top:k.position().top,left:k.position().left,draggerTop:h.position().top,draggerLeft:h.position().left,topPct:Math.round((100*Math.abs(k.position().top))/Math.abs(k.outerHeight()-g.height())),leftPct:Math.round((100*Math.abs(k.position().left))/Math.abs(k.outerWidth()-g.width()))};switch(w){case"onScrollStart":i.data("mCS_tweenRunning",true).data("onScrollStart_Callback").call(i,this.mcs);break;case"whileScrolling":i.data("whileScrolling_Callback").call(i,this.mcs);break;case"onScroll":i.data("onScroll_Callback").call(i,this.mcs);break;case"onTotalScrollBack":i.data("onTotalScrollBack_Callback").call(i,this.mcs);break;case"onTotalScroll":i.data("onTotalScroll_Callback").call(i,this.mcs);break}}},stop:function(){var g=c(this),e=g.children().children(".mCSB_container"),f=g.children().children().children().children(".mCSB_dragger");d.mTweenAxisStop.call(this,e[0]);d.mTweenAxisStop.call(this,f[0])},disable:function(e){var j=c(this),f=j.children(".mCustomScrollBox"),h=f.children(".mCSB_container"),g=f.children(".mCSB_scrollTools"),i=g.children().children(".mCSB_dragger");f.unbind("mousewheel focusin mouseenter mouseleave touchend");h.unbind("touchstart touchmove");if(e){if(j.data("horizontalScroll")){i.add(h).css("left",0)}else{i.add(h).css("top",0)}}g.css("display","none");h.addClass("mCS_no_scrollbar");j.data({bindEvent_mousewheel:false,bindEvent_focusin:false,bindEvent_content_touch:false,bindEvent_autoHideScrollbar:false}).addClass("mCS_disabled")},destroy:function(){var e=c(this);e.removeClass("mCustomScrollbar _mCS_"+e.data("mCustomScrollbarIndex")).addClass("mCS_destroyed").children().children(".mCSB_container").unwrap().children().unwrap().siblings(".mCSB_scrollTools").remove();c(document).unbind("mousemove."+e.data("mCustomScrollbarIndex")+" mouseup."+e.data("mCustomScrollbarIndex")+" MSPointerMove."+e.data("mCustomScrollbarIndex")+" MSPointerUp."+e.data("mCustomScrollbarIndex"));c(window).unbind("resize."+e.data("mCustomScrollbarIndex"))}},d={showScrollbar:function(){this.stop().animate({opacity:1},"fast")},hideScrollbar:function(){this.stop().animate({opacity:0},"fast")},mTweenAxis:function(g,i,h,f,o,y){var y=y||{},v=y.onStart||function(){},p=y.onUpdate||function(){},w=y.onComplete||function(){};var n=t(),l,j=0,r=g.offsetTop,s=g.style;if(i==="left"){r=g.offsetLeft}var m=h-r;q();e();function t(){if(window.performance&&window.performance.now){return window.performance.now()}else{if(window.performance&&window.performance.webkitNow){return window.performance.webkitNow()}else{if(Date.now){return Date.now()}else{return new Date().getTime()}}}}function x(){if(!j){v.call()}j=t()-n;u();if(j>=g._time){g._time=(j>g._time)?j+l-(j-g._time):j+l-1;if(g._time<j+1){g._time=j+1}}if(g._time<f){g._id=_request(x)}else{w.call()}}function u(){if(f>0){g.currVal=k(g._time,r,m,f,o);s[i]=Math.round(g.currVal)+"px"}else{s[i]=h+"px"}p.call()}function e(){l=1000/60;g._time=j+l;_request=(!window.requestAnimationFrame)?function(z){u();return setTimeout(z,0.01)}:window.requestAnimationFrame;g._id=_request(x)}function q(){if(g._id==null){return}if(!window.requestAnimationFrame){clearTimeout(g._id)}else{window.cancelAnimationFrame(g._id)}g._id=null}function k(B,A,F,E,C){switch(C){case"linear":return F*B/E+A;break;case"easeOutQuad":B/=E;return -F*B*(B-2)+A;break;case"easeInOutQuad":B/=E/2;if(B<1){return F/2*B*B+A}B--;return -F/2*(B*(B-2)-1)+A;break;case"easeOutCubic":B/=E;B--;return F*(B*B*B+1)+A;break;case"easeOutQuart":B/=E;B--;return -F*(B*B*B*B-1)+A;break;case"easeOutQuint":B/=E;B--;return F*(B*B*B*B*B+1)+A;break;case"easeOutCirc":B/=E;B--;return F*Math.sqrt(1-B*B)+A;break;case"easeOutSine":return F*Math.sin(B/E*(Math.PI/2))+A;break;case"easeOutExpo":return F*(-Math.pow(2,-10*B/E)+1)+A;break;case"mcsEaseOut":var D=(B/=E)*B,z=D*B;return A+F*(0.499999999999997*z*D+-2.5*D*D+5.5*z+-6.5*D+4*B);break;case"draggerRailEase":B/=E/2;if(B<1){return F/2*B*B*B+A}B-=2;return F/2*(B*B*B+2)+A;break}}},mTweenAxisStop:function(e){if(e._id==null){return}if(!window.requestAnimationFrame){clearTimeout(e._id)}else{window.cancelAnimationFrame(e._id)}e._id=null},rafPolyfill:function(){var f=["ms","moz","webkit","o"],e=f.length;while(--e>-1&&!window.requestAnimationFrame){window.requestAnimationFrame=window[f[e]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[f[e]+"CancelAnimationFrame"]||window[f[e]+"CancelRequestAnimationFrame"]}}};d.rafPolyfill.call();c.support.touch=!!("ontouchstart" in window);c.support.msPointer=window.navigator.msPointerEnabled;var a=("https:"==document.location.protocol)?"https:":"http:";c.event.special.mousewheel||document.write('<script src="'+a+'//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.0.6/jquery.mousewheel.min.js"><\/script>');c.fn.mCustomScrollbar=function(e){if(b[e]){return b[e].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof e==="object"||!e){return b.init.apply(this,arguments)}else{c.error("Method "+e+" does not exist")}}}})(jQuery);
/* plugins/CorporateIdentityPlugin/js/custom-scrollbar-plugin/jquery.mousewheel.min.js */

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);
/* plugins/CorporateIdentityPlugin/js/form/fileInputChange.js */

!function ($) {
	$(function(){
		
		// On affiche le bon design si on a du Javascript => On garde le natif dans le cadre de IE
		if (!$.browser.msie) {
			$(".basic-form-file-input").each(function() {
				var $this = $(this);
				$this.find(".button, .value").show();
				$this.removeClass("basic-form-file-input").addClass("form-file-input");
			});
		}
		
		$(".form-file-input input[type=file]").bind("change", function(event) { 
		  $input = jQuery(event.target);
		  
		  $divInput = $input.parent(".form-file-input");
		  
		  if($divInput.length > 0) {
		    $textDiv = $divInput.find(".value");
		    var value = $input.val();
		    
		    var startIndex = (value.indexOf('\\') >= 0 ? value.lastIndexOf('\\') : value.lastIndexOf('/'));
				  var filename = value.substring(startIndex);
				  if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
				    filename = filename.substring(1);
				  }
				  $textDiv = $divInput.find(".value").html(filename);
		
		  }
		});

	})
}(window.jQuery);
/* plugins/CorporateIdentityPlugin/js/magnific-popup/jquery.magnific-popup.js */

/*! Magnific Popup - v0.9.7 - 2013-10-10
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2013 Dmitry Semenov; */
;(function($) {

/*>>core*/
/**
 * 
 * Magnific Popup Core JS file
 * 
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',
	NS = 'mfp',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'mfp-ready',
	REMOVING_CLASS = 'mfp-removing',
	PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


/**
 * Private vars 
 */
var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
	MagnificPopup = function(){},
	_isJQ = !!(window.jQuery),
	_prevStatus,
	_window = $(window),
	_body,
	_document,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/**
 * Private functions
 */
var _mfpOn = function(name, f) {
		mfp.ev.on(NS + name + EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = 'mfp-'+className;
		if(html) {
			el.innerHTML = html;
		}
		if(!raw) {
			el = $(el);
			if(appendTo) {
				el.appendTo(appendTo);
			}
		} else if(appendTo) {
			appendTo.appendChild(el);
		}
		return el;
	},
	_mfpTrigger = function(e, data) {
		mfp.ev.triggerHandler(NS + e, data);

		if(mfp.st.callbacks) {
			// converts "mfpEventName" to "eventName" callback and triggers it if it's present
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
			}
		}
	},
	_setFocus = function() {
		(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
	},
	_getCloseBtn = function(type) {
		if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
			mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
			_currPopupType = type;
		}
		return mfp.currTemplate.closeBtn;
	},
	// Initialize Magnific Popup only when called at least once
	_checkInstance = function() {
		if(!$.magnificPopup.instance) {
			mfp = new MagnificPopup();
			mfp.init();
			$.magnificPopup.instance = mfp;
		}
	},
	// Check to close popup or not
	// "target" is an element that was clicked
	_checkIfClose = function(target) {

		if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
			return;
		}

		var closeOnContent = mfp.st.closeOnContentClick;
		var closeOnBg = mfp.st.closeOnBgClick;

		if(closeOnContent && closeOnBg) {
			return true;
		} else {

			// We close the popup if click is on close button or on preloader. Or if there is no content.
			if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
				return true;
			}

			// if click is outside the content
			if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
				if(closeOnBg) {
					// last check, if the clicked element is in DOM, (in case it's removed onclick)
					if( $.contains(document, target) ) {
						return true;
					}
				}
			} else if(closeOnContent) {
				return true;
			}

		}
		return false;
	},
	// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportsTransitions = function() {
		var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms','O','Moz','Webkit']; // 'v' for vendor

		if( s['transition'] !== undefined ) {
			return true; 
		}
			
		while( v.length ) {
			if( v.pop() + 'Transition' in s ) {
				return true;
			}
		}
				
		return false;
	};



/**
 * Public functions
 */
MagnificPopup.prototype = {

	constructor: MagnificPopup,

	/**
	 * Initializes Magnific Popup plugin. 
	 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		mfp.isIE7 = appVersion.indexOf("MSIE 7.") !== -1; 
		mfp.isIE8 = appVersion.indexOf("MSIE 8.") !== -1;
		mfp.isLowIE = mfp.isIE7 || mfp.isIE8;
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		mfp.supportsTransition = supportsTransitions();

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of detecting this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
		_body = $(document.body);
		_document = $(document);

		mfp.popupsCache = {};
	},

	/**
	 * Opens popup
	 * @param  data [description]
	 */
	open: function(data) {

		var i;

		if(data.isObj === false) { 
			// convert jQuery collection to array to avoid conflicts later
			mfp.items = data.items.toArray();

			mfp.index = 0;
			var items = data.items,
				item;
			for(i = 0; i < items.length; i++) {
				item = items[i];
				if(item.parsed) {
					item = item.el[0];
				}
				if(item === data.el[0]) {
					mfp.index = i;
					break;
				}
			}
		} else {
			mfp.items = $.isArray(data.items) ? data.items : [data.items];
			mfp.index = data.index || 0;
		}

		// if popup is already opened - we just update the content
		if(mfp.isOpen) {
			mfp.updateItemHTML();
			return;
		}
		
		mfp.types = []; 
		_wrapClasses = '';
		if(data.mainEl && data.mainEl.length) {
			mfp.ev = data.mainEl.eq(0);
		} else {
			mfp.ev = _document;
		}

		if(data.key) {
			if(!mfp.popupsCache[data.key]) {
				mfp.popupsCache[data.key] = {};
			}
			mfp.currTemplate = mfp.popupsCache[data.key];
		} else {
			mfp.currTemplate = {};
		}



		mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
		mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;


		if(mfp.st.modal) {
			mfp.st.closeOnContentClick = false;
			mfp.st.closeOnBgClick = false;
			mfp.st.showCloseBtn = false;
			mfp.st.enableEscapeKey = false;
		}
		

		// Building markup
		// main containers are created only once
		if(!mfp.bgOverlay) {

			// Dark overlay
			mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
				mfp.close();
			});

			mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
				if(_checkIfClose(e.target)) {
					mfp.close();
				}
			});

			mfp.container = _getEl('container', mfp.wrap);
		}

		mfp.contentContainer = _getEl('content');
		if(mfp.st.preloader) {
			mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
		}


		// Initializing modules
		var modules = $.magnificPopup.modules;
		for(i = 0; i < modules.length; i++) {
			var n = modules[i];
			n = n.charAt(0).toUpperCase() + n.slice(1);
			mfp['init'+n].call(mfp);
		}
		_mfpTrigger('BeforeOpen');


		if(mfp.st.showCloseBtn) {
			// Close button
			if(!mfp.st.closeBtnInside) {
				mfp.wrap.append( _getCloseBtn() );
			} else {
				_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
					values.close_replaceWith = _getCloseBtn(item.type);
				});
				_wrapClasses += ' mfp-close-btn-in';
			}
		}

		if(mfp.st.alignTop) {
			_wrapClasses += ' mfp-align-top';
		}

	

		if(mfp.fixedContentPos) {
			mfp.wrap.css({
				overflow: mfp.st.overflowY,
				overflowX: 'hidden',
				overflowY: mfp.st.overflowY
			});
		} else {
			mfp.wrap.css({ 
				top: _window.scrollTop(),
				position: 'absolute'
			});
		}
		if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
			mfp.bgOverlay.css({
				height: _document.height(),
				position: 'absolute'
			});
		}

		

		if(mfp.st.enableEscapeKey) {
			// Close on ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});
		}

		_window.on('resize' + EVENT_NS, function() {
			mfp.updateSize();
		});


		if(!mfp.st.closeOnContentClick) {
			_wrapClasses += ' mfp-auto-cursor';
		}
		
		if(_wrapClasses)
			mfp.wrap.addClass(_wrapClasses);


		// this triggers recalculation of layout, so we get it once to not to trigger twice
		var windowHeight = mfp.wH = _window.height();

		
		var windowStyles = {};

		if( mfp.fixedContentPos ) {
            if(mfp._hasScrollBar(windowHeight)){
                var s = mfp._getScrollbarSize();
                if(s) {
                    windowStyles.paddingRight = s;
                }
            }
        }

		if(mfp.fixedContentPos) {
			if(!mfp.isIE7) {
				windowStyles.overflow = 'hidden';
			} else {
				// ie7 double-scroll bug
				$('body, html').css('overflow', 'hidden');
			}
		}

		
		
		var classesToadd = mfp.st.mainClass;
		if(mfp.isIE7) {
			classesToadd += ' mfp-ie7';
		}
		if(classesToadd) {
			mfp._addClassToMFP( classesToadd );
		}

		// add content
		mfp.updateItemHTML();

		_mfpTrigger('BuildControls');


		// remove scrollbar, add padding e.t.c
		$('html').css(windowStyles);
		
		// add everything to DOM
		mfp.bgOverlay.add(mfp.wrap).prependTo( document.body );



		// Save last focused element
		mfp._lastFocusedEl = document.activeElement;
		
		// Wait for next cycle to allow CSS transition
		setTimeout(function() {
			
			if(mfp.content) {
				mfp._addClassToMFP(READY_CLASS);
				_setFocus();
			} else {
				// if content is not defined (not loaded e.t.c) we add class only for BG
				mfp.bgOverlay.addClass(READY_CLASS);
			}
			
			// Trap the focus in popup
			_document.on('focusin' + EVENT_NS, function (e) {
				if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
					_setFocus();
					return false;
				}
			});

		}, 16);

		mfp.isOpen = true;
		mfp.updateSize(windowHeight);
		_mfpTrigger(OPEN_EVENT);

		return data;
	},

	/**
	 * Closes the popup
	 */
	close: function() {
		if(!mfp.isOpen) return;
		_mfpTrigger(BEFORE_CLOSE_EVENT);

		mfp.isOpen = false;
		// for CSS3 animation
		if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
			mfp._addClassToMFP(REMOVING_CLASS);
			setTimeout(function() {
				mfp._close();
			}, mfp.st.removalDelay);
		} else {
			mfp._close();
		}
	},

	/**
	 * Helper for close() function
	 */
	_close: function() {
		_mfpTrigger(CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

		mfp.bgOverlay.detach();
		mfp.wrap.detach();
		mfp.container.empty();

		if(mfp.st.mainClass) {
			classesToRemove += mfp.st.mainClass + ' ';
		}

		mfp._removeClassFromMFP(classesToRemove);

		if(mfp.fixedContentPos) {
			var windowStyles = {paddingRight: ''};
			if(mfp.isIE7) {
				$('body, html').css('overflow', '');
			} else {
				windowStyles.overflow = '';
			}
			$('html').css(windowStyles);
		}
		
		_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
		mfp.ev.off(EVENT_NS);


		// clean up DOM elements that aren't removed
		mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
		mfp.bgOverlay.attr('class', 'mfp-bg');
		mfp.container.attr('class', 'mfp-container');

		// remove close button from target element
		if(mfp.st.showCloseBtn &&
		(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
			if(mfp.currTemplate.closeBtn)
				mfp.currTemplate.closeBtn.detach();
		}


		if(mfp._lastFocusedEl) {
			$(mfp._lastFocusedEl).focus(); // put tab focus back
		}
		mfp.currItem = null;	
		mfp.content = null;
		mfp.currTemplate = null;
		mfp.prevHeight = 0;

		_mfpTrigger(AFTER_CLOSE_EVENT);
	},
	
	updateSize: function(winHeight) {

		if(mfp.isIOS) {
			// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			mfp.wrap.css('height', height);
			mfp.wH = height;
		} else {
			mfp.wH = winHeight || _window.height();
		}
		// Fixes #84: popup incorrectly positioned with position:relative on body
		if(!mfp.fixedContentPos) {
			mfp.wrap.css('height', mfp.wH);
		}

		_mfpTrigger('Resize');

	},

	/**
	 * Set content of popup based on current index
	 */
	updateItemHTML: function() {
		var item = mfp.items[mfp.index];

		// Detach and perform modifications
		mfp.contentContainer.detach();

		if(mfp.content)
			mfp.content.detach();

		if(!item.parsed) {
			item = mfp.parseEl( mfp.index );
		}

		var type = item.type;	

		_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
		// BeforeChange event works like so:
		// _mfpOn('BeforeChange', function(e, prevType, newType) { });
		
		mfp.currItem = item;

		

		

		if(!mfp.currTemplate[type]) {
			var markup = mfp.st[type] ? mfp.st[type].markup : false;

			// allows to modify markup
			_mfpTrigger('FirstMarkupParse', markup);

			if(markup) {
				mfp.currTemplate[type] = $(markup);
			} else {
				// if there is no markup found we just define that template is parsed
				mfp.currTemplate[type] = true;
			}
		}

		if(_prevContentType && _prevContentType !== item.type) {
			mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
		}
		
		var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
		mfp.appendContent(newContent, type);

		item.preloaded = true;

		_mfpTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;
		
		// Append container back after its content changed
		mfp.container.prepend(mfp.contentContainer);

		_mfpTrigger('AfterChange');
	},


	/**
	 * Set HTML content of popup
	 */
	appendContent: function(newContent, type) {
		mfp.content = newContent;
		
		if(newContent) {
			if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
				mfp.currTemplate[type] === true) {
				// if there is no markup, we just append close button element inside
				if(!mfp.content.find('.mfp-close').length) {
					mfp.content.append(_getCloseBtn());
				}
			} else {
				mfp.content = newContent;
			}
		} else {
			mfp.content = '';
		}

		_mfpTrigger(BEFORE_APPEND_EVENT);
		mfp.container.addClass('mfp-'+type+'-holder');

		mfp.contentContainer.append(mfp.content);
	},



	
	/**
	 * Creates Magnific Popup data object based on given data
	 * @param  {int} index Index of item to parse
	 */
	parseEl: function(index) {
		var item = mfp.items[index],
			type = item.type;

		if(item.tagName) {
			item = { el: $(item) };
		} else {
			item = { data: item, src: item.src };
		}

		if(item.el) {
			var types = mfp.types;

			// check for 'mfp-TYPE' class
			for(var i = 0; i < types.length; i++) {
				if( item.el.hasClass('mfp-'+types[i]) ) {
					type = types[i];
					break;
				}
			}

			item.src = item.el.attr('data-mfp-src');
			if(!item.src) {
				item.src = item.el.attr('href');
			}
		}

		item.type = type || mfp.st.type || 'inline';
		item.index = index;
		item.parsed = true;
		mfp.items[index] = item;
		_mfpTrigger('ElementParse', item);

		return mfp.items[index];
	},


	/**
	 * Initializes single popup or a group of popups
	 */
	addGroup: function(el, options) {
		var eHandler = function(e) {
			e.mfpEl = this;
			mfp._openClick(e, el, options);
		};

		if(!options) {
			options = {};
		} 

		var eName = 'click.magnificPopup';
		options.mainEl = el;
		
		if(options.items) {
			options.isObj = true;
			el.off(eName).on(eName, eHandler);
		} else {
			options.isObj = false;
			if(options.delegate) {
				el.off(eName).on(eName, options.delegate , eHandler);
			} else {
				options.items = el;
				el.off(eName).on(eName, eHandler);
			}
		}
	},
	_openClick: function(e, el, options) {
		var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


		if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey ) ) {
			return;
		}

		var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

		if(disableOn) {
			if($.isFunction(disableOn)) {
				if( !disableOn.call(mfp) ) {
					return true;
				}
			} else { // else it's number
				if( _window.width() < disableOn ) {
					return true;
				}
			}
		}
		
		if(e.type) {
			e.preventDefault();

			// This will prevent popup from closing if element is inside and popup is already opened
			if(mfp.isOpen) {
				e.stopPropagation();
			}
		}
			

		options.el = $(e.mfpEl);
		if(options.delegate) {
			options.items = el.find(options.delegate);
		}
		mfp.open(options);
	},


	/**
	 * Updates text on preloader
	 */
	updateStatus: function(status, text) {

		if(mfp.preloader) {
			if(_prevStatus !== status) {
				mfp.container.removeClass('mfp-s-'+_prevStatus);
			}

			if(!text && status === 'loading') {
				text = mfp.st.tLoading;
			}

			var data = {
				status: status,
				text: text
			};
			// allows to modify status
			_mfpTrigger('UpdateStatus', data);

			status = data.status;
			text = data.text;

			mfp.preloader.html(text);

			mfp.preloader.find('a').on('click', function(e) {
				e.stopImmediatePropagation();
			});

			mfp.container.addClass('mfp-s-'+status);
			_prevStatus = status;
		}
	},


	/*
		"Private" helpers that aren't private at all
	 */
	_addClassToMFP: function(cName) {
		mfp.bgOverlay.addClass(cName);
		mfp.wrap.addClass(cName);
	},
	_removeClassFromMFP: function(cName) {
		this.bgOverlay.removeClass(cName);
		mfp.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
	},
	_parseMarkup: function(template, values, item) {
		var arr;
		if(item.data) {
			values = $.extend(item.data, values);
		}
		_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			if(arr.length > 1) {
				var el = template.find(EVENT_NS + '-'+arr[0]);

				if(el.length > 0) {
					var attr = arr[1];
					if(attr === 'replaceWith') {
						if(el[0] !== value[0]) {
							el.replaceWith(value);
						}
					} else if(attr === 'img') {
						if(el.is('img')) {
							el.attr('src', value);
						} else {
							el.replaceWith( '<img src="'+value+'" class="' + el.attr('class') + '" />' );
						}
					} else {
						el.attr(arr[1], value);
					}
				}

			} else {
				template.find(EVENT_NS + '-'+key).html(value);
			}
		});
	},

	_getScrollbarSize: function() {
		// thx David
		if(mfp.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.id = "mfp-sbm";
			scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
			document.body.appendChild(scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return mfp.scrollbarSize;
	}

}; /* MagnificPopup core prototype end */




/**
 * Public static functions
 */
$.magnificPopup = {
	instance: null,
	proto: MagnificPopup.prototype,
	modules: [],

	open: function(options, index) {
		_checkInstance();	

		if(!options) {
			options = {};
		} else {
			options = $.extend(true, {}, options);
		}
			

		options.isObj = true;
		options.index = index || 0;
		return this.instance.open(options);
	},

	close: function() {
		return $.magnificPopup.instance && $.magnificPopup.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.magnificPopup.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);			
		this.modules.push(name);
	},

	defaults: {   

		// Info about options is in docs:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options
		
		disableOn: 0,	

		key: null,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // CSS selector of input to focus after popup is opened
		
		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true, 

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,
	
		removalDelay: 0,
		
		fixedContentPos: 'auto', 
	
		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',

		tClose: 'Fermeture (Esc)',

		tLoading: 'Chargement...'

	}
};



$.fn.magnificPopup = function(options) {
	_checkInstance();

	var jqEl = $(this);

	// We call some API method of first param is a string
	if (typeof options === "string" ) {

		if(options === 'open') {
			var items,
				itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
				index = parseInt(arguments[1], 10) || 0;

			if(itemOpts.items) {
				items = itemOpts.items[index];
			} else {
				items = jqEl;
				if(itemOpts.delegate) {
					items = items.find(itemOpts.delegate);
				}
				items = items.eq( index );
			}
			mfp._openClick({mfpEl:items}, jqEl, itemOpts);
		} else {
			if(mfp.isOpen)
				mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
		}

	} else {
		// clone options obj
		options = $.extend(true, {}, options);
		
		/*
		 * As Zepto doesn't support .data() method for objects 
		 * and it works only in normal browsers
		 * we assign "options" object directly to the DOM element. FTW!
		 */
		if(_isJQ) {
			jqEl.data('magnificPopup', options);
		} else {
			jqEl[0].magnificPopup = options;
		}

		mfp.addGroup(jqEl, options);

	}
	return jqEl;
};


//Quick benchmark
/*
var start = performance.now(),
	i,
	rounds = 1000;

for(i = 0; i < rounds; i++) {

}
console.log('Test #1:', performance.now() - start);

start = performance.now();
for(i = 0; i < rounds; i++) {

}
console.log('Test #2:', performance.now() - start);
*/


/*>>core*/

/*>>inline*/

var INLINE_NS = 'inline',
	_hiddenClass,
	_inlinePlaceholder, 
	_lastInlineElement,
	_putInlineElementsBack = function() {
		if(_lastInlineElement) {
			_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
			_lastInlineElement = null;
		}
	};

$.magnificPopup.registerModule(INLINE_NS, {
	options: {
		hiddenClass: 'hide', // will be appended with `mfp-` prefix
		markup: '',
		tNotFound: 'Content not found'
	},
	proto: {

		initInline: function() {
			mfp.types.push(INLINE_NS);

			_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
				_putInlineElementsBack();
			});
		},

		getInline: function(item, template) {

			_putInlineElementsBack();

			if(item.src) {
				var inlineSt = mfp.st.inline,
					el = $(item.src);

				if(el.length) {

					// If target element has parent - we replace it with placeholder and put it back after popup is closed
					var parent = el[0].parentNode;
					if(parent && parent.tagName) {
						if(!_inlinePlaceholder) {
							_hiddenClass = inlineSt.hiddenClass;
							_inlinePlaceholder = _getEl(_hiddenClass);
							_hiddenClass = 'mfp-'+_hiddenClass;
						}
						// replace target inline element with placeholder
						_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
					}

					mfp.updateStatus('ready');
				} else {
					mfp.updateStatus('error', inlineSt.tNotFound);
					el = $('<div>');
				}

				item.inlineElement = el;
				return el;
			}

			mfp.updateStatus('ready');
			mfp._parseMarkup(template, {}, item);
			return template;
		}
	}
});

/*>>inline*/

/*>>ajax*/
var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function() {
		if(_ajaxCur) {
			_body.removeClass(_ajaxCur);
		}
	},
	_destroyAjaxRequest = function() {
		_removeAjaxCursor();
		if(mfp.req) {
			mfp.req.abort();
		}
	};

$.magnificPopup.registerModule(AJAX_NS, {

	options: {
		settings: null,
		cursor: 'mfp-ajax-cur',
		tError: '<a href="%url%">The content</a> could not be loaded.'
	},

	proto: {
		initAjax: function() {
			mfp.types.push(AJAX_NS);
			_ajaxCur = mfp.st.ajax.cursor;

			_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
			_mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
		},
		getAjax: function(item) {

			if(_ajaxCur)
				_body.addClass(_ajaxCur);

			mfp.updateStatus('loading');

			var opts = $.extend({
				url: item.src,
				success: function(data, textStatus, jqXHR) {
					var temp = {
						data:data,
						xhr:jqXHR
					};

					_mfpTrigger('ParseAjax', temp);

					mfp.appendContent( $(temp.data), AJAX_NS );

					item.finished = true;

					_removeAjaxCursor();

					_setFocus();

					setTimeout(function() {
						mfp.wrap.addClass(READY_CLASS);
					}, 16);

					mfp.updateStatus('ready');

					_mfpTrigger('AjaxContentAdded');
				},
				error: function() {
					_removeAjaxCursor();
					item.finished = item.loadError = true;
					mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
				}
			}, mfp.st.ajax.settings);

			mfp.req = $.ajax(opts);

			return '';
		}
	}
});





	

/*>>ajax*/

/*>>image*/
var _imgInterval,
	_getTitle = function(item) {
		if(item.data && item.data.title !== undefined) 
			return item.data.title;

		var src = mfp.st.image.titleSrc;

		if(src) {
			if($.isFunction(src)) {
				return src.call(mfp, item);
			} else if(item.el) {
				return item.el.attr(src) || '';
			}
		}
		return '';
	};

$.magnificPopup.registerModule('image', {

	options: {
		markup: '<div class="mfp-figure">'+
					'<div class="mfp-close"></div>'+
					'<div class="mfp-img"></div>'+
					'<div class="mfp-bottom-bar">'+
						'<div class="mfp-title"></div>'+
						'<div class="mfp-counter"></div>'+
					'</div>'+
				'</div>',
		cursor: 'mfp-zoom-out-cur',
		titleSrc: 'title', 
		verticalFit: true,
		tError: '<a href="%url%">The image</a> could not be loaded.'
	},

	proto: {
		initImage: function() {
			var imgSt = mfp.st.image,
				ns = '.image';

			mfp.types.push('image');

			_mfpOn(OPEN_EVENT+ns, function() {
				if(mfp.currItem.type === 'image' && imgSt.cursor) {
					_body.addClass(imgSt.cursor);
				}
			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(imgSt.cursor) {
					_body.removeClass(imgSt.cursor);
				}
				_window.off('resize' + EVENT_NS);
			});

			_mfpOn('Resize'+ns, mfp.resizeImage);
			if(mfp.isLowIE) {
				_mfpOn('AfterChange', mfp.resizeImage);
			}
		},
		resizeImage: function() {
			var item = mfp.currItem;
			if(!item || !item.img) return;

			if(mfp.st.image.verticalFit) {
				var decr = 0;
				// fix box-sizing in ie7/8
				if(mfp.isLowIE) {
					decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
				}
				item.img.css('max-height', mfp.wH-decr);
			}
		},
		_onImageHasSize: function(item) {
			if(item.img) {
				
				item.hasSize = true;

				if(_imgInterval) {
					clearInterval(_imgInterval);
				}
				
				item.isCheckingImgSize = false;

				_mfpTrigger('ImageHasSize', item);

				if(item.imgHidden) {
					if(mfp.content)
						mfp.content.removeClass('mfp-loading');
					
					item.imgHidden = false;
				}

			}
		},

		/**
		 * Function that loops until the image has size to display elements that rely on it asap
		 */
		findImageSize: function(item) {

			var counter = 0,
				img = item.img[0],
				mfpSetInterval = function(delay) {

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					// decelerating interval that checks for size of an image
					_imgInterval = setInterval(function() {
						if(img.naturalWidth > 0) {
							mfp._onImageHasSize(item);
							return;
						}

						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							mfpSetInterval(10);
						} else if(counter === 40) {
							mfpSetInterval(50);
						} else if(counter === 100) {
							mfpSetInterval(500);
						}
					}, delay);
				};

			mfpSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.mfploader');
							
							if(item === mfp.currItem){
								mfp._onImageHasSize(item);

								mfp.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;

							_mfpTrigger('ImageLoadComplete');
							
						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onLoadError();
							}
						}
					}
				},

				// image error handler
				onLoadError = function() {
					if(item) {
						item.img.off('.mfploader');
						if(item === mfp.currItem){
							mfp._onImageHasSize(item);
							mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loaded = true;
						item.loadError = true;
					}
				},
				imgSt = mfp.st.image;


			var el = template.find('.mfp-img');
			if(el.length) {
				var img = document.createElement('img');
				img.className = 'mfp-img';
				item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
				img.src = item.src;

				// without clone() "error" event is not firing when IMG is replaced by new IMG
				// TODO: find a way to avoid such cloning
				if(el.is('img')) {
					item.img = item.img.clone();
				}
				if(item.img[0].naturalWidth > 0) {
					item.hasSize = true;
				}
			}

			mfp._parseMarkup(template, {
				title: _getTitle(item),
				img_replaceWith: item.img
			}, item);

			mfp.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('mfp-loading');
					mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('mfp-loading');
					mfp.updateStatus('ready');
				}
				return template;
			}

			mfp.updateStatus('loading');
			item.loading = true;

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('mfp-loading');
				mfp.findImageSize(item);
			} 

			return template;
		}
	}
});



/*>>image*/

/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;		
	};

$.magnificPopup.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = mfp.st.zoom,
				ns = '.zoom',
				image;
				
			if(!zoomSt.enabled || !mfp.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					mfp.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_mfpOn('BuildControls'+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);
					mfp.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it
					
					image = mfp._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image); 
					
					animatedImg.css( mfp._getOffset() );

					mfp.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( mfp._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_mfpTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images 

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);

					mfp.st.removalDelay = duration;

					if(!image) {
						image = mfp._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}
					
					
					animatedImg.css( mfp._getOffset(true) );
					mfp.wrap.append(animatedImg);
					mfp.content.css('visibility', 'hidden');
					
					setTimeout(function() {
						animatedImg.css( mfp._getOffset() );
					}, 16);
				}

			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}	
			});
		},

		_allowZoom: function() {
			return mfp.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(mfp.currItem.hasSize) {
				return mfp.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = mfp.currItem.img;
			} else {
				el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*
			
			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',
	
	_fixIframeBugs = function(isShowing) {
		if(mfp.currTemplate[IFRAME_NS]) {
			var el = mfp.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) { 
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(mfp.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com', 
				id: 'v=', 
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					} 
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = mfp.st.iframe;
				
			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});
			
			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}
			mfp._parseMarkup(template, dataObj, item);

			mfp.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = mfp.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Précédent (Flèche gauche)',
		tNext: 'Suivant (Flèche droite)',
		tCounter: '%curr% sur %total%'
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.mfp-gallery',
				supportsFastClick = Boolean($.fn.mfpFastClick);

			mfp.direction = true; // true - next, false - prev
			
			if(!gSt || !gSt.enabled ) return false;

			_wrapClasses += ' mfp-gallery';

			_mfpOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					mfp.wrap.on('click'+ns, '.mfp-img', function() {
						if(mfp.items.length > 1) {
							mfp.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						mfp.prev();
					} else if (e.keyCode === 39) {
						mfp.next();
					}
				});
			});

			_mfpOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
				}
			});

			_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = mfp.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_mfpOn('BuildControls' + ns, function() {
				if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
					var markup = gSt.arrowMarkup,
						arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),			
						arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					var eName = supportsFastClick ? 'mfpFastClick' : 'click';
					arrowLeft[eName](function() {
						mfp.prev();
					});			
					arrowRight[eName](function() {
						mfp.next();
					});	

					// Polyfill for :before and :after (adds elements with classes mfp-a and mfp-b)
					if(mfp.isIE7) {
						_getEl('b', arrowLeft[0], false, true);
						_getEl('a', arrowLeft[0], false, true);
						_getEl('b', arrowRight[0], false, true);
						_getEl('a', arrowRight[0], false, true);
					}

					mfp.container.append(arrowLeft.add(arrowRight));
				}
			});

			_mfpOn(CHANGE_EVENT+ns, function() {
				if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

				mfp._preloadTimeout = setTimeout(function() {
					mfp.preloadNearbyImages();
					mfp._preloadTimeout = null;
				}, 16);		
			});


			_mfpOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				mfp.wrap.off('click'+ns);
			
				if(mfp.arrowLeft && supportsFastClick) {
					mfp.arrowLeft.add(mfp.arrowRight).destroyMfpFastClick();
				}
				mfp.arrowRight = mfp.arrowLeft = null;
			});

		}, 
		next: function() {
			mfp.direction = true;
			mfp.index = _getLoopedId(mfp.index + 1);
			mfp.updateItemHTML();
		},
		prev: function() {
			mfp.direction = false;
			mfp.index = _getLoopedId(mfp.index - 1);
			mfp.updateItemHTML();
		},
		goTo: function(newIndex) {
			mfp.direction = (newIndex >= mfp.index);
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				mfp._preloadItem(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				mfp._preloadItem(mfp.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(mfp.items[index].preloaded) {
				return;
			}

			var item = mfp.items[index];
			if(!item.parsed) {
				item = mfp.parseEl( index );
			}

			_mfpTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
					item.hasSize = true;
				}).on('error.mfploader', function() {
					item.hasSize = true;
					item.loadError = true;
					_mfpTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		}
	}
});

/*
Touch Support that might be implemented some day

addSwipeGesture: function() {
	var startX,
		moved,
		multipleTouches;

		return;

	var namespace = '.mfp',
		addEventNames = function(pref, down, move, up, cancel) {
			mfp._tStart = pref + down + namespace;
			mfp._tMove = pref + move + namespace;
			mfp._tEnd = pref + up + namespace;
			mfp._tCancel = pref + cancel + namespace;
		};

	if(window.navigator.msPointerEnabled) {
		addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
	} else if('ontouchstart' in window) {
		addEventNames('touch', 'start', 'move', 'end', 'cancel');
	} else {
		return;
	}
	_window.on(mfp._tStart, function(e) {
		var oE = e.originalEvent;
		multipleTouches = moved = false;
		startX = oE.pageX || oE.changedTouches[0].pageX;
	}).on(mfp._tMove, function(e) {
		if(e.originalEvent.touches.length > 1) {
			multipleTouches = e.originalEvent.touches.length;
		} else {
			//e.preventDefault();
			moved = true;
		}
	}).on(mfp._tEnd + ' ' + mfp._tCancel, function(e) {
		if(moved && !multipleTouches) {
			var oE = e.originalEvent,
				diff = startX - (oE.pageX || oE.changedTouches[0].pageX);

			if(diff > 20) {
				mfp.next();
			} else if(diff < -20) {
				mfp.prev();
			}
		}
	});
},
*/


/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.magnificPopup.registerModule(RETINA_NS, {
	options: {
		replaceSrc: function(item) {
			return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
		},
		ratio: 1 // Function or number.  Set to 1 to disable.
	},
	proto: {
		initRetina: function() {
			if(window.devicePixelRatio > 1) {

				var st = mfp.st.retina,
					ratio = st.ratio;

				ratio = !isNaN(ratio) ? ratio : ratio();

				if(ratio > 1) {
					_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
						item.img.css({
							'max-width': item.img[0].naturalWidth / ratio,
							'width': '100%'
						});
					});
					_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
						item.src = st.replaceSrc(item, ratio);
					});
				}
			}

		}
	}
});

/*>>retina*/

/*>>fastclick*/
/**
 * FastClick event implementation. (removes 300ms delay on touch devices)
 * Based on https://developers.google.com/mobile/articles/fast_buttons
 *
 * You may use it outside the Magnific Popup by calling just:
 *
 * $('.your-el').mfpFastClick(function() {
 *     console.log('Clicked!');
 * });
 *
 * To unbind:
 * $('.your-el').destroyMfpFastClick();
 * 
 * 

 * Note that it's a very basic and simple implementation, it blocks ghost click on the same element where it was bound.
 * If you need something more advanced, use plugin by FT Labs https://github.com/ftlabs/fastclick
 * 
 */

(function() {
	var ghostClickDelay = 1000,
		supportsTouch = 'ontouchstart' in window,
		unbindTouchMove = function() {
			_window.off('touchmove'+ns+' touchend'+ns);
		},
		eName = 'mfpFastClick',
		ns = '.'+eName;


	// As Zepto.js doesn't have an easy way to add custom events (like jQuery), so we implement it in this way
	$.fn.mfpFastClick = function(callback) {

		return $(this).each(function() {

			var elem = $(this),
				lock;

			if( supportsTouch ) {

				var timeout,
					startX,
					startY,
					pointerMoved,
					point,
					numPointers;

				elem.on('touchstart' + ns, function(e) {
					pointerMoved = false;
					numPointers = 1;

					point = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0];
					startX = point.clientX;
					startY = point.clientY;

					_window.on('touchmove'+ns, function(e) {
						point = e.originalEvent ? e.originalEvent.touches : e.touches;
						numPointers = point.length;
						point = point[0];
						if (Math.abs(point.clientX - startX) > 10 ||
							Math.abs(point.clientY - startY) > 10) {
							pointerMoved = true;
							unbindTouchMove();
						}
					}).on('touchend'+ns, function(e) {
						unbindTouchMove();
						if(pointerMoved || numPointers > 1) {
							return;
						}
						lock = true;
						e.preventDefault();
						clearTimeout(timeout);
						timeout = setTimeout(function() {
							lock = false;
						}, ghostClickDelay);
						callback();
					});
				});

			}

			elem.on('click' + ns, function() {
				if(!lock) {
					callback();
				}
			});
		});
	};

	$.fn.destroyMfpFastClick = function() {
		$(this).off('touchstart' + ns + ' click' + ns);
		if(supportsTouch) _window.off('touchmove'+ns+' touchend'+ns);
	};
})();

/*>>fastclick*/
})(window.jQuery || window.Zepto);
/* plugins/CorporateIdentityPlugin/js/types/AbstractPortletSkinable/slideBarSkinable.js */

!function ($) {
  $(function(){
    var $window = $(window)
    
    $(".openingArrow").click(function () {
    	$(this).parent().find("div.targetArrow").slideToggle("fast");
    	if($(this).find("img").hasClass("spr-chevron-blanc-on")){
    		$(this).find("img").removeClass("spr-chevron-blanc-on");
    		$(this).find("img").addClass("spr-chevron-blanc-off");
    	} else if($(this).find("img").hasClass("spr-chevron-blanc-off")){
    		$(this).find("img").removeClass("spr-chevron-blanc-off");
    		$(this).find("img").addClass("spr-chevron-blanc-on");
    	}
    });  
  })
}(window.jQuery)
/* plugins/CorporateIdentityPlugin/js/types/AbstractPortletSkinable/thematicsFilterBar.js */

!function ($) {
  $(function(){
    
	$(".openingThematics .focus-link").keydown(function() {
		if(event.keyCode == 39) {
			toggleMenu(this, false);
		}
		return false;
	});
		  
	$(".openingThematics,.openingThematics a, .openingThematics img").click(function (event) {
		event.preventDefault();
		toggleMenu($(".openingThematics"), true);
		return false;
	});
    
    
    function toggleMenu(_this, click) {
    	var $this = $(_this);
    	
    	// Affichage/masquage du contenu
    	if(click) {
	    	$this.parent().find("div.targetArrow").slideToggle("fast");
	    } else {
	    	$this.parents(".openingThematics").parent().find("div.targetArrow").slideToggle("fast");
	    }
	    
    	var open = $this.find("img.spr-chevron-noir-on").is(':visible');
    	
    	if(open){
    		$this.find("img.spr-chevron-noir-on").hide();
    		$this.find("img.spr-chevron-noir-off").show();
    	} else {
    		$this.find("img.spr-chevron-noir-on").show();
    		$this.find("img.spr-chevron-noir-off").hide();
    	}
    }
    
  })
}(window.jQuery);
/* plugins/CorporateIdentityPlugin/js/types/PortletNavigate/portletNavigateMenuSlideBar.js */

!function ($) {
  $(function(){
	  
	  
	// On ferme les menus
	$("header #mainMenuLinks").toggle(false);
	$("header #shareLinks").toggle(false);
	  
	var openMenuAlt = $(".menuSlideBar img.spr-mob-menu-off").attr("alt"); 
	var closeMenuAlt = $(".menuSlideBar img.spr-mob-menu-on").attr("alt"); 
	  
	var openShareAlt = $(".menuSlideBar img.spr-mob-partage-off").attr("alt"); 
	var closeShareAlt = $(".menuSlideBar img.spr-mob-partage-on").attr("alt"); 
	
	
	
	$(".menuSlideBar a.menu").click(function() { toogleMenu(this, "#mainMenuLinks", "#shareLinks", false); return false; });
	$(".menuSlideBar a.menu").focus(function() { toogleMenu(this, "#mainMenuLinks", "#shareLinks", true); return false;});
	
	$(".menuSlideBar a.share").click(function() { toogleMenu(this, "#shareLinks", "#mainMenuLinks", false); return false; });
    $(".menuSlideBar a.share").focus(function() { toogleMenu(this, "#shareLinks", "#mainMenuLinks", true); return false;});
    
    function toogleMenu(_this, elementId, elementToHide, isFocus) {
    	var $this = $(_this);
    	var $mobileMenu = $this.parents(".menuMobile");
    	
    	var $targetMenu = $mobileMenu.find(elementId);
    	
    	if($this.find("img.spr-menu-princ-actif")){
    		
    		if($this.find("img.spr-menu-princ-actif").css("display") == "none"){
    			
    			$targetMenu.slideToggle("fast");
    			
    			closeMenu(_this, elementToHide);
    			
    			// Affichage de la puce
    			$this.find("img.spr-menu-princ-actif").css("display", "block");
    			
    			// Modification de l'affichage
    			$this.find("img.icon-hover").hide();
    			$this.find("img.icon-off").hide();
    			$this.find("img.icon-on").show();
    			
    			//Ajout du fond noir
    			$this.addClass("active");
    		} else {
    			// On ne ferme pas les menus avec le focus
    			if(!isFocus) {
    				
    				$targetMenu.slideToggle("fast");
    				
    				closeMenu(_this, elementToHide);
    				
	    			// Retrait de la puce
	    			$this.find("img.spr-menu-princ-actif").css("display", "none");
	    			
	    			// Modification de l'affichage
	    			$this.find("img.icon-off").hide();
	    			$this.find("img.icon-on").hide();
	    			$this.find("img.icon-hover").show();
	    			
	    			// Retrait du fond noir
	    			$this.removeClass("active");
    			}
    		}
    	}
    	
    	return false;
    }
    
    
    /**
     * Fermeture du menu ouvert
     */
    function closeMenu(_this, elementToHide) {
		var $this = $(_this);

		var $menuMobile = $this.parents(".menuMobile");
		
		$menuMobile.find(elementToHide).hide();
		
		// Retrait de la puce
		$menuMobile.find("img.spr-menu-princ-actif").css("display", "none");
		
		// Modification de l'affichage
		$menuMobile.find("a.active").find("img.icon-off").show();
		$menuMobile.find("a.active").find("img.icon-on").hide();
		$menuMobile.find("a.active").find("img.icon-hover").hide();
		
		// Retrait du fond noir
		$menuMobile.find("a.active").removeClass("active");
    }
    
    /* Fonction gérant l'icône et le fond noir */
    $(".menuSlideBar a.share, .menuSlideBar a.menu")
    	.mouseenter(function () {
	    	var $this = $(this);
	    	var $sprActif = $this.find("img.spr-menu-princ-actif");
	    	
	    	if($sprActif.css("display") == "none"){
	    		$this.find("img.icon-hover").show();
	    		$this.find("img.icon-on").hide();
	    		$this.find("img.icon-off").hide();	    		
	    	}
	    })
	    .mouseleave(function () {
	    	var $this = $(this);
	    	var $sprActif = $this.find("img.spr-menu-princ-actif");
	    	
	    	if($sprActif.css("display") == "none"){
	    		// Affichage des bonnes icônes   		
	    		$this.find("img.icon-hover").hide();
	    		$this.find("img.icon-on").hide();
				$this.find("img.icon-off").show();
				
	    	}
	    });
    
  })
}(window.jQuery)
