const express = require("express");
const router = express.Router();
const movieWatchedController = require("../controllers/movieWatchedController");

router.post("/", movieWatchedController.createMovieWatched);

router.put("/:id", movieWatchedController.updateWatchedDuration);

router.get("/:id", movieWatchedController.getWatchedDuration);

router.get("/user/:userId/movie/:movieId", movieWatchedController.getMovieWatchedByUserIdAndMovieId);

router.put("/reset/:userId/:movieId", movieWatchedController.resetMovieWatched);

module.exports = router;
