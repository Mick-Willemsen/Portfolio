(function () {
  const root = document.documentElement;
  const loader = document.querySelector(".site-loader");

  if (!loader) {
    root.classList.remove("is-loading");
    return;
  }

  const progressText = loader.querySelector(".site-loader__progress");
  const progressFill = loader.querySelector(".site-loader__bar-fill");
  const isCasePage =
    document.body.classList.contains("case-page") ||
    document.body.classList.contains("case-gallery-page");
  const minDurationMs = isCasePage ? 180 : 5000;
  const hardTimeoutMs = isCasePage ? 1200 : 10000;
  const startedAt = Date.now();

  const images = Array.from(document.querySelectorAll("img"));
  const videos = Array.from(document.querySelectorAll("video"));
  const media = [...images, ...videos];

  let loadedCount = 0;
  let windowLoaded = false;
  let mediaLoaded = media.length === 0;
  let finished = false;

  const setProgress = (value) => {
    const normalized = Math.max(0, Math.min(100, value));

    if (progressFill) {
      progressFill.style.transform = `scaleX(${normalized / 100})`;
    }

    if (progressText) {
      progressText.textContent = `Loading ${Math.round(normalized)}%`;
    }
  };

  const tickProgress = () => {
    if (finished) return;
    const elapsed = Date.now() - startedAt;
    const timeProgress = (elapsed / minDurationMs) * 100;
    setProgress(timeProgress);
    requestAnimationFrame(tickProgress);
  };

  const finishIfReady = () => {
    if (finished || !windowLoaded || !mediaLoaded) return;
    const elapsed = Date.now() - startedAt;
    if (elapsed < minDurationMs) {
      setTimeout(finishIfReady, minDurationMs - elapsed);
      return;
    }
    finished = true;
    setProgress(100);
    root.classList.remove("is-loading");
    loader.classList.add("site-loader--hidden");
    setTimeout(() => loader.remove(), 450);
  };

  const markLoaded = () => {
    loadedCount += 1;
    if (loadedCount >= media.length) {
      mediaLoaded = true;
    }
    finishIfReady();
  };

  const watchImage = (img) => {
    if (img.complete) {
      markLoaded();
      return;
    }
    img.addEventListener("load", markLoaded, { once: true });
    img.addEventListener("error", markLoaded, { once: true });
  };

  const watchVideo = (video) => {
    if (video.readyState >= 2) {
      markLoaded();
      return;
    }
    video.addEventListener("loadeddata", markLoaded, { once: true });
    video.addEventListener("error", markLoaded, { once: true });
  };

  media.forEach((element) => {
    if (element.tagName === "IMG") {
      watchImage(element);
      return;
    }
    watchVideo(element);
  });

  setProgress(0);
  requestAnimationFrame(tickProgress);

  window.addEventListener("load", () => {
    windowLoaded = true;
    finishIfReady();
  });

  // Safety fallback: never block the page forever if one asset hangs.
  setTimeout(() => {
    mediaLoaded = true;
    windowLoaded = true;
    finishIfReady();
  }, hardTimeoutMs);
})();
