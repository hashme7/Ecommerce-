const updateCartCount = async (productindex, dec, e, quantity) => {
    console.log(quantity)
    if (dec) {
        e.preventDefault();
        let response = await fetch(`/addToCart/${productindex}`, {
            method: 'POST'
        })
        let result = await response.json();
        if (result.status == 'success') {
            $('#reloadCart').load('/cart #reloadCart')
        } else {
            let swalRes = await swal.fire({
                title: 'product quantity limit is reached',
            })
            if (swalRes.isConfirmed) {
                $('#reload').load('/cart #reloadCart')
            }
        }
    } else {
        e.preventDefault();
        if (quantity <= 1) {
            let swalRes = await swal.fire({
                text: "did you want to remove from cart"
            })
            if (swalRes.isConfirmed) {
                let response = await fetch(`/removeFrmCart/${productindex}`, {
                    method: 'PATCH'
                })
                let result = await response.json();
                if (result.status == 'success') {
                    $('#reloadCart').load('/cart #reloadCart')
                    $('#totalPriceRel').load('/cart #totalPriceRel')
                }
            }
        } else {
            let response = await fetch(`/removeFrmCart/${productindex}`, {
                method: 'PATCH'
            })
            let result = await response.json();
            if (result.status == 'success') {
                $('#reloadCart').load('/cart #reloadCart')
            }
        }

    }
}

const removeFrmCart = async (productindex, e) => {
    e.preventDefault();
    let swalRes = await swal.fire({
        text: "did want to remove from cart"
    })
    if (swalRes.isConfirmed) {
        let response = await fetch(`/deleteFrmCart/${productindex}`, {
            method: 'DELETE'
        })
        let result = await response.json();
        if (result.status == 'success') {
            console.log(result.status)
            $('#reloadCart').load('/cart #reloadCart')
            $('#totalPriceRel').load('/cart #totalPriceRel')
        }
    }
}

let radioButtons = document.querySelectorAll('#deliveryField input[type="radio"]')


radioButtons.forEach((buttons) => {
    buttons.addEventListener('change',async (e) => {
        const deliveryCharge = $(buttons).data('charge')
        try{
            let shipingMethodRes = await fetch(`/shipingMethod/${deliveryCharge}`,{
            method:'PATCH'
        })
           let isUpdated = await shipingMethodRes.json();
          if(isUpdated.success){
            console.log('updated')
          }
        }catch(error){
            console.log(error)
        }
    })
})