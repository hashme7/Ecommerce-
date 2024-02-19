const cancelOrder = async (orderId) => {
    try {
        e.preventDefault();
        const swalRes = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel;l it!'
        })
        if (swalRes.isConfirmed) {
            const response = await fetch(`/cancelOrder?order_id=${orderId}`, {
                method: 'PATCH',
            })
            const jsRes = await response.json()
            if (jsRes.status == 'success') {
                Swal.fire(
                    'Deleted!',
                    'Your Order has been cancelled.',
                    'success'
                )
                window.location.href = '/profile'
            } else {
                swal.fire({
                    title: jsRes.status,
                    text: jsRes.message,
                    icon: 'error'
                })
            }
        }

    } catch (error) {

    }
}

const downloadInvoice = async (orderId) => {
    try {
        event.preventDefault();
        let isDownloaded = await fetch(`/downloadInvo/${orderId}`, {
            method: 'GET'
        });
        if (isDownloaded) {
            let url = `/invoices/invoice${orderId}.pdf`
            swal.fire({
                title: 'are you want to download',
                html: `Click the link below to download the PDF.<br><a id="pdfLink" href="${url}" attributes-list download>Download PDF</a>`,
                showCloseButton: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                timer: 3000
            })
        }
    } catch (error) {
        console.log(error)
    }
}