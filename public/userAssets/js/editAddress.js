
const editForm = document.getElementById('editAdressForm');
editForm.addEventListener('submit', async (e) => {
    try {
        console.log(e)
        console.log("ahsdfhsdlf")
        e.preventDefault();
        const addressId = $('#addressId').val();
        console.log(addressId,"!@#$%^&*(")
        let name = $('#name').val();
        let colony = $('#colony').val();
        let mobile = $('#mobile').val();
        let state = $('#state').val();
        let city = $('#city').val();
        let pincode = $('#pincode').val();
        let house = $('#house').val();
        const data = {
            name: name,
            colony: colony,
            mobile: mobile,
            state: state,
            city: city,
            pincode: pincode,
            house: house
        }
        const queryString = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
        const response = await fetch(`/editAddress/${addressId}?${queryString}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body:JSON.stringify(data)
        });
        const recievedRes = await response.json();
        console.log(recievedRes)
        if (recievedRes.message == 'success') {
            let done = await swal.fire({
                title: "address updated succesfully",
                icon: "success",
                iconColor: "f8bb86",
                confirmButtonColor: "5b855b"
            })
            if (done.isConfirmed) {
                $('#reloadDiv').load('/profile #reloadDiv', () => {
                    console.log("ahshdfi")
                })
                window.location.href = '/profile';
            }
        } else {
            let done = await swal.fire({
                icon: 'error',
                title: "Oops...",
                text: "Something went wrong!",
                iconColor: "f8bb86",
                confirmButtonColor: "red"
            })
        }
    }catch(error){
        console.log('error on editaddress javascript',error)
    }
})

