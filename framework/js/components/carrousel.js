'use strict';

class Carrousel {

  constructor() {

    this.prevSlideMessageStr = 'Voir le contenu précédent';
    this.nextSlideMessageStr = 'Voir le contenu suivant';
    this.queryTitreTuile = '.ds44-card__title a[href]:not([disabled])';

    const allCarrousel = document.querySelectorAll('.swipper-carousel-wrap');

    if(allCarrousel != null) {
      allCarrousel.forEach((element, indexCarrousel) => {

        const nextEl = element.getElementsByClassName('swiper-button-next')[0];
        const innerTextNextEl = nextEl.getElementsByClassName('visually-hidden')[0];
        const prevEl = element.getElementsByClassName('swiper-button-prev')[0];
        const innerTextPrevEl = prevEl.getElementsByClassName('visually-hidden')[0];
        const swiper = element.getElementsByClassName('swiper-container')[0];
        const arrSlide = swiper.getElementsByClassName('swiper-slide');
        const nbrSlide = arrSlide.length;
        const wrapper = element.getElementsByClassName('swiper-wrapper')[0];
        let nbrMaxSlide = wrapper.classList.contains('grid-3-small-1') ? 3 : 4;

        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        nbrMaxSlide = screenWidth >= 768 ? nbrMaxSlide : 1;

        var swiperObj = new Swiper (swiper, {
          direction: 'horizontal',
          spaceBetween: 16,
          watchOverflow: true,
          navigation: {
            nextEl: nextEl,
            prevEl: prevEl,
          },
          slidesPerView: nbrMaxSlide,
          loop: screenWidth >= 768 ? (nbrSlide > nbrMaxSlide) : (nbrSlide > 1),
        });

        if(swiperObj.params.loop) {

          setTimeout( () => {
            for(let i = 0 ; i < arrSlide.length ; i++) {
              let tuile = arrSlide[i];
              tuile.style.margin = '0 8px';
            }
            arrSlide[0].style.margin = '0 8px 0 0';
            arrSlide[arrSlide.length-1].style.margin = '0 0 0 8px';
          }, 1000);

          let blocTitle = element.previousElementSibling;

          let title = null;

          if(blocTitle != null) { // on est dans le composant simple
            title = blocTitle;
          } else { // on est dans une page
            blocTitle = element.parentElement.previousElementSibling;
            if(blocTitle != null) {
              title = blocTitle.querySelector('.h2-like');
            }
          }

          const titleCarrousel = title != null ? title.innerText : 'Carrousel n°'+(indexCarrousel+1);

          const updatePrevAndNextSlideMessage = () => {

            let indexPrevEl = swiperObj.realIndex === 0 ? nbrSlide : swiperObj.realIndex;
            let indexNextEl = swiperObj.realIndex+nbrMaxSlide+1 > nbrSlide ? swiperObj.realIndex+nbrMaxSlide+1-nbrSlide : swiperObj.realIndex+nbrMaxSlide+1;

            let titlePrevEl = this.prevSlideMessageStr+' '+titleCarrousel+' - '+indexPrevEl+'/'+nbrSlide;
            let titleNextEl = this.nextSlideMessageStr+' '+titleCarrousel+' - '+indexNextEl+'/'+nbrSlide;

            prevEl.setAttribute('title', titlePrevEl);
            nextEl.setAttribute('title', titleNextEl);
            innerTextPrevEl.innerText = titlePrevEl;
            innerTextNextEl.innerText = titleNextEl;
          };

          updatePrevAndNextSlideMessage();

          const getIndexDerniereTuileVisible = () => {
            let nbrSlideWithDuplicated = arrSlide.length;

            let index = swiperObj.activeIndex+(nbrMaxSlide-1);
            if(swiperObj.activeIndex+(nbrMaxSlide-1) > nbrSlideWithDuplicated) {
               index = swiperObj.activeIndex+(nbrMaxSlide-1) - nbrSlideWithDuplicated;
            }
            return index;
          }

          this.updateVisibiliteTuiles(arrSlide, nbrSlide, swiperObj.activeIndex, getIndexDerniereTuileVisible());

          for(var button of [nextEl, prevEl]) {
            button.classList.remove('swiper-button-disabled');
            button.removeAttribute('aria-label');
            button.removeAttribute('role');

            let ua = navigator.userAgent;
            if (! ua.includes('Edge/42')) {
              button.classList.add('ds44-not-edge-42');
            }

            button.addEventListener('click', (event) => {

              //pour que la methode ait lieu apres swipper
              setTimeout(updatePrevAndNextSlideMessage, 5);
            });

          }

          prevEl.addEventListener('click', (event) => {

            let tuileActive = arrSlide[swiperObj.activeIndex];
            let titreTuileActive = tuileActive.querySelector(this.queryTitreTuile);

            for(let i = 0 ; i < arrSlide.length ; i++) {
              let tuile = arrSlide[i];
              tuile.style.visibility = 'visible';
            }
            //pour que la methode ait lieu apres l'animation de scroll
            setTimeout(() => {
              this.updateVisibiliteTuiles(arrSlide, nbrSlide, swiperObj.activeIndex, getIndexDerniereTuileVisible());
              titreTuileActive.focus();
            }, 200);

          });

          nextEl.addEventListener('click', (event) => {

            let indexDerniereTuile = getIndexDerniereTuileVisible();

            let tuileActive = arrSlide[indexDerniereTuile];
            let titreTuileActive = tuileActive.querySelector(this.queryTitreTuile);

            for(let i = 0 ; i < arrSlide.length ; i++) {
              let tuile = arrSlide[i];
              tuile.style.visibility = 'visible';
            }
            //pour que la methode ait lieu apres l'animation de scroll
            setTimeout(() => {
              this.updateVisibiliteTuiles(arrSlide, nbrSlide, swiperObj.activeIndex, indexDerniereTuile);
              titreTuileActive.focus();
            }, 200);

          });

          prevEl.addEventListener('keypress', (event) => fusionneKeyPressedWithClicked(event));
          nextEl.addEventListener('keypress', (event) => fusionneKeyPressedWithClicked(event));

          element.addEventListener('mousedown', (event) => {
            if(event.buttons === 1) {
              for(let i = 0 ; i < arrSlide.length ; i++) {
                let tuile = arrSlide[i];
                tuile.style.visibility = 'visible';
              }
              if(typeof element.setPointerCapture === 'function') {
                try {
                  element.setPointerCapture(event.pointerId);
                } catch (e) {
                  // empeche Edge d'envoyer des erreurs
                }
              }
            }
          });

          element.addEventListener('mouseup', (event) => {
            //pour que la methode ait lieu apres l'animation de scroll
            setTimeout(() => {
              let tuileActive = arrSlide[swiperObj.activeIndex];
              let titreTuileActive = tuileActive.querySelector(this.queryTitreTuile);

              this.updateVisibiliteTuiles(arrSlide, nbrSlide, swiperObj.activeIndex, getIndexDerniereTuileVisible());
              titreTuileActive.focus();
            }, 200);
            if(typeof element.releasePointerCapture === 'function') {
              try {
                element.releasePointerCapture(event.pointerId);
              } catch (e) {
                // empeche Edge d'envoyer des erreurs
              }
            }
          });

        }
        let spanNotif = element.getElementsByClassName('swiper-notification')[0];
        //pour que la methode ait lieu apres swipper
        setTimeout(spanNotif.remove(), 5);
      });
    }
    // besoin de garder les classes pour l'initialisation des caroussel avec js, donc on les enleve qu'a la fin
    this.removeAffichageSansJs();
  }

