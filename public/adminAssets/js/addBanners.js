function readUrl(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            $('#imgdisplay').attr('src', e.target.result).width(150).height(200)
        }
        reader.readAsDataURL(input.files[0]);
    }
}


$(document).ready(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    $('#startDate').attr('min', currentDate);
    $('#endDate').attr('min', currentDate)
});
$('#startDate').change(() => {
    $('#endDate').attr('min', $('#startDate').val())
})

const addBannerForm = document.getElementById('addBanner');
addBannerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    $('#imgError, #endDateError, #startDateError, #targetIdError, #descriptionError1, #nameError').css('display', 'none');

    const name = $('#name').val();
    const description = $('#description').val();
    const targetId = $('#targetId').val();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    const img = document.getElementById('imageupload');

    if (!validateName(name)) {
        $('#nameError').css('display', 'block');
        valid = false;
    }
    if (!validateDescription(description)) {
        $('#descriptionError1').css('display', 'block');
        valid = false;
    }
    if (!validateName(targetId)) {
        $('#targetIdError').css('display', 'block');
        valid = false;
    }
    if (!validateDate(startDate)) {
        $('#startDateError').css('display', 'block');
        valid = false;
    }
    if (!validateDate(endDate)) {
        $('#endDateError').css('display', 'block');
        valid = false;
    }
    if (img.files.length === 0) {
        $('#imgError').css('display', 'block');
        valid = false;
    }

    if (valid) {
        const data = new FormData(addBannerForm);
        try {
            const response = await fetch('/admin/addBanners', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
function validateName(name) {
    var regex = /^[a-zA-Z ]{2,30}$/;
    return regex.test(name);
}
function validateDescription(description) {
    var regex = /^[a-zA-Z ]{2,60}$/;
    return regex.test(description)
}
function validateDate(date) {
    return !isNaN(new Date(date));
}
function parseQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};

    for (const [key, value] of params) {
        result[key] = value;
    }

    return result;
}