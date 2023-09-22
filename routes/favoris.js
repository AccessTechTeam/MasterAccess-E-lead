const express = require('express');

// Création d'un routeur Express
const router = express.Router();

// Importation des contrôleurs pour les opérations sur les favoris
const ctrlsFav = require("../controllers/favoris");

// Route pour supprimer un favori par ID
router.delete("/one/:id", ctrlsFav.deleteOneFavoris);

// Route pour supprimer tous les favoris d'un utilisateur
router.delete("/all", ctrlsFav.deleteAllFavoris);

// Route pour lancer une campagne
router.post("/campagne", ctrlsFav.lancerCampagne);

// Exportation du routeur pour être utilisé dans d'autres parties de l'application
module.exports = router;
