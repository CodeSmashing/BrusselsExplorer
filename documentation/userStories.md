# User stories

<!-- >**Als** eindgebruiker
>**Wil ik** via de website de dichtstbijzijnde publieke WC’s of urinoirs in en rond mijn locatie vinden
>**Zodat ik** met gemak een toilet kan vinden als ik het dringend nodig heb

- [x] Test text
- [ ] Test text
- [ ] Test text
  - [ ] Test text

My term
: Test text
: ==Test text==

Here's a sentence with a footnote. [^1]

[^1]: This is the footnote with a link:
[title](https://www.example.com) -->

**Als** eindgebruiker
**Wil ik** via de website de dichtstbijzijnde publieke WC’s of urinoirs in en rond mijn locatie vinden
**Zodat ik** met gemak een toilet kan vinden als ik het dringend nodig heb

**Gegeven** een eindgebruiker bevindt zich initieel op de thuis pagina
**Wanneer** er nog geen algemene fetch uitgevoerd werd naar de toilet datasets
**Dan** zal de website een fetch uitvoeren naar de meest gebruikte datasets voor toilet locatie informatie
**Wanneer** er succesvol toilet locatie gegevens opgehaald worden
**Dan** zullen deze gegevens bijgehouden worden in een variabele voor verder gebruik

**Gegeven** een eindgebruiker bevindt zich initieel op de thuis pagina
**Wanneer** er geen locatie gegevens meegedeeld worden met de website omdat dit nog niet toegelaten is
**Dan** zal er een prompt verschijnen via de Geolocation API van HTML5 om te vragen dat deze zijn locatie zal delen met de website
**Wanneer** de eindgebruiker op de knop “Deel mijn locatie” klikt en dus akkoord gaat met het delen van zijn locatie
**Dan** zal de website gebruik maken van de gedeelde locatie gegevens indien deze beschikbaar/bruikbaar zijn en zullen deze bijgehouden worden in `localStorage` onder “userPreferences” \> “currentLocation”
**Wanneer** de eindgebruiker de knop “Deel mijn locatie” of anderzijds de prompt negeert
**Dan** zal de website geen gebruik maken van de locatie van de eindgebruiker en deze dus ook niet bijhouden

**Gegeven** een eindgebruiker bevindt zich op de thuis pagina en heeft de initiële Geolocation API prompt genegeerd of de toegang geweigerd
**Wanneer** de eindgebruiker op de knop “Zoek WC’s in mijn buurt” klikt
**Dan** zal er een prompt verschijnen via de Geolocation API van HTML5 om te vragen dat deze zijn locatie zal delen met de website
**Wanneer** de eindgebruiker op de knop “Deel mijn locatie” klikt en dus akkoord gaat met het delen van zijn locatie
**Dan** zal de website gebruik maken van de gedeelde locatie gegevens indien deze beschikbaar/bruikbaar zijn en zullen deze bijgehouden worden in `localStorage` onder “userPreferences” \> “currentLocation”
**Wanneer** de eindgebruiker de knop “Deel mijn locatie” of anderzijds de prompt negeert
**Dan** zal de website geen gebruik maken van de locatie van de eindgebruiker en deze dus ook niet bijhouden

**Gegeven** een eindgebruiker bevindt zich op de thuis pagina en heeft niet hun locatiegegevens gedeeld via de initiële Geolocation API prompt of door op de knop “Zoek WC’s in mijn buurt” te klikken
**Wanneer** de eindgebruiker in de zoekbalk een zoekterm invoert
**Dan** zal er een dropdown verschijnen onder de zoekbalk met de toilet locaties waarvan de plaatsnaam deels of volledig overeenkomt met de zoekterm als opties om op te klikken
**Wanneer** de eindgebruiker op een locatie klikt van het dropdown menu
**Dan** zal de dropdown menu verdwijnen en zal de specifieke locatie waarop geklikt werd als enigste locatie zichtbaar worden in de toilet locatie tabel
**Wanneer** de eindgebruiker een zoekterm heeft ingetypt en op de enter toets drukt
**Dan** zal er gezocht worden naar al de toilet locaties in de lijst waarvan de plaatsnaam deels of volledig overeenkomt met de zoekterm. Er zal een lijst terug gegeven worden met al de overeenkomstige locaties
**Wanneer** we een lijst krijgen van overeenkomende locaties
**Dan** zullen al deze locaties weergegeven worden in de toilet locatie tabel
**Wanneer** de eindgebruiker een zoekterm heeft ingetypt en op de knop "Zoek" klikt
**Dan** zal de website een nieuwe fetch uitvoeren naar de datasets om een lijst van toilet locaties terug te krijgen
**Wanneer** we een lijst krijgen van locaties
**Dan** zal er gezocht worden naar al de toilet locaties in de lijst waarvan de plaatsnaam deels of volledig overeenkomt met de zoekterm. Er zal een lijst terug gegeven worden met al de overeenkomstige locaties
**Wanneer** we een lijst krijgen van overeenkomende locaties
**Dan** zullen al deze locaties weergegeven worden in de toilet locatie tabel
**Wanneer** de eindgebruiker een zoekterm heeft ingetypt en ofwel op de enter toets drukt of op de knop "Zoek" klikt, en er zijn geen overeenkomstige opties in de lijst van toilet locaties
**Dan** zal de zoekbalk rood worden met een error CSS klasse om aan de eindgebruiker te laten weten dat er niets gevonden is in verband met zijn zoekterm

___

**Als** eindgebruiker
**Wil ik** de taal van de website kunnen veranderen van het Nederlands naar het Frans en vice versa
**Zodat ik** de website kan begrijpen in een taal die ik beheers

**Gegeven** een eindgebruiker bevindt zich op een pagina en er is een knop om de pagina te vertalen naar het Nederlands en een knop om te vertalen naar het Frans
**Wanneer** de eindgebruiker op de knop om te vertalen naar het Nederlands klikt
**Dan** zal de gehele website voortaan in het Nederlands staan tot er anders aangetoond wordt en wordt de gekozen taaloptie bijgehouden in `localStorage` voor toekomstige referentie onder “userPreferences” \> “language”
**Wanneer** de eindgebruiker op de knop om te vertalen naar het Frans klikt
**Dan** zal de gehele website voortaan in het Frans staan tot er anders aangetoond wordt en wordt de gekozen taaloptie bijgehouden in `localStorage` voor toekomstige referentie onder “userPreferences” \> “language”

___

**Als** eindgebruiker
**Wil ik** dat mijn voorkeuren worden opgeslagen (thema, favorieten, taal, …) en dat deze worden toegepast telkens als ik de website bezoek
**Zodat ik** niet alles opnieuw moet aanpassen als ik de website verlaat

**Gegeven** een eindgebruiker bevindt zich initieel op de website
**Wanneer** er een voorkeur taal te vinden is in `localStorage` onder “userPreferences” \> “language”
**Dan** zal de gehele website voortaan in de voorkeur taal staan tot er anders aangetoond wordt
**Wanneer** er een voorkeur thema te vinden is in `localStorage` onder “userPreferences” \> “theme”
**Dan** zal de huidige css regel `color-scheme` aangepast worden naar de bijgehouden thema, "dark" of "light"
**Wanneer** er favorieten te vinden zijn in `localStorage` onder “userPreferences” \> “locations” \> “favourites”
**Dan** zullen de bijgehouden locaties weergegeven worden in de toilet locatie tabel, zullen de "favoriet" knoppen de klasse "favourited" krijgen, en zullen de bijgehouden locaties in de favorieten lijst in het zij-menu weergegeven worden

___


**Als** eindgebruiker
**Wil ik** weten hoe ver elke gegeven locatie is van mijn huidige locatie en hoe lang ik er ongeveer over moet doen om er te geraken (te voet) in minuten
**Zodat ik** goede inschattingen kan maken van mijn bezoekjes

**Gegeven** een eindgebruiker bevindt zich initieel op de thuis pagina en heeft hun locatiegegevens gedeeld via de initiële Geolocation API prompt
**Wanneer** er succesvol locatie gegevens gedeeld worden en wanneer de locatie resultaten initieel gezocht werden
**Dan** zullen we een wiskundige inschatting maken van hoe ver de eindgebruiker is van elke toilet locatie, in meters, en hoe lang het ongeveer zou duren om er te geraken te voet. Elke toilet locatie item krijgt deze informatie onder een eigenschap genaamd "distance" en "walk_time" respectievelijk
**Wanneer** al de inschattingen gemaakt zijn voor de toilet locaties
**Dan** zal de toilet locatie tabel geüpdatet worden om deze berekeningen te tonen, als er al resultaten getoond worden in de tabel


**Wanneer** er locatie resultaten terug gegeven worden via een zoekopdracht


>
**Gegeven** een eindgebruiker bevindt zich initieel op de thuis pagina en heeft hun locatiegegevens gedeeld via de initiële Geolocation API prompt
**Wanneer** de eindgebruiker op de knop “Zoek WC’s in mijn buurt” klikt
**Dan** zal de website gebruik maken van de beschikbare locatie gegevens indien deze beschikbaar/bruikbaar zijn
**Wanneer** er succesvol locatie gegevens opgehaald worden
**Dan** zal de website een nieuwe fetch uitvoeren naar de datasets
**Wanneer** er succesvol nieuwe toilet locatie gegevens opgehaald worden
**Dan** wordt er gebruik gemaakt van de gedeelde locatie om de relatieve afstand tussen de eindgebruiker en elke toilet locatie te berekenen. Voor elke locatie waarvoor er succesvol een afstand berekend kan worden zal er een staafdiagram verschijnen in de tabel van toilet staafdiagrammen. De tabel van toilet locaties zal verborgen worden



**Gegeven** een eindgebruiker bevindt zich op de thuis pagina en heeft hun locatiegegevens gedeeld door op de knop “Zoek WC’s in mijn buurt” te klikken
**Wanneer**
**Dan** zal de website een nieuwe fetch uitvoeren naar de datasets
**Wanneer** er succesvol nieuwe toilet locatie gegevens opgehaald worden
**Dan** wordt er gebruik gemaakt van de gedeelde locatie om de relatieve afstand tussen de eindgebruiker en elke toilet locatie te berekenen. Voor elke locatie waarvoor er succesvol een afstand berekend kan worden zal er een staafdiagram verschijnen in de tabel van toilet staafdiagrammen. De tabel van toilet locaties zal verborgen worden

___

**Als** eindgebruiker
**Wil ik** op een visuele manier weten hoe ver elke gegeven toilet locatie is van mijn huidige locatie
**Zodat ik** in één oogopslag inschattingen kan maken van mijn bezoekjes

**Gegeven** een eindgebruiker bevindt zich in de thuis pagina en heeft zijn locatie gedeeld met de website
**Wanneer** er locatie resultaten terug gegeven worden van een zoekterm/zoektocht en er succesvol de afstanden en wandeltijd van zijn berekend
**Dan** zullen we de tabel van toilet locaties verbergen en tonen we de tabel van toilet staafdiagrammen. Elke toilet locatie waarvoor er een afstand en wandeltijd zijn berekend zal een staafdiagram krijgen in de tabel van toilet staafdiagrammen

___

**Als** eindgebruiker
**Wil ik** een optie hebben "I'm feeling dangerous", deze optie zal ook honden-WC's en parken tonen als opties
**Zodat ik** extra opties kan verkennen...

**Gegeven** een eindgebruiker bevindt zich op de thuis pagina
**Wanneer** de eindgebruiker op de knop "I'm feeling dangerous" klikt
**Dan** zullen de zoekresultaten ook parken en honden-WC's omvatten

___

**Als** eindgebruiker
**Wil ik** kunnen kiezen tussen verschillende thema's waarin de website er uit ziet
**Zodat ik** de website kan bekijken in een meer vertrouwde weergave

**Gegeven** een eindgebruiker bevindt zich op een pagina en er is een knop om het thema de veranderen naar het tegengestelde van wat het nu is
**Wanneer** de eindgebruiker op de knop "Thema” klikt en het huidige thema is het donkere thema
**Dan** zal de huidige css regel `color-scheme` aangepast worden naar “light” en behouden we de nieuw gekozen thema in `localStorage` onder “userPreferences” \> “theme”
**Wanneer** de eindgebruiker op de knop "Thema” klikt en het huidige thema is het lichte thema
**Dan** zal de huidige css regel `color-scheme` aangepast worden naar “dark” en behouden we de nieuw gekozen thema in `localStorage` onder “userPreferences” \> “theme”

___

**Als** eindgebruiker
**Wil ik** een bepaalde locatie bijhouden als een favoriet
**Zodat ik** zonder al te veel te zoeken bepaalde locaties kan terug vinden

**Gegeven** een eindgebruiker bevindt zich op de thuis pagina en er zijn knoppen om bepaalde locaties te markeren als hun favoriet in de toilet locatie tabel
**Wanneer** de eindgebruiker klikt op één van de knoppen en de locatie wordt niet al bijhouden als een favoriet
**Dan** zal de knop waarop geklikt werd een klasse genaamd "favourited" krijgen, wordt de locatie toegevoegd aan de lijst favorieten in het zij-menu, en zal de locatie bijgehouden worden in `localStorage` onder “userPreferences” \> “locations” \> “favourites”
**Wanneer** de eindgebruiker klikt op één van de knoppen en de locatie wordt wel al bijhouden als een favoriet
**Dan** zal de knop waarop geklikt werd de klasse "favourited" verliezen, wordt de locatie verwijderd van de lijst favorieten in het zij-menu, en zal de locatie verwijderd worden van `localStorage` onder “userPreferences” \> “locations” \> “favourites”

<!-- ___

(Extra als we tijd hebben)
**Als** eindgebruiker
**Wil ik** op een kaart van Brussel alle publieke WC's en urinoirs zien.
**Zodat ik** gemakkelijk kan zien waar alle publieke WC's en urinoirs zich bevinden op een kaart van Brussel. -->
