document.addEventListener("DOMContentLoaded", function () {
    let streamReference;
    let videoElement;
  
    function isMobileLandscape() {
      return window.matchMedia("(orientation: landscape) and (max-height: 500px)")
        .matches;
    }
  
    function enableCamera() {
      const cameraImages = document.querySelectorAll(".e-img");
      const cameraTitles = document.querySelectorAll(".e-item");
      let currentIndex = 0;
  
      function showItem(index) {
        cameraImages.forEach((item) => {
          item.style.opacity = 0;
        });
        cameraTitles.forEach((item) => {
          item.style.opacity = 0;
        });
        cameraImages[index].style.opacity = 1;
        cameraTitles[index].style.opacity = 1;
      }
  
      document
        .querySelector("[data-pagination-next]")
        .addEventListener("click", function () {
          currentIndex = (currentIndex + 1) % cameraImages.length;
          showItem(currentIndex);
        });
  
      document
        .querySelector("[data-pagination-prev]")
        .addEventListener("click", function () {
          currentIndex =
            (currentIndex - 1 + cameraImages.length) % cameraImages.length;
          showItem(currentIndex);
        });
      showItem(currentIndex);
  
      let wrap = document.getElementById("cameraView");
      let page = document.querySelector(".page-w");
      wrap.style.display = "block";
      page.style.visibility = "hidden";
  
      if (!videoElement) {
        videoElement = document.createElement("video");
        videoElement.setAttribute("playsinline", "");
        videoElement.setAttribute("autoplay", "");
        videoElement.setAttribute("muted", "");
        videoElement.classList.add("bg-vid");
        videoElement.style.transform = "scaleX(-1)";
        wrap.appendChild(videoElement);
      }
  
      const constraints = {
        video: { facingMode: "user" },
        audio: false,
      };
  
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            streamReference = stream;
            videoElement.srcObject = stream;
          })
          .catch(function (error) {
            console.error("Error accessing the camera: ", error);
          });
      } else {
        console.error("Your browser does not support getUserMedia API");
      }
    }
  
    function disableCamera() {
      if (streamReference) {
        streamReference.getTracks().forEach((track) => track.stop());
        streamReference = null;
      }
      let wrap = document.getElementById("cameraView");
      wrap.style.display = "none";
      if (videoElement) {
        videoElement.srcObject = null;
      }
    }
  
    if (isMobileLandscape()) {
      enableCamera();
    }
  
    window.addEventListener("resize", function () {
      if (isMobileLandscape()) {
        enableCamera();
      } else {
        disableCamera();
        let wrap = document.getElementById("cameraView");
        let page = document.querySelector(".page-w");
        wrap.style.display = "none";
        page.style.display = "block";
      }
    });
  });

  gsap.defaults({
    ease: "power4.inOut",
    duration: 0.6,
  });
  let openedColumn = null;
  let thirdColumn = false;
  
  function toggleMenu(clickedLink) {
    let linkValue = clickedLink.getAttribute("data-menu-link");
    let linkTextElement = clickedLink.querySelector(".h-reg");
    let linkText = linkTextElement.innerText;
    let menuColumn = document.querySelector(`[data-menu="${linkValue}"]`);
    let menuColmnLabel = menuColumn.querySelectorAll("[data-menu-name");
    menuColmnLabel.forEach((label) => {
      label.innerText = linkText;
    });
    let countryColumn = document.querySelector(`[data-menu="country"]`);
    let familyColumn = document.querySelector(`[data-menu="family"]`);
    let storeColumn = document.querySelector(`[data-menu="stores"]`);
    let collectionColumn = document.querySelector(`[data-menu="collections"]`);
  
    if (menuColumn === openedColumn) return;
    if (menuColumn === countryColumn || menuColumn === familyColumn) {
      thirdColumn = true;
    }
  
    document.querySelectorAll(".menu-link.is--main").forEach((link) => {
      if (clickedLink.classList.contains("is--main")) {
        link.classList.toggle("is--inactive", link !== clickedLink);
      }
    });
  
    if (!(linkValue === "family" || linkValue === "country")) {
      if (thirdColumn) {
        gsap.to([storeColumn, collectionColumn], {
          x: "-101%",
          duration: 0.5,
          onComplete: () => {
            gsap.set([storeColumn, collectionColumn], { display: "none" });
            openedColumn = menuColumn;
  
            gsap.set(menuColumn, { display: "block" });
            gsap.fromTo(menuColumn, { x: "-101%" }, { x: "0%" });
            gsap.to("[data-info-line]", {
              y: "100%",
              autoAlpha: 0,
              ease: "power3.out",
              stagger: { each: 0.02, from: "end" },
            });
  
            document
              .querySelectorAll(".menu-link.is--country")
              .forEach((link) => {
                link.classList.remove("is--inactive");
              });
          },
        });
        gsap.to([countryColumn, familyColumn], {
          x: "-201%",
          duration: 0.4,
          onComplete: () => {
            gsap.set([countryColumn, familyColumn], { display: "none" });
            openedColumn = null;
            thirdColumn = null;
          },
        });
        return;
      }
      gsap.to(openedColumn, {
        x: "-101%",
        duration: openedColumn ? 0.4 : 0,
        onComplete: () => {
          gsap.set(openedColumn, { display: "none" });
          openedColumn = menuColumn;
          gsap.set(menuColumn, { display: "block" });
          gsap.fromTo(menuColumn, { x: "-101%" }, { x: "0%" });
          gsap.to("[data-info-line]", {
            y: "100%",
            autoAlpha: 0,
            ease: "power3.out",
            stagger: { each: 0.02, from: "end" },
          });
        },
      });
    } else {
      openedColumn = menuColumn;
      gsap.set(menuColumn, { display: "block" });
      gsap.fromTo(menuColumn, { x: "-101%" }, { x: "0%" });
      gsap.to("[data-info-line]", {
        y: "100%",
        autoAlpha: 0,
        ease: "power3.out",
        stagger: { each: 0.02, from: "end" },
      });
    }
  }
  
  function closeMenu(closeButton) {
    let linkValue = closeButton.getAttribute("data-menu-close");
    let menuColumn = document.querySelector(`[data-menu="${linkValue}"]`);
  
    if (openedColumn) {
      gsap.to(menuColumn, {
        x: "-101%",
        duration: 0.5,
        onComplete: () => {
          gsap.set(menuColumn, { display: "none" });
        },
      });
      gsap.to(openedColumn, {
        x: "-201%",
        duration: 0.4,
        onComplete: () => {
          gsap.set(openedColumn, { display: "none" });
          openedColumn = null;
        },
      });
      gsap.to("[data-info-line", {
        y: "0%",
        autoAlpha: 1,
        ease: "power3.out",
        stagger: { each: 0.02, from: "start" },
      });
    } else {
      if (menuColumn) {
        gsap.to(menuColumn, {
          x: "-101%",
          duration: 0.4,
          onComplete: () => {
            gsap.set(menuColumn, { display: "none" });
          },
        });
        gsap.to("[data-info-line", {
          y: "0%",
          autoAlpha: 1,
          ease: "power3.out",
          stagger: { each: 0.02, from: "start" },
        });
      }
    }
  
    document.querySelectorAll(".menu-link").forEach((link) => {
      link.classList.remove("is--inactive");
    });
  }
  
  function openMainMenu() {
    // setupSaveIconClickHandlers();
    // updateAllSaveIcons(savedModels);
  
    gsap.to(".cursor-main", {
      autoAlpha: 0,
      y: "1rem",
      overwrite: true,
    });
  
    let tl = gsap.timeline();
    gsap.set(".menu-w", { display: "flex" });
    let main = document.querySelector(".main-w");
    let namespace = main.getAttribute("data-barba-namespace");
    let familyPage = namespace === "family";
    if (currentTimeline) currentTimeline.reverse();
  
    tl.to(".menu-col.is--main", { x: 0, duration: 0.6 })
      .to(
        "#menu-button",
        {
          color: "transparent",
          duration: 0.4,
          onStart: () => {
            gsap.set(".nav-w", { pointerEvents: "none" });
          },
        },
        0,
      )
      .fromTo(
        ".menu-link.is--main",
        { autoAlpha: 0, y: "50%" },
        {
          autoAlpha: 1,
          y: "0%",
          duration: 0.45,
          stagger: 0.05,
          clearProps: "all",
        },
        "0.3",
      )
      .from(
        "[data-info-line]",
        { autoAlpha: 0, y: "50%", duration: 0.45, stagger: 0.05 },
        "<",
      )
      .to(
        "[data-nav-fade]",
        { autoAlpha: 0, y: "1rem", duration: 0.45, stagger: 0.025 },
        0,
      )
      .to(
        ".tl-line__wrap",
        {
          scaleX: 0,
          duration: 0.45,
        },
        0,
      )
      .fromTo(".menu-bg", { opacity: 0 }, { opacity: 1, duration: 0.45 }, 0);
  
    if (namespace !== "play") {
      tl.fromTo(
        ".menu-bg",
        {
          backdropFilter: "blur(0px)",
        },
        {
          backdropFilter: "blur(20px)",
          duration: 0.4,
        },
        0,
      ).to(
        ".nav-w",
        {
          yPercent: -100,
          duration: 0.45,
        },
        0,
      );
    }
  }
  
  function closeMainMenu() {
    let main = document.querySelector(".main-w");
    let namespace = main.getAttribute("data-barba-namespace");
    let storeLocator = namespace === "stores";
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(".menu-w", { display: "none" });
        if (!storeLocator) gsap.set(".nav-w", { pointerEvents: "auto" });
      },
      onStart: () => {
        gsap.set(".nav-w", { pointerEvents: "none" });
      },
    });
    tl.to(".menu-col.is--main", { x: "-101%", duration: 0.5 })
      .to(
        "[data-nav-fade]",
        { autoAlpha: 1, y: "0rem", duration: 0.35, stagger: 0.025 },
        0,
      )
      .to(
        "[data-info-line]",
        { autoAlpha: 1, y: "0%", duration: 0.35, stagger: 0.025 },
        0,
      )
      .to(
        ".tl-line__wrap",
        {
          scaleX: 1,
          duration: 0.35,
        },
        0,
      )
      .to(
        "#menu-button",
        {
          color: "#fff",
          duration: 0.4,
          clearProps: "all",
          onEnd: () => {
            gsap.set(".nav-w", { pointerEvents: "auto", clearProps: true });
          },
        },
        0,
      )
      .to(".menu-bg", { opacity: 0, duration: 0.45 }, 0)
      .to(
        ".nav-bg",
        {
          height: navBoolean ? "100%" : "0%",
          duration: 0.45,
        },
        0,
      )
      .to(".nav-w", { y: 0, opacity: 1, duration: 0.45 }, 0);
    if (openedColumn) {
      tl.to(
        openedColumn,
        {
          x: "-301%",
          duration: 0.5,
          onComplete: () => {
            gsap.set(openedColumn, { display: "none" });
            openedColumn = null;
          },
        },
        0,
      );
    }
    if (
      openedColumn &&
      (openedColumn.matches(".menu-col.is--family") ||
        openedColumn.matches(".menu-col.is--stores"))
    ) {
      tl.to(
        [".menu-col.is--collection", ".menu-col.is--countries"],
        {
          x: "-201%",
          duration: 0.5,
          onComplete: () => {
            gsap.set(".menu-col.is--collection", { display: "none" });
            gsap.set(".menu-col.is--countries", { display: "none" });
            openedColumn = null;
          },
        },
        0,
      );
    }
    if (namespace !== "play") {
      tl.fromTo(
        ".menu-bg",
        {
          backdropFilter: "blur(20px)",
        },
        {
          backdropFilter: "blur(0px)",
          duration: 0.4,
        },
        0,
      );
    }
    document.querySelectorAll(".menu-link").forEach((link) => {
      link.classList.remove("is--inactive");
    });
  }
  
  // Event listener for the menu button
  document.querySelectorAll("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(link));
  });
  document.querySelectorAll("[data-menu-close]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.getAttribute("data-menu-close") === "main") {
        closeMainMenu();
      } else {
        closeMenu(button);
      }
    });
  });
  document.getElementById("menu-button").addEventListener("click", openMainMenu);
  document.getElementById("menu-bg").addEventListener("click", closeMainMenu);
  document
    .getElementById("close-button")
    .addEventListener("click", closeMainMenu);
  
  //
  //
  // COUNTRY LINKS
  document.querySelectorAll(".menu-link.is--country").forEach((link) => {
    link.addEventListener("click", function () {
      document.querySelectorAll(".menu-link.is--country").forEach((otherLink) => {
        otherLink.classList.add("is--inactive");
      });
      this.classList.remove("is--inactive");
    });
  });
  
  //
  //
  //
  //
  // STORE LINKS
  let storeLinks = document.querySelectorAll('[data-menu-link="country"]');
  storeLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const dataUrl = this.getAttribute("data-url");
      const requestUrl = `${window.location.origin}/countries/${dataUrl}`;
  
      if (openedColumn) {
        gsap.fromTo(
          openedColumn,
          { xPercent: 0 },
          {
            xPercent: -101,
            ease: "power3.out",
            duration: 0.5,
            onComplete: updateContent,
          },
        );
      } else {
        updateContent();
      }
  
      function updateContent() {
        fetch(requestUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text();
          })
          .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const storeList = doc.querySelector("[data-store-list]");
            const storeWrap = document.querySelector("[data-store-wrap]");
            if (storeList && storeWrap) {
              storeWrap.innerHTML = storeList.innerHTML;
            }
            if (openedColumn) {
              gsap.to(openedColumn, {
                xPercent: 0,
                ease: "power3.out",
                duration: 0.5,
              });
            }
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation:",
              error,
            );
          });
      }
    });
  });
  //
  //
  //
  //
  // SELECT FAMILY LINKS
  let familyLinks = document.querySelectorAll('[data-menu-link="family"]');
  let familyButton = document.querySelector("[data-family-button]");
  familyButton.addEventListener("click", closeMainMenu);
  
  familyLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const dataUrl = this.getAttribute("data-url");
      const requestUrl = `${window.location.origin}/families/${dataUrl}`;
      familyButton.setAttribute("href", requestUrl);
  
      if (openedColumn) {
        gsap.fromTo(
          openedColumn,
          { xPercent: 0 },
          {
            xPercent: -101,
            ease: "power3.out",
            duration: 0.5,
            onComplete: updateContent,
          },
        );
      } else {
        updateContent();
      }
  
      function updateContent() {
        fetch(requestUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text();
          })
          .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const familyItems = doc.querySelectorAll("[data-family-item]");
            const familyWrap = document.querySelector("[data-family-wrap]");
  
            if (familyItems.length > 0 && familyWrap) {
              familyWrap.innerHTML = "";
              familyItems.forEach((item) => {
                item.classList.add("is--menu");
                const img = item.querySelector(".product-item__img");
                if (img) {
                  img.classList.remove("product-item__img");
                  img.classList.add("menu-family__img");
                }
                familyWrap.appendChild(item);
              });
            }
            if (openedColumn) {
              gsap.to(openedColumn, {
                xPercent: 0,
                ease: "power3.out",
                duration: 0.5,
              });
            }
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation:",
              error,
            );
          });
      }
    });
  });
  
  // EMAIL LINKS
  document.querySelectorAll("[data-email-link]").forEach((link) => {
    let originalText;
    const emailTextElement =
      link.parentElement.querySelector("[data-email-text]");
  
    link.addEventListener("mouseenter", () => {
      originalText = emailTextElement.textContent;
      emailTextElement.textContent = "click to copy email";
    });
  
    link.addEventListener("mouseleave", () => {
      emailTextElement.textContent = originalText;
    });
  
    link.addEventListener("click", () => {
      emailTextElement.textContent = "copied email address!";
      navigator.clipboard.writeText(link.textContent).then(() => {
        setTimeout(() => {
          emailTextElement.textContent = originalText;
        }, 2000);
      });
    });
  });
  
  // MAKE ALL X CLOSE MAIN ON MOBILE
  if (window.innerWidth < 480) {
    document.querySelectorAll(".menu-close").forEach((element) => {
      element.setAttribute("data-menu-close", "main");
    });
  }

  function initFamilyPage() {
    ScrollTrigger.refresh();
    let nav = document.querySelector(".nav-w");
    let navScoreItems = document.querySelectorAll(".tl-item");
  
    nav.setAttribute("state", "default");
    nav.classList.remove("scrolled");
  
    // ---------- FAMILY SLIDER IN NAV
    let score;
    let scoreIndex;
  
    function navScore() {
      score = document.querySelector("[data-index]").textContent;
      scoreIndex = parseInt(score, 10) - 1;
  
      navScoreItems.forEach((item, index) => {
        item.classList.remove("hovered");
        let inner = item.querySelector(".item-dot");
        gsap.to(inner, {
          backgroundColor: "#fff",
          duration: 0.2,
          clearProps: "backgroundColor",
        });
        if (index !== scoreIndex) {
          item.classList.remove("active");
        } else {
          item.classList.add("active");
        }
      });
    }
    setTimeout(navScore, 50);
  
    gsap.to(".modal-close", { height: "0rem", duration: 0.45, ease: "expo.out" });
  
    let familySlider = new Swiper(".swiper.is--family", {
      slidesPerView: "auto",
      spaceBetween: 40,
      centeredSlides: true,
      speed: 800,
      keyboard: {
        enabled: true,
      },
      mousewheel: {
        invert: false,
      },
    });
  
    navScoreItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        familySlider.slideTo(index, 1000);
        gsap.set(".nav-bg", { height: "100%" });
      });
    });
  
    familySlider.on("slideChangeTransitionEnd", function () {
      let activeSlideScore = document
        .querySelector(".swiper-slide-active")
        .getAttribute("data-slide-score");
      let activeSlideIndex = parseInt(activeSlideScore, 10) - 1;
  
      navScoreItems.forEach((item) => item.classList.remove("hovered"));
  
      if (activeSlideIndex >= 0 && activeSlideIndex < navScoreItems.length) {
        navScoreItems[activeSlideIndex].classList.add("hovered");
      }
    });
  
    let familyTl = gsap.timeline({});
    let isOpen = false;
  
    let familyNav = document.querySelector(".family-nav");
    let familyNavVids = familyNav.querySelectorAll(".bg-vid");
  
    familyNavVids.forEach((vid) => {
      vid.dataset.readyToPlay = "false";
      vid.addEventListener("loadeddata", function () {
        this.dataset.readyToPlay = "true";
      });
      vid.load();
    });
  
    showFamilySlider = function () {
      if (isOpen) return;
      isOpen = true;
      familySlider.slideTo(scoreIndex, 0, false);
      lenis.stop();
      if (isMobile()) {
        gsap.set(".nav-page__bg", { pointerEvents: "auto" });
      }
  
      familyTl.clear().progress(0);
      familyTl
        .to(".family-nav", {
          height: "auto",
          ease: "expo.out",
          duration: 0.8,
        })
        .to(
          ".nav-bg",
          {
            height: "100%",
            ease: "expo.out",
            duration: 0.8,
          },
          0,
        )
        .fromTo(
          ".nav-page__bg",
          {
            opacity: 0,
          },
          {
            opacity: 1,
            ease: "expo.out",
            duration: 0.8,
          },
          0,
        )
        .fromTo(
          ".swiper-slide.is--family",
          {
            opacity: 0,
            yPercent: 50,
          },
          {
            opacity: 1,
            yPercent: 0,
            ease: "expo.out",
            duration: 1,
            stagger: { each: 0.06 },
          },
          0,
        );
      familyNavVids.forEach((vid) => {
        if (vid.dataset.readyToPlay === "true") {
          vid.play();
        } else {
          vid.addEventListener(
            "loadeddata",
            function () {
              this.play();
            },
            { once: true },
          );
        }
      });
    };
    hideFamilySlider = function () {
      isOpen = false;
      gsap.set(".nav-page__bg", {
        pointerEvents: "none",
        clearProps: "pointerEvents",
      });
  
      lenis.start();
      familyTl.clear().progress(0);
      familyTl
        .to(".family-nav", {
          height: "0px",
          ease: "expo.out",
          duration: 0.6,
        })
        .to(
          ".nav-bg",
          {
            height: navBoolean ? "100%" : "0%",
            overwrite: true,
            ease: "expo.out",
            duration: 0.6,
          },
          0,
        )
        .to(
          ".nav-page__bg",
          {
            opacity: 0,
            ease: "expo.out",
            duration: 0.6,
          },
          0,
        )
        .fromTo(
          ".swiper-slide.is--family",
          {
            opacity: 1,
            yPercent: 0,
          },
          {
            opacity: 0,
            yPercent: 50,
            ease: "expo.out",
            duration: 0.8,
            stagger: { each: 0.02 },
            onStart: () => {
              navScoreItems.forEach((item) => item.classList.remove("hovered"));
            },
          },
          0,
        );
      familyNavVids.forEach((vid) => {
        vid.pause();
      });
    };
    let scoreWrap = document.querySelector(".tl-w");
    let navWrap = document.querySelector(".nav-w");
    let navBg = document.querySelector(".nav-page__bg");
    // scoreWrap.addEventListener("mouseenter", showFamilySlider, false);
    // navWrap.addEventListener("mouseleave", hideFamilySlider, false);
    if (!isMobile()) {
      scoreWrap.addEventListener("mouseenter", showFamilySlider, false);
      navWrap.addEventListener("mouseleave", hideFamilySlider, false);
    } else {
      scoreWrap.addEventListener("click", showFamilySlider, false);
      navBg.addEventListener("click", hideFamilySlider, false);
    }
  
    //
    //
    //
  
    // ---------- COPY LINK TO CLIPBOARD
    let shareLinkElement = document.querySelector("[data-share-link]");
    let shareTextElement = shareLinkElement.querySelector("[data-share-text]");
    shareLinkElement.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        let originalText = shareTextElement.innerText;
        shareTextElement.innerText = "Copied link to clipboard";
        setTimeout(() => {
          shareTextElement.innerText = originalText;
        }, 3000);
      });
    });
  
    gsap.delayedCall(0.1, () => {
      let navToggle = document.querySelector("[data-toggle-nav]");
      let navEnd = document.querySelector("[data-family-end]");
      let navBg = nav.querySelector(".nav-bg");
  
      ScrollTrigger.create({
        trigger: navToggle,
        start: "top top+=5%",
        onEnter: function () {
          nav.classList.add("scrolled");
          navBoolean = true;
          gsap.to(navBg, {
            height: "100%",
            duration: 0.45,
            ease: "expo.out",
            overwrite: true,
          });
        },
        onLeaveBack: function () {
          nav.classList.remove("scrolled");
          navBoolean = false;
          gsap.to(navBg, {
            height: "0%",
            duration: 0.45,
            ease: "expo.out",
            overwrite: true,
          });
        },
      });
      ScrollTrigger.create({
        trigger: navEnd,
        start: "top top+=5%",
        onEnter: function () {
          nav.classList.remove("scrolled");
          navBoolean = false;
          gsap.to(navBg, {
            height: "0%",
            duration: 0.45,
            ease: "expo.out",
            overwrite: true,
          });
        },
        onLeaveBack: function () {
          nav.classList.remove("scrolled");
          navBoolean = true;
          gsap.to(navBg, {
            height: "100%",
            duration: 0.45,
            ease: "expo.out",
            overwrite: true,
          });
        },
      });
    });
  
    function ajaxModal() {
      let lightbox = document.querySelector('[data-modal="lightbox"]');
      if (!lightbox) return;
      let lightboxModal = document.querySelector('[data-modal="lightbox-modal"]');
      let lightboxClose = document.querySelector(".modal-close");
      let cmsLink = document.querySelectorAll('[data-modal="cms-link"]');
      let cmsPageContent = '[data-modal="cms-page-content"]';
      let closeButton = document.querySelector(".modal-close");
      let focusedLink;
  
      function createTimelineWithContentLoaded(cmsContent) {
        var cmsPageLinks = cmsContent.querySelectorAll(
          '[data-modal="page-link"]',
        );
        var cmsPageDetails = cmsContent.querySelectorAll(
          '[data-modal="page-detail"]',
        );
  
        let tl = gsap.timeline({
          defaults: {
            ease: "expo.inOut",
            duration: 0.45,
          },
          onReverseComplete: () => {
            lenis.start();
          },
          onStart: () => {
            lenis.stop();
            initialNav = navBoolean;
            navBoolean = true;
          },
        });
  
        tl.set(lightbox, {
          display: "block",
          onComplete: () => {
            lightboxModal.scrollTop = 0;
            navBoolean = initialNav;
          },
        })
          .fromTo(lightboxModal, { y: "100vh" }, { y: "0vh", duration: 1 }, 0)
          .to(".nav-bg", { height: "100%" }, 0)
          .fromTo(closeButton, { height: "0rem" }, { height: "3.5rem" }, 0.55)
          .fromTo(
            [...cmsPageLinks, ...cmsPageDetails],
            { opacity: 0, yPercent: 50 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.5,
              overwrite: true,
              stagger: { each: 0.05 },
            },
            0.4,
          );
  
        if (window.innerWidth < 992) {
          tl.to(
            "[data-nav-fade]",
            {
              autoAlpha: 0,
              y: "1rem",
              duration: 0.35,
              stagger: 0.025,
            },
            0,
          );
        }
  
        return tl;
      }
  
      function keepFocusWithinLightbox() {
        let focusableElements = lightbox.querySelectorAll(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        let lastFocusableElement =
          focusableElements[focusableElements.length - 1];
        lastFocusableElement.addEventListener("focusout", function () {
          lightboxClose.focus();
        });
      }
  
      function lightboxReady() {
        setupSaveIconClickHandlers();
        updateAllSaveIcons(savedModels);
  
        let otherPageLink = document.querySelectorAll('[data-modal="page-link"]');
        otherPageLink.forEach((link, i) => {
          link.addEventListener("click", function (e) {
            cmsLink = null;
            cmsLink = document.querySelectorAll('[data-modal="cms-link"]');
            e.preventDefault();
            var index = i;
  
            currentTimeline
              .timeScale(1.4)
              .reverse()
              .eventCallback("onReverseComplete", function () {
                cmsLink[index].click();
              });
          });
        });
      }
  
      cmsLink.forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
  
          lightboxModal.innerHTML = "";
          gsap.to(".f-overlay", { opacity: 0.5, duration: 1 });
  
          let linkUrl = this.getAttribute("href");
          fetch(linkUrl)
            .then((response) => response.text())
            .then((responseText) => {
              let parser = new DOMParser();
              let doc = parser.parseFromString(responseText, "text/html");
              let cmsContent = doc.querySelector(cmsPageContent);
              let cmsTitle = doc.querySelector("title").textContent;
              let cmsUrl = window.location.origin + linkUrl;
  
              //updatePageInfo(cmsTitle, cmsUrl);
              lightboxModal.appendChild(cmsContent);
  
              currentTimeline = createTimelineWithContentLoaded(cmsContent);
              currentTimeline.timeScale(1).play();
  
              keepFocusWithinLightbox();
              lightboxReady();
            });
        });
      });
  
      const mouseLeaveEvent = new MouseEvent("mouseleave", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
  
      lightboxClose.addEventListener("click", function () {
        if (currentTimeline) {
          currentTimeline.reverse();
          gsap.to(".f-overlay", { opacity: 0, duration: 0.6 });
        }
      });
      document.addEventListener("keydown", function (e) {
        if (!lightbox.contains(e.target) && currentTimeline) {
          currentTimeline.reverse();
          gsap.to(".f-overlay", { opacity: 0, duration: 0.6 });
        }
      });
      document.addEventListener("click", function (e) {
        if (e.key === "Escape" && currentTimeline) {
          currentTimeline.reverse();
          gsap.to(".f-overlay", { opacity: 0, duration: 0.6 });
        }
      });
    }
    ajaxModal();
  
    // ---- play inline vids
    setTimeout(() => {
      let vids = document.querySelectorAll(".family-video");
      vids.forEach((vid) => {
        vid.play();
      });
    }, 500);
  
  }
  
  let savedModels = getSavedModels();
