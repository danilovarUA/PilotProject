const tabs = [
    {id: 0, text: "People", icon: "group"},
    {id: 1, text: "Planets", icon: "globe"},
];

let people = [];
let planets = [];
let peopleFields = ["name", "height", "mass", "hair_color", "skin_color", "eye_color", "birth_year", "gender",
    "homeworld", "films", "species", "vehicles", "starships", "created", "edited", "url"];
let planetsFields = ["name", "rotation_period", "orbital_period", "diameter", "climate", "gravity", "terrain",
    "surface_water", "population", "residents", "films", "created", "edited", "url"];
let peopleLoaded = false;
let planetsLoaded = false;
let elementsData = {};

function loadData(url, selector){
    console.log("adding data for " + selector + " from url " + url)
    $.get(url, function(data){
        if (selector === "People"){
            people = people.concat(data["results"])
                // load single data
                for (let human of data["results"]){
                    loadSingleData(human["homeworld"])
                    for (let film of human["films"]){
                        loadSingleData(film)
                    }

                }
                // the end
        }
        if (selector === "Planets"){
            planets = planets.concat(data["results"])
        }
        if (data.next !== undefined && data.next !== null)
        {
            loadData(data.next, selector)
        }
        else {
            if (selector === "People"){
                peopleLoaded = true
            }
            if (selector === "Planets"){
                planetsLoaded = true
            }
            if (peopleLoaded && planetsLoaded){
                waitForSingleDataToLoad()
            }
        }
    })
}

function loadSingleData(url) {
    if (!(url in elementsData)){
        console.log("adding data for " + url)
        elementsData[url] = 0;
        $.get(url, function (data) {
            elementsData[url] = data
        })
    }
}

function waitForSingleDataToLoad(){
    while (!allSingleDataLoaded())
    {
        console.log("Not all data loaded")
    }
    replaceLinksWithNames()
}

function allSingleDataLoaded(){
    for (let element in elementsData){
        if (elementsData[element] === 0){
            console.log(element)
            setTimeout(() => {  return false }, 200);
        }
    }
    return true
}

function replaceLinksWithNames(){
    for (let human of people){
        human["homeworld"] = elementsData[human["homeworld"]]["name"]

        for (let count = 0; count > human["films"].length; count++){
            console.log("replaced " + uman["films"][count] + " with " + elementsData[human["films"][count]]["name"])
            human["films"][count] = elementsData[human["films"][count]]["name"]
        }
    }
    loadTable()
}

$(loadData("https://swapi.dev/api/people/", "People"))
$(loadData("https://swapi.dev/api/planets/", "Planets"))
