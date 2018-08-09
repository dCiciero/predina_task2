var access_token = "pk.eyJ1Ijoib2djaWNlcm8iLCJhIjoiY2prazk2bDFlMTloeDN2cGs0OWdnZ3M3dCJ9.TjHJEC7jposIe4SV254wJA"
var map = L.map('map').setView([51.5655555556,-0.303027777778], 8);    

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

let coordinates = [];
let signal;
let currentHour=4;
var currentMinute=54;

setInterval(() => {
    loadCoord(100);
},60000)

function displayCoord(coordinates) {
    L.marker([coordinates[2],coordinates[3]], {icon: carIcon, title: coordinates[1]}).addTo(map); 
}

function loadCoord(numberOfCordinates) {
    currentMinute++;
    currentHour > 23 ? currentHour = 0 : currentHour;
    if (currentMinute > 59) {
        currentHour++;
        currentMinute = 0;
    }
    let time= (currentHour > 23 && currentMinute >59)    ? '00:00':
            (currentHour > 23 && currentMinute <=59)  ? `00:${currentMinute}`:
            (currentHour < 10 && currentMinute < 10)  ? `0${currentHour}:0${currentMinute}`:
            (currentHour > 10 && currentMinute < 10)  ? `${currentHour}:0${currentMinute}`:
            (currentHour < 10 && currentMinute > 10)  ? `0${currentHour}:${currentMinute}`:
                                                        `${currentHour}:${currentMinute}`;
    d3.csv("data/realtimelocation.csv", function (data) {
       while (numberOfCordinates > 0) {
        let entry = Object.values(data);
            
           if (entry[0] == `${time}`) {
            coordinates[0] = entry[0];
            coordinates[1] = entry[1];
            coordinates[2] = parseFloat(entry[2]);
            coordinates[3] = parseFloat(entry[3]);
            displayCoord(coordinates);
           }
           
            numberOfCordinates--;
            break;
       }
    });
}