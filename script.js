// 파일이 연결됐는지 확인
console.log("JavaScript가 연결되었습니다.");

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
    emailInput.focus();
  } else {
    isSubscribed = true;
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

// 주요 기능 탭: 같은 역할의 요소가 여러 개라 querySelectorAll로 모두 찾는다
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// 모든 탭과 패널의 선택 상태를 먼저 해제한다
function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

// 누른 탭과 data-target으로 연결된 패널만 켠다
function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});

// 공부방 예약 흐름
const userNameError = document.querySelector("#userNameError");
const bookingFlow = document.querySelector("#bookingFlow");
const bookingSteps = document.querySelectorAll(".booking-step");
const bookingProgress = document.querySelector("#bookingProgress");
const bookingArea = document.querySelector("#bookingArea");
const stepNames = ["공부방 선택", "날짜·시간 선택", "내용 확인"];

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
}

// click: 규칙 확인(버튼 활성)에 이어 이름까지 있어야 예약 흐름을 연다
function handleStartClick() {
  if (userNameInput.value.trim() === "") {
    userNameError.textContent = "예약자 이름을 입력해 주세요. 확인 화면에 이 이름이 들어갑니다.";
    userNameInput.classList.add("has-error");
    userNameInput.focus();
    return;
  }

  userNameError.textContent = "";
  userNameInput.classList.remove("has-error");

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
    bookingArea.focus();
    return;
  }

  areaError.textContent = "";
  bookingArea.classList.remove("has-error");
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
  addMyBooking();
  showBookingStep(4);
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

  seatHelp.hidden = true;
  clearOverlapError();
  summaryName.textContent = "";
  summaryPlace.textContent = "";
  summaryTime.textContent = "";
  bookingDoneText.textContent = "";

  showBookingStep(1);
}

document.querySelector("#bookingRestart").addEventListener("click", handleRestartClick);


// 내 예약: 확정한 예약을 배열에 모아 두고, 바뀔 때마다 목록을 다시 그린다
const myBookingList = document.querySelector("#myBookingList");
const myBookingsEmpty = document.querySelector("#myBookingsEmpty");
const myBookingsMessage = document.querySelector("#myBookingsMessage");
const bookingItemTemplate = document.querySelector("#bookingItemTemplate");

const myBookings = [];
let nextBookingId = 1;

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

  showListMessage("", "");
  renderMyBookings();
}

// 템플릿을 복사해 예약 한 건의 목록 줄을 만든다
function makeBookingItem(booking) {
  const item = bookingItemTemplate.content.firstElementChild.cloneNode(true);

  item.querySelector(".booking-item-place").textContent = booking.area + " · " + booking.seat;
  item.querySelector(".booking-item-time").textContent =
    booking.date + " " + booking.time + "부터 " + booking.hours + "시간";

  const start = toHour(booking.time);
  item.querySelector(".detail-name").textContent = booking.name + "님";
  item.querySelector(".detail-range").textContent =
    booking.time + " ~ " + formatHour(start + booking.hours);
  item.querySelector(".detail-deadline").textContent =
    booking.date + " " + formatHour(start - 1) + "까지";

  const detail = item.querySelector(".booking-detail");
  const detailButton = item.querySelector(".detail-button");
  const cancelButton = item.querySelector(".cancel-button");

  // click: 자세히 보기 ↔ 접기
  detailButton.addEventListener("click", function () {
    detail.hidden = !detail.hidden;
    detailButton.textContent = detail.hidden ? "자세히 보기" : "접기";
    detailButton.setAttribute("aria-expanded", String(!detail.hidden));
  });

  cancelButton.addEventListener("click", function () {
    cancelBooking(booking, item);
  });

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
}

// click: 이용 1시간 전이 지나지 않았을 때만 취소한다
function cancelBooking(booking, item) {
  const place = booking.area + " " + booking.seat;
  const when = booking.date + " " + booking.time;
  const deadline = new Date(booking.date + "T" + formatHour(toHour(booking.time) - 1));

  if (new Date() >= deadline) {
    showListMessage(when + " " + place + " 예약은 취소 기한(이용 1시간 전)이 지나 취소할 수 없습니다. 예약 시간에 맞춰 방문해 주세요.", "is-error");
    return;
  }

  booking.status = "취소됨";
  showBookingStatus(booking, item);
  showListMessage(when + " " + place + " 예약을 취소했습니다. 같은 시간에 다시 예약하려면 새로 예약하기를 눌러 주세요.", "is-done");

  // 취소 버튼이 비활성화되면 포커스가 사라지므로 다음 행동 버튼으로 옮긴다
  document.querySelector("#newBookingButton").focus();
}

function renderMyBookings() {
  myBookingList.innerHTML = "";

  // 예약이 하나도 없을 때만 빈 목록 안내를 보여 준다
  myBookingsEmpty.hidden = myBookings.length > 0;

  myBookings.forEach(function (booking) {
    myBookingList.appendChild(makeBookingItem(booking));
  });
}

// 목록 위 안내 문구. type은 is-error, is-done 중 하나이거나 빈 값
function showListMessage(text, type) {
  myBookingsMessage.textContent = text;
  myBookingsMessage.classList.toggle("is-error", type === "is-error");
  myBookingsMessage.classList.toggle("is-done", type === "is-done");
}

// click: 완료 화면에서 내 예약으로 이동해 방금 넣은 예약에 포커스를 둔다
document.querySelector("#viewMyBookings").addEventListener("click", function () {
  myBookingList.querySelector(".detail-button").focus();
});

// click: 새로 예약하기. 예약 흐름을 연 적이 없으면 예약 준비부터 시작한다
function handleNewBookingClick() {
  if (bookingFlow.hidden) {
    userNameInput.focus();
    return;
  }
  handleRestartClick();
}

document.querySelector("#newBookingButton").addEventListener("click", handleNewBookingClick);

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

function renderReviews() {
  reviewList.innerHTML = "";
  reviewEmpty.hidden = reviews.length > 0;

  reviews.forEach(function (review) {
    const item = document.createElement("li");
    const head = document.createElement("p");
    const body = document.createElement("p");

    item.className = "review-item";
    head.className = "review-item-head";
    head.textContent = review.area + " · " + review.seat;
    body.textContent = review.text;
    item.append(head, body);

    const sub = document.createElement("p");
    sub.className = "review-item-sub";
    sub.textContent = review.date + (review.issue ? " · 불편했던 점: " + review.issue : "");
    item.append(sub);

    reviewList.appendChild(item);
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
