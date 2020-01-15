'use strict';

class Carrousel {

  prevSlideMessageStr = 'Voir le contenu précédent';
  nextSlideMessageStr = 'Voir le contenu suivant';

  constructor() {
    const allCarrousel = document.querySelectorAll(".swipper-carousel-wrap");

    if(allCarrousel != null) {
      allCarrousel.forEach((element, index) => {

        const nextEl = element.getElementsByClassName("swiper-button-next")[0];
        const innerTextNextEl = nextEl.getElementsByClassName("visually-hidden")[0];
        const prevEl = element.getElementsByClassName("swiper-button-prev")[0];
        const innerTextPrevEl = prevEl.getElementsByClassName("visually-hidden")[0];
        const swiper = element.getElementsByClassName("swiper-container")[0];
        const arrSlide = swiper.getElementsByClassName("swiper-slide");
        const nbrSlide = arrSlide.length;
        const wrapper = element.getElementsByClassName("swiper-wrapper")[0];
        const nbrMaxSlide = wrapper.classList.contains("grid-3-small-1") ? 3 : 4;

        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        var swiperObj = new Swiper (swiper, {
          direction: 'horizontal',
          spaceBetween: 10,
          watchOverflow: true,
          navigation: {
            nextEl: nextEl,
            prevEl: prevEl,
          },
          slidesPerView: screenWidth >= 768 ? nbrMaxSlide : 1,
          loop: screenWidth >= 768 ? (nbrSlide > nbrMaxSlide) : (nbrSlide > 1),
        });

        if(swiperObj.params.loop) {

          const titleCarrousel = this.getTitleCaroussel(element, index);

          const updatePrevAndNextSlideMessage = () => {

            let indexPrevEl = swiperObj.realIndex === 0 ? nbrSlide : swiperObj.realIndex;
            let indexNextEl = swiperObj.realIndex+2 > nbrSlide ? swiperObj.realIndex+2-nbrSlide : swiperObj.realIndex+2;

            let titlePrevEl = this.prevSlideMessageStr+" "+titleCarrousel+" - "+indexPrevEl+"/"+nbrSlide;
            let titleNextEl = this.nextSlideMessageStr+" "+titleCarrousel+" - "+indexNextEl+"/"+nbrSlide;

            prevEl.setAttribute("title", titlePrevEl);
            nextEl.setAttribute("title", titleNextEl);
            innerTextPrevEl.innerText = titlePrevEl;
            innerTextNextEl.innerText = titleNextEl;
          };

          updatePrevAndNextSlideMessage();

          for(var button of [nextEl, prevEl]) {
            button.classList.remove("swiper-button-disabled");
            button.removeAttribute("aria-label");
            button.removeAttribute("role");

            button.addEventListener("click", (event) => {

              //pour que la methode ait lieu apres swipper
              setTimeout(updatePrevAndNextSlideMessage, 5);
            });

          }

          prevEl.addEventListener("click", (event) => {

            let titreTuileActive = arrSlide[swiperObj.activeIndex].querySelector(".ds44-card__title a[href]:not([disabled])");
            //pour que la methode ait lieu apres l'animation de scroll
            setTimeout(() => { titreTuileActive.focus() }, 150);

          });

          nextEl.addEventListener("click", (event) => {

            let nbrSlideWithDuplicate = arrSlide.length;

            let index = swiperObj.activeIndex+(nbrMaxSlide-1);
            if(swiperObj.activeIndex+(nbrMaxSlide-1) > nbrSlideWithDuplicate) {
               index = swiperObj.activeIndex+(nbrMaxSlide-1) - nbrSlideWithDuplicate;
            }

            let titreTuileActive = arrSlide[index].querySelector(".ds44-card__title a[href]:not([disabled])");
            //pour que la methode ait lieu apres l'animation de scroll
            setTimeout(() => { titreTuileActive.focus() }, 150);

          });

          prevEl.addEventListener("keypress", (event) => fusionneKeyPressedWithClicked(event));
          nextEl.addEventListener("keypress", (event) => fusionneKeyPressedWithClicked(event));

        } else {

          disableAllTabIndexes(element);
          arrSlide.forEach((slide, index) => {
            slide.querySelector(".ds44-card__title a[href]:not([disabled])").setAttribute("tabindex", index)
          });

        }
        let spanNotif = element.getElementsByClassName("swiper-notification")[0];
        //pour que la methode ait lieu apres swipper
        setTimeout(spanNotif.remove(), 5);

      });
    }

    // besoin de garder les classes pour l'initialisation des caroussel avec js, donc on les enleve a la fin
    this.removeAffichageSansJs();
  }

  getTitleCaroussel(parent, index) {
    let title = null;
    while(
      parent != null &
      title == null
    ) {
      for(var sibling of getSiblings(parent)) {
        if(
          sibling != null &&
          sibling.classList.contains("h2-like")
        ) {
          title = sibling;
          break;
        }
      };
      parent = parent.parentElement;
    }
    return title != null ? title.innerText : "Carrousel n°"+(index+1);
  }

  // enleve les classes css de l'affichage sans js
  removeAffichageSansJs() {
    const allWrapper = document.getElementsByClassName("swiper-wrapper");
    for(let wrapper of allWrapper){
      wrapper.classList.remove("ds44-carousel-swiper");
      wrapper.classList.remove("grid-4-small-1");
      wrapper.classList.remove("grid-3-small-1");
    }
  }

}

// Singleton
new Carrousel();
