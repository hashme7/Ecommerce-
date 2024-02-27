document.addEventListener('DOMContentLoaded', function () {
    let deliveryDiv = document.getElementById('deliveryField');
    let couponDiv = document.getElementById('couponField');
    let couponInputBtn = document.getElementsByName('couponId');
    let deliveryInputBtn = document.getElementsByName('shippingMethods');
    let totalAmount = document.getElementById('total1');
    updateTotal();

    deliveryInputBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            updateTotal();
        });
    });

    couponInputBtn.forEach((btn) => {
        btn.addEventListener('change', () => {
            updateTotal();
        });
    });

    function updateTotal() {
        let deliveryInput = deliveryDiv.querySelector('input:checked');
        let couponInput = couponDiv.querySelector('input:checked');
        let couponUsed = document.getElementById('couponAmount');
        console.log("checked:",deliveryInput)
        let deliveryCharge = deliveryInput ? parseFloat(deliveryInput.getAttribute('data-charge')) : 0;
        let couponAmount = couponInput ? parseFloat(couponInput.getAttribute('data-val')) : 0;
        
        let subTotal = parseFloat(totalAmount.getAttribute('data-total'));
        let newTotal = subTotal + deliveryCharge - couponAmount;
        couponUsed.innerHTML = couponAmount;
        totalAmount.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i> ${newTotal.toFixed(2)}`;
    }
});



form.addEventListener('submit', async (event) => {
    event.preventDefault();
    var formData = $('#form').serialize();
    console.log(formData)
    const params = new URLSearchParams(formData);
    const jsonData = Object.fromEntries([...params.entries()]);
    console.log(jsonData)
    let response = await fetch('/checkout', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
            'Content-type': 'application/json'
        },
    })
    let fetchData = await response.json();
    console.log(fetchData)
    if (fetchData.status == 'success' && fetchData.paymentStatus == 'COD') {
        const swalRes = await swal.fire({
            icon: 'success',
            text: fetchData.message
        })
        if (swalRes.isConfirmed) {
            window.location.href = '/success'
        }
    } else if (fetchData.status == 'success' && fetchData.paymentStatus == 'ONLINE-PAYMENT') {
        razorpayPayment(fetchData.newOrder)
    } else if (fetchData.status == 'failed' && fetchData.message == 'OUTOFSTOCK') {
        Swal.fire({
            icon: "error",
            iconColor: "gray",
            title: "Oops...",
            text: "some items in youre cart are out of stock",
            showConfirmButton: false,
            footer: '<a href="/cart">You have to decrease your product quantity?</a>'
        });
    } else if (fetchData.status == 'failed' && fetchData.message == 'INSUFFICIENTMONEY') {
        Swal.fire({
            icon: "error",
            iconColor: "gray",
            title: "Oops...",
            text: "insufficient money in wallet",
            showConfirmButton: false,
            footer: '<a href="/profile">You can add money in your home?</a>'
        });
    } else if (fetchData.status == 'success' && fetchData.paymentStatus == "WALLET-PAYMENT") {
        const swalRes = await swal.fire({
            icon: 'success',
            text: fetchData.message
        })
        if (swalRes.isConfirmed) {
            window.location.href = '/success'
        }
    } else if (fetchData.status == 'failed' && fetchData.message == '!COD') {
        await swal.fire({
            icon: "error",
            iconColor: "gray",
            title: "Oops...",
            text: "money above 1000 not allowed for cash on delivery ",
        })
    }
})
function razorpayPayment(order) {
    try {
        var options = {
            "key": "rzp_test_KV4zi7S7ymxUYy", // Enter the Key ID generated from the Dashboard
            "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "COZA STORE",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response) {
                console.log("response:---", response)
                verifyPayment(response, order);
            },
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9544880584",
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
        rzp1.on('error', () => {
            console.log("error on razorpay")
        })
    } catch (error) {
        console.log(error)
    }
}
const verifyPayment = async (payment, order) => {
    try {
        $.ajax({
            url: '/verifyPayment',
            data: {
                payment,
                order
            },
            method: 'POST',
            success: (response) => {
                console.log("payment successfull")
                if (response.paymentStatus == 'ONLINE-PAYMENT-SUCCESS') {
                    location.href = '/success'
                }
            }
        })

    } catch (error) {
        console.log(error)
    }
}
document.querySelectorAll('#coupon').forEach(radio => {
    radio.checked = false;
});

document.addEventListener('DOMContentLoaded', function () {
    var couponButtons = document.querySelectorAll('.btn-coupon');
    couponButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            $('#couponCollapse').collapse('toggle');
        });
    });
});

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
$(document).ready(() => {
    $('#addAddressButton').click((e) => {
        const isExpanded = $('#addAddressButton').attr("aria-expanded") === "true";
        if (isExpanded) {
            $('#address-select').css('display', 'block');
        } else {
            $('#address-select').css('display', 'none');
            const addressRadios = document.querySelectorAll('input[name="address"]');
            addressRadios.forEach(radio => {
                radio.checked = false;
            });
        }
    });
});

const addAddressForm = document.getElementById('addAddressForm');
addAddressForm.addEventListener('submit', (e) => {
    address(e);
})
async function addAddress(e) {
    let isValid = true
    $('#nameError').css('display', 'none')
    $('#mobileError').css('display', 'none')
    $('#colonyError').css('display', 'none')
    $('#stateError').css('display', 'none');
    $('#cityError').css('display', 'none');
    $('#pincodeError').css('display', 'none');
    $('#houseError').css('display', 'none');
    e.preventDefault();
    const name = $('#name').val();
    const mobile = $('#mobile').val();
    const colony = $('#colony').val();
    const state = $('#state').val();
    const city = $('#city').val();
    const pincode = $('#pincode').val();
    const house = $('#house').val()
    if (name.trim() == '') {
        $('#nameError').css('display', 'block')
        isValid = false;
    }
    if (mobile.trim() == '' || mobile.length !== 10) {
        $('#mobileError').css('display', 'block')
        isValid = false;
    }
    if (colony.trim() == '') {
        $('#colonyError').css('display', 'block')
    }
    if (state.trim() == "") {
        $('#stateError').css('display', 'block');
        isValid = false;
    }
    if (city.trim() == '') {
        $('#cityError').css('display', 'block');
        isValid = false;
    }
    if (pincode.trim() == "") {
        $('#pincodeError').css('display', 'block');
        isValid = false;
    }
    if (house.trim() == '') {
        $('#houseError').css('display', 'block');
    }
    if (isValid) {
        const data = {
            name: name,
            mobile: mobile,
            colony: colony,
            state: state,
            city: city,
            pincode: pincode,
            house: house,
        }
        const response = await fetch('/addAddress', {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const res = await response.json();
        console.log(res)
        if (res.status == "success") {
            let done = await swal.fire({
                title: "address added succesfully",
                icon: "success",
                iconColor: "f8bb86",
                confirmButttonColor: "f8bb86"
            })
            if (done.isConfirmed) {
                $('#addAddressButton').attr("aria-expanded", false)
                window.location.href = '/checkout';
            }
        }
    }
}
