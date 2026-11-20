const bookingForm = document.getElementById("booking-form");
const availabilityButton = document.getElementById("check-availability");
const availabilityResult = document.getElementById("availability-result");
const priceBreakdown = document.getElementById("price-breakdown");
const totalNights = document.getElementById("total-nights");
const totalPrice = document.getElementById("total-price");
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");

const pricePerNight = Number(
  document.querySelector(".booking-card h4").textContent.replace(/[^\d.-]/g, ""),
);

availabilityButton.addEventListener("click", async () => {
  if (!bookingForm.reportValidity()) return;

  let response;
  let result;
  try {
    response = await fetch(
      `${bookingForm.action}/availability`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: checkIn.value,
          checkOut: checkOut.value,
        }),
      },
    );
    result = await response.json();
  } catch {
    availabilityResult.textContent =
      "Unable to check availability. Please try again.";
    availabilityResult.className = "mt-3 text-danger";
    priceBreakdown.classList.add("d-none");
    return;
  }

  availabilityResult.textContent = result.message;
  availabilityResult.className = response.ok
    ? "mt-3 text-success"
    : "mt-3 text-danger";
  priceBreakdown.classList.toggle("d-none", !response.ok);

  if (response.ok) {
    const nights = Math.ceil(
      (new Date(checkOut.value) - new Date(checkIn.value)) / (1000 * 60 * 60 * 24),
    );
    totalNights.textContent = nights;
    totalPrice.textContent = `₹${(nights * pricePerNight).toLocaleString("en-IN")}`;
  }
});
