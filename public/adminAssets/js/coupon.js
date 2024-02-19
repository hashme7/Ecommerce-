$('#couponAdd').on('submit', (e) => {
    $('#codeError').css('display', 'none')
    $('#discountError').css('display', 'none')
    $('#descriptionError').css('display', 'none');
    $('#dateError').css('display', 'none')
    $('#eligiblePriceError').css('display','none')
    $('#quantityError').css('display', 'none')
    const couponCode = $('#coupon_code').val();
    const regexCode = /^\d{6}$/;
    const discount = $('#discount').val();
    const description = $('#description').val();
    const price = $('#price').val();
    const eligiblePrice = $('#eligiblePrice').val();
    const quantity = $('#quantity').val()
    const date = $('#date').val()
    if (!regexCode.test(couponCode)) {
        $('#codeError').css('display', 'block')
        e.preventDefault();
    }
    if (discount < 1 || discount > 99) {
        $('#discountError').css('display', 'block')
        e.preventDefault();
    }
    if (description == "") {
        $('#descriptionError').css('display', 'block');
        e.preventDefault();
    }
    if (eligiblePrice == "" || eligiblePrice < 1) {
        $('#eligiblePriceError').css('display', 'block');
        e.preventDefault();
    }
    if (price == "" || price < 1) {
        $('#priceError').css('display', 'block');
        e.preventDefault();
    }
    if (quantity == "" || quantity < 1) {
        $('#quantityError').css('display', 'block')
        e.preventDefault();
    }
    if (date == "") {
        $('#dateError').css('display', 'block')
        e.preventDefault();
    }

})
$(document).ready(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    $('#date').attr('min', currentDate);
    $('#edit-date').attr('min', currentDate)
    const description = $('#edit-description').data('val');
    $('#edit-description').val(description);
    const date = $('#edit-date').data('val');
    const originalDate = new Date(date);
    const formattedDate =  `${originalDate.getFullYear()}-${(originalDate.getMonth() + 1).toString().padStart(2, '0')}-${originalDate.getDate().toString().padStart(2, '0')}`
    $('#edit-date').val(formattedDate)
});


$('#couponEditButton').on('click', async (e) => {
    e.preventDefault()
    $('#edit-codeError').css('display','none')
    $('#edit-discountError').css('display', 'none')
    $('#edit-descriptionError').css('display', 'none')
    $('#edit-priceError').css('display','none')
    $('#edit-quantityError').css('display','none')
    $('#edit-existError').css('display', 'none')
    $('#edit-eligiblePriceError').css('display','none')
    const currentCode = $('#edit-coupon').data('val');
    const updateCode = $('#edit-coupon').val();
    const discount = $('#edit-discount').val();
    const description = $('#edit-description').val()
    const price = $('#edit-price').val();
    const eligiblePrice = $('#edit-eligiblePrice').val();
    const quantity = $('#edit-quantity').val()
    const regexCode = /^\d{6}$/;
    let valid = true;
    if (!regexCode.test(updateCode)) {
        $('#edit-codeError').css('display', 'block')
        valid = false;
    }
    if (discount > 100 || discount < 1) {
        $('#edit-discountError').css('display', 'block')
        valid = false;
    }
    if (description == "") {
        $('#edit-descriptionError').css('display', 'block')
        valid = false;
    }
    if(eligiblePrice<1){
        $('#edit-eligiblePriceError').css('display','block')
        valid = false;
    }
    if(price<1){
        $('#edit-priceError').css('display','block')
        valid = false;
    }
    if(quantity<1){
        $('#edit-quantityError').css('display','block')
        valid = false;
    }
    if (valid) {
        let response = await fetch(`/admin/checkCode/${currentCode}/${updateCode}`, {
            method: 'GET'
        })
        let isEligible =await response.json();
        console.log(isEligible)
        if (isEligible.status == true ) {
            e.preventDefault();
            console.log("error oonadj;fkjsdkl")
            $('#edit-existError').css('display', 'block')
        }else{
            $('#couponEdit').submit()
        }
    }
})