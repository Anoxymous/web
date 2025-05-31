// General UI Functions
const ui_base_dir = (typeof ss_base_dir !== 'undefined') ? ss_base_dir : "";

function ui_new_button(id, img_url, clickFunction)
{
		var button_div = document.createElement("div");
		button_div.setAttribute("id",  id);
		button_div.className = "bar-button";
		button_div.onclick = clickFunction;
		button_div.style="background-image: url('" + img_url + "');"
		return button_div;
}

//	<input type="date" id="date">
function ui_new_input_datetime(id)
{
	var date_input = document.createElement("input");
	date_input.type="datetime-local"
	date_input.step="1"
	date_input.setAttribute("id", id);
	return date_input;
}

function ui_new_label(id, label_text)
{
	var label = document.createElement("p");
	label.setAttribute("id",  id);
	label.className = "ui-label";
	label.textContent = label_text
	return label;
}

// Location Functions //
// TODO make an array based on id
let ui_controller;
let ui_timeout;

async function fetchLocations(query, signal)
{
//	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
const url = `https://photon.komoot.io/api/?q=${query}&limit=5`

	try {
		const response = await fetch(url, { signal });
		if (!response.ok) {
			throw new Error("Network error");
		}
		return response.json();
	}
	catch (error) {
		if (error.name === "AbortError") {
			 console.log("Request aborted due to new input.");
			}
			else {
				console.error("Fetch error:", error);
			}
		return [];
	}
}

async function autocompleteLocation(input, suggestionBox)
{
	if (ui_controller){ ui_controller.abort(); } // Abort previous querys
	ui_controller = new AbortController();
	const signal = ui_controller.signal;

	var query = input.value;
	if (query.length < 3)
	{
		suggestionBox.innerHTML = "";
		suggestionBox.style.display = "none";
	}
	else
	{
		// Re-position and display
		input.parentElement.appendChild(suggestionBox);
		var y_pos = input.offsetTop + input.getBoundingClientRect().height
		suggestionBox.style.top = y_pos +'px';
		suggestionBox.style.display = "block";

		suggestionBox.innerHTML = ""; // clear any previous
		var loading_div = document.createElement("div");
		loading_div.className = "ui_suggestion-loading";
		loading_div.innerText = "Loading...";
		suggestionBox.appendChild(loading_div);
		
		const locations = await fetchLocations(query);
		
		if (signal.aborted) 
		{
			return;
		}

		if(locations.features.length > 0)
		{
			suggestionBox.innerHTML = "";

			locations.features.forEach((loc) => {
				// TODO if all are undefined, it shouldn't remove the loading div and provide no suggestions found text
				if(typeof loc.properties.name !== "undefined" )
				{
					const div = document.createElement("div");
					div.className = "suggestion-item";
					div.innerHTML = "<b>" + loc.properties.name + "</b> " + ( loc.properties.city || "") + " " + ( loc.properties.county || "" ) + " " + ( loc.properties.state || "") + " " + (loc.properties.country || " [" + ( loc.properties.osm_value || "" ) + "]");
					div.onclick = () => {
						input.value = loc.properties.name;
						suggestionBox.style.display = "none";
						// TODO pass these in
						document.getElementById("latitude").value = loc.geometry.coordinates[1].toFixed(7);
						document.getElementById("longitude").value = loc.geometry.coordinates[0].toFixed(7);
						suggestionBox.innerHTML = "";
						suggestionBox.style.display = "none";
					}
					suggestionBox.appendChild(div);
				}
			} );
		}
		else
		{
			loading_div.innerText = "No suggestions found.";
		}
	}
}

function setupAutocomplete(input)
{
	if(input != null)
	{
		var id = input.getAttribute("id")
		const suggestionBox = document.createElement("div");
		suggestionBox.setAttribute("id",  id + "_ui_suggestions");
		suggestionBox.className = "ui_suggestions";

		input.addEventListener("input", () => {
				clearTimeout(ui_timeout); // Reset the timer on each new input
				ui_timeout = setTimeout(() => {
					autocompleteLocation(input, suggestionBox)
					}, 600); // Delay for 500ms
		} );

		// Focus change? because tab leaves it displayed too
		document.addEventListener("click", (event) => {
			if (!input.contains(event.target) && !suggestionBox.contains(event.target)) {
				suggestionBox.style.display = "none";
				}
		});
	}
}

