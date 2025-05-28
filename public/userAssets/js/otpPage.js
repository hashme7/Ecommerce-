const inputs = document.querySelectorAll("input"),
  button = document.querySelector("button");
let OTPForm = document.getElementById('otpForm');
OTPForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let dat = $(OTPForm).serialize();
  try {
    let isCorrect = await fetch(`/otp?${dat}`, {
      method: 'POST'
    });
    let result = await isCorrect.json();
    if (result.success) {
      window.location.href = '/login';
    } else {
      button.classList.remove("active");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Entered otp is wrong!",
        showConfirmButton: false,
        timer: 1000
      })
    }
  } catch (error) {
    console.log(error)
  }

})
inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    const currentInput = input,
      nextInput = input.nextElementSibling,
      prevInput = input.previousElementSibling;

    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }
    if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    if (e.key === "Backspace") {
      inputs.forEach((input, index2) => {
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", true);
          input.value = "";
          prevInput.focus();
        }
      });
    }
    if (!inputs[3].disabled && inputs[3].value !== "") {
      button.classList.add("active");
      return;
    }
    button.classList.remove("active");
  });
});

window.addEventListener("load", () => inputs[0].focus());

//************** countdown ************\\
document.addEventListener("DOMContentLoaded", function () {

  const resendButton = document.getElementById("resendButton");
  const countdownDisplay = document.getElementById("countDown");
  const email = document.getElementById('email').getAttribute('mail-data')

  let countdownTime = 60;
  function updateTimerDisplay() {
    countdownDisplay.textContent = `otp resend in ${countdownTime} seconds`;
  }

  function startCountdown() {
    resendButton.disabled = true;
    updateTimerDisplay();

    const countdownInterval = setInterval(function () {
      countdownTime--;
      updateTimerDisplay();
      if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        resendButton.classList.add('active')
        resendButton.disabled = false;
        countdownDisplay.textContent = "";
        return;
      }
    }, 1000);
  }

  resendButton.addEventListener("click", async () => {
    const resData = await fetch('/emailVerify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    })
    console.log(resData)
    if (resData) {
      console.log("sw")
    } else {
      console.log("else")
    }
    countdownTime = 60;
    resendButton.classList.remove('active')
    startCountdown();
  });

  startCountdown();

});
$(document).ready(function () {
  $('.preloader').fadeOut("slow");
  setTimeout(function () { $('.preloader').fadeOut('slow'); }, 3000);
});



