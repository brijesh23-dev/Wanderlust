const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  const { category, sort, search } = req.query;
  const page = Number(req.query.page);
  const limit = 8;
  const skip = (page - 1) * limit;
  let filter = {};
  let sortOption = {};

  //search
  if (search?.trim()) {
    const keyword = search.trim();
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { location: { $regex: keyword, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (sort === "priceLow") {
    sortOption.price = 1;
  }

  if (sort === "priceHigh") {
    sortOption.price = -1;
  }

  if (sort === "country") {
    sortOption.country = 1;
  }

  if (sort === "location") {
    sortOption.location = 1;
  }

  const totalListings = await Listing.countDocuments(filter);
  const totalPages = Math.ceil(totalListings / limit);

  const allListings = await Listing.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean();

  res.render("listings/index.ejs", {
    allListings,
    search: search || "",
    category: category || "",
    sort: sort || "",
    currentPage: page,
    totalPages,
  });
};

module.exports.newFormrender = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "you are search for listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "send valid data for listing");
  }

  let newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;

  if (req.file) {
    newlisting.image = {
      url: req.file.url,
      filename: req.file.display_name,
    };
  }

  await newlisting.save();
  req.flash("success", "New listing created !");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  let listingOriginalUrl = listing.image.url;
  listingOriginalUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, listingOriginalUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "send valid data for listing");
  }
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing is updated !");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing is Deleted!");
  res.redirect("/listings");
};
