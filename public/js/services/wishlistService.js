export default async function wishlistApi(data) {
  const response = await fetch("/listings/wishlist/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listingIds: data }),
  });
  if (!response.ok) {
    throw new Error("failed to fetch wishlist");
  }
  return response.json();
}

async function addToWishlist(listingId) {
  const response = await fetch(`/wishlist/${listingId}`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("failed to add wishlist");
  }
  return response.json();
}

async function removeFromWishlist(listindId) {
  const response = await fetch(`/wishlist/${listindId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("failed to remove from wishlist");
  }
  return response.json();
}

async function getWishlist() {
  const response = await fetch("/wishlist");
  if (!response.ok) {
    throw new Error("failed to fetch wishlist");
  }
  return response.json();
}

export { addToWishlist, removeFromWishlist, getWishlist };
