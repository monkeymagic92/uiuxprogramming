// 파일이 연결됐는지 확인
console.log("JavaScript가 연결되었습니다.");

// 주요 메뉴 (10주차): 주소의 # 값과 같은 메뉴 하나만 현재 위치로 표시한다
const navLinks = document.querySelectorAll(".site-nav a");

function updateCurrentNav() {
  // 11주차: 본문 바로가기(#content)로 왔으면 본문 맨 위인 서비스 소개를 보고 있는 것과 같다
  const currentHash = window.location.hash === "#content" ? "" : window.location.hash;

  navLinks.forEach(function (link) {
    // #가 없으면 맨 위(서비스 소개)를 보고 있는 것이므로 첫 메뉴
    const current = currentHash
      ? link.getAttribute("href") === currentHash
      : link === navLinks[0];

    link.classList.toggle("is-current", current);

    if (current) {
      // 12주차: 다른 페이지가 아니라 한 페이지 안의 위치라서 page 대신 location
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // 11주차: 브라우저 탭 제목에도 지금 보고 있는 메뉴 이름을 넣는다
  const currentLink = document.querySelector('.site-nav a[aria-current="location"]');
  const pageName = currentLink ? currentLink.textContent.trim() : "서비스 소개";
  document.title = pageName + " | 동네공부방";
}

// 메뉴 클릭, 뒤로 가기·앞으로 가기 모두 주소의 #가 바뀌면 hashchange가 일어난다
window.addEventListener("hashchange", updateCurrentNav);
updateCurrentNav();

// 모바일 메뉴: 실제로 열렸는지(is-open) 하나로 버튼 문구와 aria-expanded를 맞춘다
const menuToggle = document.querySelector("#menuToggle");
const siteNav = document.querySelector("#siteNav");

function setMenuOpen(open) {
  siteNav.classList.toggle("is-open", open);
  menuToggle.textContent = open ? "메뉴 닫기" : "메뉴 열기";
  menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle.addEventListener("click", function () {
  setMenuOpen(!siteNav.classList.contains("is-open"));
});

// 11주차 keydown: 열린 모바일 메뉴를 Esc로 닫고 초점을 메뉴 버튼으로 돌려준다
// 메뉴가 닫혀 있거나 Esc가 아니면 아무것도 하지 않는다
document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape" || !siteNav.classList.contains("is-open")) return;

  setMenuOpen(false);
  menuToggle.focus();
});

// 목적지를 고르면 메뉴를 닫는다. 넓은 화면에서는 is-open이 없어도 보이므로 영향 없다
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    setMenuOpen(false);
  });
});

// 12주차 펼치기·접기 공통 함수
// 버튼의 aria-controls로 연결된 영역을 열고 닫으면서 aria-expanded를 같이 맞춘다
// 버튼에 data-open-text / data-closed-text가 있으면 상태에 맞게 버튼 글자도 바꾼다
// 자주 묻는 질문(아코디언)과 내 예약의 자세히 보기가 이 함수를 같이 쓴다
function setExpanded(button, open) {
  const target = document.getElementById(button.getAttribute("aria-controls"));

  target.hidden = !open;
  button.setAttribute("aria-expanded", String(open));

  if (button.dataset.openText) {
    button.textContent = open ? button.dataset.openText : button.dataset.closedText;
  }
}

function toggleExpanded(button) {
  setExpanded(button, button.getAttribute("aria-expanded") !== "true");
}

// 아코디언: 질문 버튼마다 따로 붙이지 않고 묶음(.accordion)에서 click을 받는다
// 버튼이라 키보드는 Tab으로 질문을 옮겨 다니고 Enter·Space로 펼친다
function setupAccordion(accordion) {
  accordion.addEventListener("click", function (event) {
    const button = event.target.closest(".accordion-button");
    if (button) {
      toggleExpanded(button);
    }
  });
}

document.querySelectorAll(".accordion").forEach(setupAccordion);

