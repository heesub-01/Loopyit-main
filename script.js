AOS.init();
gsap.registerPlugin(ScrollTrigger);

// 로딩화면//
// const introTl = gsap.timeline({ paused: true });
// window.addEventListener("load", () => {
//   const loader = document.getElementById("loopyit-loader");
//   const glitchTarget = document.querySelector(".main-content h1");

//   if (!loader) return;

//   // 자연스러운 애니메이션을 위해 쪼갠 것
//   setTimeout(() => {
//     loader.classList.add("is-hidden");
//   }, 1500);

//   setTimeout(() => {
//     if (glitchTarget) glitchTarget.classList.add("glitch");
//   }, 1800);

//   setTimeout(() => {
//     AOS.init();
//     gsap.registerPlugin(ScrollTrigger);
//   }, 2000);
// });
// -----로딩화면끝---//

/* ============================================================
   LOOPYIT | Full Script (인트로 + 기능 + 카드)
============================================================ */

// ✅ 공통 초기화

/* ============================================================
   [1] 인트로 / 마우스 트레일 / 스크롤 인터랙션
============================================================ */
$(document).ready(function () {
  const $glassyCircle = $(".glassy-circle");
  const $canvas = $("canvas");
  const ctx = $canvas[0].getContext("2d");

  // 마우스 블러 원
  $(window).on("mousemove", function (e) {
    $glassyCircle.css(
      "transform",
      `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`
    );
  });

  // 캔버스 리사이즈
  function resizeCanvas() {
    $canvas[0].width = window.innerWidth;
    $canvas[0].height = window.innerHeight;
  }
  resizeCanvas();
  $(window).on("resize", resizeCanvas);

  // 네온 트레일
  let mouseMoved = false;
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const params = {
    pointsNumber: 15,
    widthFactor: 20,
    spring: 0.5,
    friction: 0.45,
  };
  const trail = new Array(params.pointsNumber).fill().map(() => ({
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0,
  }));

  $(window).on("mousemove", (e) => {
    mouseMoved = true;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  function update(t) {
    if (!mouseMoved) {
      pointer.x =
        (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
        window.innerWidth;
      pointer.y =
        (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.sin(0.01 * t)) *
        window.innerHeight;
    }

    ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
    trail.forEach((p, i) => {
      const prev = i === 0 ? pointer : trail[i - 1];
      const spring = i === 0 ? 0.4 * params.spring : params.spring;
      p.dx += (prev.x - p.x) * spring;
      p.dy += (prev.y - p.y) * spring;
      p.dx *= params.friction;
      p.dy *= params.friction;
      p.x += p.dx;
      p.y += p.dy;
    });

    ctx.shadowColor = "#00ff66";
    ctx.shadowBlur = 30;
    ctx.strokeStyle = "#00ff66";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
      const xc = 0.5 * (trail[i].x + trail[i + 1].x);
      const yc = 0.5 * (trail[i].y + trail[i + 1].y);
      ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      ctx.lineWidth = params.widthFactor * (params.pointsNumber - i) * 0.02;
      ctx.stroke();
    }

    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    requestAnimationFrame(update);
  }
  update(0);

  // 스크롤 색상 전환
  const $section2 = $(".section2");
  const $section3 = $(".section3");
  const $circle = $(".circle");
  const $textStep1 = $(".text-step-1");
  const $textStep2Hw = $(".highlight-word");

  $(window).on("scroll", function () {
    const scrollTop = $(window).scrollTop();
    const sectionTop = $section2.offset().top;
    const sectionHeight = $section2.outerHeight();
    let progress = (scrollTop - sectionTop) / sectionHeight;
    progress = Math.max(0, Math.min(progress, 1));

    const sectionTop3 = $section3.offset().top;
    const sectionHeight3 = $section3.outerHeight();
    let progress3 = (scrollTop - sectionTop3) / sectionHeight3;
    progress3 = Math.max(0, Math.min(progress3, 1));

    if (progress > 0 && progress < 0.2) {
      $textStep1.css("opacity", 1);
      $circle.css("opacity", 1);
    } else if (progress < 0.2) {
      $textStep1.css("opacity", 0);
      $circle.css("opacity", 0);
    }

    if (progress >= 0.2 && progress < 0.45) {
      $textStep1.css("opacity", 0);
      $circle.css("opacity", 1);
      const initialSize = 90;
      const screenDiagonal = Math.sqrt(
        window.innerWidth ** 2 + window.innerHeight ** 2
      );
      const maxScale = screenDiagonal / initialSize;
      const scale = 1 + ((progress - 0.2) / 0.25) * (maxScale - 1);
      $circle.css("transform", `translate(-50%, -50%) scale(${scale})`);
    }

    if (progress < 0.5) {
      $(".scroll-arrow").css("opacity", 1);
      $section2.css("background", "#fff");
      $circle.css("background-color", "#00ff66");
    } else {
      $(".scroll-arrow").css("opacity", 0);
      $circle.css("background-color", "#000");
      $section2.css("background", "#000");
    }
  });
});

/* ============================================================
   [2] Key Features (GSAP ScrollTrigger + 커서)
============================================================ */
function SectionGroup__init() {
  $(".con").each(function (index, node) {
    var $group = $(node);
    var $section = $group.find(" > .sec:not(:first-child)");

    $section.each(function (index, node) {
      var $sectionOne = $(node);
      gsap.to($sectionOne, {
        ease: "none",
        scrollTrigger: {
          trigger: $sectionOne,
          start: "top 100%",
          end: "bottom 100%",
          pin: $sectionOne.prev(),
          pinSpacing: false,
          scrub: true,
        },
      });
    });
  });
}
SectionGroup__init();

// Swiper
const swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 40,
    stretch: 0,
    depth: -200,
    modifier: 1,
    slideShadows: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// 클릭 활성화
$(".swiper-slide > *").click(function () {
  const $this = $(this);
  if ($this.hasClass("active")) {
    $this.removeClass("active");
  } else {
    $(".swiper-slide > *").removeClass("active");
    $this.addClass("active");
  }
});

// 커서 인터랙션
const $cursorShadow = $(".cursor-shadow");
let isActive = false;

$(window).mousemove((e) => {
  $cursorShadow.css({ top: e.clientY, left: e.clientX });
});

$(".sec_wrap_2 .swiper-slide").mouseenter(function () {
  if (!isActive) {
    $("html").addClass("need-to-cursor-big");
    $cursorShadow.text("맞춤형 건강 관리 시작");
  }
});

$(".sec_wrap_2 .swiper-slide").mouseleave(function () {
  if (!isActive) {
    $("html").removeClass("need-to-cursor-big");
    $cursorShadow.text("");
  }
});

// 클릭도 동일하게 수정
$(".sec_wrap_2 .swiper-slide").click(function () {
  isActive = !isActive;
  if (isActive) {
    $("html").removeClass("need-to-cursor-big");
    $cursorShadow.text("");
  } else {
    $("html").addClass("need-to-cursor-big");
    $cursorShadow.text("맞춤형 건강 관리 시작");
  }
});
/* ============================================================
   [3] 카드 섹션 애니메이션 + 감속 스크롤
============================================================ */
const section = document.querySelector(".sec_wrap_3");
const cards = document.querySelectorAll(".cards-wrapper .card");
const body = document.body;

if (section && cards.length === 3) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sec_wrap_3",
      start: "top top",
      end: "+=200%", // 오래 고정
      pin: true,
      scrub: 0.2,
      anticipatePin: 1,

      onUpdate: (self) => {
        const p = self.progress;

        // ★ 애니 전에 hover OFF
        if (p < 0.25) {
          cards.forEach((c) =>
            c.classList.re0203333023sList.add("hover-active")
          );
        }

        // ★ 섹션을 떠나기 직전 hover OFF
        if (p >= 0.99) {
          cards.forEach((c) => c.classList.remove("hover-active"));
        }
      },
    },
  });

  // === 타임라인 시작 == //
  // 타임라인의 0~25% 사이에서 애니메이션을 모두 끝냄
  tl.fromTo(
  cards,
  { y: 160, opacity: 0, scale: 0.9 },
  {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.5,
    stagger: 0,
    ease: "power3.out",
  }
  )
  .to(
    cards,
    {
      scale: 1.08,
      duration: 0.3,
      stagger: 0,
      ease: "power2.out",
    }
  )
  .to(".card.card_1", {
    x: -520,
    duration: 0.5,
    ease: "power2.out",
  })
  .to(".card.card_2", {
    x: 0,
    duration: 0.9,
    ease: "power2.out",
  }, "<")
  .to(".card.card_3", {
    x: 520,
    duration: 0.5,
    ease: "power2.out",
  }, "<")
  .to({}, { duration: 1})
  .to(".card.card_1", {
    rotate: -4,
  })
  .to(".card.card_2", {
    rotate: 3,
  }, "<")
  .to(".card.card_3", {
    rotate: -3,
  }, "<")
  .to({}, { duration: 2 });

  }

