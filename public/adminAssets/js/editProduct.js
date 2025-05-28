const editForm = document.getElementById('editForm');
let croppers = [];
let filesValid;
$(document).ready(() => {
    $('.product-images').each((index, element) => {
        const imagePath = $(element).attr('src');
        applyCropper(element, imagePath)
    });
})

const applyCropper = (img, imagePath, index) => {
    const cropper = new Cropper(img, {
        viewMode: 1,
        guides: true,
        autoCropArea: 1
    });
    if (index) {
        croppers[index] = cropper
        return
    }
    croppers.push(cropper);
    $(img).data('cropper', cropper);
}


const changeImg = (input, index) => {
    console.log(index)
    const files = input.files;
    if (files.length > 0) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageElement = $(`#img${index}`);
            console.log(imageElement)
            const cropperInstance = imageElement.data('cropper');
            if (cropperInstance) {
                cropperInstance.destroy();
            }
            imageElement.attr('src', e.target.result);
            applyCropper(imageElement[0], e.target.result, index);
        };
        reader.readAsDataURL(files[0]);
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
function pnameValidate(name) {
    regex = /^(?= )/;
    console.log(regex.test(name));
    return regex.test(name);
}
editForm.addEventListener('submit', async (e) => {
    if(croppers.length<4){
        filesValid = false;
    }
    e.preventDefault();
    let add = true;
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
        e.preventDefault();
        $("#pnameError").css('display', 'block');
        add = false;
    }
    if (description == '' || pnameValidate(description)) {
        e.preventDefault();
        $("#descriptionError").css('display', 'block')
        add = false;
    }
    if (price < 0 || price == '') {
        e.preventDefault();
        $('#priceError').css('display', 'block');
        add = false;
    }

    if (quantity < 0 || quantity == '') {
        e.preventDefault();
        $('#quantityError').css('display', 'block')
        add = false;
    }
    if (offer > price || offer == '' || offer < 0) {
        e.preventDefault();
        $('#offerError').css('display', 'block')
        add = false;
    }
    if (!filesValid) {
        e.preventDefault();
        $('#msg-message').css('display', 'block');
        add = false;
    }
    const formData = new FormData(editForm);
    const croppedDataUrls = await Promise.all(croppers.map(cropper => cropper.getCroppedCanvas().toDataURL('image/png')));

    croppedDataUrls.forEach((croppedDataUrl, index) => {
        const blob = dataURItoBlob(croppedDataUrl);
        formData.append(`cropedImages`, blob, `cropped_image_${index}${Math.random()}.png`);
    });

    fetch("/admin/Products", {
      method: "PATCH",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          swal.fire({
            text: "product updated successfully",
            icon: "success",
          });
          setTimeout(() => {
            window.location.href = "/admin/Products";
          });
        } else {
          throw new Error(`Failed with status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
});