function updateIndicators() {
						
            const lat = parseFloat(document.getElementById("latitude").value) || 0;
            const lon = parseFloat(document.getElementById("longitude").value) || 0;

            document.getElementById("lat-indicator").innerText = lat >= 0 ? "N" : "S";
            document.getElementById("lon-indicator").innerText = lon >= 0 ? "E" : "W";
        }

function createLocationLookupForm(parentId, id, title, callback)
{
	var parentDiv = document.getElementById(parentId);
	if(parentDiv != null)
	{
		var new_div = document.createElement("div");
		new_div.setAttribute("id",  id);
		new_div.className = "ui_form";
		parentDiv.appendChild(new_div);

		var eTitle = document.createElement("h2");
		eTitle.innerHTML = title;
		new_div.appendChild(eTitle);
		
		var eForm = document.createElement("form");
		eForm.addEventListener("submit", (event) => {
			event.preventDefault(); // Prevent actual form submission
			var formElements = event.target.elements;
			var loc = formElements["location"].value;
			var lat = formElements["latitude"].value;
			var lon = formElements["longitude"].value;
			callback(lat, lon, loc); // Pass data to the callback function
		});
		new_div.appendChild(eForm);

		var eInputLoc = document.createElement("input");
		eInputLoc.type = "text";
		eInputLoc.name = "location";
		eInputLoc.setAttribute("id", "location");
		eInputLoc.setAttribute("placeholder", "Enter Name...");
		eForm.appendChild(eInputLoc);
		
		var eDivLat = document.createElement("div");
		eDivLat.className = "input-group";
		eForm.appendChild(eDivLat);

		var eInputLat = document.createElement("input");
		eInputLat.type = "number";
		eInputLat.name = "latitude";
		eInputLat.setAttribute("id", "latitude");
		eInputLat.setAttribute("placeholder", "Latitude (-90 to 90)");
		eInputLat.setAttribute("min", "-90");
		eInputLat.setAttribute("max", "90");
		eInputLat.setAttribute("step", "0.0000001");
		eInputLat.addEventListener("input", (event) => { updateIndicators() } );
		eDivLat.appendChild(eInputLat);

		var eSpanLat = document.createElement("span");
		eSpanLat.className = "indicator";
		eSpanLat.setAttribute("id", "lat-indicator");
		eSpanLat.innerText = "N/S"
		eDivLat.appendChild(eSpanLat);

		var eDivLon = document.createElement("div");
		eDivLon.className = "input-group";
		eForm.appendChild(eDivLon);
		
		var eInputLon = document.createElement("input");
		eInputLon.type = "number";
		eInputLon.name = "longitude";
		eInputLon.setAttribute("id", "longitude");
		eInputLon.setAttribute("placeholder", "Longitude (-180 to 180)");
		eInputLon.setAttribute("min", "-180");
		eInputLon.setAttribute("max", "180");
		eInputLon.setAttribute("step", "0.0000001");
		eInputLon.addEventListener("input", (event) => { updateIndicators() } );
		eDivLon.appendChild(eInputLon);
		
		var eSpanLon = document.createElement("span");
		eSpanLon.className = "indicator";
		eSpanLon.setAttribute("id", "lon-indicator");
		eSpanLon.innerText = "E/W"
		eDivLon.appendChild(eSpanLon);
		
		var eSubmit = document.createElement("button");
		eSubmit.type = "submit"
		eSubmit.className = "submit-button";
		eSubmit.innerText = "Go"
		eForm.appendChild(eSubmit);
		
		setupAutocomplete(eInputLoc);
	}
}


function ui_updateLocationLookupsForm(id, lat, lon, loc)
{
	var lookupDiv = document.getElementById(id);
	if(lookupDiv)
	{
		// Locate the form inside the parent
		var formElement = lookupDiv.querySelector("form");
		if (formElement)
		{
			// Find the input field inside the form and update its value
			var locInputField = formElement.querySelector("input[name='location']");
			if (locInputField)
			{
				locInputField.value = loc;
			}
			
			var latInputField = formElement.querySelector("input[name='latitude']");
			if (latInputField)
			{
				latInputField.value = lat;
			}
			
			var lonInputField = formElement.querySelector("input[name='longitude']");
			if (lonInputField)
			{
				lonInputField.value = lon;
			}
		}
	}
}


