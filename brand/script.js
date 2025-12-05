gsap.registerPlugin(ScrollTrigger);

/* ==========================
   Lenis + ScrollTrigger Sync
========================== */
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

AOS.init();

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     1) 헤더 메뉴
  ========================== */
  const ham = document.querySelector(".menu-button > span");
  const menu = document.querySelector("ul.main-menu");
  const links = menu.querySelectorAll("li");

  if (ham && menu && links.length) {
    const menuTl = gsap.timeline({ paused: true });

    menuTl.to(menu, {
      duration: 0.5,
      opacity: 1,
      height: "60vh",
      ease: "expo.inOut",
    });

    menuTl.from(
      links,
      {
        duration: 0.5,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: "expo.inOut",
      },
      "-=0.5"
    );

    menuTl.reverse();

    ham.addEventListener("click", () => {
      menuTl.reversed(!menuTl.reversed());
    });
  }


  /* ==========================
     2) WHY 섹션 AOS
  ========================== */
  const whySection = document.querySelector(".why");

  if (whySection) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            whySection.classList.add("show-features");
            observer.unobserve(whySection);
          }
        });
      },
      { threshold: 0.4 }
    );

    io.observe(whySection);
  }


  /* ==========================
     3) MSG-SEQUENCE (PIN + 문장 전환)
  ========================== */
  const lines = document.querySelectorAll(".msg-sequence .msg-line");
  if (lines.length > 0) {
    let currentIndex = 0;
    lines[0].classList.add("active");

    ScrollTrigger.create({
      trigger: ".msg-sequence",
      start: "top top",
      end: "+=200%",
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        let nextIndex = Math.floor(progress * lines.length);
        if (nextIndex >= lines.length) nextIndex = lines.length - 1;

        if (nextIndex !== currentIndex) {
          lines[currentIndex].classList.remove("active");
          lines[nextIndex].classList.add("active");
          currentIndex = nextIndex;
        }
      },
    });
  }


  /* ==========================
     4) MISSION 섹션 상태 전환
  ========================== */
  const mission = document.querySelector(".mission");

  if (mission) {
    const NUM_STATES = 4;

    function updateMissionState() {
      const viewportH = window.innerHeight;
      const sectionTop = mission.offsetTop;
      const scrollY = window.scrollY;

      if (scrollY + viewportH < sectionTop ||
          scrollY > sectionTop + mission.offsetHeight) {
        return;
      }

      const relative = (scrollY - sectionTop) / viewportH;
      let stage = Math.round(relative);

      if (stage < 0) stage = 0;
      if (stage > NUM_STATES - 1) stage = NUM_STATES - 1;

      mission.classList.remove("state-0", "state-1", "state-2", "state-3");
      mission.classList.add(`state-${stage}`);
    }

    updateMissionState();
    window.addEventListener("scroll", updateMissionState);
    window.addEventListener("resize", updateMissionState);
  }

});
