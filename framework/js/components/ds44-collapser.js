// Cacher tous les boutons "Fermer" sauf le bouton de la modale actuelle
function hideCloseButtons(exceptionElem) {
    const allCloseButtons = document.querySelectorAll('.ds44-btnOverlay--closeOverlay');
    allCloseButtons.forEach((element) => {
        if (element != exceptionElem) {
            element.style.display = "none";
        } else {
            element.style.display = "block";
        }
    });
}

// Effectue les actions liées à la méthode toggleMainHeaderFooterAriaHidden
function performToggleTabindex(exceptionNode, ariaHiddenValue) {
    var focusableEls = document.querySelectorAll(AccessibilityFocus.getEnabledElementsSelector());
    if (ariaHiddenValue) {
        // on ajoute tabindex=-1 sur le main et ses sous-éléments interactifs
        focusableEls.forEach((itFocusElem) => {
            if (!exceptionNode.contains(itFocusElem)) { // on ignore les éléments du bloc à exclure
                Utils.accessibilityHide(itFocusElem);
            }
        });
    } else {
        // on retire l'attribut tabindex sur le main et ses sous-éléments interactifs
        focusableEls.forEach((itFocusElem) => {
            Utils.accessibilityShow(itFocusElem);
        });
    }
}

var isMenuOpened = false;

// Modifie la valeur de l'attribut "aria-hidden" de <main>, <header> et <footer>,
// puis applique une modification de tabindex en fonction de la modification
function toggleMainHeaderFooterAriaHidden(exceptionNode) {
    let mainElem = document.querySelector("main");
    if (mainElem == null) return;
    let headerElem = isMenuOpened ? document.querySelector("header .ds44-blocBandeau") : document.querySelector("header");
    let footerElem = document.querySelector("footer");
    let ariaHiddenValue = "false" == mainElem.getAttribute("aria-hidden") || mainElem.getAttribute("aria-hidden") == null;
    isMenuOpened = false;
    if (ariaHiddenValue && exceptionNode == null) {
        return;
    }
    if (mainElem !== null) {
        mainElem.setAttribute("aria-hidden", ariaHiddenValue);
    }
    if (headerElem !== null) {
        headerElem.setAttribute("aria-hidden", ariaHiddenValue);
    }
    if (footerElem !== null) {
        footerElem.setAttribute("aria-hidden", ariaHiddenValue);
    }
    performToggleTabindex(exceptionNode, ariaHiddenValue);
}

// Modifie la valeur 'aria-hidden' des éléments section#menu section.ds44-overlay en 'true' sauf pour l'élément en paramètre
function toggleAriaHiddenSsMenu(exceptionElem) {
    let allSsMenuSections = document.querySelectorAll("section#menu section.ds44-overlay");

    allSsMenuSections.forEach((itSsMenu) => {
        if (itSsMenu == exceptionElem) {
            Utils.accessibilityShow(itSsMenu);
        } else {
            Utils.accessibilityHide(itSsMenu);
        }
    });
}

// Passe l'attribut "tabindex" des éléments 'focusables' d'un élément à -1
function disableAllTabIndexes(element) {
    if (element == null) return;

    var focusableEls = element.querySelectorAll(AccessibilityFocus.getFocusableElementsSelector());

    focusableEls.forEach((itFocusElem) => {
        Utils.accessibilityHide(itFocusElem);
    });
}

// Supprime l'attribut "tabindex" des éléments focusables d'un élément
function enableAllTabIndexes(element) {
    if (element == null) return;

    var focusableEls = element.querySelectorAll(AccessibilityFocus.getEnabledElementsSelector());

    focusableEls.forEach((itFocusElem) => {
        Utils.accessibilityShow(itFocusElem);
    });
}

