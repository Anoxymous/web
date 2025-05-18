window.addEventListener("load", function() { main() } );

function updateMapLocation(lat, lon, name)
{
	om_updateMapLocation(lat, lon, name)
	pf_setLocation(lat, lon, name)
}

function updateTimeUTC(lat, lon, name)
{
  pf_setTime(2026, 9, 26, 07, 30)
}

function main() 
{
   layouts_init();
   initialize_map();
   add_map_point(-33.8688, 151.2093); 
	 
	pf_init();
	pf_setPosition(0, 0, 0, 3, 270, 1, 30);
	
	updateMapLocation(-27.909281, 153.109104, 'Albert River')
	updateTimeUTC(2026, 9, 26, 07, 30)
	
	createLocationLookupForm("locations-form-holder", "location-form", "Jump to Location", updateMapLocation )
 }
 
