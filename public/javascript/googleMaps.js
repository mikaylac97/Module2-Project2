const { default: Axios } = require("axios");

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 }
    });
    const geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', () => {
        geocodeAddress(geocoder, map);
    });
}

function geocodeAddress(geocoder, resultMap) {
    const address = document.getElementById('address').value;
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK'){
            resultMap.serCenter(results[0].geometry.location);
            new google.maps.Marker({
                map: resultMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason:' + status);
        }
    });
}

function geocode(){
    Axios.get('https://maps.googleapis.com/maps/api/geocode/json');
        
}