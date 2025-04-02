let map;

function setStyle(/* FeatureStyleFunctionOptions */ params) {
  // Get the dataset feature, so we can work with all of its attributes.
  const datasetFeature = params.feature;

  return /* FeatureStyleOptions */ {
    fillColor: "silver",
    strokeColor: "#8b0000",
    pointRadius: 6,
  };
}

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const position = { lat: 50.85192384262128, lng: 4.352519260058613};
  const map = new Map(document.getElementsById('map'));

  // Add the data legend.
  makeLegend(map);

  // Dataset ID for squirrel dataset.
  const datasetId = "88a0bb0e-7dad-4af6-977a-295b0ca370b6";
  //@ts-ignore
  const datasetLayer = map.getDatasetFeatureLayer(datasetId);

  //@ts-ignore
  datasetLayer.style = setStyle;

  // Create an attribution DIV and add the attribution to the map.
  const attributionDiv = document.createElement("div");
  const attributionControl = createAttribution(map);

  attributionDiv.appendChild(attributionControl);
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(attributionDiv);
}

initMap();