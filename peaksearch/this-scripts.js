window.onload = function() { main();};

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
//   map_search_init()
	 
	pf_init();
	
	updateMapLocation(-27.909281, 153.109104, 'Albert River')
	updateTimeUTC(2026, 9, 26, 07, 30)
 }