// 바꿀 요소를 id로 찾는다
const subscribeForm = document.querySelector(".subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeMessage = document.querySelector("#subscribeMessage");
const subscribeButton = document.querySelector("#subscribeButton");

// 신청을 마쳤는지 기억하는 상태
let isSubscribed = false;

// 입력값에 맞는 안내 문구를 돌려준다
function makeSubscribeMessage(email) {
  if (email === "") {
    return "이메일을 입력해 주세요.";
  }
  return email + " 으로 빈자리 알림을 보내 드릴게요.";
}

// 폼을 제출하는 순간 실행
function subscribe(event) {
  // 페이지가 새로고침되지 않게 막는다
  event.preventDefault();

  const email = emailInput.value;
  subscribeMessage.textContent = makeSubscribeMessage(email);

  if (email === "") {
    // 비어 있으면 경고 스타일만 주고 다시 입력을 기다린다
    subscribeMessage.classList.remove("is-done");
    subscribeMessage.classList.add("is-error");
    emailInput.setAttribute("aria-invalid", "true");
    emailInput.focus();
  } else {
    isSubscribed = true;
    emailInput.removeAttribute("aria-invalid");
    subscribeMessage.classList.remove("is-error");
    subscribeMessage.classList.add("is-done");

    // 같은 신청이 반복되지 않게 버튼을 막는다
    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
    emailInput.disabled = true;
  }

  console.log("신청 상태:", isSubscribed);
}

subscribeForm.addEventListener("submit", subscribe);

// 예약 준비 영역에서 바꿀 요소
const themeButton = document.querySelector("#themeButton");
const userNameInput = document.querySelector("#userName");
const userNameCount = document.querySelector("#userNameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

// click: 화면 밝기를 바꾸고 버튼 문구도 지금 상태에 맞춘다
function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark
    ? "밝은 화면으로 보기"
    : "어두운 화면으로 보기";
}

themeButton.addEventListener("click", handleThemeClick);

// input: 글자를 쓰거나 지울 때마다 글자 수를 바로 보여 준다
function handleUserNameInput() {
  const currentLength = userNameInput.value.length;
  userNameCount.textContent = currentLength + " / 10";

  // 10자를 다 채우면 더 쓸 수 없다는 걸 색으로 알려 준다
  userNameCount.classList.toggle("is-full", currentLength === 10);
}

userNameInput.addEventListener("input", handleUserNameInput);

// change: 규칙 확인 여부 하나로 문구, 스타일, 버튼을 함께 바꾼다
function handleAgreeChange() {
  const agreed = agreeCheck.checked;

  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "확인했습니다. 이제 예약을 시작할 수 있습니다."
    : "이용 규칙을 확인하면 예약을 시작할 수 있습니다.";

  agreeMessage.classList.toggle("is-ready", agreed);
}

agreeCheck.addEventListener("change", handleAgreeChange);

// 주요 기능 탭 (6주차)
// 12주차: 탭 묶음(tablist) 하나를 받아 그 안의 탭만 다루는 함수로 바꿨다
// 탭을 또 만들 때는 같은 HTML 구조(role, data-target)로 쓰면 setupTabs가 그대로 처리한다

// 고른 탭 하나만 선택하고, 연결된 패널만 보인다
function selectTab(tablist, nextTab) {
  tablist.querySelectorAll('[role="tab"]').forEach(function (tab) {
    const selected = tab === nextTab;
    const panel = document.querySelector(tab.dataset.target);

    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    // 선택된 탭만 Tab 키 순서에 남기고, 나머지 탭은 방향키로 옮겨 간다
    tab.tabIndex = selected ? 0 : -1;

    panel.classList.toggle("is-active", selected);
    panel.hidden = !selected;
  });
}

function setupTabs(tablist) {
  const tabList = Array.from(tablist.querySelectorAll('[role="tab"]'));

  // click: 탭마다 따로 붙이지 않고 묶음에서 한 번에 받는다
  tablist.addEventListener("click", function (event) {
    const tab = event.target.closest('[role="tab"]');
    if (tab) {
      selectTab(tablist, tab);
    }
  });

  // keydown: ←/↑ 이전 탭, →/↓ 다음 탭, Home 첫 탭, End 마지막 탭. 끝에서 넘어가면 반대쪽으로
  tablist.addEventListener("keydown", function (event) {
    const index = tabList.indexOf(document.activeElement);
    let next = -1;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabList.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabList.length) % tabList.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabList.length - 1;

    if (index === -1 || next === -1) return;

    // 방향키로 화면이 스크롤되지 않게 막고, 선택과 초점을 같이 옮긴다
    event.preventDefault();
    selectTab(tablist, tabList[next]);
    tabList[next].focus();
  });

  // 처음 화면: HTML에서 aria-selected="true"인 탭으로 맞춘다
  selectTab(tablist, tablist.querySelector('[aria-selected="true"]') || tabList[0]);
}

document.querySelectorAll('[role="tablist"]').forEach(setupTabs);

// 공부방 예약 흐름
const userNameError = document.querySelector("#userNameError");
const bookingFlow = document.querySelector("#bookingFlow");
const bookingSteps = document.querySelectorAll(".booking-step");
const bookingProgress = document.querySelector("#bookingProgress");
const bookingArea = document.querySelector("#bookingArea");
const stepNames = ["공부방 선택", "날짜·시간 선택", "내용 확인"];
let bookingStepNow = 1;

// 고른 단계 하나만 보이고 진행 표시도 그 단계에 맞춘다
function showBookingStep(step) {
  let currentStep;

  bookingSteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
    if (!item.hidden) {
      currentStep = item;
    }
  });

  bookingProgress.textContent = step <= 3
    ? step + " / 3 · " + stepNames[step - 1]
    : "예약 완료";
  bookingProgress.classList.toggle("is-done", step === 4);

  // 숨겨진 단계에 포커스가 남지 않게 새 단계의 첫 입력칸이나 버튼으로 옮긴다
  currentStep.querySelector("select, input, button").focus();

  // 13주차: 단계를 옮길 때도 위치를 임시 보관한다. 4단계(예약 완료)는 보관하지 않는다
  bookingStepNow = step;
  if (step <= 3) saveDraft();
}

// click: 규칙 확인(버튼 활성)에 이어 이름까지 있어야 예약 흐름을 연다
function handleStartClick() {
  if (userNameInput.value.trim() === "") {
    userNameError.textContent = "예약자 이름을 입력해 주세요. 확인 화면에 이 이름이 들어갑니다.";
    userNameInput.classList.add("has-error");
    userNameInput.setAttribute("aria-invalid", "true");
    userNameInput.focus();
    return;
  }

  userNameError.textContent = "";
  userNameInput.classList.remove("has-error");
  userNameInput.removeAttribute("aria-invalid");

  bookingFlow.hidden = false;
  showBookingStep(1);
}

startButton.addEventListener("click", handleStartClick);

// 단계마다 확인할 입력 요소
const areaError = document.querySelector("#areaError");
const bookingDate = document.querySelector("#bookingDate");
const bookingTime = document.querySelector("#bookingTime");
const timeError = document.querySelector("#timeError");

// click: 동네를 고르지 않으면 1단계에 머문다
function handleNext1Click() {
  if (bookingArea.value === "") {
    areaError.textContent = "동네를 선택해 주세요. 목록에서 가까운 동네를 고르면 됩니다.";
    bookingArea.classList.add("has-error");
    bookingArea.setAttribute("aria-invalid", "true");
    bookingArea.focus();
    return;
  }

  areaError.textContent = "";
  bookingArea.classList.remove("has-error");
  bookingArea.removeAttribute("aria-invalid");
  showBookingStep(2);
}

