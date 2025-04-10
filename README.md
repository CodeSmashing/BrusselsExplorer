# BrusselsExplorer
Dynamic web groepswerk

Website maken waar je toiletten in Brussel kan vinden, sorteren, opslaan...

>## Gebruikte datasets: 
>    1. https://opendata.brussels.be/explore/dataset/toilettes_publiques_vbx/information/?disjunctive.status&disjunctive.openinghours&disjunctive.management_en
>    2. https://opendata.brussels.be/explore/dataset/urinoirs-publics-vbx/information/
>    3. https://opendata.brussels.be/explore/dataset/bruxelles_canisite/information/?disjunctive.postalcode&disjunctive.territory_fr
>    4. https://opendata.brussels.be/explore/dataset/bruxelles_parcs_et_jardins/information/
>    5. Google maps API (met datasets van de Brussel API op upgeload)

## Technische vereisten
>**DOM manipulatie:**
>
>   - Elementen selecteren
>> **Voorbeeld uit code:** User input (search, add to favorites, filters, sorteren...) op te halen.
>
>   - Elementen manipuleren
>> **Voorbeeld uit code:** Favorites op te slaan, zoekresultaten te tonen, thema aan te passen...
>
>   - Events aan elementen koppelen
>> **Voorbeeld uit code:** Favorites buttons, search button, side menu openen/sluiten, thema en taal aanpassen...
>
>---
>**Modern JavaScript:**
>
>   - Gebruik van constanten
>> **Voorbeeld uit code:** Alle buttons en divs die niet veranderen, halen we in het begin van onze code op als constanten.
>
>   - Template literals
>> **Voorbeeld uit code:** Om automatisch unieke ids te geven aan bepaalde html elementen (elke favoriete div heeft een unieke id die gelinkt is aan de inhoud).
>
>   - Iteratie over arrays
>> **Voorbeeld uit code:** Om de datasets uit te lezen en in een tabel te tonen. Om user favorites in een lijst te tonen.
>
>   - Array methodes
>> **Voorbeeld uit code:** Zoekfunctie en sorteren van resultaten.
>
>   - Arrow functions
>> **Voorbeeld uit code:** Functies in eventlisteners te maken
>
>   - Conditional (ternary) operator (moderne if..else)
>> **Voorbeeld uit code:** Om tussen states te switchen in objects (Gratis of niet, visible of niet...)
>
>   - Callback functions
>> **Voorbeeld uit code:** /
>
>   - Promises
>> **Voorbeeld uit code:** Bij de het fetchen van de API data
>
>   - Async & Await
>> **Voorbeeld uit code:** Om pas dingen to doen met de data, zodra deze geladen is
>
>   - Observer API (1 is voldoende)
>> **Voorbeeld uit code:**
>
>---
>**Data & API:** 
>
>   - Fetch om data op te halen
>> **Voorbeeld uit code:** Brussel API
>
>   - JSON manipuleren en weergeven
>> **Voorbeeld uit code:** Favorites en userdata bijhouden, opslagen, bijwerken en uitlezen 
>
>---
>**Opslag & validatie:**  
>   - Formulier validatie
>> **Voorbeeld uit code:** Invalid input opvangen in search. Als locatietoegang geweigerd word, toegang to sommige dingen beperken om errors te voorkomen.
>   - Gebruik van LocalStorage
>> **Voorbeeld uit code:** Favorieten, locatie worden allemaal bijgehouden in een object in de localstorage.
>
>---
>**Styling & layout:**
>   - Basis HTML layout (flexbox of CSS grid kan hiervoor worden gebruikt)
>   - Basis CSS
>   - Gebruiksvriendelijke elementen (verwijderknoppen, icoontjes,...)

>## Installatie handleiding
>   1. Dowload zip file van deze github repository
>   ![Stap 1](README_IMGS/stap1.png)
>   2. Extract de zip file in een folder en open deze via VS code
>   ![Stap 2](README_IMGS/stap2.png)
>   3. Installeer de live-server plugin in VS code
>   ![Stap 2](README_IMGS/stap3.png)
>   4. Start de live-server onderaan je VS code-venster
>   ![Stap 2](README_IMGS/stap4.png)

>## Gebruikte bronnen
>   1. https://opendata.brussels.be
>   2. https://www.stackoverflow.com
>   3. https://www.w3schools.com/
>   4. https://www.google.com
>   5. https://canvas.ehb.be/courses/38344 - Cursus Dynamic Web
>   6. https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters

>## Taakverdeling
>   ### Bruno
>       - HTML structure
>       - JS favorites
>       - CSS styling
>       - Search function
>       - Sorting
>   ### Niels
>       - JS calculate distance
>       - CSS styling
>       - README
>       - Filters
>       - Barcharts
>       
>

