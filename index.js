$(function(){
    $("#tabs > .tabs-container").dxTabs({
        dataSource: tabs,
        selectedIndex: 0,
    }).dxTabs("instance");
});