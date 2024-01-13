let filesValid;
let cropedImages = [];
let imageCount = 0;
function pnameValidate(name) {
    regex = /^(?= )/;
    console.log(regex.test(name));
    return regex.test(name);
}

addEventListener("DOMContentLoaded", (event) => {
    
});


const addForm = document.getElementById('addForm');
 function addFormSubmit(event) {
    let add = true;
    event.preventDefault();
    $('#msg-message').css('display', 'none')
    $("#pnameError").css('display', 'none');
    $("#descriptionError").css('display', 'none')
    $('#priceError').css('display', 'none')
    $('#quantityError').css('display', 'none')
    $('#offerError').css('display', 'none')
    let name = $('#name').val()
    let description = $('#discription').val()
    let price = Number($('#price').val())
    let quantity = Number($('#quantity').val())
    let offer = Number($('#offer').val());
    if (price == '') {
        console.log('error')
    }
    if (name == '' || pnameValidate(name)) {
        event.preventDefault();
        $("#pnameError").css('display', 'block');
        add = false;
    }
    if (description == '' || pnameValidate(description)) {
        event.preventDefault();
        $("#descriptionError").css('display', 'block')
        add = false;
    }
    if (price < 0 || price == '') {
        event.preventDefault();
        $('#priceError').css('display', 'block');
        add = false;
    }

    if (quantity < 0 || quantity == '') {
        event.preventDefault();
        $('#quantityError').css('display', 'block')
        add = false;
    }
    if (offer > price || offer == '' || offer < 0) {
        event.preventDefault();
        $('#offerError').css('display', 'block')
        add = false;
    }
    if (!filesValid) {
        event.preventDefault();
        $('#msg-message').css('display', 'block');
        add = false;
    }
    const formData = new FormData(addForm);

    cropedImages.forEach((cropper, index) => {
        const croppedDataUrl = cropper.getCroppedCanvas().toDataURL('image/png');
        const blob = dataURItoBlob(croppedDataUrl);

        formData.append('cropedImages', blob, `cropped_image_${index}${Math.random()}.png`);
    })
    if (add) {
        $.ajax({
            url: '/admin/addProducts',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                window.location.href = "/admin/Products";
            },
            error: function (error) {
                console.log("error",error)
                document.getElementById('response').innerText='producct name already there';
                document.getElementById('response').style.color ='red'
            }
        })
    }

}
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

