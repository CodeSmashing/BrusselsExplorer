---

Als eindgebruiker  
Wil ik via de website de dichtstbijzijnde publieke WC’s of urinoirs in en rond mijn locatie vinden.  
Zodat ik met gemak een toilet kan vinden als ik het dringend nodig heb.

**Given** een eindgebruiker bevindt zich in de homepagina  
**When** de eindgebruiker initieel de website in laadt  
**Then** zal er een prompt verschijnen via de Geolocation API van HTML5 om te vragen dat deze zijn locatie zal delen met de website  
**When** de eindgebruiker op de knop “Deel mijn locatie” klikt en dus akkoord gaat met het delen van zijn locatie  
**Then** zal de website gebruik maken van de gedeelde locatie gegevens indien deze beschikbaar/bruikbaar zijn en zullen deze bijgehouden worden in de lokale browser opslag onder “userPreferences” \> “currentLocation”  
**When** de eindgebruiker de knop “Deel mijn locatie” of anderzijds de prompt negeert  
**Then** zal de website geen gebruik maken van de locatie van de eindgebruiker en deze dus ook niet bijhouden

**Given** een eindgebruiker bevindt zich in de homepagina en heeft de initiële Geolocation API prompt genegeerd  
**When** de eindgebruiker op de knop “Zoek WC’s in mijn buurt” klikt  
**Then** zal er een prompt verschijnen via de Geolocation API van HTML5 om te vragen dat deze zijn locatie zal delen met de website  
**When** de eindgebruiker op de knop “Deel mijn locatie” klikt en dus akkoord gaat met het delen van zijn locatie  
**Then** zal de website gebruik maken van de gedeelde locatie gegevens indien deze beschikbaar/bruikbaar zijn en zullen deze bijgehouden worden in de lokale browser opslag onder “userPreferences” \> “currentLocation”  
**When** er succesvol locatie gegevens opgehaald worden  
**Then** zal de website een fetch uitvoeren naar de datasets om dan gebruik te maken van de gedeelde locatie om de relatieve afstand tussen de eindgebruiker en elke toilet locatie te berekenen. Voor elke locatie waarvoor er succesvol een afstand berekend kon worden zal er een bar chart verschijnen in een tabel boven de zoekresultaten tabel  
**When** de eindgebruiker de knop “Deel mijn locatie” of anderzijds de prompt negeert  
**Then** zal de website geen gebruik maken van de locatie van de eindgebruiker om de relatieve afstand tussen de eindgebruiker en al de locaties te berekenen en zullen dus ook geen bar charts aangemaakt worden

**Given** een eindgebruiker bevindt zich in de homepagina en deelt hun locatiegegevens via de initiële Geolocation API prompt  
**When** er geldige locatiegegevens meegedeeld zijn  
**Then** zal de website gebruik maken van de gedeelde locatie gegevens indien deze beschikbaar/bruikbaar zijn en zullen deze bijgehouden worden in de lokale browser opslag onder “userPreferences” \> “location” \> “current”

**Given** een eindgebruiker bevindt zich in de homepagina en heeft hun locatiegegevens gedeeld via de initiële Geolocation API prompt  
**When** de eindgebruiker op de knop “Zoek WC’s in mijn buurt” klikt  
**Then** zal de website gebruik maken van de beschikbare locatie gegevens indien deze beschikbaar/bruikbaar zijn  
**When** er succesvol locatie gegevens opgehaald worden  
**Then** zal de website een fetch uitvoeren naar de datasets om dan gebruik te maken van de gedeelde locatie om de relatieve afstand tussen de eindgebruiker en elke toilet locatie te berekenen. Voor elke locatie waarvoor er succesvol een afstand berekend kon worden zal er een bar chart verschijnen in een tabel boven de zoekresultaten tabel  
**When** de eindgebruiker de knop “Deel mijn locatie” of anderzijds de prompt negeert  
**Then** zal de website geen gebruik maken van de locatie van de eindgebruiker om de relatieve afstand tussen de eindgebruiker en al de locaties te berekenen en zullen dus ook geen bar charts aangemaakt worden

