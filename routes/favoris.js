const express = require('express');

const router = express.Router();
const ctrlsFav = require("../controllers/favoris")


router.delete("/one/:id",ctrlsFav.deleteOneFavoris)

router.delete("/all", ctrlsFav.deleteAllFavoris)

router.post("/campagne" , ctrlsFav.lancerCampagne)


module.exports = router