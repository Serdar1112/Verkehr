var map = L.map('map').setView([49.488888, 8.469167], 14); //Zeigt die Map an, in Mannheim, Zoomfaktor 14.
L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Farbeschema für die Map
var colors = ["#f7fbff","#e3eef9","#cfe1f2","#b5d4e9","#93c3df","#6daed5","#4b97c9","#2f7ebc","#1864aa","#0a4a90","#08306b"];
var circle = [];
var coords = [];
var deviceId = [];
$.ajaxSetup({
    async: false
});

//LEGENDE ABER FAIL
// var legend = L.control({position: 'bottomright'});
// function getColor(d) {
//     return colors[d];
// }
// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 10, 20, 50, 100, 200, 500, 1000],
//         labels = [];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColor(i) + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//     }

//     return div;
// };

// legend.addTo(map);
//API URL und KEY
let urlbase = "https://api.mvvsmartcities.com/v2/";
let key = "YOUR_API_KEY";
let devices = "?deviceId=mavi001&"
                +"deviceId=mavi002&"
                +"deviceId=mavi003&"
                +"deviceId=mavi004&"
                +"deviceId=mavi005&"
                +"deviceId=mavi009&"
                +"deviceId=mavi010&"
                +"deviceId=mavi011&"
                +"deviceId=mavi013&"
                +"deviceId=mavi014&"
                +"deviceId=mavi015";//Kameras die NaN Daten haben oder irgendwann aus waren, sind hier ausgeschlossen.

//Jede Abfrage läuft hier durch, um die Daten zu bekommen.
async function fetchData(params){
    let url = urlbase + params;
    return fetch(url, {headers: {"Accept": "application/json", "Ocp-Apim-Subscription-Key": key}}).then(r => r.json());
}
fetchCoordinates();
//Nimmt die Koordinaten der Kameras.
async function fetchCoordinates(){
    let params = "device/timeseriesdefinition" + devices;
    $.getJSON("fallzahlen/allcams.json", function(json) {
        data = json;
    });
    for(var i = 0; i < Object.keys(data["location.coordinates"]).length; i++)
        {
            if((i == 11 || i == 12 || i == 13 || i == 14 || i == 11 || i >= 15))
            {

            }
            else{
                coords.push(data["location.coordinates"][i]);
                deviceId.push(data["deviceId"][i]);
            }
        }
        
        createCircles(coords,deviceId);  

    // let data; request.then(d => {
    //     data = d; 
    //     console.log(data);
    //     for(var i = 0; i < Object.keys(data["location.coordinates"]).length; i++)
    //     {
    //         coords.push(data[i]["timeSeriesDefinitions"][0]["location"]["coordinates"]);
    //         deviceId.push(data[i]["deviceId"]);
    //     }
    //     createCircles(coords,deviceId);  
    // });
}
var cameraData = [[]];

var allDataGlobal = fetchDataFromDevice();
//Nimmt die Timeseries Daten aller Kameras zwischen dem 2021-06-16 bis 2021-12-28
function fetchDataFromDevice()
{
    let params = "device/timeseries"+devices+"&from=2021-06-01T00%3A00%3A00.000Z&to=2021-12-28T23%3A59%3A59.999Z&func=sum&interval=H&sort=desc";
    $.getJSON("fallzahlen/allCamsss.json", function(json) {
        datas = json;
    });
    var allData = GetTimeStampsInRow(datas);
    return allData;
    
}

