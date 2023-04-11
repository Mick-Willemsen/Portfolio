gsap.from(".nav-logo, .nav-links > a", 2, {
  top: "30px",
  opacity: 0,
  ease: "power4.inOut",
  delay: 1,
  stagger: {
    amount: 0.3,
  },
});

gsap.from("h1, .item", 2, {
  y: 50,
  opacity: 0,
  ease: "power4.inOut",
  delay: 1.5,
  stagger: {
    amount: 0.3,
  },
});

gsap.from(".play-wrapper, .pattern, .copy", 2, {
  scaleY: 0,
  ease: "power3.inOut",
  stagger: {
    amount: 0.3,
  },
  delay: 2.5,
});

gsap.from(".hr", 2, {
  width: "0",
  ease: "power3.inOut",
  delay: 3,
});

gsap.from(".btns", 2, {
  x: 50,
  opacity: 0,
  ease: "power3.inOut",
  delay: 3,
});

gsap.from(".play-btn", 2, {
  scale: 0,
  ease: "power3.inOut",
  delay: 3,
});

gsap.from(".hero-wrapper", 2, {
  width: "100%",
  ease: "power3.inOut",
  delay: 3,
});

gsap.from("#work", 2, {
  top: "30px",
  opacity: 0,
  ease: "power4.inOut",
  delay: 2,
  stagger: {
    amount: 0.3,
  },
});
gsap.from(".work-container", 2, {
  top: "30px",
  opacity: 0,
  ease: "power4.inOut",
  delay: 3,
  stagger: {
    amount: 0.3,
  },
});

gsap.from(".about-text > h2, .about-text > h3", 2, {
  top: "30px",
  opacity: 0,
  ease: "power4.inOut",
  delay: 2,
  stagger: {
    amount: 0.3,
  },
});
gsap.from(".pictureframe", 2, {
  opacity: 0,
  ease: "power3.inOut",
  delay: 3.5,
});

gsap.from(".about-text > p, .about-text > a", 2, {
  top: "30px",
  opacity: 0,
  ease: "power4.inOut",
  delay: 3,
});

gsap.from("form", 2, {
  opacity: 0,
  ease: "power3.inOut",
  delay: 3.5,
});
gsap.from(".structure", 2, {
  opacity: 0,
  ease: "power3.inOut",
  delay: 3.5,
});

// gsap.from(".arrow", 2, {
//   scale: "0",
//   ease: "power3.inOut",
//   delay: 3,
// });

// gsap.from(".herotext", 2, {
//   bottom: "-20rem",
//   ease: "power3.inOut",
//   delay: 4,
// });

// function delay(n) {
//   n = n || 2000;
//   return new Promise((done) => {
//     setTimeout(() => {
//       done();
//     }, n);
//   });
// }

// function pageTransition() {
//   var tl = gsap.timeline();
//   tl.to(".loading-screen", {
//     duration: 1.2,
//     width: "100%",
//     left: "0%",
//     ease: "Expo.easeInOut",
//   });

//   tl.to(".loading-screen", {
//     duration: 1,
//     width: "100%",
//     left: "100%",
//     ease: "Expo.easeInOut",
//     delay: 0.3,
//   });
//   tl.set(".loading-screen", { left: "-100%" });
// }

// function contentAnimation() {
//   var tl = gsap.timeline();
//   tl.from(".animate-this", {
//     duration: 1,
//     y: 30,
//     opacity: 0,
//     stagger: 0.4,
//     delay: 0.2,
//   });
// }

// $(function () {
//   barba.hooks.after(() => {});

//   barba.init({
//     sync: true,
//     views: [
//       {
//         namespace: "home",
//         beforeEnter({ next }) {},
//       },
//     ],
//     transitions: [
//       {
//         async leave(data) {
//           const done = this.async();

//           pageTransition();
//           await delay(1000);
//           done();
//         },
//         async enter(data) {
//           contentAnimation();
//         },
//         async once(data) {
//           contentAnimation();
//         },
//       },
//     ],
//   });

//   barba.hooks.afterEnter(() => {
//     addEvents();
//   });
// });
