const tabs = [
    {id: 0, text: "People", icon: "group"},
    {id: 1, text: "Planets", icon: "globe"},
];

let people = [];
let planets = [];
let elementsData = {};

const VALUE_TO_COLUMNS = {
    "general": {
        "People": ["name", "height", "mass", "hair_color", "skin_color", "eye_color", "birth_year", "gender",
            "homeworld"],
        "Planets": ["name", "rotation_period", "orbital_period", "diameter", "climate", "gravity", "terrain",
            "surface_water", "population"],},
    "detailed": {
        "People": ["name", "height", "mass", "hair_color", "skin_color", "eye_color", "birth_year", "gender",
            "homeworld", "films", "species", "vehicles", "starships", "created", "edited", "url"],
        "Planets": ["name", "rotation_period", "orbital_period", "diameter", "climate", "gravity", "terrain",
            "surface_water", "population", "residents", "films", "created", "edited", "url"]
    }
}

// data at tese indexes should be additionally loaded since it onyl contains links
const DATA_LOAD_INDEX = {
    "People": {"single": [
        "homeworld"
        ], "each": [
            "films",
            "vehicles",
            "species",
            "starships"

        ]},
    "Planets": {"single": [

        ], "each": [
            "films",
            "residents"

        ]}}

let peopleLoaded = false;
let planetsLoaded = false;

function loadData(url, selector){
    $.get(url, function(data){
        if (selector === "People"){
            people = people.concat(data["results"])

                // Loads data for elements that only have links to later replace them with names
                for (let human of data["results"]){
                    for (let index of DATA_LOAD_INDEX[selector]["single"]){
                        loadSingleData(human[index])
                    }
                    for (let index of DATA_LOAD_INDEX[selector]["each"]){
                        for(let element of human[index]){
                            loadSingleData(element)
                        }
                    }
                }
        }
        if (selector === "Planets"){
            planets = planets.concat(data["results"])
            // Loads data for elements that only have links to later replace them with names
                for (let planet of data["results"]){
                    for (let index of DATA_LOAD_INDEX[selector]["each"]){
                        for(let element of planet[index]){
                            loadSingleData(element)
                        }
                    }
                }
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
        elementsData[url] = 0;
        $.get(url, function (data) {
            elementsData[url] = data
        })
    }
}

function waitForSingleDataToLoad(){
    while (!allSingleDataLoaded())
    {
        console.log("Not all data loaded yet, waiting")
    }
    replaceLinksWithNames()
}

function allSingleDataLoaded(){
    for (let element in elementsData){
        if (elementsData[element] === 0){
            setTimeout(() => {  return false }, 200);
        }
    }
    return true
}

function replaceLinksWithNames(){
    for (let human of people){
        for (let index of DATA_LOAD_INDEX["People"]["single"]){
            human[index] = elementsData[human[index]]["name"]
        }
        for (let index of DATA_LOAD_INDEX["People"]["each"]){
            for (let count = 0; count < human[index].length; count++){
                if (index === "films"){  // Unfortunately film has title, not a name, which fucks up the beauty of it all
                    human[index][count] = elementsData[human[index][count]]["title"]
                }
                else {
                    human[index][count] = elementsData[human[index][count]]["name"]
                }
            }
        }
    }

    for (let planet of planets){
        for (let index of DATA_LOAD_INDEX["Planets"]["each"]){
            for (let count = 0; count < planet[index].length; count++){
                if (index === "films"){  // Unfortunately film has title, not a name, which fucks up the beauty of it all
                    planet[index][count] = elementsData[planet[index][count]]["title"]
                }
                else {
                    planet[index][count] = elementsData[planet[index][count]]["name"]
                }
            }
        }
    }

    loadTable()
}

$(loadData("https://swapi.dev/api/people/", "People"))
$(loadData("https://swapi.dev/api/planets/", "Planets"))