// 반응형 대응
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

// 감속 스크롤 (Lenis)
const lenis = new Lenis({
  duration: 1,
  smooth: true,
  direction: "vertical",
});

// Lenis 스크롤이 일어날 때마다 ScrollTrigger에 알림
lenis.on("scroll", ScrollTrigger.update);

// GSAP 타이머에 Lenis를 물려서 한 타임라인에서 갱신
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // gsap time(s) → ms
});
gsap.ticker.lagSmoothing(0);

// section 3 item drop animation
$(function () {
  const $items = $(".fall-text-1, .fall-text-2, .fall-text-3, .fall-text-4");

  // 처음에는 애니메이션 멈춰둠
  $items.addClass("fall-paused");

  $(window).on("scroll", function () {
    const winTop = $(window).scrollTop();
    const winH = $(window).height();
    const trigger = winTop + winH * 0.6;

    $items.each(function () {
      const $el = $(this);
      const elTop = $el.offset().top;

      if (elTop < trigger && !$el.hasClass("fall-started")) {
        $el.addClass("fall-started");
        $el.removeClass("fall-paused"); // 애니메이션 재생 시작
      }
    });
  });
});

$(document).ready(function () {
  var $sec3 = $(".sec_wrap_3");

  $(window).on("scroll", function () {
    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var sec3Top = $sec3.offset().top;
    var sec3Height = $sec3.outerHeight();

    // 섹션 3이 화면 전체에 다 보일 때
    if (scrollTop + windowHeight >= sec3Top + sec3Height) {
      $("body").addClass("scrolled-3");
    } else {
      $("body").removeClass("scrolled-3");
    }
  });
});
// 3섹션----//

