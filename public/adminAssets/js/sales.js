const showLoading = () => {
    console.log("*****************")
    document.getElementById('loading').style.display = 'block';
}
const closeLoading = () => {
    console.log("&&&&&&&&&&&&&&&&&&")
    document.getElementById('loading').style.display = 'none';
}
const reportDownload = async (elem) => {
    try {
        showLoading()
        event.preventDefault();
        let type = elem.getAttribute('data-type')
        let filter = document.getElementById('filter')
        let customDate = document.getElementById('dateSelect').value;
        let url = `/admin/salesreport/${type}?filter=${filter.value}`;
        console.log(customDate)
        if (filter.value == 'Custom Date') {
            url = `/admin/salesreport/${type}?filter=${filter.value}&&customDate=${customDate}`
        }
        let isDownloaded = await fetch(url, {
            method: "GET",
        })

        if (type == 'PDF') {
            let fetchRes = await isDownloaded.json();
            console.log("fetchREsult",fetchRes)
            if (fetchRes.failed) {
                swal.fire({
                    title:'!OOops',
                    text:'no data is there',
                    icon:'info'
                })
            } else {
                swal.fire({
                    title: 'are you want to download',
                    html: `Click the link below to download the PDF.<br><a id="pdfLink" href="${fetchRes.url}" attributes-list download>Download PDF</a>`,
                    showCloseButton: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                })
            }

        } else {
            console.log("dkf;ajskldjfk")
            const blob = await isDownloaded.blob();
            const blobUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = `salesReport.xlsx`;
            downloadLink.click();
            URL.revokeObjectURL(blobUrl);
        }
        closeLoading()
    } catch (error) {
        console.log("error on reportDownload", error)
    }
}
$("#filter").change(async function () {
    if ($(this).val() == 'Custom Date') {
        document.getElementById('dateSelectDiv').style.display = 'block';
    } else {
        document.getElementById('dateSelectDiv').style.display = 'none';
        let filter = document.getElementById('filter');
        console.log(filter.value)
        let data = {
            fetch: true
        }
        try {
            let fetchData = await fetch(`/admin/sales?filter=${filter.value}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            let details = await fetchData.json();

            const orderList = details.orderList;
            const tbody = document.getElementById('updatingTBody');

            tbody.innerHTML = '';

            orderList.forEach((order, i) => {
                order.products.forEach((product, k) => {
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td>${i + 1}</td>
                        <td><b>#4566${i}${k}</b></td>
                        <td>${product.product.productName}</td>
                        <td>${product.quantity}</td>
                        <td>${product.product.price}</td>
                        <td>${product.product.price * product.quantity}</td>
                        <td>${new Date(order.orderedDate).toLocaleDateString('en-us', {
                        weekday: "long", year: "numeric", month: "short", day: "numeric"
                    })}</td>
                        <td>${order.user.email}</td>
                        <td>${order.paymentStatus}</td>
                    `;
                });
            });
        } catch (error) {
            console.log(error)
        }
    }
});

$('#dateSelect').change(async () => {
    try {
        let customDate = document.getElementById('dateSelect').value;
        let filter = document.getElementById('filter')
        console.log("date changed")
        let data = {
            fetch: true
        }
        url = `/admin/sales?filter=${filter.value}&&customDate=${customDate}`

        let fetchData = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let details = await fetchData.json();

        const orderList = details.orderList;

        const tbody = document.getElementById('updatingTBody');

        tbody.innerHTML = '';
        if (!orderList.length) {
            const row = tbody.insertRow();
            row.innerHTML = `<td>No data found<td>`
        } else {
            orderList.forEach((order, i) => {
                order.products.forEach((product, k) => {
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td>${i + 1}</td>
                        <td><b>#4566${i}${k}</b></td>
                        <td>${product.product.productName}</td>
                        <td>${product.quantity}</td>
                        <td>${product.product.price}</td>
                        <td>${product.product.price * product.quantity}</td>
                        <td>${new Date(order.orderedDate).toLocaleDateString('en-us', {
                        weekday: "long", year: "numeric", month: "short", day: "numeric"
                    })}</td>
                        <td>${order.user.email}</td>
                        <td>${order.paymentStatus}</td>
                    `;
                });
            });
        }


    } catch (error) {
        console.log(error)
    }
})