updateAllSaveIcons(savedModels);
setupSaveIconClickHandlers();
checkAndToggleShareButtonVisibility();

const urlParams = new URLSearchParams(window.location.search);
const wishlistItemsFromURL = urlParams.get("wishlist");
if (wishlistItemsFromURL) {
  const modelsFromURL = wishlistItemsFromURL
    .split(",")
    .map(decodeURIComponent)
    .map(slugifyModelName);
  savedModels = [...new Set([...savedModels, ...modelsFromURL])];
  updateAllSaveIcons(savedModels);
}
loadWishlistItems(savedModels);
//});

function slugifyModelName(modelName) {
  return modelName.toLowerCase().replace(/[\s+\/]/g, "-");
}

function getSavedModels() {
  let models = JSON.parse(localStorage.getItem("savedModels") || "[]").map(
    slugifyModelName,
  );
  const urlParams = new URLSearchParams(window.location.search);
  const wishlistItemsFromURL = urlParams.get("wishlist");

  if (wishlistItemsFromURL) {
    const urlModels = wishlistItemsFromURL
      .split(",")
      .map(decodeURIComponent)
      .map(slugifyModelName);
    models = [...new Set([...models, ...urlModels])];
    localStorage.setItem("savedModels", JSON.stringify(models));
  }

  return models;
}

