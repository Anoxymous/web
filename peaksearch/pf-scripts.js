
// Consts
var pf_dps = 15;
var pf_mps = 10;

// Globals
var pf_ready = 0;
var pf_next_az;
var pf_next_al;
var pf_next_el;
var pf_next_fov;
var pf_next_lat = 0;
var pf_next_lon = 0;
var pf_next_loc = "no location"

// DOM Elements
var pf_panel;
var pfCanv;

function pf_setLocation(lat, lon, loc)
{
	pf_setPosition(lat, lon, loc, pf_panel.elevationOffset(), pf_panel.azimut(), pf_panel.altitude(), pf_panel.fieldofview());
}

function pf_setPosition(lat, lon, loc, el, az, al, fov)
{
	pf_next_az = az;
	pf_next_al = al;
	pf_next_el = el;
	pf_next_fov = fov;
	pf_next_lat = lat;
	pf_next_lon = lon;
	pf_next_loc = loc;
	if(pf_ready)
	{
		pf_panel.loadViewpoint(pf_next_lat, pf_next_lon, pf_next_loc)
	}
}

function pf_setTime(y, m, d, h, min)
{
	// TODO - set this
	if(pf_ready)
	{
		pf_panel.astro.currentDateTime(y, m, d, h, min);
	}
}

function pf_init()
{
	// Find the DIV
	var pfDiv = document.getElementById("pf_canvas_holder");
	pfDiv.className = "pfcontent";
	
	// Add the canvas element and loading spinners
	pfCanv = document.createElement("canvas");
	pfCanv.setAttribute("id", "pfcanvas");
	pfCanv.className = "pfcanvas";
	pfCanv.setAttribute("oncontextmenu", "event.preventDefault()");
	pfDiv.appendChild(pfCanv);
	
	var pfProg = document.createElement("div");
	pfProg.setAttribute("id", "pfcanvasprogress");
	pfDiv.appendChild(pfProg);
	
	var pfSpinner = document.createElement("div");
	pfSpinner.setAttribute("id", "pfspinner")
	pfSpinner.className = "pfspinner";
	pfProg.appendChild(pfSpinner);
	
	var b1 = document.createElement("div");
	var b2 = document.createElement("div");
	var b3 = document.createElement("div");
	b1.className = "bounce1"
	b2.className = "bounce2"
	b3.className = "bounce3"
	pfSpinner.appendChild(b1);
	pfSpinner.appendChild(b2);
	pfSpinner.appendChild(b3);
	
	// Initialise the Canvas
	if (PeakFinder.utils.caniuse()) {
		pf_panel = new PeakFinder.PanoramaPanel({
			canvasid: 'pfcanvas', 
			locale: 'en'
		}) // attach to canvas

		pf_panel.init(function() {
			pf_init_panel_settings();
		})
		
	}
}

function pf_init_panel_settings()
{
	pf_panel.settings.distanceUnit(0)
	pf_panel.settings.showMoon(1)
	pf_panel.settings.theme(1)
	pf_panel.addEventListener('viewpointjourney finished', async function(vp) {pf_animateCallback(vp) } )
	
	pf_panel.loadViewpoint(pf_next_lat, pf_next_lon, pf_next_loc)
	pf_ready = 1
}

function pf_animateCallback(vp) 
{
//	console.log(`viewpoint ready ${vp}`)
	
	// animate to view
	var speed_az = pf_next_az / pf_dps;
	var speed_al = pf_next_al / pf_dps
	var speed_fov = pf_next_fov / pf_dps
	var speed_el = pf_next_el / pf_mps
	pf_panel.azimut(pf_next_az, speed_az)
	pf_panel.altitude(pf_next_al, speed_al)
	pf_panel.elevationOffset(pf_next_el, speed_el)
	pf_panel.fieldofview(pf_next_fov, speed_fov)
}

function pf_resize()
{
	window.dispatchEvent(new Event('resize'));
//	$(window).trigger('resize');
	if(pfCanv != null)
	{
//		pf_panel.apply()
//		pf_panel.init()
		
//		pf_panel.trigger('resize');
//		pfCanv.width = pfCanv.parentElement.clientWidth; // Match parent width
//		pfCanv.height = pfCanv.parentElement.clientHeight; // Match parent height
		
//		var gl = pfCanv.getContext("webgl2");
//		gl.viewport(0, 0, pfCanv.parentElement.clientWidth, pfCanv.parentElement.clientHeight);
//		pf_panel.fieldofview(pf_next_fov, 0)
	}
}