  updateVisibiliteTuiles(arrSlide, nbrSlide, indexPremiereTuileVisible, indexDerniereTuileVisible) {

    if(indexDerniereTuileVisible === indexPremiereTuileVisible) { // mobile - 1 tuile d'affiche
      let indexTuileVisible = indexDerniereTuileVisible;
      let indexTuilePrecedente = indexTuileVisible != 0 ? indexTuileVisible - 1 : nbrSlide;
      let indexTuileSuivante = indexTuileVisible != nbrSlide ? indexTuileVisible + 1 : 0;
      for(let index = 0 ; index < arrSlide.length ; index++) {
        let slide = arrSlide[index];
        if ( index === indexTuileVisible ) {
          slide.removeAttribute('aria-hidden');
          slide.style.visibility= 'visible';
          let allElementsFocusables = slide.querySelectorAll(queryAllFocusableElements);
          for (let element of allElementsFocusables) {
            element.removeAttribute('tabindex');
          }
        } else if (
          index === indexTuilePrecedente ||
          index === indexTuileSuivante
        ) {
          slide.setAttribute('aria-hidden', 'true');
          let allElementsFocusables = slide.querySelectorAll(queryAllFocusableElements);
          for (let element of allElementsFocusables) {
            element.setAttribute('tabindex', '-1');
          }
        } else {
          slide.setAttribute('aria-hidden', 'true');
          slide.style.visibility= 'hidden';
          let allElementsFocusables = slide.querySelectorAll(queryAllFocusableElements);
          for (let element of allElementsFocusables) {
            element.removeAttribute('tabindex');
          }
        }
      }
    } else if(indexDerniereTuileVisible >= indexPremiereTuileVisible) { // desktop - tuiles au milieu de la liste
      for(let index = 0 ; index < arrSlide.length ; index++) {
        let slide = arrSlide[index];
        if (
          index >= indexPremiereTuileVisible &&
          index <= indexDerniereTuileVisible
        ) {
          slide.removeAttribute('aria-hidden');
          slide.style.visibility= 'visible';
        } else {
          slide.setAttribute('aria-hidden', 'true');
          slide.style.visibility= 'hidden';
        }
      }
    } else { // desktop - tuiles aux deux extremes de la luste
      for(let index = 0 ; index < arrSlide.length ; index++) {
        let slide = arrSlide[index];
        if (
            (
              index >= indexPremiereTuileVisible &&
              index < arrSlide.length
            ) ||
            (
              index <= indexDerniereTuileVisible &&
              index >= 0
            )
        ) {
          slide.removeAttribute('aria-hidden');
          slide.removeAttribute('style');
        } else {
          slide.setAttribute('aria-hidden', 'true');
          slide.setAttribute('style', 'display:none;');
        }
      }
    }
  }

  // enleve les classes css de l'affichage sans js
  removeAffichageSansJs() {
    const allWrapper = document.getElementsByClassName('swiper-wrapper');
    for(let index = 0 ; index < allWrapper.length ; index++) {
      let wrapper = allWrapper[index];
      wrapper.classList.remove('ds44-carousel-swiper');
      wrapper.classList.remove('grid-4-small-1');
      wrapper.classList.remove('grid-3-small-1');
    }
  }

}

// Singleton
new Carrousel();