// click: 날짜와 시작 시간이 둘 다 있어야 확인 단계로 간다
function handleNext2Click() {
  const missingDate = bookingDate.value === "";
  const missingTime = bookingTime.value === "";

  if (missingDate || missingTime) {
    timeError.textContent = missingDate
      ? "이용 날짜를 선택해 주세요. 달력 아이콘을 누르면 고를 수 있습니다."
      : "시작 시간을 선택해 주세요.";
    bookingDate.classList.toggle("has-error", missingDate);
    bookingTime.classList.toggle("has-error", missingTime);
    // 11주차: 테두리 색만이 아니라 aria-invalid로도 어느 칸이 잘못됐는지 알린다
    bookingDate.setAttribute("aria-invalid", String(missingDate));
    bookingTime.setAttribute("aria-invalid", String(missingTime));

    if (missingDate) {
      bookingDate.focus();
    } else {
      bookingTime.focus();
    }
    return;
  }

  timeError.textContent = "";
  bookingDate.classList.remove("has-error");
  bookingTime.classList.remove("has-error");
  bookingDate.removeAttribute("aria-invalid");
  bookingTime.removeAttribute("aria-invalid");
  clearOverlapError();
  fillSummary();
  showBookingStep(3);
}

document.querySelector("#bookingNext1").addEventListener("click", handleNext1Click);
document.querySelector("#bookingNext2").addEventListener("click", handleNext2Click);

// 이전 단계로 갈 때는 값을 지우지 않고 화면만 바꾼다
document.querySelector("#bookingBack2").addEventListener("click", function () {
  showBookingStep(1);
});
document.querySelector("#bookingBack3").addEventListener("click", function () {
  showBookingStep(2);
});

// change: 스터디룸을 고르면 함께 오는 사람 안내를 보여 준다
const bookingSeat = document.querySelector("#bookingSeat");
const seatHelp = document.querySelector("#seatHelp");

function handleSeatChange() {
  seatHelp.hidden = bookingSeat.value !== "스터디룸";
}

bookingSeat.addEventListener("change", handleSeatChange);

// 확인 화면: 확인 단계로 넘어갈 때마다 지금 값으로 다시 채운다
const bookingHours = document.querySelector("#bookingHours");
const summaryName = document.querySelector("#summaryName");
const summaryPlace = document.querySelector("#summaryPlace");
const summaryTime = document.querySelector("#summaryTime");

function fillSummary() {
  summaryName.textContent = userNameInput.value.trim() + "님";
  summaryPlace.textContent = bookingArea.value + " · " + bookingSeat.value;
  summaryTime.textContent = bookingDate.value + " " + bookingTime.value + "부터 " + bookingHours.value + "시간";
}

// click: 예약을 확정하면 완료 화면에 고른 내용을 한 문장으로 보여 준다
const bookingDoneText = document.querySelector("#bookingDoneText");

const overlapError = document.querySelector("#overlapError");

function handleCompleteClick() {
  // 이미 확정한 예약과 시간이 겹치면 확정하지 않고 날짜·시간 수정으로 안내한다
  const overlap = findOverlappingBooking();

  if (overlap) {
    overlapError.textContent = overlap.date + " " + overlap.time + "부터 " + overlap.hours + "시간 동안 "
      + overlap.area + " " + overlap.seat + " 예약이 이미 있습니다. 날짜·시간 수정하기를 눌러 겹치지 않는 시간을 골라 주세요.";
    summaryTime.classList.add("has-error");
    document.querySelector("#bookingBack3").focus();
    return;
  }

  bookingDoneText.textContent = summaryName.textContent + ", " + bookingArea.value + " "
    + bookingSeat.value + "을 " + summaryTime.textContent + " 동안 예약했습니다.";
  const saved = addMyBooking();
  showBookingStep(4);

  // 13주차: 저장에 성공했을 때만 작성 중 임시값을 지운다
  // 실패하면 임시값을 남겨 새로고침 뒤 3단계에서 다시 확정할 수 있게 한다
  if (saved) {
    clearDraft();
  } else {
    draftStatus.textContent = "예약을 브라우저에 저장하지 못했어요. 새로고침하면 내 예약에서 사라질 수 있어요. 작성 내용은 남겨 두었으니 새로고침 뒤 3단계에서 다시 확정할 수 있어요.";
  }
}

document.querySelector("#bookingComplete").addEventListener("click", handleCompleteClick);

// click: 다시 예약하기는 예약 흐름의 선택·오류·진행 상태를 처음으로 되돌린다
// 이름과 규칙 확인은 예약 준비 영역 값이라 그대로 둔다
function handleRestartClick() {
  bookingArea.value = "";
  bookingSeat.value = "1인석";
  bookingDate.value = "";
  bookingTime.value = "";
  bookingHours.value = "1";

  areaError.textContent = "";
  timeError.textContent = "";
  bookingArea.classList.remove("has-error");
  bookingDate.classList.remove("has-error");
  bookingTime.classList.remove("has-error");
  bookingArea.removeAttribute("aria-invalid");
  bookingDate.removeAttribute("aria-invalid");
  bookingTime.removeAttribute("aria-invalid");

  seatHelp.hidden = true;
  clearOverlapError();
  summaryName.textContent = "";
  summaryPlace.textContent = "";
  summaryTime.textContent = "";
  bookingDoneText.textContent = "";

  showBookingStep(1);
}

document.querySelector("#bookingRestart").addEventListener("click", handleRestartClick);

// 13주차: 작성 중인 예약 임시 보관·복구
// 확정 전에 새로고침하면 이름·규칙 확인·선택값·단계가 모두 사라졌다 (README 13주차 QA)
// 지금 탭에서만 이어 쓰면 되는 값이라 sessionStorage에 둔다. 확정한 예약은 기존대로 localStorage
const DRAFT_STORAGE_KEY = "dongneBookingDraft";
const prepareSection = document.querySelector("#prepare");
const draftNotice = document.querySelector("#draftNotice");
const draftStatus = document.querySelector("#draftStatus");
const draftDiscard = document.querySelector("#draftDiscard");

// 예약 준비와 예약 흐름의 값, 지금 단계(흐름이 닫혀 있으면 0)를 하나로 묶는다
function getDraftValues() {
  return {
    name: userNameInput.value,
    agree: agreeCheck.checked,
    area: bookingArea.value,
    seat: bookingSeat.value,
    date: bookingDate.value,
    time: bookingTime.value,
    hours: bookingHours.value,
    step: bookingFlow.hidden ? 0 : bookingStepNow
  };
}

