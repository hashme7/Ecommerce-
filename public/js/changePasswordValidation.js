function resetPassword(event){
    console.log("inside validation")
    let password = $('#newPassword').val();
    let confirmPassword = $('#confirmPassword').val();
    if(!PasswordValidation(password)){
        console.log("password incorrect")
         $('#passwordError').css('display','block')
        event.preventDefault();
        return;
    }
    else{
        $('#passwordError').css('display','none')
    }
    if(password !== confirmPassword){
        $('#confirmPasswordError').css('display','block')
        event.preventDefault();
        return;
    }else{
        $('#confirmPasswordError').css('display','none')
    }
}
//***************password validation*****************\\
function PasswordValidation(password){
    let regexP =/^(?=.*[0-9])(?!.* ).{6,}$/
    if(!regexP.test(password)){
        return false;
    }
    return true;
}