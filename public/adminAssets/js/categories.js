const actionBtn = document.getElementById('BlockBtn')
let popUpForm = document.getElementById('formContainer');
let AddPopForm = document.getElementById('addCategoryForm')
let iddiscription = document.getElementById('discription')
let idCatName = document.getElementById('name')
blockAndUnblock = async (name, action, event) => {
    if (action == 'true') {
        console.log("unblocking")
        let response = await swal.fire({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: 'brown',
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No, cancel it!",
            closeOnConfirm: false,
            closeOnCancel: false
        })
        if (!response.isConfirmed) {
            e.preventDefault();
        } else {
            $.ajax({
                url:
                    `/admin/unBlockCategory?name=${name}`,
                type: "POST",
                success: function (data) {
                    console.log(data)
                    $('#messageDiv').text(data.messge)
                    reloadTable();
                },
                error: function (error) {
                    console.log(`Error ${error}`); 3
                }
            })
        }

    } else {
        let response = await swal.fire({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: 'brown',
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No, cancel it!",
            closeOnConfirm: false,
            closeOnCancel: false
        })
        if (!response.isConfirmed) {
            event.preventDefault();
        } else {
            $.ajax({
                url: `/admin/blockCategory?name=${name}`,
                type: "POST",
                success: function (data) {
                    $('#messageDiv').text(data.messge)
                    reloadTable();
                },
                error: function (error) {
                    console.log(`Error ${error}`);
                }
            });
        }
    }
}

// function changeColor(){
//     document.getElementById('BlockBtn').classList.add('BlockBtn')
// }
function reloadTable() {
    $('#dynamicTable').load('/admin/categories #dynamicTable', () => {
        console.log('Table reloaded successfully');
    });
}


formModal = async (catId) => {
    try {
        if (catId) {
            console.log("formModal")
            let response = await fetch(`http://localhost:2020/admin/findCatId?_id=${catId}`, {
                method: "GET"
            })
            if (response.ok) {
                let responseData = await response.json();
                console.log(responseData)
                catIdForEdit = responseData.message._id;
                iddiscription.value = responseData.message.discription;
                idCatName.value = responseData.message.name;
                popUpForm.classList.add('editform-control');
            } else {
                console.log("something went wrong", response)
            }
        } else {
            AddPopForm.classList.add('form-contrl')
        }
    } catch (error) {
        console.log("error modal:", error)
    }
}
closeFormModel = () => {
    popUpForm.classList.remove('editform-control');
}
closeAddModal = () => {
    AddPopForm.classList.remove('form-contrl')
}

//debouncing for delay fetching
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

const debouncedValid = debounce(async (event, decider) => {
    try {
        if (decider) {
            let AddCatName = document.getElementById('AddCatName').value;
            console.log(AddCatName);
            let response = await fetch(`/admin/findCategories?name=${AddCatName}`);
            console.log(response)
            if (response) {
                let resData = await response.json();
                console.log(resData.message);
                if (resData.message === null) {
                    $('#addCatBtn').attr('disabled', false).css('background', 'green')
                    $('#messageP').text("")
                } else {
                    console.log("dasjf;");
                    event.preventDefault();
                    $('#messageP').text("category name is already taken").css('color', 'brown')
                    $('#addCatBtn').attr('disabled', true).css('background', 'brown')
                }
            } else {
                console.log(error);
            }
        } else {
            let response = await fetch(`/admin/findCategories?name=${idCatName.value}`);
            if (response) {
                let resData = await response.json();
                if (!resData.message) {
                    $('#messageCatName').text("")
                    $('#formSubBtn').attr('disabled', false).css('background', 'green')
                } else if (resData.message._id === catIdForEdit) {
                    console.log("sameName")
                    $('#messageCatName').text("")
                    $('#formSubBtn').attr('disabled', false).css('background', 'green')
                } else {
                    $('#messageCatName').text("Category is already taken").css('color', 'brown')
                    $('#formSubBtn').attr('disabled', true).css('background', 'brown')
                }
            } else {
                console.log(error);
            }
        }
    } catch (error) {
        console.log("error on validating the categoryName", error);
    }
}, 500);

editFormsub = async () => {
    try {
        let CatNameIN = document.getElementById('name').value
        let discIN = document.getElementById('discription').value
        let valData = validation($('#name').val(), $('#discription').val(), $('#EerorMsCat'), $('#EerorMsDis'))
        if (!valData) {
            return false
        } else {
            let response = await fetch(`/admin/editCategory?findCatId=${catIdForEdit}&&discription=${discIN}&&name=${CatNameIN}`, {
                method: "PATCH"
            })
            let res = await response.json();
            console.log(res.message)
            if (res.message.modifiedCount > 0) {
                $('#messageDiv').text("category updated succesfully")
                closeFormModel();
                reloadTable()
            } else {
                $('#messageDiv').text(`didn't make any changes`)
                closeFormModel()
                reloadTable()
            }
        }

    } catch (error) {
        console.log("error on editCategory on js file :", error)
    }
}
addCategory = async (event) => {
    try {
        let valid = validation($('#AddCatName').val(), $('#Adddiscription').val(), $('#erorMsCat'), $('#erorMsDis'));
        console.log(valid)
        if (!valid) {
            event.preventDefault();
            return false;
        } else {
            let res = await fetch('/admin/addCategories', {
                method: "POST"
                ,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: document.getElementById('AddCatName').value,
                    discription: document.getElementById('Adddiscription').value
                })
            })
            event.preventDefault();
            let result = await res.json();
            if (result.ok) {
                if (result.message) {
                    closeAddModal();
                    let swalRes = await Swal.fire({
                        title: "Added",
                        text: "Category added succesfully!",
                        icon: "success"
                    });
                    if (swalRes.isConfirmed) {
                        reloadTable()
                        document.getElementById('messageBox').innerHTML = result.message;
                    }
                }
            }
        }
    } catch (error) {
        console.log("error on AddCategory :", error)
    }
}

const validation = (name, discription, errDivC, errDivD) => {
    console.log(name, discription)
    let regex = /^\s/;
    console.log(regex.test(name));
    console.log(":-", name)
    if (regex.test(name) || name === "") {
        errDivC.text('invalid Catergory name').css('color', 'brown')
        return false;
    } else {
        errDivC.text('')
    }
    if (regex.test(discription)) {
        errDivD.text('invalid discription').css('color', 'brown')
        return false;
    } else {
        errDivD.text('')
    }
    return true;
}