const reviewSwiper = new Swiper(".reviewSwiper", {
  effect: "cards",
  grabCursor: true,
});

// 4섹션------
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".random_box");
  const boxes = document.querySelector(".random_box_up");
  if (!section || !boxes) return;

  const add = () => {
    boxes.classList.add("in-view");
  };
  const remove = () => {
    boxes.classList.remove("in-view");
  };

  // 상태
  let wasVisible = null; // 섹션 가시 여부 기록 (IO 기준)
  let inViewApplied = false; // 실제로 .in-view 클래스가 적용돼 있는지
  let lastY = window.scrollY || window.pageYOffset;

  const THRESH = 0.22; // 섹션 가시 판정 임계값
  const ioOpts = {
    root: null,
    rootMargin: "-20% 0px -20% 0px",
    threshold: [0, THRESH, 0.5, 1],
  };

  // 가시 중에도 스크롤 방향으로 즉시 토글 (요구사항)
  const applyDirectionLogic = (scrollingUp, visible) => {
    if (!visible) return; // 가시 아닐 땐 IO 로직이 처리
    if (scrollingUp && inViewApplied) {
      // ↑ 위로 스크롤하면, 섹션 안에 있어도 숨김
      remove();
      inViewApplied = false;
    } else if (!scrollingUp && !inViewApplied) {
      // ↓ 아래로 스크롤하면서 다시 보이게
      add();
      inViewApplied = true;
    }
  };

  // IO: 진입/이탈 판정
  const io = new IntersectionObserver((entries) => {
    const e = entries[0];
    const visible = e.isIntersecting && e.intersectionRatio >= THRESH;

    if (wasVisible === null) {
      // 초기 1회: 상태만 기록
      wasVisible = visible;
      return;
    }

    // 안 보였다가 → 보임: 등장
    if (!wasVisible && visible) {
      add();
      inViewApplied = true;
    }

    // 보이다가 → 안 보임: 숨김
    if (wasVisible && !visible) {
      remove();
      inViewApplied = false;
    }

    wasVisible = visible;
  }, ioOpts);

  io.observe(section);

  // 폴백 + 방향 판정 (iOS Safari 등 초기 딜레이 보정 및 방향 토글)
  const fallbackCheck = () => {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const visibleH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    const ratio = Math.max(0, Math.min(visibleH / r.height, 1));
    const visible = ratio >= THRESH;

    const currentY = window.scrollY || window.pageYOffset;
    const scrollingUp = currentY < lastY;
    lastY = currentY;

    if (wasVisible === null) {
      // 초기 1회: 상태만 기록
      wasVisible = visible;
      return;
    }

    // IO와 동일한 전이 처리 (안정성)
    if (!wasVisible && visible) {
      add();
      inViewApplied = true;
    }
    if (wasVisible && !visible) {
      remove();
      inViewApplied = false;
    }

    // 가시 상태에서도 '방향'으로 즉시 토글
    applyDirectionLogic(scrollingUp, visible);

    wasVisible = visible;
  };

  window.addEventListener("scroll", fallbackCheck, { passive: true });
  window.addEventListener("resize", fallbackCheck);

  // (선택) 페이지 숨김 시 정리
  // document.addEventListener('pagehide', () => {
  //   io.disconnect();
  //   window.removeEventListener('scroll', fallbackCheck);
  //   window.removeEventListener('resize', fallbackCheck);
  // });
});

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
