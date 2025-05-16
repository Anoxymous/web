    var map;
    var mapLat = -33.829357;
		var mapLng = 150.961761;
    var mapDefaultZoom = 10;
    
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
      var vectorLayer = new ol.layer.Vector({
        source:new ol.source.Vector({
          features: [new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
            })]
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


function window_load()
{

        if (PeakFinder.utils.caniuse()) {

          let panel = new PeakFinder.PanoramaPanel({
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
}