window.addEventListener("load", function() { ui_onLoad() } );

function ui_onLoad()
{
	setupAutocomplete("location");
}

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

function setupAutocomplete(id)
{
	var input = document.getElementById(id);
	if(input != null)
	{
		const suggestionBox = document.createElement("div");
		suggestionBox.setAttribute("id",  id + "_ui_suggestions");
		suggestionBox.className = "ui_suggestions";
		input.parentElement.appendChild(suggestionBox);
		var y_pos = input.offsetTop + input.getBoundingClientRect().height
		suggestionBox.style.top = y_pos +'px';

		input.addEventListener("input", async () => { autocompleteLocation(input, suggestionBox) } );

		// Focus change? because tab leaves it displayed too
		document.addEventListener("click", (event) => {
			if (!input.contains(event.target) && !suggestionBox.contains(event.target)) {
				suggestionBox.style.display = "none";
				}
		});
	}
}