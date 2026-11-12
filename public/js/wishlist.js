import wishlistApi from "./services/wishlistService.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "./services/wishlistService.js";
/*==================================
        local storage wishlist (guest user)
=============================*/

// const WISHLIST_KEY = "wishlist";
// let wishlistResult = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");

// const wishlistButtons = document.querySelectorAll(".wishlist-btn");
// wishlistButtons.forEach((button) => {
//   updateButton(button);

//   button.addEventListener("click", async (e) => {
//     const listingId = e.currentTarget.dataset.listingId;
//     if (wishlistResult.includes(listingId)) {
//       wishlistResult = wishlistResult.filter(
//         (wishlist) => wishlist !== listingId,
//       );
//     } else {
//       wishlistResult = [...wishlistResult, listingId];
//     }
//     localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistResult));
//     updateButton(button);
//   });
// });

const wishlistButtons = document.querySelectorAll(".wishlist-btn");

async function initializeWishlist() {
  try {
    const { listings } = await getWishlist();

    wishlistButtons.forEach((button) => {
      const listingId = button.dataset.listingId;

      const isActive = listings.some(
        (listing) => listing._id === listingId
      );

      button.classList.toggle("active", isActive);
    });
  } catch (error) {
    console.error(error);
  }
}

initializeWishlist();

// button and currentButton are same but differ in refereces.

wishlistButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const currentButton = e.currentTarget;
    const listingId = currentButton.dataset.listingId;
    const isActive = currentButton.classList.contains("active");
    console.log(isActive);
    currentButton.disabled = true;
    try {
      if (isActive) {
        await removeFromWishlist(listingId);
        currentButton.classList.remove("active");
      } else {
        await addToWishlist(listingId);
        currentButton.classList.add("active");
      }
    } catch (error) {
      console.error(error);
    } finally {
      currentButton.disabled = false;
    }
  });
});

const wishlistContainer = document.querySelector("#wishlist-container");
const emptyWishlist = document.querySelector("#empty-wishlist");
const wishlistLoading = document.querySelector("#wishlist-loading");
const wishlistCount = document.querySelector("#wishlist-count");

if (wishlistContainer) {
  try {
    const { listings } = await wishlistApi(wishlistResult);

    wishlistLoading?.classList.add("d-none");
    wishlistCount.textContent = `${listings.length} saved listing${
      listings.length === 1 ? "" : "s"
    }`;

    if (listings.length === 0) {
      emptyWishlist?.classList.remove("d-none");
    } else {
      listings.forEach((listing) => {
        const card = createListingCard(listing);
        const removeButton = card.querySelector(".wishlist-remove-btn");
        removeButton.addEventListener("click", () => {
          wishlistResult = wishlistResult.filter(
            (listingId) => listingId !== listing._id,
          );
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistResult));
          card.remove();
          wishlistCount.textContent = `${wishlistResult.length} saved listing${
            wishlistResult.length === 1 ? "" : "s"
          }`;

          if (wishlistResult.length === 0) {
            emptyWishlist?.classList.remove("d-none");
          }
        });
        wishlistContainer.appendChild(card);
      });
    }
  } catch (error) {
    wishlistLoading?.classList.add("d-none");
    wishlistContainer.innerHTML =
      '<p class="text-danger">Unable to load your wishlist. Please try again.</p>';
    console.error("Unable to load wishlist", error);
  }
}

function updateButton(button) {
  const isActive = wishlistResult.includes(button.dataset.listingId);
  button.classList.toggle("active", isActive);
  button.setAttribute(
    "aria-label",
    isActive ? "Remove from wishlist" : "Add to wishlist",
  );
}

function createListingCard(listing) {
  const column = document.createElement("div");
  column.className = "col mb-4";

  const link = document.createElement("a");
  link.href = `/listings/${listing._id}`;
  link.className = "listing-link";

  const card = document.createElement("div");
  card.className = "listing-card";

  const image = document.createElement("img");
  image.src = listing.image.url.replace(
    "/upload",
    "/upload/w_600,h_400,c_fill,q_auto:good,f_auto/",
  );
  image.className = "card-img-top";
  image.alt = listing.title;
  image.loading = "lazy";
  image.decoding = "async";

  const imageContainer = document.createElement("div");
  imageContainer.className = "card-img-container";
  imageContainer.appendChild(image);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "wishlist-remove-btn";
  removeButton.textContent = "Remove";
  removeButton.setAttribute(
    "aria-label",
    `Remove ${listing.title} from wishlist`,
  );
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  imageContainer.appendChild(removeButton);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h5");
  title.className = "listing-title";
  title.textContent = listing.title;

  const location = document.createElement("p");
  location.className = "listing-location";
  location.textContent = `${listing.location}, ${listing.country}`;

  const price = document.createElement("p");
  price.className = "listing-price";
  price.textContent = `₹${listing.price.toLocaleString("en-IN")} / night`;

  body.append(title, location, price);
  card.append(imageContainer, body);
  link.appendChild(card);
  column.appendChild(link);
  return column;
}
