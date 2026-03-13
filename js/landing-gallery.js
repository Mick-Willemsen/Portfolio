const landingGallery = document.querySelector(".landing-gallery");

document
  .querySelectorAll('video[src*="Closed-Eye-World.mov"]')
  .forEach((video) => {
    const applyPlaybackRate = () => {
      video.playbackRate = 1.25;
    };

    applyPlaybackRate();
    video.addEventListener("loadedmetadata", applyPlaybackRate, { once: true });
  });

if (landingGallery) {
  const track = landingGallery.querySelector(".landing-gallery__track");
  const items = landingGallery.querySelectorAll(".landing-gallery__item");
  const animatedPreviewImages = landingGallery.querySelectorAll("img[data-animated-src]");
  const indicator = landingGallery.querySelector(".landing-gallery__indicator");
  const indicatorLine = landingGallery.querySelector(".landing-gallery__line");
  const indicatorWrap = landingGallery.querySelector(".landing-gallery__line-wrap");
  const headerTitle = landingGallery.querySelector(".landing-gallery__header h1");
  const activeLabel = landingGallery.querySelector(".landing-gallery__active-label");
  const mobileQuery = window.matchMedia("(max-width: 950px)");
  let activeItem = null;
  let wheelLocked = false;
  let hoverSuppressedUntil = 0;
  let hoverActivationTimeout = null;
  let desktopExpandedWidth = null;
  let desktopCollapsedWidth = null;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const getDesktopLayout = (selectedItem = activeItem || items[0]) => {
    if (!track || items.length === 0) {
      return {
        expandedWidth: null,
        collapsedWidth: null,
        lineWidth: 0,
      };
    }

    const trackStyles = window.getComputedStyle(track);
    const gapValue = parseFloat(trackStyles.columnGap || trackStyles.gap || "0");
    const gap = Number.isFinite(gapValue) ? gapValue : 0;
    const itemCount = items.length;

    if (itemCount <= 1) {
      return {
        expandedWidth: track.clientWidth,
        collapsedWidth: track.clientWidth,
        lineWidth: track.clientWidth,
      };
    }

    const isPortraitItem = selectedItem?.classList.contains("landing-gallery__item--contain");
    const isGrowthSplitLayout =
      document.body.classList.contains("case-gallery-page--growth") &&
      itemCount === 2 &&
      selectedItem?.classList.contains("landing-gallery__item--case-copy-full");
    const minCollapsedWidth = isPortraitItem ? 30 : 12;
    const minExpandedWidth = isPortraitItem ? 300 : 520;
    const maxExpandedWidth = Math.max(
      minExpandedWidth,
      track.clientWidth - (itemCount - 1) * (minCollapsedWidth + gap)
    );
    const targetExpandedWidth = isGrowthSplitLayout
      ? clamp(track.clientWidth * 0.42, minExpandedWidth, track.clientWidth * 0.5)
      : isPortraitItem
        ? clamp(track.clientWidth * 0.3, minExpandedWidth, 520)
        : Math.max(track.clientWidth * 0.68, clamp(window.innerHeight * 0.8, 620, 1080));
    const expandedWidth = clamp(targetExpandedWidth, minExpandedWidth, maxExpandedWidth);
    const collapsedWidth = Math.max(
      minCollapsedWidth,
      (track.clientWidth - expandedWidth - (itemCount - 1) * gap) / (itemCount - 1)
    );

    return {
      expandedWidth,
      collapsedWidth,
      lineWidth: expandedWidth + (itemCount - 1) * collapsedWidth + (itemCount - 1) * gap,
    };
  };

  const syncIndicatorWidth = () => {
    if (!indicatorWrap || !track) return;

    if (mobileQuery.matches) {
      indicatorWrap.style.width = "100%";
      landingGallery.style.setProperty("--gallery-content-width", "100%");
      landingGallery.style.removeProperty("--desktop-title-width");
      desktopExpandedWidth = null;
      desktopCollapsedWidth = null;
      return;
    }

    const { expandedWidth, collapsedWidth, lineWidth } = getDesktopLayout();
    desktopExpandedWidth = expandedWidth;
    desktopCollapsedWidth = collapsedWidth;

    indicatorWrap.style.width = `${lineWidth}px`;
    landingGallery.style.setProperty("--gallery-content-width", `${lineWidth}px`);

    if (headerTitle) {
      const titleWidth = headerTitle.getBoundingClientRect().width;
      landingGallery.style.setProperty("--desktop-title-width", `${titleWidth}px`);
    }
  };

  const getItemLabel = (item) => {
    if (!item) return "";
    if (item.dataset.caption) return item.dataset.caption;

    const image = item.querySelector("img");
    if (image && image.alt) return image.alt;

    const video = item.querySelector("video");
    if (video && video.getAttribute("src")) {
      const src = video.getAttribute("src");
      const fileName = src.split("/").pop() || "";
      return fileName.replace(/\.[^/.]+$/, "");
    }

    return "";
  };

  const syncAnimatedImages = (selectedItem) => {
    items.forEach((item) => {
      item.querySelectorAll("img[data-animated-src]").forEach((image) => {
        const nextSrc = item === selectedItem ? image.dataset.animatedSrc : image.dataset.staticSrc;
        if (nextSrc && image.getAttribute("src") !== nextSrc) {
          image.setAttribute("src", nextSrc);
        }
      });
    });
  };

  const preloadAnimatedImages = () => {
    animatedPreviewImages.forEach((image) => {
      const animatedSrc = image.dataset.animatedSrc;
      if (!animatedSrc) return;
      const preloadImage = new Image();
      preloadImage.src = animatedSrc;
    });
  };

  const setActiveItem = (nextActiveItem, { force = false } = {}) => {
    if (!nextActiveItem || (!force && nextActiveItem === activeItem)) return;
    activeItem = nextActiveItem;
    syncAnimatedImages(nextActiveItem);

    if (!mobileQuery.matches) {
      const layout = getDesktopLayout(nextActiveItem);
      desktopExpandedWidth = layout.expandedWidth;
      desktopCollapsedWidth = layout.collapsedWidth;
      if (indicatorWrap) {
        indicatorWrap.style.width = `${layout.lineWidth}px`;
        landingGallery.style.setProperty("--gallery-content-width", `${layout.lineWidth}px`);
      }
    }

    items.forEach((item) => {
      const isActive = item === nextActiveItem;
      item.classList.toggle("is-active", isActive);

      if (mobileQuery.matches) {
        item.style.flex = "";
      } else {
        item.style.flex = isActive
          ? `0 0 ${desktopExpandedWidth}px`
          : `0 0 ${desktopCollapsedWidth}px`;
      }
    });

    if (activeLabel) {
      activeLabel.textContent = getItemLabel(nextActiveItem);
    }
  };

  const getClosestItemToCenter = () => {
    if (mobileQuery.matches && track.scrollTop <= 2) {
      return items[0];
    }

    const trackRect = track.getBoundingClientRect();
    const centerY = trackRect.top + trackRect.height / 2;
    let closestItem = items[0];
    let closestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;
      const distance = Math.abs(centerY - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    return closestItem;
  };

  const getActiveIndex = () => Array.from(items).indexOf(activeItem || items[0]);

  const stepActiveItem = (direction) => {
    const currentIndex = getActiveIndex();
    const nextIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));

    if (nextIndex === currentIndex) return;
    setActiveItem(items[nextIndex]);
  };

  syncIndicatorWidth();

  if (items.length > 0) {
    setActiveItem(items[0], { force: true });
    if (mobileQuery.matches) {
      track.scrollTop = 0;
    }
  }

  if (animatedPreviewImages.length > 0) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preloadAnimatedImages, { timeout: 1500 });
    } else {
      window.setTimeout(preloadAnimatedImages, 250);
    }
  }

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      if (!mobileQuery.matches && Date.now() < hoverSuppressedUntil) return;
      if (mobileQuery.matches) {
        setActiveItem(item);
        return;
      }

      window.clearTimeout(hoverActivationTimeout);
      hoverActivationTimeout = window.setTimeout(() => {
        hoverSuppressedUntil = Date.now() + 380;
        setActiveItem(item);
      }, 45);
    });

    item.addEventListener("mouseleave", () => {
      window.clearTimeout(hoverActivationTimeout);
    });

    item.addEventListener("click", () => {
      setActiveItem(item);
    });
  });

  let ticking = false;
  track.addEventListener("scroll", () => {
    if (!mobileQuery.matches || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (track.scrollTop <= 2) {
        setActiveItem(items[0]);
        ticking = false;
        return;
      }

      setActiveItem(getClosestItemToCenter());
      ticking = false;
    });
  }, { passive: true });

  track.addEventListener("mousemove", (event) => {
    if (!indicator || !indicatorLine || mobileQuery.matches) return;
    const trackBounds = track.getBoundingClientRect();
    const lineBounds = indicatorLine.getBoundingClientRect();
    const indicatorMaxX = Math.max(0, lineBounds.width - indicator.offsetWidth);
    const rawRatio = (event.clientX - trackBounds.left) / trackBounds.width;
    const ratio = Math.max(0, Math.min(1, rawRatio));
    indicator.style.transform = `translateX(${ratio * indicatorMaxX}px)`;
  });

  track.addEventListener(
    "wheel",
    (event) => {
      if (mobileQuery.matches) return;
      if (Math.abs(event.deltaY) < 8 || wheelLocked) return;

      event.preventDefault();
      wheelLocked = true;
      hoverSuppressedUntil = Date.now() + 380;
      stepActiveItem(event.deltaY > 0 ? 1 : -1);

      window.setTimeout(() => {
        wheelLocked = false;
      }, 220);
    },
    { passive: false }
  );

  window.addEventListener("resize", () => {
    if (mobileQuery.matches) {
      syncIndicatorWidth();
      if (track.scrollTop <= 2) {
        setActiveItem(items[0], { force: true });
        return;
      }
      setActiveItem(getClosestItemToCenter(), { force: true });
      return;
    }

    syncIndicatorWidth();
    const currentActiveItem = landingGallery.querySelector(".landing-gallery__item.is-active");
    setActiveItem(currentActiveItem || items[0], { force: true });
  });
}

