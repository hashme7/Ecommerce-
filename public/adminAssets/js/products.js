const listAndUnlist = async (productName, decider) => {
    try {
        if (decider) {
            let result = await fetch(`/admin/unlistProduct?productName=${productName}`, {
                method: "PATCH"
            })
            let resObj = await result.json();
            console.log(resObj)
            if (resObj.message) {
                $('#dynamicTable').load('/admin/Products #dynamicTable')
                document.getElementById('mssgBox').innerText = resObj.message;
            }
        } else {
            let result = await fetch(`/admin/listProduct?productName=${productName}`, {
                method: "PATCH"
            })
            let resObj = await result.json();
            console.log(resObj)
            if (resObj.message) {
                $('#dynamicTable').load('/admin/Products #dynamicTable')
                document.getElementById('mssgBox').innerText = resObj.message;
            }
        }
    } catch (error) {
        console.log("error on list/unlisting :", error)
    }
}