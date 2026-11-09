if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isOwner } = require("../middleware.js");
const { listingSchema } = require("../Schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const user = require("../models/user.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing),
  );

router.get("/", wrapAsync(listingController.index));

router.get("/wishlist", wrapAsync(listingController.renderWishlist));
router.post("/wishlist/data",listingController.getWishlist)

//new route
router.get("/new", isLoggedIn, listingController.newFormrender);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    isOwner,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//show route
// router.get("/:id",
//     wrapAsync(listingController.showListing));

//create route
// router.post("/",
//     isLoggedIn,
//     validateListing,wrapAsync(listingController.createListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing),
);

//update route
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.updateListing));

//delete route
// router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroyListing));

module.exports = router;