// 처음 화면 그대로면 보관할 내용이 없는 것으로 본다
function hasDraftInput(draft) {
  return Boolean(draft.name || draft.agree || draft.area || draft.seat !== "1인석"
    || draft.date || draft.time || draft.hours !== "1");
}

function saveDraft() {
  const draft = getDraftValues();
  if (!hasDraftInput(draft)) {
    clearDraft();
    return;
  }

  try {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    const savedMessage = "작성 내용을 임시 보관했어요. 새로고침해도 이어서 작성할 수 있어요.";
    // 같은 문장을 다시 넣으면 화면 낭독기가 매번 읽으므로 바뀔 때만 넣는다
    if (draftStatus.textContent !== savedMessage) {
      draftStatus.textContent = savedMessage;
    }
  } catch (error) {
    // 저장소가 막혀도 지금 입력한 값은 지우지 않고 위험만 알린다
    draftStatus.textContent = "작성 내용을 임시 보관하지 못했어요. 새로고침하면 작성 내용이 사라질 수 있어요.";
  }
}

// 글자 입력은 input, 선택 상자·체크박스는 change에서 보관한다
[prepareSection, bookingFlow].forEach(function (area) {
  area.addEventListener("input", saveDraft);
  area.addEventListener("change", saveDraft);
});

// 비어 있거나 망가진 값이면 null을 돌려 빈 화면에서 시작한다
function readDraft() {
  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_STORAGE_KEY));
    if (!draft || typeof draft.name !== "string") {
      return null;
    }
    return draft;
  } catch (error) {
    return null;
  }
}

// 목록에 있는 값만 고르고, 없으면 처음 값으로 둔다
function restoreSelect(select, value, firstValue) {
  const found = Array.from(select.options).some(function (option) {
    return option.value === value;
  });
  select.value = found ? value : firstValue;
}

function restoreDraft() {
  const draft = readDraft();
  if (!draft) return;

  // 자바스크립트로 value를 바꾸면 input·change가 안 일어나서 글자 수와 버튼 상태를 직접 맞춘다
  userNameInput.value = draft.name.slice(0, 10);
  handleUserNameInput();
  agreeCheck.checked = draft.agree === true;
  handleAgreeChange();

  restoreSelect(bookingArea, draft.area, "");
  restoreSelect(bookingSeat, draft.seat, "1인석");
  restoreSelect(bookingTime, draft.time, "");
  restoreSelect(bookingHours, draft.hours, "1");
  // 날짜 형식이 아니면 입력칸이 알아서 빈 값으로 만든다
  bookingDate.value = String(draft.date || "");
  handleSeatChange();

  // 그 단계에 들어갈 조건이 안 맞으면 조건이 맞는 앞 단계로 돌린다
  let step = draft.step;
  if (!Number.isInteger(step) || step < 0 || step > 3) step = 0;
  if (step >= 1 && (userNameInput.value.trim() === "" || !agreeCheck.checked)) step = 0;
  if (step >= 2 && bookingArea.value === "") step = 1;
  if (step === 3 && (bookingDate.value === "" || bookingTime.value === "")) step = 2;

  if (step === 0) {
    userNameInput.focus();
    draftStatus.textContent = "작성하던 예약을 불러왔어요. 예약 준비에서 이어서 작성하세요.";
  } else {
    bookingFlow.hidden = false;
    if (step === 3) fillSummary();
    // showBookingStep이 다시 보관하면서 문장을 바꾸므로 안내 문장은 그 뒤에 쓴다
    showBookingStep(step);
    draftStatus.textContent = "작성하던 예약을 불러왔어요. " + step + "단계(" + stepNames[step - 1] + ")부터 이어서 작성하세요.";
  }
  draftDiscard.hidden = false;

  // 안내 문장과 이어 쓸 칸이 한 화면에 보이게 한다
  draftNotice.scrollIntoView({ block: step === 0 ? "end" : "start" });
}

// 임시값만 지운다. 확정한 예약(내 예약)은 그대로 남는다
function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    // 저장소를 쓸 수 없는 경우
  }
  draftDiscard.hidden = true;
  draftStatus.textContent = "";
}

// click: 불러온 내용을 버리고 이름부터 다시 쓴다
draftDiscard.addEventListener("click", function () {
  userNameInput.value = "";
  handleUserNameInput();
  userNameError.textContent = "";
  userNameInput.classList.remove("has-error");
  userNameInput.removeAttribute("aria-invalid");
  agreeCheck.checked = false;
  handleAgreeChange();

  // 예약 흐름의 값·오류는 다시 예약하기와 같은 방법으로 되돌린 뒤 흐름을 닫는다
  // (값이 모두 비어서 이 안에서 임시값도 지워진다)
  handleRestartClick();
  bookingFlow.hidden = true;

  userNameInput.focus();
  draftStatus.textContent = "처음부터 입력할 수 있어요.";
});


// 내 예약: 확정한 예약을 배열에 모아 두고, 바뀔 때마다 목록을 다시 그린다
const myBookingList = document.querySelector("#myBookingList");
const myBookingsEmpty = document.querySelector("#myBookingsEmpty");
const myBookingsMessage = document.querySelector("#myBookingsMessage");
const bookingItemTemplate = document.querySelector("#bookingItemTemplate");

// 10주차: 필터로 다시 볼 수 있게 후기처럼 브라우저 저장소에 남긴다
const BOOKING_STORAGE_KEY = "dongneBookings";

function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKING_STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

// 13주차: 저장에 성공했는지 돌려준다. 예약 확정 때 임시값을 지울지 이 값으로 정한다
function saveBookings() {
  try {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(myBookings));
    return true;
  } catch (error) {
    // 저장소가 막혀 있어도 지금 화면의 목록은 그대로 쓴다
    return false;
  }
}

const myBookings = loadBookings();

// 저장된 예약 중 가장 큰 번호 다음부터 매긴다
let nextBookingId = 1;
myBookings.forEach(function (booking) {
  if (booking.id >= nextBookingId) {
    nextBookingId = booking.id + 1;
  }
});

