$(function(){
    var tabsInstance = $("#tabs > .tabs-container").dxTabs({
        dataSource: tabs,
        selectedIndex: 0,
        onItemClick: function(e) {
            selectBox.option("value", e.itemData.id);
        }
    }).dxTabs("instance");
});