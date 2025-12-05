AOS.init();


// ============================
// 헤더 메뉴 (이름 충돌 해결)
// ============================
const ham = document.querySelector(".menu-button > span");
const menu = document.querySelector("ul.main-menu");
const links = menu.querySelectorAll("li");

var menuTl = gsap.timeline({ paused: true });

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


// ============================
// 카드 애니메이션 / 페이지네이션
// ============================
gsap.registerPlugin(ScrollTrigger);

const kfCards = gsap.utils.toArray(".kf-card");
const dots = gsap.utils.toArray(".kf-pagination .dot");

const cardTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".sec-1",
    start: "top top",
    end: "+=300%",
    scrub: true,
    pin: true,
    onUpdate: (self) => {
      updatePagination(self.progress);
    }
  }
});

// 카드 애니메이션
kfCards.forEach((card, i) => {
  if (i !== 0) {
    cardTl.fromTo(
      card,
      { opacity: 0, y: 150 },
      { opacity: 1, y: 0, duration: 2, ease: "power4.out" }
    );
  }

  if (i < kfCards.length - 1) {
    cardTl.to(
      card,
      { opacity: 0, y: -130, duration: 2, ease: "power2.inOut" },
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


// ============================
// 배경 색 전환
// ============================
gsap.to(".sec-1", {
  backgroundColor: "#ffffff",
  scrollTrigger: {
    trigger: ".sec-2",
    start: "top bottom",
    end: "top center",
    scrub: true
  }
});

window.addEventListener("load", () => {
  setTimeout(() => {
    AOS.refreshHard();
  }, 300);
});
