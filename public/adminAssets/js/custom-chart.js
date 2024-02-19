
let month;
let chart
document.addEventListener('DOMContentLoaded', () => {
    updateChart()
    let monthButton = document.getElementById('month-button');
    let yearButton = document.getElementById('year-button');
    monthButton.addEventListener('click', () => {
        month = true;
        updateChart()
    })
    yearButton.addEventListener('click', () => {
        month = false
        updateChart()
    })
});


/*Sale statistics Chart*/
async function updateChart() {
    if (chart) {
        chart.destroy();
    }
    let salesData;
    let productCount;
    let labels;
    const fetchData = await fetch('/admin/dashboardData', {
        method: 'GET'
    })
    const orders = await fetchData.json()
    if (month) {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        salesData = orders.monthlySales.map((elem) => parseFloat(elem.total) || 0);
        productCount = orders.monthlySales.map((elem) => elem.count);
    } else {
        labels = orders.yearlySales.map((elem) => elem.year)
        salesData = orders.yearlySales.map((elem) => parseFloat(elem.total || 0));
        productCount = orders.yearlySales.map((elem) => elem.count)
    }
    var ctx = document.getElementById('salesChart').getContext('2d');
    document.getElementById('Revenue').innerHTML = orders.totalIncome;
    document.getElementById('products').innerHTML = orders.productsCount;
    console.log(orders.totalIncome)
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales',
                tension: 0.3,
                fill: true,
                backgroundColor: 'lightgreen',
                borderColor: 'rgba(44, 120, 220)',
                data: salesData
            },
            {
                label: 'Products',
                tension: 0.3,
                fill: true,
                backgroundColor: 'rgb(4, 180, 130)',
                borderColor: 'rgb(4, 209, 130)',
                data: productCount
            }
            ]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                }
            }
        }
    });


    const paymentStatusCounts = {};

    for (const order of orders.orderList) {
        const paymentStatus = order.paymentStatus;
        if (paymentStatusCounts[paymentStatus]) {
            paymentStatusCounts[paymentStatus]++;
        } else {
            paymentStatusCounts[paymentStatus] = 1;
        }
    }
    console.log('*********', paymentStatusCounts)
    /*Sale statistics Chart*/
    if ($('#myChart2').length) {
        var ctx = document.getElementById("myChart2");
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(paymentStatusCounts),
                datasets: [
                    {
                        backgroundColor: ["#5897fb", "#7bcf86", "#ff9076"],
                        data: [paymentStatusCounts.WALLET, paymentStatusCounts.onlinePay, paymentStatusCounts.COD]
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                        },
                    }
                }
            }
        });
    } //end i

    const ctBestSale = document.getElementById('bestSelling').getContext('2d');
    const dataOfBestProducts = {
        labels: orders.bestSellingProducts.map(item => item.product),
        datasets: [
            {
                label: 'Dataset 1',
                data: orders.bestSellingProducts.map(item => item.sum),
                backgroundColor: Object.values(Utils.CHART_COLORS),
            }
        ]
    };

    new Chart(ctBestSale, {
        type: 'pie',
        data: dataOfBestProducts,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                }
            }
        },
    });


    const dataOfBestCategories = {
        labels: orders.bestSellingCategory.map(item => item._id),
        datasets: [
            {
            label: 'Dataset 1',
            data: orders.bestSellingCategory.map(item => item.category),
            backgroundColor:Object.values(Utils.CHART_COLORS)
            }
        ]
    }
    const ctBestCatSale = document.getElementById('bestSellingCategory').getContext('2d');
    new Chart(ctBestCatSale, {
        type: 'pie',
        data: dataOfBestCategories,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                }
            }
        },
    })
}

const Utils = {
    CHART_COLORS: {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    }
};