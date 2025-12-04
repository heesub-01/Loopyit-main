document.addEventListener('DOMContentLoaded', () => {
  const whySection = document.querySelector('.why');
  if (!whySection) return;

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 화면에 들어오면 한 번만 실행
          whySection.classList.add('show-features');
          observer.unobserve(whySection);
        }
      });
    },
    {
      threshold: 0.4, // 섹션이 40% 정도 보일 때 트리거
    }
  );

  io.observe(whySection);
});



document.addEventListener('DOMContentLoaded', () => {
  const msgSection = document.querySelector('.msg-sequence');
  if (!msgSection) return;

  const lines = Array.from(msgSection.querySelectorAll('.msg-line'));
  if (!lines.length) return;

  let hasStarted = false;   // 시퀀스를 시작했는지 여부
  let isLocked   = false;   // 스크롤 잠금 여부
  let step       = 0;       // 0: 1번 문장, 1: 2번 문장, 2: 3번 문장
  let prevIndex  = null;
  let originalOverflow = '';

  let isTransitioning = false;   // 애니메이션 중인지(휠 중복 입력 막기)
  const STEP_DELAY = 600;        // 문장 전환 간 최소 간격(ms)

  // ---------------- 공통 유틸 ----------------
  function showLine(index) {
    if (index < 0 || index >= lines.length) return;

    // 이전 문장: 위로 나가면서 페이드아웃
    if (prevIndex !== null && prevIndex !== index) {
      const prev = lines[prevIndex];
      prev.style.opacity = '0';
      prev.style.transform =
        'translate3d(-50%, -50%, 0) translateY(-20px)';
    }

    // 현재 문장: 아래에서 올라오며 페이드인
    const curr = lines[index];
    curr.style.opacity = '1';
    curr.style.transform =
      'translate3d(-50%, -50%, 0) translateY(0)';

    prevIndex = index;
  }

  function lockScroll() {
    if (isLocked) return;
    isLocked = true;

    // 기존 overflow 저장하고 잠깐 막기
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // msg-sequence 섹션 시작점을 화면 맨 위에 맞추기
    const top = msgSection.offsetTop;
    window.scrollTo({ top, left: 0 });

    // 휠로만 문장 전환되도록
    window.addEventListener('wheel', onWheel, { passive: false });
  }

  function unlockScroll() {
    if (!isLocked) return;
    isLocked = false;

    document.body.style.overflow = originalOverflow || '';
    window.removeEventListener('wheel', onWheel);
  }

  // ---------------- 스크롤(휠)로 단계 전환 ----------------
  function onWheel(e) {
    if (!isLocked) return;

    // 기본 스크롤 막기
    e.preventDefault();

    if (isTransitioning) return; // 애니메이션 중엔 입력 무시

    const dy = e.deltaY;
    if (dy === 0) return;

    // 아래로 스크롤
    if (dy > 0) {
      if (step < lines.length - 1) {
        // 다음 문장으로 이동 (0->1, 1->2)
        step += 1;
        isTransitioning = true;
        showLine(step);

        setTimeout(() => {
          isTransitioning = false;
        }, STEP_DELAY);
      } else if (step === lines.length - 1) {
        // 마지막 문장(2번 index) 상태에서 한 번 더 아래로 스크롤하면 해제
        unlockScroll();
        // 여기서 자동으로 다음 섹션으로 스크롤하고 싶으면 아래 주석 해제:
        /*
        window.scrollTo({
          top: msgSection.offsetTop + msgSection.offsetHeight,
          left: 0,
          behavior: 'smooth',
        });
        */
      }
    }
    // 위로 스크롤: 이전 문장으로 돌아가기 (원하면)
    else if (dy < 0) {
      if (step > 0) {
        step -= 1;
        isTransitioning = true;
        showLine(step);

        setTimeout(() => {
          isTransitioning = false;
        }, STEP_DELAY);
      }
    }
  }

  // ---------------- 섹션 진입 시점 감지 ----------------
  function handleScrollTrigger() {
    if (hasStarted) return;

    const rect = msgSection.getBoundingClientRect();
    const tolerance = 10; // msg-sequence top 이 화면 상단과 거의 맞을 때

    // rect.top === 0 이면 정확히 화면 상단, 약간의 오차 허용
    if (rect.top <= tolerance && rect.top >= -tolerance) {
      hasStarted = true;
      step = 0;

      lockScroll();   // 스크롤 잠그고
      showLine(0);    // 첫 문장 보여주기

      window.removeEventListener('scroll', handleScrollTrigger);
      window.removeEventListener('resize', handleScrollTrigger);
    }
  }

  // 스크롤 / 리사이즈할 때마다 msg-sequence 위치 체크
  window.addEventListener('scroll', handleScrollTrigger);
  window.addEventListener('resize', handleScrollTrigger);
});



document.addEventListener('DOMContentLoaded', () => {
  const mission = document.querySelector('.mission');
  if (!mission) return;

  const NUM_STATES = 4; // 0,1,2,3

  function updateMissionState() {
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const sectionTop = mission.offsetTop;
    const scrollY = window.scrollY || window.pageYOffset;

    // 섹션이 화면 근처에 없으면 굳이 계산 안 해도 됨
    if (scrollY + viewportH < sectionTop || scrollY > sectionTop + mission.offsetHeight) {
      return;
    }

    // 섹션 안에서 얼마나 내려왔는지 (0 ~ 4 정도의 값)
    const relative = (scrollY - sectionTop) / viewportH;
    let stage = Math.round(relative); // 0,1,2,3 이상

    if (stage < 0) stage = 0;
    if (stage > NUM_STATES - 1) stage = NUM_STATES - 1;

    // 클래스 세팅
    mission.classList.remove('state-0', 'state-1', 'state-2', 'state-3');
    mission.classList.add(`state-${stage}`);
  }

  // 처음 한 번 실행
  updateMissionState();

  window.addEventListener('scroll', updateMissionState);
  window.addEventListener('resize', updateMissionState);
});
