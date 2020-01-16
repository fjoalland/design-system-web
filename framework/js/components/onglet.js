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

        let tabpanel = document.querySelector(tab.getAttribute("href"));
        let tabpanelExit = tabpanel.children[tabpanel.children.length-1];

        tabpanelExit.addEventListener('click', (event) => { event.preventDefault(); tab.focus(); });
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

      let tabpanel = document.querySelector(tab.getAttribute("href"));

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

}

// Singleton
new Onglet();
