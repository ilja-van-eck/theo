function initSlider() {
    document.addEventListener("DOMContentLoaded", () => {
      // ––––– PROGRESS BAR
      let progressBar = document.querySelector(".tl-line");
      function updateProgressBar() {
        var progress = lenis.progress;
        var maxScale = isMobile() ? 1.13 : 1;
        var scaledProgress = Math.min(progress * maxScale, 1);
  
        gsap.set(progressBar, {
          scaleX: scaledProgress,
          ease: "none",
        });
      }
      lenis.on("scroll", updateProgressBar);
      updateProgressBar();
  
      // ––––– APPEND END SLIDE
      let slideEnd = document.querySelector(".slide-end");
      let sliderList = document.querySelector(".slider-list");
      if (slideEnd && sliderList) {
        sliderList.appendChild(slideEnd);
      }
  
      function isSmallScreen() {
        return window.matchMedia("(max-width: 991px)").matches;
      }
  
      // Parallax on the last slide
      gsap.from(".slide-end__inner", {
        xPercent: isSmallScreen() ? 0 : -75,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".slide-end",
          start: isSmallScreen() ? "top bottom" : "left right",
          end: isSmallScreen() ? "top top" : "left center",
          scrub: true,
          horizontal: !isSmallScreen(),
        },
      });
  
      // Parallax on slide background
      let slides = gsap.utils.toArray(".slider-item");
      slides.forEach((slide, index) => {
        let bgWrap = slide.querySelector(".slide-bg__wrap");
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: slide,
            start: isSmallScreen() ? "top bottom" : "left right",
            end: isSmallScreen() ? "top top" : "left left",
            scrub: true,
            horizontal: !isSmallScreen(),
            snap: {
              snapTo: isSmallScreen() ? [0, 1] : [0, 0.5, 1],
              duration: { min: 0.1, max: 0.6 },
              ease: "expo.out",
            },
            onToggle: () => {
              if (isSmallScreen()) {
                gsap.to("[data-home-info]", {
                  opacity: 0,
                  y: "1.5rem",
                  duration: 0.3,
                  ease: "power3.out",
                });
              }
            },
            onSnapComplete: () => {
              if (isSmallScreen()) {
                gsap.to("[data-home-info]", {
                  opacity: 1,
                  y: "0rem",
                  duration: 0.3,
                  ease: "power3.out",
                });
              }
            },
          },
        });
        tl.fromTo(
          bgWrap,
          {
            xPercent: isSmallScreen() ? 0 : -50,
          },
          { xPercent: 0, yPercent: 0, ease: "none", duration: 1 },
        ).addLabel(index, "1");
  
        gsap.fromTo(
          slide,
          {
            xPercent: 0,
            yPercent: 0,
          },
          {
            xPercent: isSmallScreen() ? 0 : 100,
            ease: "none",
            scrollTrigger: {
              trigger: slide,
              start: isSmallScreen() ? "top top" : "left left",
              end: isSmallScreen() ? "bottom top" : "right left",
              scrub: true,
              horizontal: !isSmallScreen(),
            },
          },
        );
      });
  
      // ––––– PAGINATION DOTS IN NAV
      let amountOfSlides = slides.length;
      let endPoint = window.innerWidth * 0.5 * amountOfSlides;
      let tlItems = document.querySelectorAll(".tl-item");
      tlItems.forEach((item, index) => {
        item.addEventListener("click", () => {
          let increment = endPoint / tlItems.length;
          let value = increment * index;
          lenis.scrollTo(value, {
            duration: 1,
            lerp: 0.1,
            lock: true,
            force: true,
          });
        });
      });
  
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
              videoMain.play();
            }
  
            if (
              videoBg &&
              videoMain &&
              videoBg.currentTime !== videoMain.currentTime
            ) {
              videoBg.currentTim = videoMain.currentTime;
            }
          } else {
            if (videoBg) {
              videoBg.pause();
            }
            if (videoMain) {
              videoMain.pause();
            }
          }
        });
      }
      slides.forEach((slide, index) => {
        let videoMain = slide.querySelector(".slide-vid");
        let videoBg = slide.querySelector(".bg-vid");
        let dataRatingEl = slide.querySelector("[data-rating]");
        let dataRating = dataRatingEl ? dataRatingEl.textContent.trim() : null;
        let dataColor = slide.querySelector("[data-color]").style.backgroundColor;
  
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
            if (videoMain) {
              videoMain.volume = 0;
              videoMain.play();
            }
  
            if (videoBg) videoBg.play();
  
            if (dataRating !== "m") {
              let tlIndex = parseInt(dataRating, 10) - 1;
              let tlItem = document.querySelectorAll(".tl-item")[tlIndex];
              if (tlItem) {
                tlItem.classList.add("active");
                let itemDot = tlItem.querySelector(".item-dot");
                if (itemDot) {
                  itemDot.style.backgroundColor = dataColor;
                }
              }
            }
          });
  
          slide.addEventListener("mouseleave", () => {
            if (videoMain) videoMain.pause();
            if (videoBg) videoBg.pause();
  
            if (dataRating !== "m") {
              let tlIndex = parseInt(dataRating, 10) - 1;
              let tlItem = document.querySelectorAll(".tl-item")[tlIndex];
              if (tlItem) {
                tlItem.classList.remove("active");
                let itemDot = tlItem.querySelector(".item-dot");
                if (itemDot) {
                  itemDot.style.backgroundColor = "white";
                }
              }
            }
          });
        }
      });
  
      // DOMContentLoaded
    });
  }
  