**Given** een eindgebruiker bevindt zich in de homepagina en geeft niet hun locatie mee via de initiële Geolocation prompt of door op de knop “Zoek WC’s in mijn buurt” te klikken  
**When** de eindgebruiker in de zoekbalk een zoekterm invoert en voor ongeveer 2 seconden geen verdere inputs geeft of knoppen aanklikt  
**Then** zal er gezocht worden naar al de toilet locaties met een locatienaam die deels overeenkomt met de ingegeven zoekterm. Er zal een lijst terug gegeven worden met al de locaties  
**When** we een lijst krijgen van overeenkomende locaties  
**Then** zal er een dropdown verschijnen onder de zoekbalk met de zoekresultaten als opties om op te klikken  
**When** de eindgebruiker op een locatie klikt van het dropdown menu  
**Then** zal de eindgebruiker gebracht worden (we scrollen de pagina voor hen) naar de Google Maps map en zal er een cirkel verschijnen op de Google Maps map op de gekozen plaats met een diameter van 1-5 km.  
Al de overige locaties die gevonden waren zullen zichtbaar zijn in een tabel onder de Google Maps map  
**When** de eindgebruiker klikt op een tabel item  
**Then** zal de eindgebruiker gebracht worden naar de Google Maps map en zal er een cirkel verschijnen op de Google Maps map op de gekozen plaats met een diameter van 1-5 km  
**When** de eindgebruiker een zoekterm heeft ingetypt en op de enter toets drukt  
**Then** zal er gezocht worden naar al de toilet locaties met een locatienaam die minstens deels overeenkomt met de ingegeven zoekterm. Er zal een lijst terug gegeven worden met al de locaties  
**When** we een lijst krijgen van overeenkomende locaties  
**Then** zal er gebruikgemaakt worden van de meest overeenkomende optie van het dropdown menu, zal de eindgebruiker worden gebracht naar de Google Maps map en er zal een cirkel verschijnen op de Google Maps map op de gekozen locatie met een diameter van 1-5 km.  
Al de overige locaties die gevonden waren zullen zichtbaar zijn in een tabel onder de Google Maps map  
**When** de eindgebruiker een plaats heeft ingetypt en op de enter toets drukt, en er zijn geen overeenkomstige opties meegegeven  
**Then** zal de zoekbalk rood worden met een error CSS klasse om aan de eindgebruiker te laten weten dat er niets gevonden is in verband met zijn zoekterm

---

Als eindgebruiker  
Wil ik de taal van de website kunnen veranderen van het Nederlands naar het Frans en vice versa.  
Zodat ik de website kan begrijpen in een taal die ik beheers.

**Given** een eindgebruiker bevindt zich in de homepagina en er is een knop om de pagina te vertalen naar het Nederlands en een knop om te vertalen naar het Frans  
**When** de eindgebruiker op de knop om te vertalen naar het Nederlands klikt  
**Then** wordt de gekozen taaloptie bijgehouden in de locale opslag voor toekomstige referentie en zal de gehele website voortaan in het Nederlands staan tot er anders aangetoond wordt  
**When** de eindgebruiker op de knop om te vertalen naar het Frans klikt  
**Then** wordt de gekozen taaloptie bijgehouden in de locale opslag voor toekomstige referentie en zal de gehele website voortaan in het Frans staan tot er anders aangetoond wordt

---

Als eindgebruiker  
Wil ik dat mijn voorkeuren worden opgeslagen (thema, locatie, favorieten, taal, …) en dat deze worden toegepast telkens als ik de website bezoek  
Zodat ik niet alles opnieuw moet aanpassen als ik de website verlaat.

**Given** een eindgebruiker bevindt zich initieel op de website  
**When** er gebruikersdata te vinden is in de lokale session data  
**Then** zullen de voorkeuren bewaard in de lokale opslag toegepast worden op de website (thema, locatie, favorieten, taal, …)

**Given** een eindgebruiker bevindt zich op de homepagina en er is een knop om de pagina te vertalen naar het Nederlands en een knop om te vertalen naar het Frans  
**When** de eindgebruiker op de knop om te vertalen naar het Nederlands klikt  
**Then** zal de gehele website voortaan in het Nederlands staan tot er anders aangetoond wordt en wordt de gekozen taaloptie bijgehouden in de locale opslag voor toekomstige referentie onder “userPreferences” \> “language”  
**When** de eindgebruiker op de knop om te vertalen naar het Frans klikt  
**Then** zal de gehele website voortaan in het Frans staan tot er anders aangetoond wordt en wordt de gekozen taaloptie bijgehouden in de locale opslag voor toekomstige referentie onder “userPreferences” \> “language”

