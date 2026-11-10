//this handle map automatic coordinate
//new.ejs

import getCurrentLocation from "./services/locationService.js";

const currentLoationBtn = document.getElementById("current-location");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

getCurrentLocation(currentLoationBtn,latitudeInput,longitudeInput);

