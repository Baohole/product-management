const changeStatus = document.querySelectorAll('[button-change-status]');
changeStatus.forEach((button) => {
    button.addEventListener('click', () => {
       const status = button.getAttribute('data-status');
       const id = button.getAttribute('data-id');
       const newStatus = (status === 'active') ? 'inactive' : 'active';
    
       const statusForm = document.querySelector('#change-status-form');
       const path = statusForm.getAttribute('data-path');
       statusForm.action = path + `${newStatus}/${id}?_method=PATCH`;
       statusForm.submit();
    });
});

const deleteItem = document.querySelectorAll('[button-delete]');
deleteItem.forEach((button) => {
    button.addEventListener('click', () => {
        const ifConfirm = confirm('Xóa sản phẩm này?')
        if(ifConfirm) { 
            const id = button.getAttribute('data-id');
            const deleteForm = document.querySelector('#delete-form');
            //console.log(path);
            deleteForm.action = deleteForm.getAttribute('data-path') + `${id}?_method=DELETE`;
            deleteForm.submit();
        }
        
    });
});


// Status Filter
const buttonAttribute = document.querySelectorAll('[button-status]');
if (buttonAttribute.length > 0) {
    let url = new URL(window.location.href);

    buttonAttribute.forEach((button) => {
        button.addEventListener('click', (e) => {
            //e.preventDefault();
            const buttonStatus = button.getAttribute('button-status');

            if (buttonStatus) {
                url.searchParams.set('status', buttonStatus);
            }
            else {
                url.searchParams.delete('status');
            }

            window.location.href = url.href;
        });
    });
}

// Search Product
const formSearch = document.querySelector('#form-search');
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener('submit', (e) => {
        //e.preventDefault();
        //console.log(e);
        const key = e.target.elements.search_query.value;
       // console.log(key);
        if (key) {
            url.searchParams.set('search_query', key);
            window.location.href = url.href;
            //console.log(url.href)
        }

    });
}

// Pagination
const pagination = document.querySelectorAll('[button-pagination]');
if (pagination.length > 0) {
    const url = new URL(window.location.href);
    pagination.forEach((button) => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            url.searchParams.set('page', page);
            window.location.href = url.href;
        });
    });
}

// Check-box
const productsTable = document.querySelector('[check-multi]');
if (productsTable) {
    const changeMultiForm = document.querySelector('[form-change-multi]');
    const checkAll = productsTable.querySelector('input[name=check-all]');
    const checkId = productsTable.querySelectorAll('input[name=id]');

    checkAll.addEventListener('click', () => {
        checkId.forEach((check) => {
            check.checked = checkAll.checked;
        });
    });

    checkId.forEach(check => {
        check.addEventListener('click', () => {
            const countChecked = productsTable.querySelectorAll('input[name=id]:checked').length;
            checkAll.checked = countChecked === checkId.length;
        });
    });

    changeMultiForm.addEventListener('submit', (e) => {
        //e.preventDefault();
        const idSaver = changeMultiForm.querySelector('input[name=ids]');
        const checkedIDs = productsTable.querySelectorAll('input[name=id]:checked');
        const type = changeMultiForm.querySelector('select[name=type]').value;
        //console.log(type);
        if (!type) {
            alert('Vui lòng chọn 1 hành động!!!');
            e.preventDefault();
        }
        else if (idSaver && checkedIDs.length > 0) {
            if (type == 'delete') {
                if (!confirm(`Xóa ${checkedIDs.length} sản phẩm đã chọn ?`)) {
                    e.preventDefault();
                    return;
                }
            }
            if (type == 'position') {
                idSaver.value = Array.from(checkedIDs).map((id) => {
                    const position = id.closest('tr').querySelector('input[name=position]').value;
                    const data = `${id.value}-${position}`;
                    return data;
                }).join(',');
            }
            else {
                idSaver.value = Array.from(checkedIDs).map((id) => id.value).join(',');
            }
        }
        else {
            alert("Vui lòng chọn 1 bản ghi");
            e.preventDefault();
        }
        //console.log(idSaver.value);
        //changeMultiForm.submit();
    });
}

// Preview Image
const uploadImg = document.querySelector('[img-upload]');
if(uploadImg){
    const uploadInput = uploadImg.querySelector('[img-upload-input]');
    const uploadPreview = uploadImg.querySelector('[img-upload-preview]');

    uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file){
            uploadPreview.src = URL.createObjectURL(file);
        }
    });
}


// Alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const time = parseInt(showAlert.getAttribute('data-time'));

    setTimeout(() => {
        showAlert.style.display = 'none';
    }, time);

    const close = showAlert.querySelector('[close-alert]');
    close.addEventListener('click', () => {
        showAlert.style.display = 'none';
    });
}


// Filter
const productFilter = document.querySelector('[sort]');
if (productFilter) {
    const url = new URL(window.location.href);
    const filter = productFilter.querySelector('[sort-select]');
    //console.log(filter);
    filter.addEventListener('change', (e) => {
        const value = e.target.value;
        const [filterKey, filterVal] = value.split('-');

        url.searchParams.set('sortKey', filterKey);
        url.searchParams.set('sortVal', filterVal);
        window.location.href = url.href;
    });

    const clear = productFilter.querySelector('[sort-clear]');
    clear.addEventListener('click', () => {
        url.searchParams.delete('sortKey');
        url.searchParams.delete('sortVal');
        window.location.href = url.href;
    });

    const key = url.searchParams.get('sortKey');
    if (key) {
        const val = url.searchParams.get('sortVal');
        filter.querySelector(`option[value=${key}-${val}]`).selected = true;
    }
}

// Paragraph Editor TinyMCE
tinymce.init({
    selector: 'textarea'
});
