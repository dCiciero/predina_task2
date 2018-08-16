var access_token = "pk.eyJ1Ijoib2djaWNlcm8iLCJhIjoiY2prazk2bDFlMTloeDN2cGs0OWdnZ3M3dCJ9.TjHJEC7jposIe4SV254wJA"
var map = L.map('map').setView([53.186288,-1.779785], 7);    

L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${access_token}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets',
    accessToken: `${access_token}`
}).addTo(map);
var carIcon = L.icon({
    iconUrl: 'img/cab.png',

    iconSize:     [35, 35], 
    iconAnchor:   [22, 94],
    popupAnchor:  [-3, -76] 
});

let time = "", vehicle = "Vehicle_847" ;
let coordinates = [], display = [];
let currentHour=14, currentMinute=52, currentDisplay = 0, maxDiaplay = 1;
let group = L.layerGroup();
let marker;


function displayCoord(coordinates) {
    marker = L.marker([coordinates[2],coordinates[3]], {icon: carIcon, title: coordinates[1]}); 
    group.addLayer(marker);
    
}

function loadCoord() {
    let cnt = 0;
    currentHour > 23 ? currentHour = 0 : currentHour;
    if (currentMinute > 59) {
        currentHour++;
        currentMinute = 0;
    }
    time = (currentHour > 23 && currentMinute >59)    ? '00:00':
            (currentHour > 23 && currentMinute <=59)  ? `00:${currentMinute}`:
            (currentHour < 10 && currentMinute < 10)  ? `0${currentHour}:0${currentMinute}`:
            (currentHour > 10 && currentMinute < 10)  ? `${currentHour}:0${currentMinute}`:
            (currentHour < 10 && currentMinute > 10)  ? `0${currentHour}:${currentMinute}`:
                                                        `${currentHour}:${currentMinute}`;
    
   
    d3.csv("data/realtimelocation.csv", function (data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                if (element == time) {
                    if (data.Vehicle == vehicle) {
                        while (currentDisplay < maxDiaplay) {
                            coordinates[0] = data.Time;
                            coordinates[1] = data.Vehicle;
                            coordinates[2] = parseFloat(data.Latitude);
                            coordinates[3] = parseFloat(data.Longitude);
                            displayCoord(coordinates);
                            currentDisplay++;
                            break;
                        }
                    }
                   
                } 
            }
        }
        
       
    });

    
    
    group.eachLayer(layer => {
        group.removeLayer(layer);
    });

    group.addTo(map);
    currentMinute++;
    currentDisplay = 0;
    coordinates = [];
    
}
loadCoord();
setInterval(() => {
    loadCoord();
    
},60000)