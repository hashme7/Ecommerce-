const form = document.getElementById('form');
form.addEventListener('submit', async (e) => {
    let isValid = true;
    e.preventDefault();
    $('#newPasswordError').css('display', 'none');
    $('#crntPswdError').css('display', 'none');
    $('#nameLengthError').css('display', 'none');
    const name = $('#name').val();
    const crntpswd = $('#currentpswd').val()
    const newPswd = $('#newpswd').val()
    const mobile = $('#mobile').val()
    if (name.trim() == '') {
        console.log("name error ")
        $('#nameLengthError').css('display', 'block');
        isValid = false;
    }
    if (crntpswd !== '') {
        if (!PasswordValidation(crntpswd)) {
            $('#crntPswdError').css('display', 'block');
            isValid = false;
        }
        if (!PasswordValidation(newPswd)) {
            $('#newPasswordError').css('display', 'block')
            isValid = false;
        }
    }
    if (mobile == "") {
        $('#mobileLngthErrror').css('display', 'block');
        isValid = false;
    }
    if (isValid) {
        const data = {
            name: name,
            mobile: mobile,
            currentPassword: crntpswd,
            newPassword: newPswd
        }
        console.log(JSON.stringify(data));
        const response = await fetch('/editProfile', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json();
        if (result.status == 'Entered password is incorrect') {
            $('#crntPswdError').text(result.status).css('display', 'block');
        } else if (result.status == "your profile is updated") {
            $('#result').text(result.status).css('color', 'green')
        }
    }
})

function PasswordValidation(password) {
    let regexP = /^(?=.*[0-9])(?!.* ).{6,}$/
    console.log(password)
    console.log(regexP.test(password))
    if (!regexP.test(password)) {
        return false;
    }
    console.log("true")
    return true;
}