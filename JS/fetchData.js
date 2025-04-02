'use stict';

let toiletData = [];
let searchResults = document.querySelector('tbody');

fetch('https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/toilettes_publiques_vbx/records?limit=50')
    .then(response => response.json())
    .then(data  => {
        toiletData = data.results;        
        //console.log(toiletData); //Bestaat, geopont, location, pricing, openinghours
        toiletData.forEach(toilet => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            //location
            td.textContent = toilet.location;
            tr.appendChild(td.cloneNode(true));
            //pricing
            td.textContent = toilet.pricing_en;
            tr.appendChild(td.cloneNode(true));
            //opening hours
            td.textContent = toilet.openinghours;
            tr.appendChild(td.cloneNode(true));
            //excists
            td.textContent = toilet.status;
            tr.appendChild(td.cloneNode(true));

            searchResults.appendChild(tr);
        });
    })
    .catch(error => {
        console.log(`Er ging iets mis: ${error.message}`); 
    });
