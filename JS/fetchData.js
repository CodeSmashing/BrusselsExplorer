'use stict';

console.log('test');

fetch('https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/toilettes_publiques_vbx/records?limit=20')
    .then(response => () => {console.log(response.json())})
    .catch(error => {
        console.log(`Er ging iets mis: ${error.message}`); 
    });
