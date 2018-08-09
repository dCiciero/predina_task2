var access_token = "pk.eyJ1Ijoib2djaWNlcm8iLCJhIjoiY2prazk2bDFlMTloeDN2cGs0OWdnZ3M3dCJ9.TjHJEC7jposIe4SV254wJA"
var map = L.map('map').setView([51.5655555556,-0.303027777778], 8);    

L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${access_token}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets',
    accessToken: `${access_token}`
}).addTo(map);
var carIcon = L.icon({
    iconUrl: 'img/cab.png',

    iconSize:     [35, 35], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
// L.marker([51.5655555556,-0.303027777778], {alt: 'Mising icon', zIndexOffset: 1000}).addTo(map);
// L.marker([51.516658,-0.205789]).addTo(map);
// L.marker([54.989596999999996,-3.272584]).addTo(map);
// L.marker([55.310151,-3.4483919999999997]).addTo(map);

let coordinates = [];
let signal;
let currentHour=4;
var currentMinute=59;

// loadCoord(100);
setInterval(() => {
    //currentMinute++;
    //currentHour++;
    loadCoord(1000);
     
    // console.log(currentMinute);
    // console.log(coordinates);
    // console.log(formatTime(currentHour, currentMinute))
    // console.log(currentHour,currentMinute)
    //console.log(resetTime(currentHour,currentMinute))
},10000)
function formatTime(currentHour, currentMinute) {
    currentHour > 23 ? currentHour = 0 : currentHour;
    if (currentMinute > 59) {
        currentHour++;
        currentMinute = 0;
        //currentMinute++;
        console.log(currentMinute)
    }
    return (currentHour > 23 && currentMinute >59)    ? '00:00':
            (currentHour > 23 && currentMinute <=59)  ? `00:${currentMinute}`:
            (currentHour < 10 && currentMinute < 10)  ? `0${currentHour}:0${currentMinute}`:
            (currentHour >= 10 && currentMinute < 10)  ? `${currentHour}:0${currentMinute}`:
            (currentHour < 10 && currentMinute > 10)  ? `0${currentHour}:${currentMinute}`:
                                                        `${currentHour}:${currentMinute}`;
}
// function resetTime(currentHour, currentMinute) {
//     console.log(currentMinute)
//     currentHour = parseInt(currentHour)
//     currentMinute = parseInt(currentMinute)
//     currentHour > 23 ? currentHour = 0 : currentHour;
//     if (currentMinute > 59) {
//         currentHour++;
//         currentMinute = 0;
//     }
//     return `${currentHour}:${currentMinute}`
//}
// setTimeout(() => {
//     // console.log(currentMinute)
//     // currentHour > 23 ? currentHour = 0 : currentHour;
//     // if (currentMinute > 59) {
//     //     currentHour++;
//     //     currentMinute = 0;
//     // }
//     // console.log(currentMinute);
//     console.log(coordinates);
//     console.log(formatTime(currentHour, currentMinute))
//     // console.log(currentHour,currentMinute)
//     console.log(_.filter(coordinates, (d) => {return d.Time== '05:00' && d.Vehicle == 'Vehicle_1803'}))
//     // console.log(coordinates)
// }, 800);


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
    console.log(`${time} is ${typeof(time)}`)
    d3.csv("data/realtimelocation.csv", function (data) {
       while (numberOfCordinates > 0) {
        let entry = Object.values(data);
            
           if (entry[0] == `${time}`) {
            coordinates[0] = entry[0];
            coordinates[1] = entry[1];
            coordinates[2] = parseFloat(entry[2]);
            coordinates[3] = parseFloat(entry[3]);
            console.log(coordinates)
            displayCoord(coordinates);
           }
           
            numberOfCordinates--;
            break;
       }
    });
}