// Timer Functions //
const playbackSpeeds = [ "-1 year", "-1 month", "-1 week", "-1 day", "-1 hr", "-10 mins", "-1 min", "-1 sec", "+1 sec", "+1 min", "+10 mins", "+1 hr", "+1 day", "+1 week", "+1 month", "+1 year"];
let playbackTimerlaybackTimer;
const playbackData = new Map();

class playbackDataForm {
	// Variables
	speedIndex = 8;
	timeChangedCallbacks = [];
	playing = false;
	
	// Elements
	timeInput;
	btnTimeShift;
	btnNow;
	btnPlay;
	btnPause;
	btnFF;
	btnRR;
	lblSpeed;
	
  constructor(id)
	{
		this.timeInput = ui_new_input_datetime(id + "_input_date" )
		this.btnTimeShift = ui_new_button(id + "_input_shift", ui_base_dir + "img/icons/time-shift.svg", () => triggerTimeChanged(id) );
		this.btnNow = ui_new_button(id + "_input_now", ui_base_dir + "img/icons/now.svg", () => setCurrentTime(id) );
		this.btnPlay = ui_new_button(id + "_input_play", ui_base_dir + "img/icons/playback-play.svg", () => startPlayback(id) );
		this.btnPause = ui_new_button(id + "_input_pause", ui_base_dir + "img/icons/playback-pause.svg", () => pausePlayback(id) );
		this.btnFF = ui_new_button(id + "_input_ff", ui_base_dir + "img/icons/playback-ff.svg", () => adjustPlaybackSpeed(id, 1) );
		this.btnRR = ui_new_button(id + "_input_rr", ui_base_dir + "img/icons/playback-rr.svg", () => adjustPlaybackSpeed(id, -1) );
		this.lblSpeed = ui_new_label(id + "_speed_value", "n/a" );
  }
}

function registerTimeChangedCallback(timer_id, callback)
{
	if(playbackData.has(timer_id))
	{
		playbackData.get(timer_id).timeChangedCallbacks.push(callback);
	}
}

function initPlayback()
{
	playbackTimer = setInterval(() => { playbackRunTimer() }, 1000);
}

function playbackRunTimer()
{
	playbackData.forEach (function(data, id) {
		if(data.playing)
		{
			let newTime = new Date(data.timeInput.value);
			const lastMinute = Math.floor(newTime / (1000 * 60 ));
			
			const speed = playbackSpeeds[data.speedIndex].split(" ");
			const increment = speed[1]
			const amount = parseInt(speed[0])
			
			var changed = true;
			switch (increment) {
				case "sec": newTime.setSeconds(newTime.getSeconds() + amount); break;
				case "min":
				case "mins":
					newTime.setMinutes(newTime.getMinutes() + amount); break;
				case "hr": newTime.setHours(newTime.getHours() + amount); break;
				case "day": newTime.setDate(newTime.getDate() + amount); break;
				case "week": newTime.setDate(newTime.getDate() + (amount * 7) ); break;
				case "month": newTime.setMonth(newTime.getMonth() + amount); break;
				case "year": newTime.setFullYear(newTime.getFullYear() + amount); break;

				default:
					changed = false;
					break;
			}
			
			if(changed)
			{
				const localTime = new Date(newTime.getTime() - newTime.getTimezoneOffset() * 60000)
				var timeStr = localTime.toISOString().slice(0, 19);
				data.timeInput.value = timeStr;
				const newMinute = Math.floor(newTime / (1000 * 60));
				if (newMinute !== lastMinute)
				{
					triggerTimeChanged(id);
				}
			}
		}
	})
}

function triggerTimeChanged(timer_id)
{
	if(playbackData.has(timer_id))
	{
		const data = playbackData.get(timer_id);
		const timeValue = data.timeInput.value;
		data.timeChangedCallbacks.forEach(callback => callback(timeValue));
	}
}

