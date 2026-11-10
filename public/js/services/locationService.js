
const getCurrentLocation = (
  currentLocationBtn,
  latitudeInput,
  longitudeInput
) => {
  currentLocationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        latitudeInput.value = latitude;
        longitudeInput.value = longitude;
      },
      (error) => {
        
(error) => {
  let message;

  switch (error.code) {
    case 1:
      message = "Please allow location access in your browser.";
      break;

    case 2:
      message = "Unable to detect your location. Try again.";
      break;

    case 3:
      message = "Location request timed out. Please try again.";
      break;

    default:
      message = "Something went wrong while detecting your location.";
  }

  alert(message);
}

      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export default getCurrentLocation;