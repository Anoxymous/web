
// TODO make an array based on id
let ui_controller;

async function fetchLocations(query, signal)
{
	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

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

		if(locations.length > 0)
		{
			suggestionBox.innerHTML = "";

			locations.forEach((loc) => {
				const div = document.createElement("div");
				div.className = "suggestion-item";
				div.innerText = loc.display_name;
				div.onclick = () => {
					input.value = loc.display_name;
					suggestionBox.style.display = "none";
					// TODO pass these in
					document.getElementById("latitude").value = loc.lat;
					document.getElementById("longitude").value = loc.lon;
					suggestionBox.innerHTML = "";
					suggestionBox.style.display = "none";
				};
				suggestionBox.appendChild(div);
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

		input.addEventListener("input", async () => { autocompleteLocation(input, suggestionBox) } );

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
		eInputLoc.setAttribute("id", "location");
		eInputLoc.setAttribute("placeholder", "Enter Name...");
		eForm.appendChild(eInputLoc);
		
		var eDivLat = document.createElement("div");
		eDivLat.className = "input-group";
		eForm.appendChild(eDivLat);

		var eInputLat = document.createElement("input");
		eInputLat.type = "number";
		eInputLat.setAttribute("id", "latitude");
		eInputLat.setAttribute("placeholder", "Latitude (-90 to 90)");
		eInputLat.setAttribute("min", "-90");
		eInputLat.setAttribute("max", "90");
		eInputLat.setAttribute("step", "0.0000001");
		eInputLat.addEventListener("oninput", (event) => { updateIndicators() } );
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
		eInputLon.setAttribute("id", "longitude");
		eInputLon.setAttribute("placeholder", "Longitude (-180 to 180)");
		eInputLon.setAttribute("min", "-180");
		eInputLon.setAttribute("max", "180");
		eInputLon.setAttribute("step", "0.0000001");
		eInputLon.addEventListener("oninput", (event) => { updateIndicators() } );
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