// 지금 예약 흐름에 들어 있는 값으로 예약 하나를 만들어 맨 앞에 넣는다
function addMyBooking() {
  myBookings.unshift({
    id: nextBookingId,
    name: userNameInput.value.trim(),
    area: bookingArea.value,
    seat: bookingSeat.value,
    date: bookingDate.value,
    time: bookingTime.value,
    hours: Number(bookingHours.value),
    status: "예약됨"
  });
  nextBookingId = nextBookingId + 1;
  const saved = saveBookings();

  showListMessage("", "");
  // 취소됨만 보고 있었어도 방금 확정한 예약이 보이게 전체로 돌린다
  setBookingFilter("all");
  return saved;
}

// 11주차: 카드마다 버튼 글자가 같아서 버튼 이름 앞에 어떤 예약인지 붙인다
// 예) "망원동 1인석 2026-11-20 10:00 예약 취소"
function nameBookingButton(button, booking) {
  button.setAttribute("aria-label",
    booking.area + " " + booking.seat + " " + booking.date + " " + booking.time + " " + button.textContent);
}

// 템플릿을 복사해 예약 한 건의 목록 줄(카드)을 만든다
// 12주차: 카드마다 이벤트를 붙이지 않는다. 카드에는 예약 번호(data-id)만 적고,
// 버튼의 data-action(detail, cancel)으로 무슨 행동인지 구분해 목록 하나에서 받는다
function makeBookingItem(booking) {
  const item = bookingItemTemplate.content.firstElementChild.cloneNode(true);
  item.dataset.id = booking.id;

  item.querySelector(".booking-item-place").textContent = booking.area + " · " + booking.seat;
  item.querySelector(".booking-item-time").textContent =
    booking.date + " " + booking.time + "부터 " + booking.hours + "시간";

  const start = toHour(booking.time);
  item.querySelector(".detail-name").textContent = booking.name + "님";
  item.querySelector(".detail-range").textContent =
    booking.time + " ~ " + formatHour(start + booking.hours);
  item.querySelector(".detail-deadline").textContent =
    booking.date + " " + formatHour(start - 1) + "까지";

  // 자세히 보기는 자주 묻는 질문과 같은 펼치기 함수(toggleExpanded)를 쓰므로 영역에 id를 붙여 연결한다
  const detail = item.querySelector(".booking-detail");
  const detailButton = item.querySelector(".detail-button");
  detail.id = "booking-detail-" + booking.id;
  detailButton.setAttribute("aria-controls", detail.id);
  nameBookingButton(detailButton, booking);

  showBookingStatus(booking, item);
  return item;
}

// 상태 글자, 취소 표시, 취소 버튼을 예약 상태 하나에 맞춘다
function showBookingStatus(booking, item) {
  const cancelled = booking.status === "취소됨";
  const cancelButton = item.querySelector(".cancel-button");

  item.querySelector(".booking-status").textContent = booking.status;
  item.classList.toggle("is-cancelled", cancelled);
  cancelButton.disabled = cancelled;
  cancelButton.textContent = cancelled ? "취소 완료" : "예약 취소";
  nameBookingButton(cancelButton, booking);
}

// click: 목록 안의 모든 카드 버튼이 여기로 모인다
myBookingList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const item = button.closest(".booking-item");
  const booking = myBookings.find(function (saved) {
    return saved.id === Number(item.dataset.id);
  });

  if (button.dataset.action === "detail") {
    toggleExpanded(button);
    nameBookingButton(button, booking);
    return;
  }

  if (button.dataset.action !== "cancel") return;
  askCancelBooking(booking, item, button);
});

function isPastCancelDeadline(booking) {
  const deadline = new Date(booking.date + "T" + formatHour(toHour(booking.time) - 1));
  return new Date() >= deadline;
}

// 12주차 모달 공통 함수
// 연 버튼을 기억해 두었다가, 어떤 방법으로 닫혀도(돌아가기·Esc·바깥 클릭) 그 버튼으로 초점을 돌려준다
let modalOpener = null;

function openModal(dialog, opener) {
  modalOpener = opener;
  dialog.showModal();
}

function closeModal(dialog) {
  dialog.close();
}

document.querySelectorAll(".modal").forEach(function (dialog) {
  // data-modal-close 버튼, 또는 상자 바깥의 어두운 배경을 누르면 닫는다
  dialog.addEventListener("click", function (event) {
    if (event.target.closest("[data-modal-close]") || event.target === dialog) {
      closeModal(dialog);
    }
  });

  // Esc도 close 이벤트로 들어온다. 연 버튼이 그대로 쓸 수 있는 상태일 때만 초점을 돌려준다
  // (취소를 확정하면 그 버튼은 "취소 완료"로 막히거나 목록에서 빠지므로 cancelBooking이 초점을 옮긴다)
  dialog.addEventListener("close", function () {
    if (modalOpener && modalOpener.isConnected && !modalOpener.disabled) {
      modalOpener.focus();
    }
    modalOpener = null;
  });
});

// 예약 취소 확인 모달
const cancelDialog = document.querySelector("#cancelDialog");
const cancelDialogText = document.querySelector("#cancelDialogText");
let pendingCancel = null;

// click 예약 취소: 기한이 지났으면 모달 없이 바로 안내하고, 아니면 어떤 예약인지 보여 주고 한 번 더 묻는다
function askCancelBooking(booking, item, button) {
  if (isPastCancelDeadline(booking)) {
    showListMessage(booking.date + " " + booking.time + " " + booking.area + " " + booking.seat
      + " 예약은 취소 기한(이용 1시간 전)이 지나 취소할 수 없습니다. 예약 시간에 맞춰 방문해 주세요.", "is-error");
    return;
  }

  pendingCancel = { booking: booking, item: item };
  cancelDialogText.textContent = booking.area + " " + booking.seat + " · "
    + booking.date + " " + booking.time + "부터 " + booking.hours + "시간";
  openModal(cancelDialog, button);
}

document.querySelector("#cancelConfirm").addEventListener("click", function () {
  const target = pendingCancel;
  pendingCancel = null;
  closeModal(cancelDialog);
  cancelBooking(target.booking, target.item);
});

