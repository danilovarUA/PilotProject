const PAGE_SIZES = [10, 50, 100]
const DEFAULT_PAGE_SIZE = PAGE_SIZES[0]

// Tabs
$(function(){
    $("#tabs > .tabs-container").dxTabs({
        dataSource: tabs,
        selectedIndex: 0,
    }).dxTabs("instance");
});

// Table
function loadTable() {
    let value = $('.dx-tab-selected span').text();
    let source = people
    if (value === "Planets"){source = planets}
    $("#gridContainer").dxDataGrid({
        rowAlternationEnabled: true,
        dataSource: source,
        columns: VALUE_TO_COLUMNS["general"][value],
        showBorders: true,
        paging: {
            pageSize: DEFAULT_PAGE_SIZE
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: PAGE_SIZES,
            showInfo: true
        },
    });
}
let justOpened = false  // used in case open is clicked and closing is trying to close it right after
let modalOpened = false
function toggleModal(event){
    let row;
    if (event !== undefined){
        row = parseInt(event.target.parentNode.getAttribute("aria-rowindex")) - 1
        if (isNaN(row)){  // that is either name of column or selector for number of rows per page
            return
    }
    }
    // TODO: Why isn't it working with JQuery?
    if (modalOpened) {
        console.log("Closing")
        document.getElementById("modalDiv").style.display = "none";
    }
    else {
        console.log("Opening")
        document.getElementById("modalDiv").style.display = "block";
        justOpened = true
        loadModal(row);
    }
    modalOpened = !modalOpened
}

function loadModal(row){
    let value = $('.dx-tab-selected span').text();
    let source = people
    if (value === "Planets"){source = planets}
    $("#form").dxForm({
        colCount: 2,
        formData: source[row],
        items: VALUE_TO_COLUMNS["detailed"][value]
    });
}

//or esc pressed
function tryCloseModal(e){
    if (justOpened){
        justOpened = false
        return
    }
    if (  modalOpened && e.target === (document.getElementById("modalDiv"))  ){
        toggleModal()
    }
}