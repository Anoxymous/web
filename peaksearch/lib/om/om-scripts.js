	var map;
    var mapLat = -33.829357;
		var mapLng = 150.961761;
    var mapDefaultZoom = 12;
		var pointFeature;
    var panel;
    
  
    function initialize_map() {
      map = new ol.Map({
        target: "map",
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                      url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([mapLng, mapLat]),
            zoom: mapDefaultZoom
        })
      });
			add_map_point(mapLat, mapLng)
    }

    function add_map_point(lat, lng) {
			
			pointFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
            })
      var vectorLayer = new ol.layer.Vector({
        source:new ol.source.Vector({
          features: [pointFeature]
        }),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
          })
        })
      });

      map.addLayer(vectorLayer); 
    }

function om_updateMapLocation(lat, lon, name)
 {
    var view = map.getView();
    var newCoords = ol.proj.fromLonLat([lon, lat]); // Convert lat/lon to map projection
		var newCoords2 = ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857');
		pointFeature.getGeometry().setCoordinates(newCoords2);
    view.setCenter(newCoords2);
}