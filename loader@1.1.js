function initHomeLoader() {
    let loadWrap = document.querySelector(".load-w");
    if (!loadWrap) return;
    let loadHeading = loadWrap.querySelector(".h-med");
    let loadCount = loadWrap.querySelector(".loader-nr");
    let navWrap = document.querySelector(".nav-w");
    let body = document.body;
    let slides = gsap.utils.toArray(".slider-item");
    let amountOfSlides = slides.length + 1;
    let endPointD = window.innerWidth * 0.5 * amountOfSlides;
    let endPointM = window.innerHeight * amountOfSlides;
    let scrollDistance;
    let initialSlideX;
    let initialSlideY;
    let initialSlideDuration;
  
    if (window.innerWidth < 992) {
      scrollDistance = (endPointM / 9) * 2.02;
      initialSlideX = 0;
      initialSlideY = 200;
      initialSlideDuration = 1;
    } else {
      scrollDistance = (endPointD / 9) * 2.7;
      initialSlideX = 200;
      initialSlideY = 0;
      initialSlideDuration = 0.6;
    }
  
    let loadTimeline = gsap.timeline({
      defaults: {
        ease: "power3.inOut",
        duration: 0.8,
      },
      onStart: () => {
        gsap.set(".slide-end__inner", { visibility: "hidden" });
        gsap.set(".slider-item", { pointerEvents: "none" });
        lenis.scrollTo(0, {
          immediate: true,
          lock: true,
          force: true,
          onComplete: () => {
            lenis.stop();
          },
        });
        gsap.set(body, { cursor: "wait" });
        gsap.delayedCall(5, () => {
          lenis.start();
          gsap.set(".slider-item", {
            pointerEvents: "auto",
            clearProps: "pointerEvents",
          });
          gsap.from(".slider-item", {
            xPercent: initialSlideX,
            yPercent: initialSlideY,
            duration: initialSlideDuration,
            ease: "power3.in",
            onStart: () => {
              gsap.set(".slider-list", { visibility: "visible" });
            },
            onComplete: () => {
              lenis.scrollTo(scrollDistance, {
                duration: 2,
                ease: (t) => Math.min(1, 1.001 - Math.pow(2, -6 * t)),
                lock: true,
                force: true,
              });
              gsap.fromTo(
                ".cursor-main",
                {
                  autoAlpha: 0,
                },
                {
                  autoAlpha: 1,
                  delay: 2,
                  onComplete: () => {
                    const handleScrollOnce = () => {
                      gsap.to(".cursor-main", { autoAlpha: 0 });
                      lenis.off("scroll", handleScrollOnce);
                    };
                    gsap.delayedCall(1, () => {
                      lenis.on("scroll", handleScrollOnce);
                    });
                  },
                },
              );
              gsap.set(".slide-end__inner", { visibility: "visible" });
            },
          });
        });
      },
      onComplete: () => {
        gsap.set(loadWrap, { display: "none" });
        gsap.set(body, { cursor: "auto" });
        gsap.set(".slide-end", { visibility: "visible" });
      },
    });
  
    let randomY1 = Math.floor(Math.random() * 3) * 10 + 20;
    let randomY2 = Math.floor(Math.random() * 3) * 10 + 60;
    let imageIndex = Math.floor(randomY1 / 10) - 1;
    let loaderImages = document.querySelectorAll(".load-heart");
  
    loadTimeline
      .to(loadCount, {
        y: `-${randomY1}%`,
        duration: 1.5,
      })
      .to(
        loaderImages,
        {
          opacity: (i) => (i <= Math.floor(randomY1 / 10) - 1 ? 1 : 0),
          duration: 0.5,
          stagger: {
            amount: 1,
            start: 0,
          },
        },
        0,
      )
      .to(loadCount, {
        y: `-${randomY2}%`,
        duration: 1.8,
      })
      .to(
        loaderImages,
        {
          opacity: (i) => (i <= Math.floor(randomY2 / 10) - 1 ? 1 : 0),
          duration: 0.5,
          stagger: {
            amount: 1.3,
            start: 0,
          },
        },
        1.5,
      )
      .to(loadCount, {
        y: "-90%",
        duration: 1.7,
      })
      .to(
        loaderImages,
        {
          opacity: 1,
          duration: 0.1,
          stagger: {
            each: 0.08,
          },
        },
        3.3,
      )
      .to(loadHeading, {
        autoAlpha: 0,
        y: "50%",
        duration: 0.55,
      })
      .to(
        navWrap,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
        },
        "<",
      );
  }
  