// 모달에서 "예약 취소하기"를 눌렀을 때 실제로 취소한다
function cancelBooking(booking, item) {
  const place = booking.area + " " + booking.seat;
  const when = booking.date + " " + booking.time;

  booking.status = "취소됨";
  saveBookings();
  showBookingStatus(booking, item);

  // 예약됨만 보고 있으면 취소한 카드는 목록에서 빠져야 하므로 다시 그린다
  if (currentFilter !== "all") {
    renderMyBookings();
  }
  showListMessage(when + " " + place + " 예약을 취소했습니다. 같은 시간에 다시 예약하려면 새로 예약하기를 눌러 주세요.", "is-done");

  // 취소 버튼이 비활성화되면 포커스가 사라지므로 옮겨 준다 (11주차에 바꿈)
  // 전체 보기면 카드가 그대로 남아 있으니 그 카드의 자세히 보기로,
  // 예약됨만 보고 있었으면 카드가 목록에서 빠지므로 선택된 필터 버튼으로
  if (currentFilter === "all") {
    item.querySelector(".detail-button").focus();
  } else {
    document.querySelector('.filter-button[aria-pressed="true"]').focus();
  }
}

// 내 예약 필터 (10주차)
const filterButtons = document.querySelectorAll(".filter-button");
const myBookingsCount = document.querySelector("#myBookingsCount");
const filterNames = { all: "전체", booked: "예약됨", cancelled: "취소됨" };
const emptyAllText = myBookingsEmpty.textContent;
const showAllBookings = document.querySelector("#showAllBookings");

// all: 전체, booked: 취소하지 않은 예약, cancelled: 취소한 예약
let currentFilter = "all";

function getVisibleBookings() {
  return myBookings.filter(function (booking) {
    if (currentFilter === "all") return true;
    if (currentFilter === "cancelled") return booking.status === "취소됨";
    return booking.status !== "취소됨";
  });
}

function renderMyBookings() {
  const visibleBookings = getVisibleBookings();

  myBookingList.innerHTML = "";
  myBookingsEmpty.hidden = visibleBookings.length > 0;
  myBookingList.hidden = visibleBookings.length === 0;
  // 예약은 있는데 고른 상태에만 없을 때만 전체 보기를 보여 준다. 예약이 아예 없으면 새로 예약하기가 다음 행동
  showAllBookings.hidden = !(visibleBookings.length === 0 && myBookings.length > 0);

  // 예약이 아예 없을 때와, 고른 상태에만 없을 때 안내를 다르게 한다
  if (visibleBookings.length === 0) {
    myBookingsEmpty.textContent = myBookings.length === 0
      ? emptyAllText
      : filterNames[currentFilter] + " 상태인 예약이 없습니다. 확정한 예약은 모두 "
        + myBookings.length + "건이고, 아래 전체 보기를 누르면 모두 볼 수 있습니다.";
  }

  myBookingsCount.textContent = currentFilter === "all"
    ? "전체 " + myBookings.length + "건"
    : filterNames[currentFilter] + " " + visibleBookings.length + "건 / 전체 " + myBookings.length + "건";

  visibleBookings.forEach(function (booking) {
    myBookingList.appendChild(makeBookingItem(booking));
  });
}

// 누른 버튼 하나만 선택 표시(is-active, aria-pressed)하고 목록을 다시 그린다
function setBookingFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach(function (button) {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  renderMyBookings();
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setBookingFilter(button.dataset.filter);
  });
});

// 11주차 click: 빈 결과에서 전체 보기를 누르면 전체 필터로 돌리고 초점도 전체 버튼으로 옮긴다
// (전체 보기 버튼이 다시 숨겨지므로 초점이 사라지지 않게)
showAllBookings.addEventListener("click", function () {
  setBookingFilter("all");
  document.querySelector('.filter-button[data-filter="all"]').focus();
});

// 목록 위 안내 문구. type은 is-error, is-done 중 하나이거나 빈 값
function showListMessage(text, type) {
  myBookingsMessage.textContent = text;
  myBookingsMessage.classList.toggle("is-error", type === "is-error");
  myBookingsMessage.classList.toggle("is-done", type === "is-done");
}

// click: 완료 화면에서 내 예약으로 이동해 방금 넣은 예약에 포커스를 둔다
// 주소도 #myBookings로 바꿔서 메뉴의 현재 위치가 따라오게 한다
document.querySelector("#viewMyBookings").addEventListener("click", function () {
  location.hash = "#myBookings";
  myBookingList.querySelector(".detail-button").focus();
});

// click: 새로 예약하기. 예약 흐름을 연 적이 없으면 예약 준비부터 시작한다
function handleNewBookingClick() {
  location.hash = "#prepare";

  if (bookingFlow.hidden) {
    userNameInput.focus();
    return;
  }
  handleRestartClick();
}

document.querySelector("#newBookingButton").addEventListener("click", handleNewBookingClick);

// 저장해 둔 예약으로 처음 목록을 그린다
renderMyBookings();

// "13:00" → 13
function toHour(time) {
  return Number(time.slice(0, 2));
}

// 9 → "09:00"
function formatHour(hour) {
  return String(hour).padStart(2, "0") + ":00";
}

// 같은 날, 취소하지 않은 예약 중 지금 고른 시간과 한 시간이라도 겹치는 예약을 찾는다
function findOverlappingBooking() {
  const start = toHour(bookingTime.value);
  const end = start + Number(bookingHours.value);

  return myBookings.find(function (booking) {
    if (booking.status === "취소됨" || booking.date !== bookingDate.value) {
      return false;
    }

    const bookedStart = toHour(booking.time);
    const bookedEnd = bookedStart + booking.hours;
    return start < bookedEnd && bookedStart < end;
  });
}

function clearOverlapError() {
  overlapError.textContent = "";
  summaryTime.classList.remove("has-error");
}


// 이용 후기 폼 (9주차)
const reviewForm = document.querySelector("#reviewForm");
const reviewIssue = document.querySelector("#reviewIssue");
const reviewIssueOptions = document.querySelector("#reviewIssueOptions");
const reviewIssueInputs = document.querySelectorAll('input[name="issue"]');
const reviewIssueError = document.querySelector("#reviewIssueError");

