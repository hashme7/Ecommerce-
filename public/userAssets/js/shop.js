$(document).ready(function () {
    $('.filter-tope-group button').on('click', function (e) {
        e.preventDefault()
        var categoryFilter = $(this).data('filter');
        let newUrl = updateUrl(categoryFilter, "category")
        console.log(newUrl)
        filterData(newUrl);
    });
    $('#page-select li[data-filter]').click(function (e) {
        e.preventDefault();
        $('#page-select li').removeClass('selected-page')
        $(this).addClass('selected-page')
        var pageFilter = $(this).data('filter');
        let newUrl = updateUrl(pageFilter, "page");
        filterData(newUrl);
    });
    // Handle "less than" button
    $('#page-lt button').click(function (e) {
        e.preventDefault();
        let currentPage = parseInt($('#page-select li.selected-page').data('filter'));
        $('#page-select li').removeClass('selected-page')
        if (currentPage >= 1) {
            let newPage = currentPage - 1;
            let newUrl = updateUrl(newPage, "page");
            filterData(newUrl);
        }
    });

    // Handle "greater than" button
    $('#page-gt button').click(function (e) {
        e.preventDefault();
        let currentPage = parseInt($('#page-select li.selected-page').data('filter'));
        // You may need to adjust the condition based on the total number of pages available
        if (currentPage < 3) {
            let newPage = currentPage + 1;
            let newUrl = updateUrl(newPage, "page");
            filterData(newUrl);
        }
    });
    $('#searchBtn').on('click', (e) => {
        e.preventDefault();
        let searchData = $('#search').val();
        let newUrl = updateUrl(searchData, 'search')
        filterData(newUrl)
    })
    $('#sortByLowToHigh').on('click', function (e) {
        e.preventDefault();
        let sortData = $(this).data('sort');
        console.log(sortData)
        let newUrl = updateUrl(sortData, "price")
        filterData(newUrl)
    })
    $('#sortByHighToLow').on('click', function (e) {
        e.preventDefault();
        let sortData = $(this).data('sort');
        console.log(sortData)
        let newUrl = updateUrl(sortData, "price")
        filterData(newUrl)
    })
});
const updateUrl = (item, type) => {
    let currentUrl = window.location.href;
    let basePath = currentUrl;
    if (currentUrl.includes(`${type}=`)) {
        const regex = new RegExp(`${type}=[^&]*`);
        return currentUrl.replace(regex, `${type}=${item}`);
    } else {
        const separator = currentUrl.includes('?') ? '&' : '?';
        return `${basePath}${separator}${type}=${item}`;
    }
};

function filterData(url) {
    $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({
            fetching: true
        })
        ,
        success: function (data) {
            console.log(data)
            updateDataContainer(data);
            history.pushState({ data }, null, `${url}`)
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}
const updateDataContainer = (data) => {
    const shopContainer = $('.productContainer');
    shopContainer.empty();

    const productContainer = $('<div class="row isotope-grid poductsContainer" id="data-container">');  // Corrected typo here
    if (data.length > 0) {
        productContainer.append(data.map(product => `
        <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${product.category}" data-category="${product.category}">
            <div class="block2">
                <div class="block2-pic hov-img0">
                    <img src="multerimages/${product.images[0]}" alt="IMG-PRODUCT">
                    <a href="/productlist?productId=${product._id}" class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04">
                        Quick View
                    </a>
                </div>
                <div class="block2-txt flex-w flex-t p-t-14">
                    <div class="block2-txt-child1 flex-col-l ">
                        <a href="product-detail.html" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                            ${product.productName}
                        </a>
                        <span class="stext-105 cl3">
                            ${product.price}
                        </span>
                    </div>
                    <div class="block2-txt-child2 flex-r p-t-3">
                        <a href="#" class="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                            <img class="icon-heart1 dis-block trans-04" src="images/icons/icon-heart-01.png" alt="ICON">
                            <img class="icon-heart2 dis-block trans-04 ab-t-l" src="images/icons/icon-heart-02.png" alt="ICON">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join(''));
        shopContainer.append(productContainer);
    } else {
        productContainer.append(`<h4>No products found<h4>`)
        shopContainer.append(productContainer)
    }

}