function updateAllSaveIcons(savedModels) {
  document.querySelectorAll(".save-icon").forEach((button) => {
    const modelId = button.getAttribute("data-model");
    const slugifiedModelId = slugifyModelName(modelId);
    if (savedModels.includes(slugifiedModelId)) {
      button.classList.add("is--saved");
    } else {
      button.classList.remove("is--saved");
    }
  });
}

function updateWishlistSaveIcons() {
  const wishlistWrap = document.querySelector("[data-wishlist-wrap]");
  if (wishlistWrap) {
    wishlistWrap.querySelectorAll(".save-icon").forEach((button) => {
      button.classList.add("is--saved");
    });
  }
}

function setupSaveIconClickHandlers() {
  document.querySelectorAll(".save-icon").forEach((button) => {
    button.addEventListener("click", function () {
      const modelId = this.getAttribute("data-model");
      toggleModelIdInLocalStorage(modelId, this);
      checkAndToggleShareButtonVisibility();
      updateWishlistSaveIcons();
      //
    });
  });
}

function toggleModelIdInLocalStorage(modelId, button) {
  let savedModels = JSON.parse(localStorage.getItem("savedModels") || "[]").map(
    slugifyModelName,
  );
  const slugifiedModelId = slugifyModelName(modelId);
  const modelIndex = savedModels.indexOf(slugifiedModelId);

  if (modelIndex === -1) {
    // –––– TOGGLE MODAL IF EMPTY
    if (savedModels.length === 0) {
      const modalToggle = document.querySelector("#w-modal-toggle");
      if (modalToggle) {
        modalToggle.click();
      }
    }

    savedModels.push(slugifiedModelId);
    button.classList.add("is--saved");

    const modelSlug = slugifyModelName(modelId);
    const modelUrl = `/models/${modelSlug}`;
    fetchModelItem(modelUrl, document.querySelector("[data-wishlist-wrap]"));
  } else {
    savedModels.splice(modelIndex, 1);
    button.classList.remove("is--saved");

    if (button.closest(".menu-col.is--wishlist")) {
      button.parentElement.parentElement.remove();
    }

    const wishlistItemToRemove = document.querySelector(
      `[data-wishlist-item="${modelId}"]`,
    );
    if (wishlistItemToRemove) {
      wishlistItemToRemove.remove();
    }
  }

  localStorage.setItem("savedModels", JSON.stringify(savedModels));
  checkAndToggleShareButtonVisibility();
}

