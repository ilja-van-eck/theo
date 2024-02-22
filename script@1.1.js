function isMobile() {
    return window.innerWidth < 992;
  }
  
  function resetWebflow(data) {
    let parser = new DOMParser();
    let dom = parser.parseFromString(data.next.html, "text/html");
    let webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
    document.documentElement.setAttribute("data-wf-page", webflowPageId);
    window.Webflow.destroy();
    window.Webflow.ready();
    window.Webflow.require("ix2").init();
  }
  
  function initMotherPage() {
    const familyUrlElement = document.querySelector("#family-url");
    const modalCloseButtons = document.querySelectorAll(".modal-close");
  
    if (familyUrlElement && modalCloseButtons.length) {
      const familyUrl = familyUrlElement.getAttribute("href");
  
      modalCloseButtons.forEach((button) => {
        button.setAttribute("href", familyUrl);
      });
    }
  }
  
  function initFamilyBottom(container) {
    if (!container) container = document;
    var dataIndex = parseInt(
      container.querySelector("[data-index]").textContent,
      10,
    );
    const sliderItems = container.querySelectorAll(
      "[data-family-bottom] .slider-item",
    );
    const totalItems = sliderItems.length;
  
    var prevIndex = dataIndex - 1 < 1 ? totalItems - 1 : dataIndex - 2;
    var nextIndex = dataIndex % totalItems;
  
    if (dataIndex - 1 < 1) {
      setTimeout(() => {
        sliderItems[totalItems - 1].style.order = 1;
      }, 150);
    }
    if (nextIndex === 0) {
      setTimeout(() => {
        sliderItems[0].style.order = 3;
      }, 150);
    }
  
    sliderItems.forEach((item, index) => {
      const isPrevious = index === prevIndex;
      const isNext = index === nextIndex;
  
      if (isPrevious) {
        let buttonText = item.querySelectorAll(".button-text");
        buttonText.forEach((text) => {
          text.textContent = "previous";
        });
      }
  
      const showItem = isMobile() ? isNext : isPrevious || isNext;
      if (showItem) {
        item.style.display = "block";
        item.style.order = 2;
      } else {
        item.remove();
      }
    });
  
    let slideWrap = container.querySelector("[data-family-bottom]");
    let slides = slideWrap.querySelectorAll(".slider-item");
    if (window.innerWidth < 992) {
      slides.forEach((slide) => {
        let videoBg = slide.querySelector(".bg-vid");
        let videoMain = slide.querySelector(".slide-vid");
  
        if (videoBg) {
          preloadVideo(videoBg);
        }
        if (videoMain) {
          preloadVideo(videoMain);
          videoMain.currentTime = videoBg.currentTime;
        }
      });
    }
  
    function preloadVideo(video) {
      let videoSrc;
      const isMainVideo = !video.hasAttribute("data-video-url-mobile");
  
      if (window.innerWidth < 480 && !isMainVideo) {
        videoSrc = video.getAttribute("data-video-url-mobile");
      } else {
        videoSrc = video.getAttribute("data-video-url");
      }
      if (videoSrc) {
        video.src = videoSrc;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("autoplay", "");
        video.load();
      } else {
        console.log(
          "No video source found for",
          isMainVideo ? "main video" : "background video",
        );
      }
    }
  
    function handleVideoVisibility(entries, observer) {
      entries.forEach((entry) => {
        const slide = entry.target;
        const videoBg = slide.querySelector(".bg-vid");
        const videoMain = slide.querySelector(".slide-vid");
  
        if (entry.isIntersecting) {
          if (videoBg) {
            videoBg.play();
          }
          if (videoMain) {
            videoMain.currentTime = videoBg.currentTime;
            videoMain.play();
          }
  
          if (
            videoBg &&
            videoMain &&
            videoBg.currentTime !== videoMain.currentTime
          ) {
            videoMain.currentTime = videoBg.currentTime;
          }
        } else {
          if (videoBg) {
            videoBg.pause();
          }
          if (videoMain) {
            videoMain.pause();
            videoMain.currentTime = videoBg.currentTime;
          }
        }
      });
    }
    //
    //
    slides.forEach((slide, index) => {
      let videoMain = slide.querySelector(".slide-vid");
      let videoBg = slide.querySelector(".bg-vid");
      let score =
        parseInt(slide.querySelector("[data-score]").textContent, 10) - 1;
  
      if (videoBg) fetchAndPlayVideo(videoBg, false);
  
      if (window.innerWidth < 992) {
        const observerOptions = {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        };
        const videoObserver = new IntersectionObserver(
          handleVideoVisibility,
          observerOptions,
        );
  
        slides.forEach((slide) => {
          videoObserver.observe(slide);
        });
      } else {
        slide.addEventListener("mouseenter", () => {
          let tlItem = document.querySelectorAll(".tl-item")[score];
          tlItem.classList.add("active");
  
          if (videoMain) {
            fetchAndPlayVideo(videoMain);
            if (videoBg && videoBg.currentTime) {
              videoMain.currentTime = videoBg.currentTime;
            }
            videoMain.volume = 0;
            videoMain.play();
          }
          if (videoBg) videoBg.play();
        });
  
        slide.addEventListener("mouseleave", () => {
          if (videoMain) videoMain.pause();
          if (videoBg) videoBg.pause();
          let tlItem = document.querySelectorAll(".tl-item")[score];
          tlItem.classList.remove("active");
        });
      }
    });
  
    function fetchAndPlayVideo(
      video,
      autoplay = true,
      isBackgroundVideo = false,
    ) {
      let videoSrc;
      if (isBackgroundVideo && window.innerWidth < 480) {
        videoSrc = video.getAttribute("data-video-url-mobile");
      } else {
        videoSrc = video.getAttribute("data-video-url");
      }
      if (video && !video.src && videoSrc) {
        fetch(videoSrc)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
          })
          .then((blob) => {
            video.src = URL.createObjectURL(blob);
            video.load();
            if (autoplay) {
              video.play();
            }
          })
          .catch((e) => {
            console.warn("Video playback failed", e);
          });
      } else if (autoplay && video.src) {
        video.play();
      }
    }
  
    // empty state
    if (window.innerWidth > 991) {
      gsap.delayedCall(0.1, () => {
        const modelWrap = document.querySelector(".two-col");
        if (modelWrap) {
          const children = modelWrap.children;
          if (children.length % 2 !== 0) {
            const emptyProductItem = document.querySelector(
              ".product-item.is--empty",
            );
            if (emptyProductItem) {
              modelWrap.appendChild(emptyProductItem);
              emptyProductItem.classList.remove("u--hide");
            }
          }
        }
      });
    }
    dataIndex = null;
    nextIndex = null;
    prevIndex = null;
  }
  
  function removeFamilyNav() {
    let scoreWrap = document.querySelector(".tl-w");
    scoreWrap.removeEventListener("mouseenter", false);
  }
  
  function makeItemActive() {
    const sliderElName = document.querySelector(
      '[data-barba-namespace="family"] .f-hero .slider-title',
    );
    const cmsPageName = sliderElName ? sliderElName.textContent : "";
    const sliderItems = document.querySelectorAll(
      "[data-home-slider] .slider-item",
    );
    if (sliderItems) {
      sliderItems.forEach(function (item) {
        const titleElement = item.querySelector(".slider-title");
        const titleText = titleElement ? titleElement.textContent : "";
  
        if (titleText === cmsPageName) {
          item.classList.add("is--transitioning");
        }
      });
    }
  
    const bottomItems = document.querySelectorAll(
      "[data-family-bottom] .slider-item",
    );
    if (bottomItems) {
      bottomItems.forEach(function (item) {
        const titleElement = item.querySelector(".slider-title");
        const titleText = titleElement ? titleElement.textContent : "";
  
        if (titleText === cmsPageName) {
          item.classList.add("is--transitioning");
        }
      });
    }
  }
  
  function makeItemActiveTest(nextContainer, currentContainer) {
    const sliderElName = nextContainer.querySelector(
      '[data-barba-namespace="family"] .f-hero .slider-title',
    );
    const cmsPageName = sliderElName ? sliderElName.textContent : "";
  
    const bottomItems = currentContainer.querySelectorAll(
      "[data-family-bottom] .slider-item",
    );
    if (bottomItems) {
      bottomItems.forEach(function (item) {
        const titleElement = item.querySelector(".slider-title");
        const titleText = titleElement ? titleElement.textContent : "";
  
        if (titleText === cmsPageName) {
          item.classList.add("is--transitioning");
        }
      });
    }
  }
  
  function flip(outgoing, incoming) {
    let state = Flip.getState(outgoing.find(".slide-inner"));
    let outGoingSlide = outgoing.find(".slide-inner");
    incoming.find(".slide-info__wrap").remove();
    outGoingSlide.appendTo(incoming);
    Flip.from(state, { duration: 1, ease: "power4.inOut", absolute: true });
  }
  
  function flipTest(outgoing, incoming) {
    let flipState = Flip.getState(outgoing.find(".slide-inner"));
    let outGoingSlide = outgoing.find(".slide-inner");
    let incomingInfo = incoming.querySelector(".slide-info__wrap");
    incomingInfo.remove();
    outGoingSlide.appendTo(incoming);
    Flip.from(flipState, { duration: 1, ease: "power4.inOut", absolute: true });
  }
  
  function runFamilyAfter() {
    let progressBar = document.querySelector(".tl-line");
    gsap.to(progressBar, { scaleX: 0, ease: "expo.out", duration: 0.5 });
  
    let arrowDown = document.querySelector(".f-hero__down");
    arrowDown.classList.remove("u--hide");
  
    let centerVideo = document.querySelector(".slide-vid__wrap");
    if (centerVideo) {
      centerVideo.remove();
    }
  
    let videoBlur = document.querySelector('[data-video="blur"]');
    let videoMain = document.querySelector('[data-video="full"]');
    let imageBlur = document.querySelector("[data-image-blur]");
    videoMain.currentTime = videoBlur.currentTime;
    gsap.set(videoMain, { opacity: 1 });
    gsap.to(videoBlur, {
      opacity: 0,
      duration: 0.5,
      delay: 1,
      ease: "power3.inOut",
    });
    gsap.to(imageBlur, {
      opacity: 0,
      duration: 0.001,
      delay: 1,
      ease: "power3.inOut",
    });
  }
  
  function runFamilyNavTransition() {
    let familyNav = document.querySelector(".family-nav");
    let familyNavVids = familyNav.querySelectorAll(".bg-vid");
    familyNavVids.forEach((vid) => {
      vid.pause();
    });
    if (currentTimeline) {
      currentTimeline.reverse();
    }
    let hide = gsap.timeline({});
    hide
      .to(".family-nav", {
        height: "0px",
        ease: "power4.out",
        duration: 1.2,
      })
      .to(
        ".nav-bg",
        {
          height: "0%",
          overwrite: "height",
          ease: "power4.out",
          duration: 1,
        },
        0,
      )
      .to(".nav-page__bg", {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
      .fromTo(
        ".swiper-slide.is--family",
        {
          opacity: 1,
          yPercent: 0,
        },
        {
          opacity: 0,
          yPercent: 50,
          ease: "power4.out",
          duration: 1,
          stagger: { each: 0.02 },
        },
        0,
      );
  }
  
  barba.hooks.after((data) => {
    $(data.next.container).removeClass("fixed");
    $(".is--transitioning").removeClass("is--transitioning");
    $(".u--z-index-5").removeClass("u--z-index-5");
    resetWebflow(data);
    lenis.scrollTo(0, {
      immediate: true,
      force: true,
      lock: true,
      onComplete: () => {
        lenis.start();
        ScrollTrigger.refresh();
      },
    });
  });
  
  barba.hooks.leave((data) => {
    lenis.stop();
  });
  
  barba.hooks.enter((data) => {
    $(data.next.container).addClass("fixed");
    $(data.next.container).addClass("u--z-index-5");
  });
  
  barba.init({
    preventRunning: true,
    prevent: function ({ el }) {
      return el.hasAttribute("data-barba-prevent");
    },
    transitions: [
      {
        name: "home-default",
        sync: true,
        to: { namespace: ["play"] },
        afterEnter() {
          window.location.reload();
          initHomeLoader();
        },
      },
      {
        name: "stores-default",
        sync: true,
        to: { namespace: ["stores"] },
        afterEnter() {
          window.location.reload();
        },
      },
      {
        name: "family-to-family-nav",
        sync: true,
        leave(data) {
          navBoolean = false;
          runFamilyNavTransition();
          return gsap.to(data.current.container, {
            opacity: 0,
            delay: 0.2,
            duration: 1,
          });
        },
        enter(data) {
          gsap.from(data.next.container, {
            opacity: 0,
            duration: 1,
          });
        },
        custom: ({ trigger }) => {
          const shouldTrigger = trigger.classList.contains(
            "family-slider__video",
          );
          return shouldTrigger;
        },
      },
      {
        name: "mother",
        sync: true,
        to: { namespace: ["mother"] },
        afterEnter() {
          initMotherPage();
        },
      },
      {
        name: "home-to-family",
        sync: true,
        from: { namespace: ["play"] },
        to: { namespace: ["family"] },
        beforeEnter() {
          let videoMain = document.querySelector('[data-video="full"]');
          gsap.set(videoMain, { opacity: 0 });
          gsap.set(".slider-item", { pointerEvents: "none" });
          gsap.set(".cursor-main", { autoAlpha: 0, overwrite: true });
        },
        enter(data) {
          makeItemActive();
          flip($(".is--transitioning"), $(".f-hero"));
          let nextWrap = data.next.container;
          let hero = nextWrap.querySelector(".f-hero");
          let heroButton = hero.querySelector(".button-filled.is--slide");
          let heroSmallVid = hero.querySelector(".slide-vid__wrap");
          let cursorWrap = document.querySelector(".cursor-w");
          gsap.to(".cursor-img", {
            opacity: 0,
            scale: 0.6,
            stagger: 0.025,
            onComplete: () => {
              cursorWrap.remove();
            },
          });
          gsap.to(".slide-bg__wrap", {
            xPercent: 0,
            overwrite: true,
            duration: 1,
            ease: "power4.inOut",
          });
          gsap.to(heroButton, {
            yPercent: 50,
            opacity: 0,
            onComplete: () => {
              gsap.set(heroButton, { display: "none" });
            },
          });
          gsap.to(heroSmallVid, {
            opacity: 0,
            duration: 0.2,
            ease: "power4.out",
          });
          gsap.to('[data-video="full"]', {
            opacity: 1,
            delay: 1,
            duration: 0.2,
            ease: "power4.out",
          });
          return gsap.to(data.current.container, {
            opacity: 0,
            duration: 1.05,
            ease: "power4.out",
          });
        },
        after(data) {
          lenis.destroy();
          lenis = new Lenis({
            lerp: 0.2,
            orientation: "vertical",
            gestureOrientation: "vertical",
          });
          const sliderItems = document.querySelectorAll(
            "[data-family-bottom] .slider-item",
          );
          sliderItems.forEach((item) => {
            item.style.display = "block";
          });
          runFamilyAfter();
          gsap.set(".slider-item", { pointerEvents: "auto", clearProps: "all" });
        },
        afterEnter() {
          //setTimeout(initFamilyBottom, 50);
        },
      },
      {
        name: "family-to-home",
        sync: true,
        from: { namespace: ["family"] },
        to: { namespace: ["play"] },
        enter(data) {
          closeMainMenu();
          return gsap.to(data.current.container, { opacity: 0, duration: 0.5 });
        },
        afterEnter() {
          initHomeLoader();
          window.location.reload();
        },
      },
      {
        name: "stores-to-home",
        sync: true,
        from: { namespace: ["stores"] },
        to: { namespace: ["play"] },
        enter(data) {
          closeMainMenu();
          return gsap.to(data.current.container, { opacity: 0, duration: 0.5 });
        },
        afterEnter() {
          initHomeLoader();
        },
        after() {
          window.location.reload();
        },
      },
      {
        name: "family-to-family-bottom",
        sync: true,
        beforeEnter() {
          let videoMain = document.querySelectorAll('[data-video="full"]');
          gsap.set(videoMain, { opacity: 0 });
          gsap.set(".slider-item", { pointerEvents: "none" });
          gsap.set(".cursor-main", { autoAlpha: 0, overwrite: true });
        },
        enter(data) {
          makeItemActiveTest(data.next.container, data.current.container);
          let incomingHero = data.next.container.querySelector(".f-hero");
          flipTest($(".is--transitioning"), incomingHero);
  
          let nextWrap = data.next.container;
          let hero = nextWrap.querySelector(".f-hero");
          let heroButton = hero.querySelector(".button-filled.is--slide");
          let heroSmallVid = hero.querySelector(".slide-vid__wrap");
          let bottomSmallVid = hero.querySelector(".bottom-vid__wrap");
          gsap.to(".slide-bg__wrap", {
            xPercent: 0,
            overwrite: true,
            duration: 1,
            ease: "power4.inOut",
          });
          gsap.to(heroButton, {
            yPercent: 50,
            opacity: 0,
            onComplete: () => {
              gsap.set(heroButton, { display: "none" });
            },
          });
          // gsap.to(heroSmallVid, {
          //   opacity: 0,
          //   duration: 0.2,
          //   ease: "power4.out",
          // });
          gsap.to(bottomSmallVid, {
            opacity: 0,
            duration: 0.2,
            ease: "power4.out",
          });
          gsap.to('[data-video="full"]', {
            opacity: 1,
            delay: 1,
            duration: 0.2,
            ease: "power4.out",
          });
          return gsap.to(data.current.container, {
            opacity: 0,
            duration: 1.05,
            ease: "power4.out",
          });
        },
        after() {
          gsap.set(".slider-item", { pointerEvents: "auto", clearProps: "all" });
          runFamilyAfter();
        },
        custom: ({ trigger }) => {
          const shouldTrigger = trigger.hasAttribute("data-family-bottom-link");
          return shouldTrigger;
        },
      },
      {
        name: "family-default",
        sync: true,
        to: { namespace: ["family"] },
        afterEnter(data) {
          runFamilyAfter();
          setTimeout(initFamilyBottom(data.next.container), 50);
        },
      },
    ],
    views: [
      {
        namespace: "play",
        afterEnter() {
          initSlider();
          removeFamilyNav();
        },
      },
      {
        namespace: "family",
        afterEnter(data) {
          initFamilyPage(data.next.container);
          runFamilyAfter();
          setTimeout(initFamilyBottom(data.next.container), 50);
        },
      },
      {
        namespace: "mother",
        afterEnter(data) {
          initMotherPage();
          initFamilyPage(data.next.container);
        },
      },
    ],
  });
  