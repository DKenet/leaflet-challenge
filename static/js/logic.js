// Create a Leaflet map centered on a default location
var map = L.map('map').setView([0, 0], 2);

// Add the base map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Define a function to determine the color based on the depth of the earthquake
function getColor(depth) {    
    return depth > 90 ? '#FF5733' :   // question mark is a concise notation for if/else
           depth > 70  ? '#FFC300' :
           depth > 50  ? '#FFD700' :
           depth > 30  ? '#DAF7A6' :
           depth > 10   ? '#7FFF00' :
                          '#2E8B57';
}

// Fetch earthquake data from USGS GeoJSON feed
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        // Loop through each earthquake feature and add a circle marker to the map
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates;
            var mag = feature.properties.mag;
            var depth = coords[2];
            var place = feature.properties.place;

            // Create a circle marker with varying radius and color based on magnitude and depth
            L.circleMarker([coords[1], coords[0]], {
                radius: mag * 3,
                color: getColor(depth),
                fillColor: getColor(depth),
                fillOpacity: 0.8
            })
            .addTo(map)
            // Add a popup with information about the earthquake
            .bindPopup(`<b>${place}</b><br>Magnitude: ${mag}<br>Depth: ${depth} km`);
        });

        // Create a legend
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                depths = [0, 10, 30, 50, 70, 90]
                

            // loop through our depth intervals and generate a label with a colored square for each interval
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i class="legendbox" style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
            }
            return div;
        };

        legend.addTo(map);
    })
    .catch(error => {
        console.error('Error fetching earthquake data:', error);
    });