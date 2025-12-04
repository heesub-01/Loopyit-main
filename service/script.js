AOS.init();

// 헤더
const ham = document.querySelector(".meun-button > span");
const menu = document.querySelector("ul.main-menu");
const links = menu.querySelectorAll("li");

var tl = gsap.timeline({ paused: true });

tl.to(menu, {
  duration: 0.5,
  opacity: 1,
  height: "60vh", // change this to 100vh for full-height menu
  ease: "expo.inOut",
});
tl.from(
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

tl.reverse();

ham.addEventListener("click", () => {
  tl.reversed(!tl.reversed());
});




gsap.registerPlugin(ScrollTrigger);

const kfCards = gsap.utils.toArray(".kf-card");
const dots = gsap.utils.toArray(".kf-pagination .dot");

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".main-warp",
    start: "top top",
    end: "+=300%",
    scrub: true,
    pin: true,
    onUpdate: (self) => {
      updatePagination(self.progress);
    }
  }
});

// kf-card 애니메이션
kfCards.forEach((card, i) => {

  // 첫 번째 카드는 등장 애니메이션만 스킵
  if (i !== 0) {
    tl.fromTo(card,
      { opacity: 0, y: 150 },
      { opacity: 1, y: 0, duration: 1.9, ease: "power4.out" }
    );
  }

  // 사라지는 애니메이션은 모든 카드에 적용
  if (i < kfCards.length - 1) {
    tl.to(card,
      { opacity: 0, y: -130, duration: 1.6, ease: "power2.inOut" },
      "+=1.0"
    );
  }
});

// 페이지네이션
function updatePagination(progress) {
  const total = kfCards.length;
  const index = Math.floor(progress * total);
  const safeIndex = Math.min(index, total - 1);

  dots.forEach(dot => dot.classList.remove("active"));
  dots[safeIndex].classList.add("active");
}

// 마우스감속//
const lenis = new Lenis({
  smooth: true,
  lerp: 0.12,   // 감속 강도 (0.05~0.12 추천)
  wheelMultiplier: 0.9
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ScrollTrigger 연동
lenis.on('scroll', ScrollTrigger.update);

gsap.to(".sec-1", {
  backgroundColor: "#ffffff",
  scrollTrigger: {
    trigger: ".sec-2",
    start: "top bottom",    // sec-2가 화면 아래에 닿기 시작할 때
    end: "top center",      // sec-2가 화면 중앙에 올 때
    scrub: true
  }
});

