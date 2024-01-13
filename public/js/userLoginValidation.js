
function validateForm() {
    // Prevent the default form submission
    event.preventDefault();
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';
    const email = document.forms["form"]["email"].value;
    const password = document.forms["form"]["password"].value;
    let isValid = true;
    
   console.log(email)
  
    if (!emailValidation(email) ) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }
    if (!PasswordValidation(password)) {
        console.log("password invalid")
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }else{
        document.getElementById('passwordError').style.display = 'none';
    }
    if(password.length<6){
        console.log("6 ")
        document.getElementById('passwordError').style.display = 'block';
    }
    if(!isValid)return;
    document.getElementById('form').submit();
}

function emailValidation(email){
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!regex.test(email)){
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


const modal = (event)=>{
    event.preventDefault()
    document.getElementById('form-container').classList.add('form-contrl')
}
const closeModal = (event)=>{
    document.getElementById('form-contain')
}