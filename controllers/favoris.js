const Favoris = require("../Model/Favoris");
const NameListProspet = require("../Model/NameListProspet");

// Supprimer un favori par son ID
exports.deleteOneFavoris = (req, res) => {
    const id = req.params.id;

    // Utilisez `findOneAndDelete` au lieu de `findByIdAndDelete` pour plus de sécurité et de validation
    Favoris.findOneAndDelete({ _id: id })
        .then(() => {
            res.status(200).json({ message: 'Supprimé avec succès !' });
        })
        .catch((err) => {
            res.status(500).json({ message: "Erreur lors de la suppression, veuillez réessayer plus tard !" });
        });
}

// Supprimer tous les favoris d'un utilisateur
exports.deleteAllFavoris = (req, res) => {
    const user = req.user.userId;

    // Assurez-vous que l'utilisateur est authentifié avant de supprimer ses favoris
    if (!user) {
        res.status(401).json({ message: "Non autorisé, veuillez vous connecter d'abord !" });
        return;
    }

    Favoris.deleteMany({ userId: user })
        .then(() => {
            res.status(200).json({ message: 'La liste des favoris a été supprimée avec succès !' });
        })
        .catch((err) => {
            res.status(500).json({ message: "Erreur lors de la suppression, veuillez réessayer plus tard !" });
        });
}

// Lancer une campagne
exports.lancerCampagne = (req, res) => {
    const user = req.user.userId;
    const nameListProspect = req.body.nameListProspect;
    const data = req.body.data;

    // Assurez-vous que l'utilisateur est authentifié avant de lancer une campagne
    if (!user) {
        res.status(401).json({ message: "Non autorisé, veuillez vous connecter d'abord !" });
        return;
    }

    NameListProspet.find({ userId: user, active: true })
        .then((result) => {
            // Vérifiez si une campagne est déjà active pour cet utilisateur
            if (result.length > 0) {
                res.status(400).json({ message: "Une campagne est déjà active, veuillez attendre qu'elle soit terminée !" });
            } else {
                // Créez une nouvelle campagne
                new NameListProspet({
                    nameListProspect,
                    userId: user,
                    active: true,
                    date: new Date()
                })
                .save()
                .then(() => {
                    res.status(200).json({ message: "Campagne enregistrée et lancée !" });
                })
                .catch((err) => {
                    res.status(500).json({ message: "Erreur lors de l'enregistrement de la campagne, veuillez réessayer plus tard !" });
                });
            }
        });
}
