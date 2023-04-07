const apikey="cYL6RdDvhRhaF6DgsOG332V79xPSpoVRoDwYJzzEm41tTdUrBstHQJkG"; 
const input=document.querySelector(".input");
// const city=document.querySelector(".city");
const search_btn=document.querySelector(".search_btn");
const search_btnCompare=document.getElementById("search_btn_compare");
const inputCompare=document.querySelector(".input_compare");

let page_num=0;
let country="";
let comparison_country="";
let city_name="";
let search=false;
let lat=0;
let lon=0;

input.addEventListener("input",(event)=>{
    clearSearch();
    event.preventDefault();
    country=event.target.value;
})
inputCompare.addEventListener("input",(event=>{

  clearSearch();
  event.preventDefault();
  comparison_country=event.target.value;
}));
search_btnCompare.addEventListener("click",()=>{
  comparisonChart();
  clearComparisonChart()
});
search_btn.addEventListener("click",()=>{


    
    cleargallery();
    search=true;
    SearchPhotos(country,page_num);
    createMapPopup();
    getCountryData(country);
    cordinateFinder()
    clearChart();
    createChart();
    clearComparisonChart();



})

function createMapPopup(){

  document.querySelector(".mapper").innerHTML="";

  mapInstinct=document.createElement("button");
  mapInstinct.innerHTML=`<span>Click me to find ${country} in the world map</span>`
  mapInstinct.classList.add("btn", "btn-info");
  mapInstinct.style.margin="5%";
  mapInstinct.style.borderRadius="10px";
  mapInstinct.style.height="40px";
  mapInstinct.setAttribute("data-toggle","modal");
  mapInstinct.setAttribute("data-target","#myModal");
  document.querySelector(".mapper").appendChild(mapInstinct);

mapInstinct.addEventListener("click",()=>{
  initMap();
}
)
};
function clearSearch(){
    input.innerHTML="";
    inputCompare.innerHTML="";
}

function cleargallery(){
    document.querySelector(".grid").innerHTML="";
    page_num=1;
}

async function CuratedPhotos(page_num){
    // fetch the data from api
    const data=await fetch(`https://api.pexels.com/v1/curated?page=${page_num}`, 
    {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: apikey,         
        },
    });
    const response=await data.json();     
    console.log(response);

    display_images(response); 
  }           
  function display_images(response){
      
      

        redrep=response.photos.slice(0,8);
        background=redrep[0].src.large;
        document.getElementById("header").style.backgroundImage=`url(${background})`;
        redrep.forEach((image) => {
  
  
          const gallery_container=document.createElement("div");
          gallery_container.innerHTML=`<img src=${image.src.large}>`;
          gallery_container.classList.add("image");
  
      
          document.querySelector(".grid").appendChild(gallery_container);

          grid= document.querySelector(".grid");
          grid.style.display="grid";

  
      });

  }

async function SearchPhotos(query, page_num){
    const data=await fetch(`https://api.pexels.com/v1/search?query=${query}&page=${page_num}`, 
    {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: apikey,
        },
    });
    const response=await data.json();
    console.log(response);
    display_images(response);
}



function clearChart(){
    document.getElementById("chart_of_cost").innerHTML="";
    document.getElementById("pie_of_cost").innerHTML="";
    document.querySelector(".chartOfCost").innerHTML="";
    document.querySelector(".countrydata").innerHTML="";

}
function clearComparisonChart(){
  document.getElementById("comparecost").innerHTML="";

}

Chart.defaults.global.responsive = true;