//Hier findet die ganze Berechnung statt.
function GetTimeStampsInRow (data){
    let values = [];
    
        let indexes = [];//Wieviele daten pro Kamera es gibt.
        let deviceValues = [[]];//Alle Kameradaten pro Stunde (sehr viele)
        for(var i = 0; i < Object.keys(data["timeSeries"]).length; i++)
        {
            indexes.push(Object.keys(data["timeSeries"][i]).length);
        }
        var allData = 0;
        console.log(data["timeSeries"])
        for(var i = 0; i < Object.keys(data["timeSeries"]).length; i++)
            {
                deviceValues[i] = [[data["timeSeries"][0][0]["timestamps"], data["timeSeries"][0][0]["values"]]];

                for(var j = 0; j < indexes[i]; j++)
                {

                    deviceValues[i].push([data["timeSeries"][i][j]["timestamps"], data["timeSeries"][i][j]["values"]]);
                }
            }

            test = deviceValues;
            let datetrenner = []; //Alle Daten sind hier drin gespeichert und pro Tag zusammengefasst. Also durch 24
            for(var i= 0; i < Object.keys(deviceValues).length; i++){
                datetrenner[i]=[[]];
                for(var j = 0; j < Object.keys(deviceValues[i]).length; j++)
                {

                    var counter=0;
                    
                     for(var k = 0; k < Object.keys(deviceValues[i][j][0]).length; k++){
                        
                        counter += deviceValues[i][j][1][k];
                        if(k % 24 == 0 && k != 0)
                        {
                            if(k == 24){datetrenner[i][j] = [counter]; counter = 0;}
                            else{
                                datetrenner[i][j].push(counter);
                                counter = 0;
                            }
                        }
                     }
                }
            }
            
            valuesOfCamerasWithDates = [[]]; //Hier sind alle Kameradaten pro Tag von einer Kamera, dessen unter Kameras summiert.
                                            //Z.B Mavi001 hat 10 Kameradaten, diese sind dann in einer zusammengefasst.
            for(var i = 0; i < Object.keys(datetrenner).length;i++){
                if(i==0){

                    valuesOfCamerasWithDates[i] = DateArrayLoop(datetrenner[i],Object.keys(deviceValues[i]).length);
                }
                else
                valuesOfCamerasWithDates.push(DateArrayLoop(datetrenner[i],Object.keys(deviceValues[i]).length));
            }
            for(var i = 0; i < Object.keys(valuesOfCamerasWithDates).length; i++){
                var valuesz=0;
                cameraData[i]=[]; //Hier sind alle Kamera Daten innerhalb einer Woche gespeichert.

                for(var j = 0; j < Object.keys(valuesOfCamerasWithDates[i]).length; j++)
                {
                    valuesz+=valuesOfCamerasWithDates[i][j];
                    if(j%7==0&&j!=0)
                    {
                        cameraData[i].push(valuesz);
                        valuesz = 0;
                    }
                }
                
            }
            allDataInOne = [[]]; //Hier sind alle Daten der Kameras summiert (Mavi001,Mavi002..) Pro Woche.
            var sumOfData=0;
            
                for(var i = 0; i < 16;i++)
                {
                    for(var j = 0; j < Object.keys(cameraData).length;j++)
                    {
                        sumOfData += cameraData[j][i];
                    }
                    if(i==0) allDataInOne[i] = sumOfData;
                    else allDataInOne.push(sumOfData);
                    sumOfData=0;
                }
            
            
            let sortedData = JSON.parse(JSON.stringify(allDataInOne))
            SortValues();
            //Sortiert die Kameradaten nach der Reihenfolge aufsteigend.
            function SortValues(){
                for(var i = 0; i < Object.keys(allDataInOne).length; i++)
                {
                        sortedData.sort(function(a, b){return a - b});
                }
            }
            //Falls die Slider sich bewegen, ändere den anderen Slider mit.
            sliderCar.oninput = function() {
                sliderCorona.value = sortedInzidenzen.indexOf(inzidenzenMannheim[allDataInOne.indexOf(sortedData[sliderCar.value])]);
            }
            sliderCorona.oninput = function() {
                sliderCar.value = sortedData.indexOf(allDataInOne[inzidenzenMannheim.indexOf(sortedInzidenzen[sliderCorona.value])]);
            }
            return allDataInOne;

    
}
//Hier ist die große Berechnung, dass die Kameradaten pro Kamera durch sich selbst zusammengefasst wird.
 function DateArrayLoop(arr,devide){
    
    var elementPerArrayCount = arr[0].length;
    var sum = 0;
    valuesOfCamerasWithDate = [[]];
    for(var j = 0; j < elementPerArrayCount; j++){
        for(var i  = 0 ; i < arr.length; i++){
            sum += arr[i][j];
        }
        if(j==0){
            valuesOfCamerasWithDate[j] = parseInt(sum/devide);
        }
        else{
            
            valuesOfCamerasWithDate.push(parseInt(sum/devide));
        }
        sum = 0;
    }
    return valuesOfCamerasWithDate;
}
//Hier werden die Kreise erstellt.
 function createCircles(coords, deviceId){
    var size = Object.keys(coords).length;
    

    for(var i = 0; i < size; i++)
    {
        circle[i] = new L.circle([coords[i][1]
         , coords[i][0]], {
         color: 'white',
         opacity:0.8,
         fillColor: '#ffffff',
         fillOpacity: 0.8,
         radius: 70
        }).addTo(map);
        circle[i].bindPopup("Kamera: "+deviceId[i]);
    }
}
//Fallzahlen werden eingelesen.
$.getJSON("fallzahlen/7tagesinzidenz.json", function(json) {
    inzidenzen = json;
});
var inziMannheim =[];//Alle Inzidenzen der Städte.

var lenghtInzi = Object.keys(inzidenzen).length-1-21;
for(var i = 0; i < 112; i++)
{
    if(i==0)inziMannheim[i]=inzidenzen[lenghtInzi];
    else inziMannheim.push(inzidenzen[lenghtInzi-i]);
}
var inziMannheimWochen =[]; // Alle inzidenzen der Städte pro Woche (nicht vom Namen täuschen lassen)
var entry = 0;
for(var i = 0; i < Object.keys(inziMannheim).length; i++){
    if(i%7==0)
    {
        inziMannheimWochen[entry] = inziMannheim[i];
        entry++;
    }
}
var inzidenzenMannheim =[]; //Alle Inzidenzen pro Woche in Mannheim.

for(var i = 0; i < Object.keys(inziMannheimWochen).length; i++)
{
    if(i==0)
    inzidenzenMannheim[i] = inziMannheimWochen[i]["8222_7di"];
    else inzidenzenMannheim.push(inziMannheimWochen[i]["8222_7di"]);
}
let sortedInzidenzen = JSON.parse(JSON.stringify(inzidenzenMannheim))
SortInzidenzen();
function SortInzidenzen(){
    for(var i = 0; i < Object.keys(inzidenzenMannheim).length; i++)
    {
        sortedInzidenzen.sort(function(a, b){return a - b});
    }
}
//2021-06-16-2021-12-28