    var map;
    var mapLat = -33.829357;
		var mapLng = 150.961761;
    var mapDefaultZoom = 10;
		var pointFeature;
    var panel;
		
		function showTab(tabId) {
            var tabs = document.getElementsByClassName('tab-content');
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('active');
            }
            document.getElementById(tabId).classList.add('active');
						 map.updateSize();
        }
				
				
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

function updateMapLocation(lat, lon, name)
 {
    var view = map.getView();
    var newCoords = ol.proj.fromLonLat([lon, lat]); // Convert lat/lon to map projection
    view.setCenter(newCoords);
    view.setZoom(12); // Adjust zoom level if needed
		
		var newCoords = ol.proj.fromLonLat([lon, lat]); // Convert lat/lon to map projection
    pointFeature.getGeometry().setCoordinates(newCoords);
		
		panel.loadViewpoint(lat, lon, 'Albert River')
}

function window_load()
{

        if (PeakFinder.utils.caniuse()) {

        panel = new PeakFinder.PanoramaPanel({
            canvasid: 'pfcanvas', 
            locale: 'en'
          }) // attach to canvas
         
          panel.addEventListener('viewpointjourney finished', function (args) {
            console.log('viewpointjourney finished' + args)
          })

          panel.init(function() {
            console.log('ready')
            panel.settings.distanceUnit(0)
						panel.settings.showMoon(1)
						panel.astro.currentDateTime(2026, 9, 26, 07, 30)
						panel.settings.theme(1)
						
            panel.loadViewpoint(-27.909281, 153.109104, 'Albert River')

            panel.addEventListener('viewpointjourney finished', async function(vp) {
                console.log(`viewpoint ready ${vp}`)
          
                // animate to view
                panel.altitude(1.0, 1.0)
								panel.elevationOffset(3, 1.0)
                panel.fieldofview(45.0, 2.0)
                panel.azimut(270, 5.0)

								
								
            })
          })
        }
        else { // !caniuse
        
        }
				
				
						        $("#searchInput").on("input", function() {
            var query = $(this).val();
            if (query.length < 3) {
                $("#autocompleteList").hide();
                return;
            }

            $.getJSON(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`, function(data) {
                var list = $("#autocompleteList");
                list.empty();
                if (data.length > 0) {
                    list.show();
                    data.forEach(function(item) {
                        list.append(`<div class="autocomplete-item" data-lat="${item.lat}" data-lon="${item.lon}">${item.display_name}</div>`);
                    });
                } else {
                    list.hide();
                }
            });
        });

        $(document).on("click", ".autocomplete-item", function() {
            var lat = $(this).data("lat");
            var lon = $(this).data("lon");
            $("#latInput").val(lat);
            $("#lonInput").val(lon);
            $("#autocompleteList").hide();
						updateMapLocation(lat, lon)
        });
				
}

				function handleLocationChange() {
            var lat = document.getElementById("latInput").value;
            var lon = document.getElementById("lonInput").value;

						updateMapLocation(lat, lon)
        }
				
        function toggleSearch() {
            var searchBox = document.getElementById("searchBox");
            searchBox.style.display = searchBox.style.display === "none" ? "block" : "none";
        }