async function createChart(){


chartData=await fetchChartData(country);
chartLabels=chartData[1];
dataPoints=chartData[0];
const sum = dataPoints.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

const chartbox=document.querySelector(".chart_of_cost");
chartbox.style.visibility="visible";
const cpcanvas=document.getElementById("chart_of_cost");



const costChart= new Chart(cpcanvas,{
    type:'bar',
    responsive:'true',
    data: {
        labels: chartLabels,
        datasets: [
          {
            label: `Average cost of living in ${country}`,
            backgroundColor: [" black", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#FFA500","#C2B280","black","orange" ],
            data: dataPoints,
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: `Average cost of living in ${country} - $ ${sum}`
        }
      }


});
const pcanvas=document.getElementById("pie_of_cost");
const pieChart= new Chart(pcanvas,{
    type:'doughnut',
    responsive:'true',
    data: {
        labels: chartLabels,
        datasets: [
          {
            title:{
              text: `Ration cost of living in ${country}`, 
            },
            backgroundColor: [" brown", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#FFA500","#C2B280","black","orange" ],
            data: dataPoints,
          }
        ]
      },
      options: {
        legend: { display: true },
        title: {
          display: true,
          text: `Average cost of living in ${country} - $ ${sum}`
        }
      }

      
});


chart=document.querySelector(".chartOfCost");
chart.style.margin="5%";

chattext=document.createElement("div");
chattext.classList.add("chartintro");
heading1=document.createElement("h1");
heading1.innerHTML="";
heading1.innerHTML= `The above graphs tell more about the cost of living in ${country}`;
parachart=document.createElement("p");
parachart.innerHTML="";
parachart.innerHTML="By hoovering over each of the data points, you can make out, just how much exactly in dollars you'll spend on each utility ";
chattext.appendChild(heading1);
chattext.appendChild(parachart);
chart.appendChild(chattext);
chart.style.visibility="visible";
compare=document.querySelector(".comparison");
compare.style.display="block";

}


 async function comparisonChart(){


chartData=await fetchChartData(country);
chartLabels=chartData[1];
dataPoints=chartData[0];
chartDataTwo=await fetchChartData(comparison_country);
chartLabelsTwo=chartDataTwo[1];
dataPointsTwo=chartDataTwo[0];
const comcanvas=document.getElementById("comparecost");

const costChart= new Chart(comcanvas,{
  type:'bar',
  data: {
      labels: chartLabels,
      datasets: [
        {
          label:`${country}`,
          backgroundColor:"orange",
          data: dataPoints,
        },
        {
          label:`${comparison_country}`,
          backgroundColor:"cadetblue",
          data: dataPointsTwo,
        }
      ]
    },
    options: {
      legend: { display: true },
      title: {
        display: true,
        text: ` ${country} cost of living in comparison with ${comparison_country}`
      }
    }


});


}
async function fetchChartData(query1){
    let chartlabels=[];
    let dataPoint= [];

    console.log("chart labels initial value: ", chartlabels);
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'a4674df18dmshddc32ea7ed9250ap11720ejsnc8bcf2840b5f',
            'X-RapidAPI-Host': 'cost-of-living-and-prices.p.rapidapi.com'
        }
    };

chartdata= await fetch(`https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=&country_name=${query1}`, options)
	response=await chartdata.json();
    let prices=response.prices

    console.log("prices", prices);

  const groupedData=_.groupBy(prices,"category_name")

  console.log("groupedData", groupedData);

  for(const item of Object.keys(groupedData)){
    category=[];
       const cat=groupedData[item];
        console.log("cat", cat);
        cat.forEach((cost)=>{
            
            if (cost.usd){
                costa=cost.usd;
                console.log("costa", costa);
                avg=costa.avg;
                amount=parseFloat(avg);
                console.log("amount", amount);
                category.push(amount);  
                meantt=_.mean(category);
            }
            else{
                console.log("no cost usd", cost);
                //DO something when the cost usd doesn't exist
            }
            
  
        })
   
    dataPoint.push(meantt);
    chartlabels.push(item);

  }
  console.log("categorymeans",dataPoint);
  console.log("chartlabels",chartlabels)

  return [dataPoint, chartlabels];
  

}

//Get them country data
async function getCountryData(query){

    const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a4674df18dmshddc32ea7ed9250ap11720ejsnc8bcf2840b5f',
		'X-RapidAPI-Host': 'country-facts.p.rapidapi.com'
	}
};

countryall= await fetch('https://country-facts.p.rapidapi.com/all', options)
response=await countryall.json();
console.log(response)


response.forEach((country)=>{
    target=country.name.common;
    if(target==query){

        city_name=country.capital[0];
        console.log(city_name)
        heading=document.createElement("h3");
        heading.innerHTML=`${query},${country.capital[0]}`;
        population=document.createElement("p");
        population.innerHTML=`Population:${country.population}`;
        document.querySelector(".countrydata").appendChild(heading);
        document.querySelector(".countrydata").appendChild(population);
        document.querySelector(".countrydata").style.visibility="visible";
        

    }
   
})

}

//Display the country information

// Responsive navbar


$('.navTrigger').click(function () {
    $(this).toggleClass('active');
    console.log("Clicked menu");
    $("#mainListDiv").toggleClass("show_list");
    $("#mainListDiv").fadeIn();

});

$(window).scroll(function() {
            if ($(document).scrollTop() > 50) {
                $('.nav').addClass('affix');
            } else {
                $('.nav').removeClass('affix');
            }
        });


// autocomplete searchbar

const countryarr= ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

function autocomplete(inp, arr) {
    
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) { 
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }
  
  autocomplete(document.getElementById("search"), countryarr);


  async function cordinateFinder( query1){
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'a4674df18dmshddc32ea7ed9250ap11720ejsnc8bcf2840b5f',
        'X-RapidAPI-Host': 'geocoding-by-api-ninjas.p.rapidapi.com'
      }
    };
  
   code=await fetch(`https://geocoding-by-api-ninjas.p.rapidapi.com/v1/geocoding?city=${query1}`, options)
    response = await code.json(); 
    console.log(response);
    let target=response[0];
    console.log(target);
    lat=(target.latitude).toFixed(4);
    lon=(target.longitude).toFixed(4);
    console.log(lat,lon);

}



let map;
let service;
let infowindow;

function initMap() {

  const place = new google.maps.LatLng(lat, lon);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: place,
    zoom: 8,
  });


  const request = {
    query: `${city_name}`,
    fields: ["name", "geometry"],
  };

  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });

  alert("the map takes a while to load. Stick with us!");
  console.log("I have been called successfully");
}






  

  
