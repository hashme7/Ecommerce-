

// ****************** validation on email ******************\\
function validationOnform(event) {
    let email = $('#email').val();
    let valid = emailValidation(email);
    console.log("email:", email)
    if (!valid || email == "") {
        $('#emailError').css('display', 'block')
        event.preventDefault();
    } else {
        $('#emailError').css('display', 'none')
    }
}

// **************** emailValidation **************\\
function emailValidation(email) {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
        return false;
    }
    return true;
}
let sendBtn = document.getElementById('sendbtn')

$(document).ready(function () {
    // Animate loader off screen
    $('.preloader').fadeOut("slow");
    setTimeout(function () { $('.preloader').fadeOut('slow'); }, 1000);
});
