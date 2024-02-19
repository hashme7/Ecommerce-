

const addAddressForm = document.getElementById('addAddressForm');
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
        $('#houseError').css('display', 'block')
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
                title: "address deleted succesfully",
                icon: "success",
                iconColor: "f8bb86",
                confirmButttonColor: "f8bb86"
            })
            if (done.isConfirmed) {
                document.getElementById('closeButton').click();
                clearForm();
                $('#reloadDiv').load('/profile #reloadDiv')
            }

        }
    }
}
function clearForm() {
    var form = document.getElementById('addAddressForm');
    for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];
        if (element.type !== 'button' && element.type !== 'submit' && element.type !== 'reset') {
            element.value = '';
        }
    }
}

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
async function deleteAddress(address) {
    let result = await swal.fire({
        title: "Are you sure!",
        icon: "question",
        iconColor: 'brown',
        confirmButton: true,
        confirmButtonColor: '#f8bb86',
        showCancelButton: true,
        cancelButtonColor: 'brown',
        Animation: true
    });
    if (result.isConfirmed) {
        try {
            let response = await fetch(`/deleteAddress/${address}`, {
                method: 'PATCH'
            })
            let jsonResponse = await response.json();
            console.log(jsonResponse)
            if (jsonResponse.status == 'success') {
                let done = await swal.fire({
                    title: "address deleted succesfully",
                    icon: "success",
                    iconColor: "f8bb86",
                    confirmButttonColor: "f8bb86"
                })
                if (done.isConfirmed) {
                    $('#reloadDiv').load('/profile #reloadDiv', () => {
                        console.log("ahshdfi")
                    })
                }

            }
        } catch (error) {
            console.log("error on js delting", error)
        }

    }
}
document.addEventListener('DOMContentLoaded', function () {
    const addMoneyForm = document.getElementById('addMoneyForm');
    const addMoneyBtn = document.getElementById('addMoneyBtn');

    addMoneyBtn.addEventListener('click', async function () {
        const amount = document.getElementById('amount').value;
        try {
            event.preventDefault()
            const createOrderResponse = await fetch('/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })
            });

            if (createOrderResponse.ok) {
                const orderData = await createOrderResponse.json();

                const options = {
                    key: orderData.keyId,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'Coza Store',
                    description: 'Add money to wallet',
                    order_id: orderData.orderId,
                    handler: async function (response) {
                        const verifyPaymentResponse = await fetch(`/verifyWalletPayment/${orderData.amount}/Deposit`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(response)
                        });
                        if (verifyPaymentResponse.ok) {
                            const verifyPaymentData = await verifyPaymentResponse.json();
                            if (verifyPaymentData.status === 'success') {
                                await Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Money added succesfully ",
                                    text:"Payment successful. Wallet updated!",
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                location.reload();
                        } else {
                            let swalRes = await Swal.fire({
                                title: "payment verification",
                                text: 'Payment verification failed. Please try again.',
                                icon: "error"
                            });
                            if (swalRes.isConfirmed) {
                                window.href = '/profile'
                            }
                        }
                    } else {
                        let swalRes = await Swal.fire({
                            title: "The Internet?",
                            text: 'Error verifying payment. Please try again.',
                            icon: "error"
                        });
                        if(swalRes.isConfirmed){
        window.href = '/profile'
    }
}
                    }
                };

const rzp = new Razorpay(options);
rzp.open();
            } else {
    let swalRes = await Swal.fire({
        title: "The Internet?",
        text: 'Error creating order. Please try again.',
        icon: "error"
    });
    if (swalRes.isConfirmed) {
        window.href = '/profile'
    }
}
        } catch (error) {
    alert('An unexpected error occurred. Please try again.');
}
    });
});
