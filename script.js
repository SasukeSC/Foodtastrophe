'use strict';
//These are my API KEYS
const API_KEY = "AIzaSyD7rk-u3PkM2D-M0QRlLitc7H2_AjfSqiQ"
var API_KEY1 = 'NIS6Im8kfnKr6Dbv5RtoiMJeknkxmG3Yy849JmYDA8A_t17DYH4Estn8TFUbQOoJIj0QG8HO2bZC8ZYsKrnzdSqNnGGD_FsAFO2oLIiELY98FZjdjiopg1OeM-hfXnYx';

//lat1 and lng1 are for iniialzing the users longitude and latitude to zero by defualt. 
var lat1 = 0;
var lng1 = 0;
//Map is for initialzing the variable for map. search is for the search variable that will be passed in to YELP API
var map;
var search;
window.onload = function () {
    // setting up a bunch of get elements so that i can use a addEventListener on them. If clicked, they will go to the search query function and find the locations
    const searchB = document.getElementById('searchB');
    const check = document.getElementsByClassName("check");
    const american = document.getElementById("american");
    const asian = document.getElementById("asian");
    const breakfast = document.getElementById("breakfast");
    const fastfood = document.getElementById("fastfood");
    const italian = document.getElementById("italian");
    const mexican = document.getElementById("mexican");
    for (var i = 0; i < check.length; i++) {
        check[i].addEventListener("click", searchQuery);
    }


    american.addEventListener('click', function () {
        document.getElementById('search').value = american.value;
        searchQuery();
    })
    asian.addEventListener('click', function () {
        document.getElementById('search').value = asian.value;
        searchQuery();
    })
    breakfast.addEventListener('click', function () {
        document.getElementById('search').value = breakfast.value;
        searchQuery();
    })
    fastfood.addEventListener('click', function () {
        document.getElementById('search').value = fastfood.value;
        searchQuery();
    })
    italian.addEventListener('click', function () {
        document.getElementById('search').value = italian.value;
        searchQuery();
    })
    mexican.addEventListener('click', function () {
        document.getElementById('search').value = mexican.value;
        searchQuery();
    })
    searchB.addEventListener('click', searchQuery);
    //initialzing startPos variable for initial longitude and latitude 
    var startPos;
    //function for setting up the initial map on the site with your location as the center.
    var geoSuccess = function (position) {
        startPos = position;
        lat1 = startPos.coords.latitude;
        lng1 = startPos.coords.longitude;
        // yourLocation
        var yourLocation = {
            lat: lat1,
            lng: lng1
        };
        // The map, centered at yourLocation
        var map = new google.maps.Map(
            document.getElementById('map'), {
                zoom: 17,
                center: yourLocation
            });
        // The marker, positioned at yourLocation
        var marker = new google.maps.Marker({
            position: yourLocation,
            title: "Your Location!",
            map: map
        });
    };

    //Functioning for searching the places the user wants based on search box results
    function searchQuery(event) {
        var defaut = "";
        if (!search) {
            search = document.getElementById('search').value;
            if (search) {
                defaut = "&term=" + search + "&";
            }
        }
        //get elements for checking if all the check boxes i made are checked
        var open = document.getElementById("openNow").checked;
        var p1 = document.getElementById("$").checked;
        var p2 = document.getElementById("$$").checked;
        var p3 = document.getElementById("$$$").checked;
        var p4 = document.getElementById("$$$$").checked;
        var rec = document.getElementById("recommended").checked;
        var hr = document.getElementById("highestRated").checked;
        var mr = document.getElementById("mostReviewed").checked;
        var walk = document.getElementById("walking").checked;
        var biking = document.getElementById("biking").checked;
        var driving = document.getElementById("driving").checked;

        //these will add to the query link depending on if the boxes are checked or not
        var radius = "";
        var sort = "";
        var price = "";
        var category = '&categories=restaurants';
        var openNow = "";

        if (open) {
            openNow = "&open_now=true"
        }

        if (walk) {
            radius = "&radius=1610";
        }
        if (biking) {
            radius = "&radius=3220";
        }
        if (driving) {
            radius = "&radius=4830";
        }

        if (rec) {
            sort = "&sort_by=best_match";
        } else if (hr) {
            sort = "&sort_by=rating";
        } else if (mr) {
            sort = "&sort_by=review_count";
        }

        if (p1) {
            price = "&price=1"
            if (p2) {
                price += ",2"
            }
            if (p3) {
                price += ",3"
            }
            if (p4) {
                price += ",4"
            }
        } else if (p2) {
            price = "&price=2"
            if (p3) {
                price += ",3"
            }
            if (p4) {
                price += ",4"
            }
        } else if (p3) {
            price = "&price=3"
            if (p4) {
                price += ",4"
            }
        } else if (p4) {
            price = "&price=4"
        }

        console.log(search);
        //this is the URL for grabbing the data based on all the variables above
        var URL = ' https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?' + defaut + 'latitude=' + lat1 + '&longitude=' + lng1 + radius + category + sort + price + openNow;
        var req = new Request(URL, {
            method: 'GET',
            headers: new Headers({
                //setting the api key so i have the right to access data
                'Authorization': 'Bearer ' + API_KEY1,
                'Content-Type': 'application/json'
            })

        });

        fetch(req)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    ssss
                    throw new Error();
                }
            })
            .then((jsonData) => {
                //the if statement is checking if the data returned from Yelp is not empty
                if (jsonData.businesses[0]) {
                    search = null;
                    console.log(jsonData.businesses);
                    var map;
                    var bounds = new google.maps.LatLngBounds();
                    var mapOptions = {
                        mapTypeId: 'roadmap'
                    };

                    // Display a map on the page
                    map = new google.maps.Map(document.getElementById("map"), mapOptions);
                    map.setTilt(45);


                    // Multiple Markers
                    var markers = ["e"];
                    // Info Window Content
                    var infoWindowContent = ["e"];

                    jsonData.length

                    for (var i = 1; i < jsonData.businesses.length; i++) {
                        markers.push("e");
                        infoWindowContent.push("e");
                    }
                    for (var i = 0; i < jsonData.businesses.length; i++) {
                        markers[i] = [jsonData.businesses[i].name, jsonData.businesses[i].coordinates.latitude, jsonData.businesses[i].coordinates.longitude];
                        infoWindowContent[i] = ['<div class="info_content">' + '<h3>' + jsonData.businesses[i].name + '</h3>' + '<img width=50% height=50% src="' + jsonData.businesses[i].image_url + '">' + '<h4>Phone Number: ' + jsonData.businesses[i].display_phone + '</h4>' + '<h4>Rating: ' + jsonData.businesses[i].rating + '</h4>' + '<h4>Review count: ' + jsonData.businesses[i].review_count + '</h4>' + '<h4>Address: ' + jsonData.businesses[i].location.address1 + '</h4>' + '</div>'];
                    }
                    console.log(jsonData.businesses.length);


                    // Display multiple markers on a map
                    var infoWindow = new google.maps.InfoWindow(),
                        marker, i;

                    // Loop through our array of markers & place each one on the map  
                    for (i = 0; i < markers.length; i++) {
                        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
                        bounds.extend(position);
                        marker = new google.maps.Marker({
                            position: position,
                            map: map,
                            title: markers[i][0]
                        });

                        // Allow each marker to have an info window    
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infoWindow.setContent(infoWindowContent[i][0]);
                                infoWindow.open(map, marker);
                            }
                        })(marker, i));

                        // Automatically center the map fitting all markers on the screen
                        map.fitBounds(bounds);
                    }
                } else {
                    //displays no results if there is no data
                    alert("No Results!");
                    // yourLocation
                    var yourLocation = {
                        lat: lat1,
                        lng: lng1
                    };
                    //resets map to your initial location
                    var map = new google.maps.Map(
                        document.getElementById('map'), {
                            zoom: 10,
                            center: yourLocation
                        });
                }
            })
            .catch((err) => {
                console.log('ERROR: ', err.message);
            });
    }
    //prompt for getting location
    navigator.geolocation.getCurrentPosition(geoSuccess);
};