// change: 체크하면 불편한 점 영역을 열고, 해제하면 숨기면서 안의 입력도 막는다
// disabled인 입력은 Tab으로 들어갈 수 없고 FormData에도 들어가지 않는다
function syncIssueFields() {
  const open = reviewIssue.checked;

  reviewIssue.setAttribute("aria-expanded", String(open));
  reviewIssueOptions.hidden = !open;
  reviewIssueInputs.forEach(function (input) {
    input.disabled = !open;
  });

  // 닫은 영역의 오류가 남아 있으면 제출을 막는 이유가 사라졌으므로 같이 지운다
  if (!open) {
    clearFieldError(reviewIssueOptions, reviewIssueOptions, reviewIssueError);
  }
}

reviewIssue.addEventListener("change", function () {
  syncIssueFields();
  clearReviewStatusIfFixed();
});
syncIssueFields();

// 입력 중 상태와 오류를 표시할 요소
const reviewArea = document.querySelector("#reviewArea");
const reviewAreaField = document.querySelector("#reviewAreaField");
const reviewAreaError = document.querySelector("#reviewAreaError");
const reviewText = document.querySelector("#reviewText");
const reviewTextField = document.querySelector("#reviewTextField");
const reviewTextHelp = document.querySelector("#reviewTextHelp");
const reviewTextCount = document.querySelector("#reviewTextCount");
const reviewTextError = document.querySelector("#reviewTextError");

const REVIEW_MIN = 20;
const REVIEW_MAX = 200;
const reviewTextHelpDefault = reviewTextHelp.textContent;

// 오류는 테두리(has-error), aria-invalid, 오류 문장을 한꺼번에 켜고 끈다
function showFieldError(box, control, errorBox, message) {
  control.setAttribute("aria-invalid", "true");
  errorBox.textContent = message;
  box.classList.remove("is-valid");
  box.classList.add("has-error");
  return false;
}

function clearFieldError(box, control, errorBox) {
  control.removeAttribute("aria-invalid");
  errorBox.textContent = "";
  box.classList.remove("has-error");
}

// input: 글자 수와 조건까지 남은 글자를 쓰는 동안 바로 보여 준다
// 아직 쓰는 중에는 빨간 오류를 띄우지 않고 안내 문장만 바꾼다
function updateReviewTextState() {
  const length = reviewText.value.length;
  const written = reviewText.value.trim().length;
  const enough = written >= REVIEW_MIN;
  const invalid = reviewText.getAttribute("aria-invalid") === "true";

  reviewTextCount.textContent = length + " / " + REVIEW_MAX + "자";
  reviewTextField.classList.toggle("is-valid", enough && !invalid);

  if (written === 0) {
    reviewTextHelp.textContent = reviewTextHelpDefault;
  } else if (enough) {
    reviewTextHelp.textContent = "등록 조건을 충족했습니다.";
  } else {
    reviewTextHelp.textContent = (REVIEW_MIN - written) + "자 더 쓰면 등록할 수 있습니다.";
  }
}

function validateReviewArea() {
  if (reviewArea.value === "") {
    return showFieldError(reviewAreaField, reviewArea, reviewAreaError,
      "다녀온 동네를 선택해 주세요. 목록에서 공부방이 있는 동네를 고르면 됩니다.");
  }

  clearFieldError(reviewAreaField, reviewArea, reviewAreaError);
  return true;
}

// 빈 값과 글자 수 부족은 고치는 방법이 달라서 문장도 나눈다
function validateReviewText() {
  const written = reviewText.value.trim().length;

  if (written === 0) {
    return showFieldError(reviewTextField, reviewText, reviewTextError,
      "후기 내용을 입력해 주세요.");
  }

  if (written < REVIEW_MIN) {
    return showFieldError(reviewTextField, reviewText, reviewTextError,
      "후기를 " + REVIEW_MIN + "자 이상 써 주세요. 지금 " + written + "자라서 "
      + (REVIEW_MIN - written) + "자 더 필요합니다.");
  }

  clearFieldError(reviewTextField, reviewText, reviewTextError);
  updateReviewTextState();
  return true;
}

// 불편한 점 영역이 닫혀 있으면 검사하지 않는다
function validateReviewIssue() {
  const picked = reviewForm.querySelector('input[name="issue"]:checked');

  if (reviewIssue.checked && !picked) {
    return showFieldError(reviewIssueOptions, reviewIssueOptions, reviewIssueError,
      "가장 불편했던 점을 하나 골라 주세요. 남기지 않으려면 위 체크를 해제하면 됩니다.");
  }

  clearFieldError(reviewIssueOptions, reviewIssueOptions, reviewIssueError);
  return true;
}

// 제출 때 띄운 "고칠 항목" 문구를 남은 오류 수에 맞춘다. 다 고치면 내린다
// 저장 실패 문구는 건드리지 않도록 "고칠 항목" 문구일 때만 바꾼다
function clearReviewStatusIfFixed() {
  if (reviewStatus.dataset.kind !== "count") {
    return;
  }

  const left = reviewForm.querySelectorAll('[aria-invalid="true"]').length;
  if (left === 0) {
    showReviewStatus("", "");
  } else {
    showReviewStatus(makeErrorCountMessage(left), "is-error");
    reviewStatus.dataset.kind = "count";
  }
}

function makeErrorCountMessage(count) {
  return "고칠 항목이 " + count + "개 있습니다. 붉게 표시된 안내를 보고 고친 뒤 다시 등록해 주세요.";
}

// 한 번 오류가 난 칸은 값을 고치는 즉시 다시 검사해서 오류를 해제한다
reviewText.addEventListener("input", function () {
  updateReviewTextState();

  if (reviewText.getAttribute("aria-invalid") === "true") {
    validateReviewText();
    clearReviewStatusIfFixed();
  }
});

reviewArea.addEventListener("change", function () {
  if (reviewArea.getAttribute("aria-invalid") === "true") {
    validateReviewArea();
    clearReviewStatusIfFixed();
  }
});

