
function validateSignup() {
    event.preventDefault();
    document.getElementById('fnameError').style.display = 'none';
    document.getElementById('femailError').style.display = 'none';
    document.getElementById('fpasswordError').style.display = 'none';
    document.getElementById('fconfirmPasswordError').style.display = 'none';
    document.getElementById('fphoneError').style.display = 'none';

    let name = document.forms['signUpForm']['name'].value;
    let email = document.forms['signUpForm']['email'].value;
    let password = document.forms['signUpForm']['password'].value;
    let confirmPassword = document.forms['signUpForm']['confirmpassword'].value;
    let number = document.forms['signUpForm']['phone'].value;
    let isValid = true;
    console.log("validateSignup")
    if(name == ""){
        document.getElementById('fnameError').style.display = 'block'
        isValid = true;
    }
    if (!emailValidation(email)||email == "") {
        console.log("email")
        document.getElementById('femailError').style.display = 'block';
        isValid = false;
    }
    if (!PasswordValidation(password)) {
        console.log("password");
        document.getElementById('fpasswordError').style.display = 'block';
        isValid = false;
    }
    if (confirmPassword !== password|| confirmPassword =="") {
        console.log("confirmPassword")
        document.getElementById('fconfirmPasswordError').style.display = 'block';
        isValid = false
    }
    if(number ==''){
        console.log('phone')
        document.getElementById('fphoneError').style.display = 'block';
        isValid = false;
    }
    if (!isValid) return;
    document.getElementById('signUpForm').submit();
}
function emailValidation(email) {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
        return false;
    }
    return true;
}
function PasswordValidation(password){
    let regexP =/^(?=.*[0-9])(?!.* ).{6,}$/
    console.log(password)
    console.log(regexP.test(password))
    if(!regexP.test(password)){
        return false;
    }
    console.log("true")
    return true;
}
$(document).ready(function () {
    $( ' .preloader' ).fadeOut("slow");
        setTimeout(function(){ $('.preloader').fadeOut('slow'); }, 900);
    });