function checkAndToggleShareButtonVisibility() {
  const savedModels = JSON.parse(localStorage.getItem("savedModels") || "[]");
  const shareButton = document.querySelector('[data-wishlist="share"]');
  if (shareButton) {
    if (savedModels.length === 0) {
      shareButton.classList.add("u--hide");
    } else {
      shareButton.classList.remove("u--hide");
    }
  }
}

function loadWishlistItems(savedModels) {
  if (savedModels.length === 0) {
    return;
  }

  const wishlistWrap = document.querySelector("[data-wishlist-wrap]");
  if (!wishlistWrap) {
    return;
  }

  let promises = savedModels.map((modelSlug) => {
    const modelUrl = `/models/${modelSlug}`;
    return fetchModelItem(modelUrl, wishlistWrap);
  });

  Promise.all(promises).then(() => {
    updateWishlistSaveIcons();
    updateAllSaveIcons(savedModels);
    setupSaveIconClickHandlers();
  });
}

function fetchModelItem(url, container) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const wishlistItem = doc.querySelector("[data-wishlist-item]");
        if (wishlistItem) {
          container.appendChild(wishlistItem);
          resolve();
        } else {
          reject("Wishlist item not found in the response");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//
//

// SHARE LINK
function generateShareableLink() {
  const savedModels = getSavedModels();
  const encodedModels = savedModels.map(encodeURIComponent).join(",");
  const baseUrl = window.location.origin;
  const shareableURL = `${baseUrl}?wishlist=${encodedModels}`;
  let buttonText = document.querySelector('[data-wishlist="button-text"]');

  navigator.clipboard
    .writeText(shareableURL)
    .then(() => {
      let originalText = buttonText.innerText;
      buttonText.innerText = "Copied to clipboard";
      setTimeout(() => {
        buttonText.innerText = originalText;
      }, 3000);
    })
    .catch((err) => {
      console.error("Failed to copy URL:", err);
    });
}
const shareButton = document.querySelector('[data-wishlist="share"]');
if (shareButton) {
  shareButton.addEventListener("click", generateShareableLink);
}