// Collapser ds44
(function (window) {
    function ds44() {
        var _ds44 = {};

        // composant menu de navigation - spécifique
        _ds44.menuExpand = function (querySelector) {

            const menuToggler = document.querySelectorAll(querySelector);

            menuToggler.forEach((element) => {
                element.addEventListener('click', () => {
                    displayMainNavMenu(element);
                })
            });

            let displayMainNavMenu = function (element) {
                let mainElem = document.querySelector("body");
                let footerElem = document.querySelector("footer");
                document.querySelector("body").style.overflow = 'hidden';
                Utils.accessibilityHide(document.querySelector("header#topPage > *:not(ds44-blocMenu)"));
                element.setAttribute("aria-expanded", "true");
                let navNivOne = document.querySelector('.ds44-overlay--navNiv1');
                Utils.accessibilityShow(navNivOne);
                isMenuOpened = true; // indiquer qu'on ouvre le menu
                toggleMainHeaderFooterAriaHidden(navNivOne);
                isMenuOpened = true; // duplicata pour qu'une fermeture d'overlay se souvienne que le menu est ouvert
                navNivOne.style.visibility = 'visible';
                navNivOne.classList.add('show');
                navNivOne.querySelector('.ds44-btnOverlay--closeOverlay').focus();
                if (!mainElem) mainElem.setAttribute("aria-hidden", "true");
                if (!footerElem) footerElem.setAttribute("aria-hidden", "true");
                // ajouter l'élément de piège focus sur le menu nv1
                MiscEvent.dispatch('focus:addLoop', {'element': navNivOne});
                toggleAriaHiddenSsMenu(navNivOne);
            }
        }

        // Sous-composant expandable qui doit ouvrir son parent et fermer les autres expandables sur tabulation
        _ds44.ssElemExpandable = function (querySelector) {
            const toggler = document.querySelectorAll(querySelector);

            //Bind event on keydown (TAB, SHIFT+TAB)
            toggler.forEach((element) => {
                element.addEventListener('keyup', function (e) {
                    performTabFocus(e);
                });
            });

            let performTabFocus = function (e) {
                let KEYCODE_TAB = 9;
                var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

                if (!isTabPressed) {
                    return;
                }
                var elemParent = e.target.closest('.ds44-collapser_element');
                if (!elemParent.querySelector('.ds44-collapser_button').classList.contains('show')) {
                    elemParent.querySelector('.ds44-collapser_button').click();
                }
            }

        }

        // Composant expandable
        _ds44.expandable = function (querySelector) {
            const toggler = document.querySelectorAll(querySelector); // element(s) by id or class css
            let currentElementOpened = null;

            //Bind event on click
            toggler.forEach((element) => {
                element.addEventListener('click', () => {
                    showCurrentBlocExpandable(element);
                })
            });

            let showCurrentBlocExpandable = function (element) {
                const panel = element.nextElementSibling;
                currentElementOpened = element;
                element.classList.toggle('show');
                panel.style.maxHeight = (panel.style.maxHeight) ? null : panel.scrollHeight + 60 + "px";
                element.setAttribute('aria-expanded', element.classList.contains("show"));
                panel.setAttribute("aria-hidden", !element.classList.contains("show"));
                panel.style.visibility = element.classList.contains("show") ? "visible" : "hidden";
            }

        };

        // Composants expandables ouvrant un sous-menu en topbar
        _ds44.ssMenuExpandable = function (querySelector) {

            const ssMenuToggler = document.querySelectorAll(querySelector);

            ssMenuToggler.forEach((element) => {
                element.addEventListener('click', () => {
                    displaySsNavMenu(element);
                })
            });

            let displaySsNavMenu = function (element) {
                element.setAttribute("aria-expanded", "true");
                let navNivOne = document.querySelector('.ds44-overlay--navNiv1');
                let navNivTwo = document.querySelector("#" + element.getAttribute("data-ssmenu"));
                navNivTwo.style.visibility = 'visible';
                navNivTwo.classList.add('show');
                Utils.accessibilityShow(navNivTwo);
                hideCloseButtons(navNivTwo.querySelector('.ds44-btnOverlay--closeOverlay'));
                navNivTwo.querySelector('.ds44-btn-backOverlay').focus();
                // ajouter l'élément de piège focus sur le menu nv2
                disableAllTabIndexes(document.querySelector("header"));
                enableAllTabIndexes(navNivTwo);
                MiscEvent.dispatch('focus:addLoop', {'element': navNivTwo});
                toggleAriaHiddenSsMenu(navNivTwo);
            }

        }

        // Composants "Retour" dans le menu en topbar
        _ds44.ssMenuReturn = function (querySelector) {

            const ssMenuReturn = document.querySelectorAll(querySelector);

            ssMenuReturn.forEach((element) => {
                element.addEventListener('click', () => {
                    returnSsNavMenu(element);
                })
            });

            let returnSsNavMenu = function (element) {
                let navNivOne = document.querySelector('.ds44-overlay--navNiv1');
                let navCurrent = element.closest("section.ds44-overlay");
                navNivOne.style.visibility = 'visible';
                navNivOne.querySelector('.ds44-menuBtn[data-ssmenu="' + navCurrent.id + '"], #ds44-btn-applis').setAttribute("aria-expanded", "false");
                Utils.accessibilityHide(navCurrent);
                navCurrent.style.visibility = 'visible';
                navCurrent.classList.remove('show');
                hideCloseButtons(navNivOne.querySelector('.ds44-btnOverlay--closeOverlay'));
                disableAllTabIndexes(document.querySelector("header"));
                enableAllTabIndexes(navNivOne);
                MiscEvent.dispatch('focus:addLoop', {'element': navNivOne});
                toggleAriaHiddenSsMenu(navNivOne);
                setTimeout(function () {
                    navNivOne.querySelector('.ds44-menuBtn[data-ssmenu="' + navCurrent.id + '"], #ds44-btn-applis').focus();
                }, 0);
            }

        }

        // Composant ouvrant le menu des applications
        _ds44.menuAppExpander = function (querySelector) {

            const ssMenuReturn = document.querySelectorAll(querySelector);

            ssMenuReturn.forEach((element) => {
                element.addEventListener('click', () => {
                    returnSsNavMenu(element);
                })
            });

            let returnSsNavMenu = function (element) {
                element.setAttribute("aria-expanded", "true");
                let navNivOne = document.querySelector('.ds44-overlay--navNiv1');
                let navApplis = document.querySelector("#navApplis");
                navApplis.style.visibility = 'visible';
                navApplis.classList.add('show');
                Utils.accessibilityShow(navApplis);
                hideCloseButtons(navApplis.querySelector('.ds44-btnOverlay--closeOverlay'));
                navApplis.querySelector('.ds44-btnOverlay--closeOverlay').focus();
                // ajouter l'élément de piège focus sur le menu nv2
                disableAllTabIndexes(document.querySelector("header"));
                enableAllTabIndexes(navApplis);
                MiscEvent.dispatch('focus:addLoop', {'element': navApplis});
                toggleAriaHiddenSsMenu(document.querySelector(".ds44-overlay--navApplis"));
            }

        }

        // Composant popup
        _ds44.popup = function () {
            const modalComponents = document.querySelectorAll('[data-js="ds44-modal"]');

            //Bind les événements pour chacun des boutons
            modalComponents.forEach((button) => {
                button.addEventListener('click', () => {
                    const modalId = (button.dataset.target) ? button.dataset.target : null;
                    const modal = document.querySelector(modalId);
                    if (modal !== null) {
                        toggleMainHeaderFooterAriaHidden(modal);
                        let main = document.querySelector("main");
                        if (main !== null) Utils.accessibilityHide(main);
                        let body = document.querySelector("body");
                        if (body !== null) body.style.overflow = "hidden";
                        _getFocusOnPopup(modal);
                        modal.classList.add('show');
                        modal.setAttribute('aria-hidden', 'false');
                        Utils.accessibilityShow(modal);
                        disableAllTabIndexes(document.querySelector("section.ds44-ongletsContainer"));
                        enableAllTabIndexes(modal);
                        MiscEvent.dispatch('focus:addLoop', {'element': modal});
                        const closeButton = modal.querySelector('[data-js="ds44-modal-action-close"]');
                        hideCloseButtons(closeButton);
                        closeButton.focus();
                        closeButton.addEventListener('click', () => {
                            _closePopup();
                        });

                        modal.addEventListener('click', (event) => {
                            if (modal == event.target) {
                                _closePopup();
                            }
                        });

                        document.dispatchEvent(new CustomEvent('modal:show'));
                    }
                })
            });

            //Bind événement lié au document ( bouton échap )
            window.document.addEventListener("keyup", (e) => {
                if (e.key === "Escape") {
                    _closePopup();

                    const elementsShow = document.querySelectorAll('.show');
                    elementsShow.forEach((elementShow) => {
                        console.info('debug ' + elementsShow);
                        if (document.activeElement == elementShow) {
                            // hideAllOtherBlock();
                            elementShow.click();
                        }
                    });
                }
            });

            let _closePopup = function () {
                const currentModal = document.querySelector('.show[role="dialog"]');
                if (currentModal) {
                    document.querySelector("body").style.overflow = null;
                    toggleMainHeaderFooterAriaHidden(null);
                    let main = document.querySelector("main");
                    if (main !== null) Utils.accessibilityShow(main);
                    currentModal.classList.toggle('show');
                    Utils.accessibilityHide(currentModal);
                    if (currentModal.classList.contains("ds44-modal-container")) {
                        document.querySelector('[data-js="ds44-modal"][data-target="#' + currentModal.id + '"]').focus();
                    } else if (currentModal.classList.contains("ds44-overlay")) {
                        MiscEvent.dispatch('overlay:close');
                    }

                    document.dispatchEvent(new CustomEvent('modal:hide'));
                }

                Buttons.displayAllCloseBtns();

            }

            let _getFocusOnPopup = function (modal) {
                let firstField = modal.querySelector('input, button, textarea, a, select');
                let allFields = modal.querySelectorAll('input, button, textarea, a, select');
                let tabIndex = 1;

                firstField.focus();

                modal.addEventListener('focusout', dontAllowFocusOnOtherElements);

                function dontAllowFocusOnOtherElements(event) {
                    event.stopPropagation();

                    if (!modal.contains(event.relatedTarget) || event.relatedTarget == null) {
                        firstField.focus();
                        return false;
                    }
                    modal.focus();
                }
            }
        };

        _ds44.setFocus = function (selector, params) {
            document.getElementsByTagName('body')[0].classList.add('fullHeight');
            let elementToFocus = (typeof selector === "string") ? document.querySelector(selector) : selector;

            if (elementToFocus == null) return;

            //Selon la configuration , on va autorisé le masquage du focus soit au click soit via le bouton échap
            if (params) {
                function escapeFunction(evt) {
                    evt = evt || window.event;
                    if (evt.keyCode == 27) {
                        deleteExistingFocus();
                        document.removeEventListener('keydown', escapeFunction);
                    }
                };
                document.addEventListener('keydown', escapeFunction);
            }

            //Pour ne pas effectuer un focus sur une des divs de focus
            if (elementToFocus.classList.contains('focus-background')) {
                return;
            }

            let offsetElement = getOffset(elementToFocus);

            deleteExistingFocus();

            function deleteExistingFocus() {
                let existingDiv = document.querySelectorAll('.focus-background');

                if (existingDiv.length) {
                    existingDiv.forEach((divToDelete) => {
                        divToDelete.parentNode.removeChild(divToDelete);
                    });
                    document.getElementsByTagName('body')[0].classList.remove('fullHeight');
                }

            }

            function getOffset(el) {
                var _x = 0;
                var _y = -el.clientTop;
                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return {top: _y - window.scrollY, left: _x - window.scrollX};
            }

            function createDiv(styles) {
                let newDiv = document.createElement("div");
                newDiv.classList.add("focus-background");
                styles = Object.keys(styles).reduce((acc, key) => {
                    acc[key] = styles[key] + 'px';
                    return acc;
                }, {});
                Object.assign(newDiv.style, styles);
                return newDiv;
            }

            const newDivLeft = createDiv({
                top: 0,
                bottom: 0,
                left: 0,
                width: offsetElement.left
            });

            const newDivTop = createDiv({
                top: 0,
                height: offsetElement.top,
                left: offsetElement.left,
                width: elementToFocus.offsetWidth
            });

            const newDivRight = createDiv({
                top: 0,
                bottom: 0,
                left: offsetElement.left + elementToFocus.offsetWidth,
                right: 0
            });

            const newDivBottom = createDiv({
                top: offsetElement.top + elementToFocus.offsetHeight,
                bottom: 0,
                left: offsetElement.left,
                width: elementToFocus.offsetWidth,
            });

            document.body.appendChild(newDivLeft);
            document.body.appendChild(newDivTop);
            document.body.appendChild(newDivRight);
            document.body.appendChild(newDivBottom);
        }

        _ds44.expandTuileLink = function () {
            /* Etend le lien dans les tuiles en ajoutant un onclick sur l'ensemble de la tuile */

            let allTuiles = document.querySelectorAll('section.ds44-card');

            if (allTuiles.length) {
                allTuiles.forEach((tuile) => {
                    tuile.onclick = function (e) {
                        tuileLinkArray = tuile.getElementsByTagName('a');
                        if (tuileLinkArray.length) {
                            tuileLinkArray[0].click();
                        }
                    };
                });
            }
        }

        _ds44.closeOverlays = function (querySelector) {
            let closeBtns = document.querySelectorAll(querySelector);
            if (closeBtns.length) {
                closeBtns.forEach((btn) => {
                    btn.onclick = function () {
                        MiscEvent.dispatch('overlay:close');
                    };
                });
            }
        }

        _ds44.fiddleInputLabel = function (classCSSAnimation, querySelector) {

            let allInputs = document.querySelectorAll(querySelector);

            if (allInputs.length) {
                allInputs.forEach((inputElem) => {
                    const label = inputElem.previousElementSibling;

                    label.classList.remove(classCSSAnimation);

                    inputElem.addEventListener('focus', (event) => {
                        label.classList.add(classCSSAnimation);
                    });
                    inputElem.addEventListener('blur', (event) => {
                        if (!inputElem.value) {
                            label.classList.remove(classCSSAnimation);
                        }
                    });
                });
            }
        }

        _ds44.reactOnInvalidInput = function () {
            allInputs = document.querySelectorAll("input, select");

            if (allInputs.length) {
                allInputs.forEach((itInput) => {
                    itInput.addEventListener("invalid", function () {
                        itInput.setAttribute("aria-invalid", "true");
                        if (itInput.tagName === 'SELECT') {
                            itInput.setAttribute("aria-label", textLabels.invalid_input_select);
                        } else {
                            itInput.setAttribute("aria-label", textLabels.invalid_input_text);
                        }
                    });
                    itInput.addEventListener("blur", function () {
                        itInput.setAttribute("aria-invalid", "false");
                        itInput.removeAttribute("aria-label");
                        itInput.checkValidity();
                    });
                });
            }


        }

        return _ds44;
    }

// On rend accessible notre librairie
    if (typeof (window.ds44) === 'undefined') {
        window.ds44 = ds44();
    }
})(window); // Création de la closure en passant en paramètre le scope global

