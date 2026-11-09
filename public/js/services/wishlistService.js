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
