// Modifie la valeur 'aria-hidden' des éléments section#menu section.ds44-overlay en 'true' sauf pour l'élément en paramètre
function toggleAriaHiddenSsMenu(exceptionElem) {
    let allSsMenuSections = document.querySelectorAll('section#menu section.ds44-overlay');

    allSsMenuSections.forEach((itSsMenu) => {
        if (itSsMenu == exceptionElem) {
            MiscEvent.dispatch('accessibility:show', {'element': itSsMenu});
        } else {
            MiscEvent.dispatch('accessibility:hide', {'element': itSsMenu});
        }
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
                MiscEvent.dispatch('accessibility:hide', {'element': document.querySelector("header#topPage > *:not(ds44-blocMenu)")});
                element.setAttribute("aria-expanded", "true");
                let navNivOne = document.querySelector('.ds44-overlay--navNiv1');
                MiscEvent.dispatch('accessibility:show', {'element': navNivOne});
                toggleMainHeaderFooterAriaHidden(navNivOne);
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
                MiscEvent.dispatch('accessibility:show', {'element': navNivTwo});

                MiscEvent.dispatch('overlay:hideCloseButtons', {'element': navNivTwo.querySelector('.ds44-btnOverlay--closeOverlay')});
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
                MiscEvent.dispatch('accessibility:hide', {'element': navCurrent});
                navCurrent.style.visibility = 'visible';
                navCurrent.classList.remove('show');
                MiscEvent.dispatch('overlay:hideCloseButtons', {'element': navNivOne.querySelector('.ds44-btnOverlay--closeOverlay')});
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
                MiscEvent.dispatch('accessibility:show', {'element': navApplis});
                MiscEvent.dispatch('overlay:hideCloseButtons', {'element': navApplis.querySelector('.ds44-btnOverlay--closeOverlay')});
                navApplis.querySelector('.ds44-btnOverlay--closeOverlay').focus();
                // ajouter l'élément de piège focus sur le menu nv2
                disableAllTabIndexes(document.querySelector("header"));
                enableAllTabIndexes(navApplis);
                MiscEvent.dispatch('focus:addLoop', {'element': navApplis});
                toggleAriaHiddenSsMenu(document.querySelector(".ds44-overlay--navApplis"));
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

//Initialisation des composants collapse
ds44.expandable('.ds44-collapser_button');
ds44.ssElemExpandable('.ds44-collapser_content--link');
ds44.ssMenuExpandable('nav[role="navigation"] .ds44-navList .ds44-menuBtn');
ds44.ssMenuReturn('.ds44-btn-backOverlay');
ds44.menuAppExpander('#ds44-btn-applis');