// Initialisation du composant bouton menu
ds44.menuExpand('.ds44-btn--menu');

// Initialisation des boutons menu ouvrant le niveau 2
//ds44.meuNiv2Expand('.ds44-overlay--navNiv1 .ds44-ds44-menuBtn');

//Initialisation des composants collapse
ds44.expandable('.ds44-collapser_button');
ds44.ssElemExpandable('.ds44-collapser_content--link');
ds44.ssMenuExpandable('nav[role="navigation"] .ds44-navList .ds44-menuBtn');
ds44.ssMenuReturn('.ds44-btn-backOverlay');
ds44.menuAppExpander('#ds44-btn-applis');
//Initialisation des composants de popup
/*
Utilisation :
sur un lien, ou boutton ou autre élément html , ajouter ces deux attributs :
data-js="ds44-modal" data-target="#ds44-modal-exemple"

data-js="ds44-modal" , permet de définir l'élément qui servira à afficher la popup lors d'un click
data-target="#ds44-modal-exemple" , permet de définir la popup, via un id ou une class css unique /!\
 */
ds44.popup();

/*
Utilisation du composant de mise en avant
indiquer le sélecteur en paramètre ( id/class )
le second paramètre permet d'activer le bouton echap
true ou false
*/
ds44.setFocus('#focusable', true);

//Démonstration sur l'événement click , met en avant l'élément sur lequel on a cliqué
/*
document.addEventListener('click', function (e) {

    e.preventDefault();
    let element = e.target;
    ds44.setFocus(element, true);

}, true);
*/

ds44.expandTuileLink();
// sert pour gérer les liens autour des tuiles

ds44.closeOverlays(".ds44-btnOverlay--closeOverlay");
// ajoute un listener aux boutons qui ferment les overlays

const classAnimInputForm = "ds44-moveLabel";

ds44.fiddleInputLabel(classAnimInputForm, '.' + classAnimInputForm + ' + input[type="text"], .' + classAnimInputForm + ' + input[type="email"], .' + classAnimInputForm + ' + input[type="tel"], .' + classAnimInputForm + ' + input[type="search"]');
// faire une animation CSS sur certains champs inputs pour conserver un DOM lisible pour les lecteurs vocaux

ds44.reactOnInvalidInput();
// effectuer une action sur les champs "input" invalides
