const mongoose = require("mongoose");
require("dotenv").config();

// Connexion à la base de données MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true, // Utilisation du nouveau parseur d'URL (obligatoire)
    useUnifiedTopology: true, // Utilisation de la nouvelle gestion de topologie (obligatoire)
})
.then(() => {
    console.log("Connexion à la base de données réussie (Code 200)");
})
.catch((err) => {
    console.error("Erreur lors de la connexion à la base de données :", err);
});

module.exports = mongoose;