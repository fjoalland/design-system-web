'use strict';

class Onglet {

  constructor() {
    let allTabs = document.querySelectorAll(".js-tablist__link");
    if (!(allTabs == null)) {
      allTabs.forEach((tab) => {
        tab.addEventListener('click', () => this.processTransitionOnglets(tab, allTabs));
        tab.addEventListener("keypress", (event) => fusionneKeyPressedWithClicked(event));

        if(tab.hasAttribute("aria-current")) {
          tab.classList.add("ds44-tabs__linkSelected");
        }

        let hrefTag = this.getTagFromHref(tab.getAttribute("href"));

        let tabpanel = document.querySelector(hrefTag);
        let tabpanelExit = tabpanel.children[tabpanel.children.length-1];

        tabpanelExit.addEventListener('click', (event) => {
          event.preventDefault();
          tab.focus();

          let header = document.querySelector("header");
          if(header != null) {
            let distanceToScroll = header.offsetHeight;
            let distanceEntreTabPanelExitEtTab = getPositionY(tabpanelExit) - getPositionY(tab) + distanceToScroll;
            let distanceEntreTabPanelExitEtHautEcran = getPositionY(tabpanelExit) - document.scrollingElement.scrollTop;
            if(distanceEntreTabPanelExitEtTab >= distanceEntreTabPanelExitEtHautEcran) { //si le tab est au dessus de l'ecran visible
              document.scrollingElement.scrollBy(0, -distanceToScroll * 2);
            }
          }
        });
        tabpanelExit.addEventListener("keypress", (event) => fusionneKeyPressedWithClicked(event));

        if(tab.getAttribute("aria-current") === "true") {
          tab.focus();
          tabpanel.style["display"] = "block";
          timerClass(tabpanel, "opacity", "1", 150);
        }

      });
    }
  }

  // effectue une transition des display:none sur les contenus des onglets
  processTransitionOnglets(tabClicked, allTabs) {

    allTabs.forEach((tab) => {

      let hrefTag = this.getTagFromHref(tab.getAttribute("href"));

      let tabpanel = document.querySelector(hrefTag);

      if (tabClicked === tab) {
        tab.classList.add("ds44-tabs__linkSelected");

        timerClass(tabpanel, "display", "block", 150);
        timerClass(tabpanel, "opacity", "1", 300);

        let tabpanelAnchor = tabpanel.children[0];
        tabpanelAnchor.focus();

      } else {
        tab.classList.remove("ds44-tabs__linkSelected");

        tabpanel.style["opacity"] = "0";
        timerDisplayNone(tabpanel, 150);
      }

    });
  }

  // Récupère le tag ID d'un HREF, s'il existe
  getTagFromHref(href) {
    if (href.indexOf("#") != -1) {
      return href.slice(href.indexOf("#"));
    }
    return "#";
  }

}

// Singleton
new Onglet();