reviewIssueInputs.forEach(function (input) {
  input.addEventListener("change", function () {
    if (reviewIssueOptions.getAttribute("aria-invalid") === "true") {
      validateReviewIssue();
      clearReviewStatusIfFixed();
    }
  });
});

// 제출 상태와 저장한 후기 목록
const reviewSubmit = document.querySelector("#reviewSubmit");
const reviewStatus = document.querySelector("#reviewStatus");
const reviewList = document.querySelector("#reviewList");
const reviewEmpty = document.querySelector("#reviewEmpty");

const REVIEW_STORAGE_KEY = "dongneReviews";

// 주소 끝에 ?save-error 를 붙여 열면 저장 실패 화면을 확인할 수 있다
const forceSaveFailure = new URLSearchParams(location.search).has("save-error");

// 새로고침해도 남도록 브라우저 저장소(localStorage)에서 불러온다
function loadReviews() {
  try {
    return JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

const reviews = loadReviews();

// 12주차: 후기 한 건을 받아 목록 한 줄을 돌려주는 함수로 나눴다
// 목록 함수(renderReviews)는 빈 목록 안내와 순서만, 카드 모양은 이 함수만 맡는다
function createText(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function createReviewItem(review) {
  const item = document.createElement("li");
  // 불편했던 점이 있는 후기는 표시를 달리한다 (글 "불편했던 점"과 왼쪽 선)
  item.className = review.issue ? "review-item has-issue" : "review-item";

  item.append(createText("p", "review-item-head", review.area + " · " + review.seat));
  item.append(createText("p", "review-item-text", review.text));

  // 날짜는 time 요소로. 화면 글자와 기계가 읽는 값(datetime)을 같이 둔다
  const sub = createText("p", "review-item-sub", "");
  const date = createText("time", "", review.date);
  date.dateTime = review.date;
  sub.append(date);
  if (review.issue) {
    sub.append(" · 불편했던 점: " + review.issue);
  }
  item.append(sub);

  return item;
}

function renderReviews() {
  reviewList.innerHTML = "";
  reviewEmpty.hidden = reviews.length > 0;

  reviews.forEach(function (review) {
    reviewList.append(createReviewItem(review));
  });
}

renderReviews();

// 상태 문구. type은 is-error, is-done 중 하나이거나 빈 값
function showReviewStatus(text, type) {
  reviewStatus.textContent = text;
  reviewStatus.classList.toggle("is-error", type === "is-error");
  reviewStatus.classList.toggle("is-done", type === "is-done");
  reviewStatus.dataset.kind = "";
}

// 저장하는 동안 버튼을 잠가 두 번 눌러도 한 번만 저장되게 한다
function setReviewSaving(saving) {
  reviewForm.setAttribute("aria-busy", String(saving));
  reviewSubmit.disabled = saving;
  reviewSubmit.textContent = saving ? "등록하는 중…" : "후기 등록하기";
}

function wait(milliseconds) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, milliseconds);
  });
}

// 서버가 없으니 잠깐 기다린 뒤 브라우저 저장소에 저장한다
async function saveReview(review) {
  await wait(800);

  if (forceSaveFailure) {
    throw new Error("저장 실패 확인용");
  }

  reviews.unshift(review);
  try {
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
  } catch (error) {
    reviews.shift();
    throw error;
  }
}

// 입력값, 안내·오류 문장, 조건부 영역, 버튼 상태를 처음으로 되돌린다
function resetReviewForm() {
  reviewForm.reset();
  syncIssueFields();

  clearFieldError(reviewAreaField, reviewArea, reviewAreaError);
  clearFieldError(reviewTextField, reviewText, reviewTextError);
  updateReviewTextState();

  setReviewSaving(false);
  showReviewStatus("", "");
}

// submit: 버튼 클릭과 입력칸에서 Enter 모두 여기로 들어온다
async function handleReviewSubmit(event) {
  event.preventDefault();

  if (reviewForm.getAttribute("aria-busy") === "true") {
    return;
  }

  // 오류를 모두 보여 주려고 하나가 틀려도 나머지까지 검사한다
  const results = [validateReviewArea(), validateReviewText(), validateReviewIssue()];
  const errorCount = results.filter(function (ok) { return !ok; }).length;

  if (errorCount > 0) {
    showReviewStatus(makeErrorCountMessage(errorCount), "is-error");
    reviewStatus.dataset.kind = "count";

    // 첫 오류 칸으로 이동한다. 라디오 묶음이면 첫 선택지로
    const firstError = reviewForm.querySelector('[aria-invalid="true"]');
    if (firstError === reviewIssueOptions) {
      reviewIssueInputs[0].focus();
    } else {
      firstError.focus();
    }
    return;
  }

  // 닫힌 영역의 라디오는 disabled라 FormData에 issue가 들어가지 않는다
  const data = new FormData(reviewForm);
  const review = {
    area: data.get("area"),
    seat: data.get("seat"),
    text: String(data.get("text")).trim(),
    issue: data.get("issue"),
    date: new Date().toISOString().slice(0, 10)
  };

  setReviewSaving(true);
  showReviewStatus("후기를 등록하고 있습니다. 잠시만 기다려 주세요.", "");

  try {
    await saveReview(review);
    renderReviews();
    resetReviewForm();
    showReviewStatus(review.area + " " + review.seat + " 후기를 등록했습니다. 아래 최근 후기 맨 위에서 확인할 수 있습니다.", "is-done");
  } catch (error) {
    // 실패하면 쓴 내용은 그대로 두고 버튼만 다시 쓸 수 있게 푼다
    setReviewSaving(false);
    showReviewStatus("후기를 등록하지 못했습니다. 쓴 내용은 그대로 두었으니 후기 등록하기를 다시 눌러 주세요.", "is-error");
  }
}

reviewForm.addEventListener("submit", handleReviewSubmit);

// click: 처음부터 다시 쓰기
document.querySelector("#reviewReset").addEventListener("click", function () {
  resetReviewForm();
  reviewArea.focus();
});

// 13주차: 페이지가 다 준비된 뒤 작성하던 예약이 있으면 한 번 불러온다
restoreDraft();
