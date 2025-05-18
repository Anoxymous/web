// Consts

// Globals
var isResizing_v = false;
var isResizing_h = false;

var setting_view_type = "s"
var setting_current_tab = "e"
var setting_info_tab = 0

// Elements
var div_float_s = document.getElementById("float-container-s");
var div_float_v = document.getElementById("float-container-v");
var div_float_h = document.getElementById("float-container-h");
var resizer_v = document.getElementById("div-dock-resizer-v");
var topDiv = document.getElementById("div-dock-top");
var bottomDiv = document.getElementById("div-dock-bottom");
var resizer_h = document.getElementById("div-dock-resizer-h");
var leftDiv = document.getElementById("div-dock-left");
var rightDiv = document.getElementById("div-dock-right");
var div_map = document.getElementById("contents-map");
var div_eye = document.getElementById("contents-eye");
var div_info = document.getElementById("contents-info");

function layouts_init()
{
	resizer_v.addEventListener("mousedown", startDragV);
	document.addEventListener("mouseup", endDrag);
	resizer_v.addEventListener("touchstart", startDragV);
	document.addEventListener("touchend", endDrag);

	resizer_h.addEventListener("mousedown", startDragH);
	resizer_h.addEventListener("touchstart", startDragH);

	document.addEventListener("mousemove", resizeDivs);
	document.addEventListener("touchmove", resizeDivs);
	configureView();
}

function startDragV(event) {
    isResizing_v = true;
}

function startDragH(event) {
    isResizing_h = true;
}

function endDrag() {
    isResizing_v = false;
    isResizing_h = false;
		configureView();
}

function resizeDivs(event) {
	var e = event.type.includes("touch") ? event.touches[0] : event;
	
	if (isResizing_v)
	{
		var newHeight = e.clientY;
		var bottomHeight = (bottomDiv.parentElement.offsetHeight - newHeight) - 10;
		topDiv.style.height = `${newHeight}px`;
		bottomDiv.style.height =  `${bottomHeight}px`;
		bottomDiv.style.flex = "1"; // Ensures the bottom div fills remaining space
	}
	else if(isResizing_h)
	{
		var newWidth = e.clientX;
		leftDiv.style.width = `${newWidth}px`;
		rightDiv.style.flex = "1"; // Ensures the bottom div fills remaining space
	}
}
				
function toggleToolbar() {
		var toolbar = event.target.querySelector(".pop-out-toolbar-up");
		if(toolbar != null)
		{
			toolbar.style.display = (toolbar.style.display === "none" || toolbar.style.display === "") ? "flex" : "none";
		}
}

function toggleView(view_type)
{
		setting_view_type = view_type
		configureView()
}

function showTab(tab)
{
		setting_current_tab = tab
		configureView()
}

function toggleTab(i)
{
		setting_info_tab = (setting_info_tab == 1) ? 0 : 1;
		configureView()
}
				
function configureView()
{
		div_float_s.style.display = (setting_view_type == "s") ? "flex" : "none";
		div_float_v.style.display = (setting_view_type == "v") ? "flex" : "none";
		div_float_h.style.display = (setting_view_type == "h") ? "flex" : "none";
		div_info.style.display = (setting_info_tab) ? "flex" : "none";
		
	
			if(setting_view_type == "s")
			{
					div_float_s.appendChild(div_map)
					div_float_s.appendChild(div_eye)

					div_map.style.display = (setting_current_tab == "m") ? "flex" : "none";
					div_eye.style.display = (setting_current_tab == "e") ? "flex" : "none";
			}
			else if(setting_view_type == "v")
			{
				if(setting_current_tab == "m")
				{
					topDiv.appendChild(div_map)
					bottomDiv.appendChild(div_eye)
				}
				else
				{
					topDiv.appendChild(div_eye)
					bottomDiv.appendChild(div_map)
				}
				
				div_map.style.display = "flex"
				div_eye.style.display = "flex"
			}
			else if(setting_view_type == "h")
			{
				if(setting_current_tab == "m")
				{
					leftDiv.appendChild(div_map)
					rightDiv.appendChild(div_eye)
				}
				else
				{
					leftDiv.appendChild(div_eye)
					rightDiv.appendChild(div_map)
				}
				
				div_map.style.display = "flex"
				div_eye.style.display = "flex"
			}
		resizeCanvas()
}

  

				
function resizeCanvas()
{
	window.dispatchEvent(new Event('resize'));
	/*
requestAnimationFrame(() => {
    document.body.style.display = "none";
    requestAnimationFrame(() => {
        document.body.style.display = "block";
    });
});
*/
}
