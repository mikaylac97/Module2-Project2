// const axios = require('axios')

let latitude = 58.3816;
let longitude = 34.6037;

// axios
//     .get('/posts')
//     .then(response => {

//     })

window.addEventListener('load', () => {
    const postLocation = {
        lat: latitude,
        lng: longitude,
    };

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom:10,
        center: postLocation
    });

    const marker = new google.maps.Marker({
        position: postLocation,
        map: map,
    });

});
