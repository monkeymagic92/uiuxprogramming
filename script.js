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
}

subscribeForm.addEventListener("submit", subscribe);