**Given** een eindgebruiker bevindt zich op de homepagina en er is een knop om het thema de veranderen naar het tegengestelde van wat het nu is  
**When** de eindgebruiker op de knop “Verander mijn thema” klikt en het huidige thema is het donkere thema  
**Then** zal de huidige css regel “color-scheme” aangepast worden naar “light” en behouden we de nieuw gekozen thema in de lokale browser opslag on “userPreferences” \> “theme”  
**When** de eindgebruiker op de knop “Verander mijn thema” klikt en het huidige thema is het lichte thema  
**Then** zal de huidige css regel “color-scheme” aangepast worden naar “dark” en behouden we de nieuw gekozen thema in de lokale browser opslag on “userPreferences” \> “theme”

**Given** een eindgebruiker bevindt zich in de homepagina en er zijn knoppen om bepaalde locaties te markeren als hun favoriet  
**When** de eindgebruiker klikt op één van de knoppen en de locatie wordt niet al bijhouden als een favoriet  
**Then** zal de achtergrondkleur van de knop opgevuld worden en zal de locatie bijgehouden worden in de lokale browser opslag onder “userPreferences” \> “locations” \> “favourites”.  
De locatie wordt dan ook toegevoegd aan de lijst favorieten in het zijmenu  
**When** de eindgebruiker klikt op één van de knoppen en de locatie wordt wel al bijhouden als een favoriet  
**Then** zal de achtergrondkleur van de knop leeg worden en zal de locatie verwijderd worden van de lokale browser opslag onder “userPreferences” \> “locations” \> “favourites”.  
De locatie wordt dan ook verwijderd van de lijst favorieten in het zijmenu

---

Als eindgebruiker  
Wil ik weten hoe ver elke gegeven locatie is van mijn huidige locatie en hoe lang ik er ongeveer over moet doen om er te geraken (te voet)  
Zodat ik goede inschattingen kan maken van mijn bezoekjes

**Given** een eindgebruiker bevindt zich op de homepagina en heeft zijn locatie gedeeld met de website  
**When** er locatie resultaten terug gegeven worden van een zoekterm/zoektocht  
**Then** zullen we een wiskundige inschatting maken van hoe ver de locatie is van de eindgebruiker en hoe lang het ongeveer zou duren om er te geraken (te voet) en voegen we deze informatie toe aan elke locatie tabel item.  
Hiervoor voegen we dan ook een “afstand” en “tijd” header toe aan de locatie tabel

---

Als eindgebruiker  
Wil ik op een visuele manier weten hoe ver elke gegeven locatie is van mijn huidige locatie en hoe lang ik er ongeveer over moet doen om er te geraken  
Zodat ik in één oogopslag inschattingen kan maken van mijn bezoekjes

**Given** een eindgebruiker bevindt zich op de homepagina en heeft zijn locatie gedeeld met de website  
**When** er locatie resultaten terug gegeven worden van een zoekterm/zoektocht  
**Then** zullen we een wiskundige inschatting maken van hoe ver de locatie is van de eindgebruiker en vertonen we deze informatie in een zijwaartse staafdiagram boven de locatie tabel

---

(toestemming vragen van leerkracht)  
Als eindgebruiker   
Wil ik een optie hebben ‘im feeling dangerous’, deze optie zal ook honden-WC's en parken tonen als opties.  
Zodat ik goed kan lachen..

**Given** een eindgebruiker bevindt zich op de homepagina  
**When** de eindgebruiker klikt op de ‘im feeling dangerous’-knop.  
**Then** zullen al de zoekopdrachten ook parken- en honden-WC's mee in de zoekresultaten bevinden  
**Then** krijgt de eindgebruiker de dichtstbijzijnde WC’s, parken, of honden-WC’s te zien.

---

(Extra als we tijd hebben)  
Als eindgebruiker  
Wil ik op een kaart van Brussel alle publieke WC's en urinoirs zien.  
Omdat dit handig is.

---