function startPlayback(timer_id)
{
	if(playbackData.has(timer_id))
	{
		const data = playbackData.get(timer_id);
		data.playing = true;
		
		data.timeInput.disabled = true;
		data.btnTimeShift.classList.add("button-disabled");
		data.btnNow.classList.add("button-disabled");
		data.btnPlay.classList.add("button-disabled");
		data.btnPause.classList.remove("button-disabled");
	}
}

function pausePlayback(timer_id) 
{
	if(playbackData.has(timer_id))
	{
		const data = playbackData.get(timer_id);
		data.playing = false;

		data.timeInput.disabled = false;
		data.btnTimeShift.classList.remove("button-disabled");
		data.btnNow.classList.remove("button-disabled");
		data.btnPlay.classList.remove("button-disabled");
		data.btnPause.classList.add("button-disabled");
	}
}

function setCurrentTime(timer_id)
{
	if(playbackData.has(timer_id))
	{
		const data = playbackData.get(timer_id);
		
		const now = new Date()
		const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
		data.timeInput.value = localTime.toISOString().slice(0, 19);
		triggerTimeChanged(timer_id);
	}
}

function adjustPlaybackSpeed(timer_id, forward)
{
	if(playbackData.has(timer_id))
	{
		const data = playbackData.get(timer_id);
		// Increment index
		data.speedIndex += forward;
		// Validate Boundaries
		if (data.speedIndex < 0) data.speedIndex = 0;
		if (data.speedIndex >= playbackSpeeds.length) data.speedIndex = playbackSpeeds.length - 1;

		// Update Label
		data.lblSpeed.textContent = playbackSpeeds[data.speedIndex] + " / sec";

		// Disble Elements
		if (data.speedIndex == 0)
		{
			data.btnRR.classList.add("button-disabled");
		}
		else
		{
			data.btnRR.classList.remove("button-disabled");
		}
		
		if (data.speedIndex == (playbackSpeeds.length-1) )
		{
			data.btnFF.classList.add("button-disabled");
		}
		else
		{
			data.btnFF.classList.remove("button-disabled");
		}

	}
}

function createPlaybackForm(parentId, id, title, callback)
{
	var parentDiv = document.getElementById(parentId);
	if(parentDiv != null)
	{
		const data = new playbackDataForm(id);
		playbackData.set(id, data);
		
		//	<div class="ui_form" id="time-form">
		var new_div = document.createElement("div");
		new_div.setAttribute("id",  id);
		new_div.className = "ui_form";
		parentDiv.appendChild(new_div);
		
		//		<h2>Jump to Time</h2>
		var eTitle = document.createElement("h2");
		eTitle.innerHTML = title;
		new_div.appendChild(eTitle);
		
		//		<form onsubmit="event.preventDefault();">
		var eForm = document.createElement("form");
		eForm.addEventListener("submit", (event) => {
			event.preventDefault(); // Prevent actual form submission
		});
		new_div.appendChild(eForm);
		
		//			<div class="input-group">
		var group_div = document.createElement("div");
		group_div.setAttribute("id",  id + "_input_group");
		group_div.className = "input-group";
		eForm.appendChild(group_div);
		
		//				<input type="date" id="date">
		group_div.appendChild(data.timeInput);
		group_div.appendChild(data.btnTimeShift);
		
		var group_div2 = document.createElement("div");
		group_div2.setAttribute("id",  id + "_speed_group");
		group_div2.className = "input-group";
		eForm.appendChild(group_div2);
		
		var speed_label = ui_new_label(id + "_speed_label", "Playback Speed: ");
		group_div2.appendChild(speed_label);
		group_div2.appendChild(data.lblSpeed);
		
		//			<div class="input-bar">
		var input_bar_div = document.createElement("div");
		input_bar_div.setAttribute("id",  id + "_input_bar");
		input_bar_div.className = "input-bar";
		eForm.appendChild(input_bar_div);
		
		input_bar_div.appendChild(data.btnNow);
		input_bar_div.appendChild(data.btnRR);
		input_bar_div.appendChild(data.btnPause);
		input_bar_div.appendChild(data.btnPlay);
		input_bar_div.appendChild(data.btnFF);
		
		adjustPlaybackSpeed(id, 0);
		setCurrentTime(id);
		startPlayback(id);
		registerTimeChangedCallback(id,  callback);
	}
}

initPlayback()




