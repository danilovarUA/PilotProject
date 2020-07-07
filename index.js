const SOURCE_TO_COLUMNS = {
    "People": ["name", "height", "mass", "hair_color", "skin_color", "eye_color", "birth_year", "gender", "homeworld"],
    "Planets": ["name", "rotation_period", "orbital_period", "diameter", "climate", "gravity", "terrain", "surface_water", "population"],
}
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
    console.log("loading table with " + value)
    let source;
    if (value === "People"){
        source = people
    }
    else if (value === "Planets")
    {
        source = planets
    }
    $("#gridContainer").dxDataGrid({
        dataSource: source,
        columns: SOURCE_TO_COLUMNS[source],
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

let modalOpened = false
function toggleModal(event){
    let row;
    console.log("toggling from " + modalOpened)
    if (event !== undefined){
        console.log(event.target.parentNode)
        row = parseInt(event.target.parentNode.getAttribute("aria-rowindex")) - 1
    }
    // TODO: Why isn't it working with JQuery?
    if (modalOpened) {
        document.getElementById("modalDiv").style.display = "none";
    }
    else {
        document.getElementById("modalDiv").style.display = "block";
        loadModal(row);
    }
    modalOpened = !modalOpened
}

function loadModal(row){
    let value = $('.dx-tab-selected span').text();
    let source;
    let fields;
    if (value === "People"){
        source = people
        fields = peopleFields
    }
    else if (value === "Planets")
    {
        source = planets
        fields = planetsFields
    }
    $("#form").dxForm({
        colCount: 2,
        formData: source[row],
        items: fields
    });
}