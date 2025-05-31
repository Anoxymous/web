// window.addEventListener("load", function() { import_resources() } );

const import_ss_libs = ["lo", "ui", "om", "pf"];

const button_sets = [
	{ "set_id": "tab_buttons", "buttons": [
			{ "id": "show_peaks",        "icon": "img/icons/eye.svg",       "type": "action",  "value": "showTab('e')" },
			{ "id": "show_map",          "icon": "img/icons/map.svg",       "type": "action",  "value": "showTab('m')" },
			{ "id": "layout_toolbar",    "icon": "img/icons/layouts.svg",   "type": "toolbar", "value": "layout_buttons" },
			{ "id": "show_info",         "icon": "img/icons/info.svg",      "type": "action",  "value": "toggleTab('contents-info')" }
	] },
	{ "set_id": "control_buttons", "buttons": [
			{ "id": "control_loc",       "icon": "img/icons/loc-jump.svg",  "type": "action",  "value": "toggleTab('locations-form-holder')" },
			{ "id": "control_date",      "icon": "img/icons/date.svg",      "type": "action",  "value": "toggleTab('playback-form-holder')" },
			{ "id": "control_sun_rise",  "icon": "img/icons/sun-rise.svg",  "type": "action",  "value": "" },
			{ "id": "control_sun_set",   "icon": "img/icons/sun-set.svg",   "type": "action",  "value": "" },
			{ "id": "control_moon_rise", "icon": "img/icons/moon-rise.svg", "type": "action",  "value": "" },
			{ "id": "control_moon_set",  "icon": "img/icons/moon-set.svg",  "type": "action",  "value": "" }
	] },
	{ "set_id": "layout_buttons", "buttons": [
			{ "id": "layout_s",          "icon": "img/icons/layout_s.svg",  "type": "action",  "value": "toggleView('s')" },
			{ "id": "layout_v",          "icon": "img/icons/layout_v.svg",  "type": "action",  "value": "toggleView('v')" },
			{ "id": "layout_h",          "icon": "img/icons/layout_h.svg",  "type": "action",  "value": "toggleView('h')" }
	]}
];


function updateMapLocation(lat, lon, name)
{
	om_updateMapLocation(lat, lon, name)
	pf_setLocation(lat, lon, name)
	ui_updateLocationLookupsForm("location-form", lat, lon, name)
}

function updateTimeUTC(timeValue)
{
	const newTime = new Date(timeValue);
	
	const year   = newTime.getUTCFullYear(); // newTime.getFullYear(); // now.getUTCFullYear();
	const month  = newTime.getUTCMonth() + 1; // newTime.getMonth() + 1; // String(now.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
	const day    = newTime.getUTCDate(); // newTime.getDay(); // String(now.getUTCDate()).padStart(2, "0");
	const hour   = newTime.getUTCHours(); // newTime.getHours(); // String(now.getUTCHours()).padStart(2, "0");
	const minute = newTime.getUTCMinutes(); // newTime.getMinutes(); // String(now.getUTCMinutes()).padStart(2, "0");
	
//	console.log("Time changed:", timeValue);
  pf_setTime(year, month, day, hour, minute);
}

function main() 
{
	
	layouts_init();
	initialize_map();
	 
	pf_init();
	pf_setPosition(0, 0, 0, 3, 270, 1, 30);
	createLocationLookupForm("locations-form-holder", "location-form", "Jump to Location", updateMapLocation )
	createPlaybackForm("playback-form-holder", "playback-form", "Jump to Time", updateTimeUTC )
	updateMapLocation(-27.909281, 153.109104, 'Albert River')
//	updateTimeUTC(2026, 9, 26, 07, 30)
	
 }
 
