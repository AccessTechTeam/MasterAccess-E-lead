require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')
const cookieParser = require("cookie-parser")
const mongoose = require("./db/db")
const UserInscription = require("./Model/model")
const validationInscriptionSchema = require("./Validation/validationInscription")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const passport = require("passport")
const getLinks = require("./Scrap/Search_profils")
const session = require("express-session")
const path = require("path")
const getRelationPersons = require("./Scrap/getRelationPersons")
const getProfileViewCount = require("./Scrap/getProfilViewCount")
const authMiddleware = require("./middleware/auth")
const NameListProspet = require("./Model/NameListProspet")
const getRelationNumb = require("./Scrap/getRelationNumb")
const invitationOnHold = require("./Scrap/invitationOnHold")
const getProfileVisits = require("./Scrap/getProfileVisits")
const ProspectRechecheModels = require("./Model/ProspectRechercheModels")
const Li_at = require("./Model/li_at")
const ObjectId = require('mongoose').Types.ObjectId;
const fileUpload = require('express-fileupload')
const fs = require('fs')
const EvolutionLinkedIn = require('./Model/EvolutionLinkedIn')
const testingLiAt = require("./Scrap/TestingLIAT")
const enrichissement = require("./Scrap/enrichissementProspect")
const ProspectEnrichis = require("./Model/ProspectEnrichis")
const addProspect = require("./Scrap/addingProspect")
const InvitationAll = require("./Model/invitationsAll")
const verificationAcceptation = require("./Scrap/verificationAcceptation")
const deleteInvitationOnHold = require("./Scrap/deleteInvitationOnHold")
const Favoris = require("./Model/Favoris")
const cron = require("node-cron")
const schedule = require("node-schedule")
const Links = require("./Model/Link")
const { json } = require('body-parser')
const QueueItem = require("./Model/QueuItems")
const Model = require("./Model/model")
const verifyInvitationStatus = require("./Scrap/verifyinvitationStatut")
const verifyResponsePerson = require("./Scrap/checkResponsePerson")
const SuivisReponse = require("./Model/SuivisReponsePersonne")
const secondMessage = require("./Scrap/sendSecondMsg")
const verifySecondResponsePerson = require("./Scrap/checkForAnotherRes")
const personInvitationPendingSchema = require("./Model/personInvitationPending")
const klist = require("./Model/KList")
const checkInivitation = require("./Scrap/checkInvitation")
const checkResponsePerson = require("./Scrap/checkResponsePerson")
const sendSecondMsg = require("./Scrap/sendSecondMsg")
const checkForAnotherRes = require("./Scrap/checkForAnotherRes")
const K = require("./public/js/K")
const ProsK = require("./Model/ProsK")
const mailSender = require("./public/js/mailSender")
const routerFavoris = require("./routes/favoris")
const mailForCampaignFinished = require("./mailForCampaignFinished")
const forceToAdd = require('./Scrap/forceToAdd')
const keySec = process.env.SECRET_KEY



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }))
app.use(fileUpload())
app.use(session({
    name: 'AL',
    secret: "CleSecrete",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // le cookie ne sera envoyé que sur une connexion HTTPS sécurisée
        httpOnly: false, // empêche l'accès au cookie via JavaScript
        maxAge: 24 * 60 * 60 * 1000 // durée de vie du cookie en millisecondes
    }
}));

app.use(express.static(__dirname + '/public'))


const port = 3000;



// FUNCTION MAIN
async function main() {
    try {

        app.use(cors())
        app.use(cookieParser())
        app.use(passport.initialize());

        app.post("/addingProspectinCampagne", authMiddleware, async (req, res) => {

            const nom = req.body.nom;
            const lien_linkedin = req.body.lien;
            const user = req.user.userId
            const nameListProspectId = req.body.nameListProspectId
            const profilName = req.body.profileName
            const liensLinkedin = req.body.LiensLinkedin
            let tableauLienLinkedin = JSON.parse(decodeURIComponent(liensLinkedin))



            const newLink = new Links({
                url: lien_linkedin,
                nameListProspectId,
                user,
            });

            await newLink.save();

        });


        app.get("/verification-campagne", authMiddleware, async (req, res) => {
            const user = req.user.userId
            try {
                const activeCampagne = await NameListProspet.findOne({ active: true, completed: false, userId: user })
                if (activeCampagne) {
                    res.json({
                        messages: "Attendez que la campagne soit terminée pour pouvoir lancer une nouvelle.",
                        active: true,
                        campaignId: activeCampagne._id

                    })
                } else {
                    res.json({
                        active: false
                    })
                }
            }
            catch (err) {
                res.json({ messages: "Une erreur s'est produite lors de la vérification de la campagne." })
            }

        })

        app.post("/lol", authMiddleware, async (req, res) => {

            const user = req.user.userId;
            const nameListProspectId = req.body.nameListProspectId;
            const liensLinkedin = req.body.LiensLinkedin;
            let tableauLienLinkedin = JSON.parse(decodeURIComponent(liensLinkedin));

            const message = req.body.message

            const updatedCampagne = await NameListProspet.findOneAndUpdate(
                { _id: nameListProspectId }, // Rechercher la campagne par son ID
                { $set: { active: true, date: new Date(), completed: false, } }, // Mettre à jour le champ 'active' en le définissant sur 'true + la date'
                { new: true } // Renvoyer la version mise à jour de la campagne
            );
            console.log("Campagne mise à jour :", updatedCampagne);

            const extractedIds = tableauLienLinkedin.map(element => {
                const url = element.link;
                const parts = url.split('?');
                const profilePart = parts[0];
                const profileName = profilePart.split('/').pop();
                return profileName;
            });
            // Transformer le tableau de liens en un tableau d'objets correspondant au modèle
            const documents = tableauLienLinkedin.map((element, index) => ({

                url: element.link,
                messages: message,
                nom: element.nom,
                processed: false,
                nameListProspectId: nameListProspectId,
                photo: element.photo,
                emploie: element.emploie,
                user: user,
                inQueue: true,
                date: new Date(),
                idOfUrl: extractedIds[index]

            }));

            try {
                // Check if documents already exist in the database
                const existingLinks = await Promise.all(documents.map(doc => Links.findOne({ url: doc.url })));

                // Filter out documents that don't already exist in the database
                const newDocuments = documents.filter((doc, index) => !existingLinks[index]);

                if (newDocuments.length > 0) {
                    // Insert new documents into the database
                    await Links.insertMany(newDocuments);
                    console.log(`${newDocuments.length} document(s) added successfully.`);
                } else {
                    console.log("No new documents to add.");
                }


                console.log("Ajouté avec success")
                await initializeQueue(req.user.userId)



            } catch (error) {
                console.error(error);
                console.log("erreur")
            }



        });


        async function initializeQueue(user) {
            await QueueItem.deleteMany({ user })

            const result = await NameListProspet.findOne({ active: true, userId: user });
            if (result) {
                const links = await Links.find({ processed: false, inQueue: true, nameListProspectId: result._id, user: result.userId });

                await QueueItem.insertMany(links);
            }

            console.log('File d\'attente initialisée')

        }
        // Fonction pour traiter un lien spécifique.
        async function processLink(link) {
            console.log("ON RENTRE DANS PROCESSLINK ICI")


            const namelist = await NameListProspet.findOne({ active: true, userId: link.user })


            const result = await Li_at.findOne({ user: link.user });
            const status = await addProspect(result.li_at, link.url, link.messages);

            const modifyLinkDocument = await Links.findOne({ url: link.url })
            const linkDocument = await QueueItem.findOne({ url: link.url });
            if (status.status === true) {

                modifyLinkDocument.processed = true;
                modifyLinkDocument.inQueue = false;
                modifyLinkDocument.step = 1;
                modifyLinkDocument.date = new Date();
                // Recherche de l'index du "New Add" le plus récent dans namelist.timeline
                let newestNewAddIndex = -1;
                let newestAddDate = null;

                for (let i = 0; i < namelist.timeline.length; i++) {
                    const entry = namelist.timeline[i];
                    if (entry.event === "New Add") {
                        if (!newestAddDate || entry.date > newestAddDate) {
                            newestAddDate = entry.date;
                            newestNewAddIndex = i;
                        }
                    }
                }

                if (newestNewAddIndex !== -1) {
                    // Incrémente le nombre de "New Add" pour l'entrée la plus récente
                    namelist.timeline[newestNewAddIndex].numberOfadding += 1;
                }



            } else if (status.status === false) {
                console.log("le Prospect n'a pas pu etre ajouté !")

                modifyLinkDocument.processed = false;
                modifyLinkDocument.inQueue = false;
                modifyLinkDocument.inProcess = true;
                // modifyLinkDocument.Kaspr = true;
                // modifyLinkDocument.step = 1;
                modifyLinkDocument.traited = false;
                modifyLinkDocument.toForce = true

                //MODIFICATION POUR DU FORCING D'AJOUT SI UNE PERSONNE N'A PAS PU ETRE AJOUTER A CE MOMENT ON LA PLACE DANS UNE BDD POUR UNE DEUXIEME TENTATIVE D'AJOUT 
                // ON CREER UNE TACHE QUI SE LANCE TOUT LES JOURS POUR VOIR SI LA PERSONNE A ÉTÉ AJOUTÉ POUR UNE DEUXIEME FOIS SI OUI ELLE REINTEGRE LE PROCESS SINON KSPR

            }

            await modifyLinkDocument.save();
            await namelist.save()

            await QueueItem.deleteOne({ _id: linkDocument._id, });




        }

        async function processQueue() {
            const campagnes = await NameListProspet.find({ active: true });
            for (const campaign of campagnes) {
                const currentQueue = await QueueItem.find({
                    user: campaign.userId,
                    nameListProspectId: campaign._id,
                }).limit(20);

                if (currentQueue.length > 0) {
                    console.log("THE CURRENT QUEU LIST : ", currentQueue)
                    // Supposons que campaign.userId est une valeur valide pour la recherche
                    const campagnes = await NameListProspet.find({ active: true, userId: campaign.userId });
                    console.log("CAMPAGNE DANS CURRENTQUEU ")

                    // Parcourir toutes les campagnes trouvées
                    for (const campagne of campagnes) {
                        // Ajouter un nouvel événement à la propriété "timeline" de chaque document
                        campagne.timeline.push({
                            event: "New Add",
                            date: new Date(),
                            nombreTotal: currentQueue.length
                        });

                        // Enregistrer les modifications pour chaque document
                        await campagne.save();
                        console.log("YEES")
                    }
                }

                if (currentQueue.length === 1) {
                    // Mettre à jour la campagne lorsque la file d'attente est vide
                    await NameListProspet.findOneAndUpdate(
                        { _id: campaign._id },
                        {
                            $set: {
                                active: true,
                                completed: false,
                                date_finished: new Date(),
                                step: 1,
                            },
                        },
                        { new: true }
                    );
                    console.log("Campagne terminée. Champ 'active' mis à jour.");

                    try {
                        const user = await Model.findOne({ _id: campaign.user });
                        console.log(user.email);
                    } catch (err) {
                        console.log(err);
                    }
                }

                for (const link of currentQueue) {
                    // Your processing logic for each link goes here.
                    const minDelay = 3000;
                    const maxDelay = 10000;
                    const delayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                    await delay(delayTime);
                    // Assuming `processLink` is an asynchronous function.
                    await processLink(link);

                }
            }
        }



        function delay(ms) {
            console.log(ms)
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        cron.schedule('38 14 * * *', processQueue);


        cron.schedule("57 14 * * *", async () => {

            const campagnes = await NameListProspet.find({ active: true });
            const userIds = campagnes.map((camp) => camp.userId);
            const usersWithActiveCampaigns = await Model.find().where('_id').in(userIds);
            for (const [index, user] of usersWithActiveCampaigns.entries()) {
                const userId = user._id;
                const token = await Li_at.findOne({ user: userId });

                const linksInBdd = await Links.find({
                    user: userId,
                    nameListProspectId: campagnes[index]._id,
                    processed: false,
                    inQueue: false,
                    inProcess: true,
                    traited: false,
                    toForce: true
                });

                console.log("LINKS", linksInBdd)

                if (linksInBdd.length > 0) {

                    console.log("TEST")
                    const campagnes = await NameListProspet.find({ active: true, userId: userId });
                    console.log(campagnes)
                    for (const campagne of campagnes) {
                        // Ajouter un nouvel événement à la propriété "timeline" de chaque document
                        campagne.timeline.push({
                            event: "Force Add",
                            date: new Date(),
                            nombreTotal: linksInBdd.length

                        });
                        // Enregistrer les modifications pour chaque document
                        await campagne.save();
                        console.log("YEES")
                    }

                }

                for (const link of linksInBdd) {

                    console.log("ON RENTRE ICI")
                    const LinksUrlBdd = link.url;
                    const minDelay = 3000;
                    const maxDelay = 10000;
                    const delayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                    await delay(delayTime);
                    const status = await forceToAdd(token.li_at, LinksUrlBdd)
                    console.log(status.status)
                    console.log(link.nameListProspectId)
                    const namelist = await NameListProspet.findOne({ _id: link.nameListProspectId });

                    if (status.status === "Attente") {
                        link.processed = true;
                        link.inQueue = false;
                        link.step = 1;
                        link.date = new Date();
                        link.Toforce = false;
                        // SI ATTENTE CELA VEUT DIRE QUE JE L'AI DEJA AJOUTÉ LE REMTTRE DANS LE PROCESS SI IL A DEJA ETE AJOUTÉ DEPUIS LA PREMIERE FCT

                        await link.save()
                    }
                    else if (status.status === "Ajouté") {
                        console.log("FORCE ADD AJOUTÉ DANS status.status === Ajouté")
                        // SI AJOUTÉ LE REMETTRE DANS LE PROCESS
                        link.processed = true;
                        link.inQueue = false;
                        link.step = 1;
                        link.date = new Date();
                        link.Toforce = false;
                        // Recherche de l'index du "New Add" le plus récent dans namelist.timeline
                        let newestNewAddIndex = -1;
                        let newestAddDate = null;


                        for (let i = 0; i < namelist.timeline.length; i++) {
                            const entry = namelist.timeline[i];
                            if (entry.event === "Force Add") {
                                if (!newestAddDate || entry.date > newestAddDate) {
                                    newestAddDate = entry.date;
                                    newestNewAddIndex = i;
                                }
                            }
                        }

                        if (newestNewAddIndex !== -1) {
                            // Incrémente le nombre de "New Add" pour l'entrée la plus récente
                            namelist.timeline[newestNewAddIndex].numberOfadding += 1;
                        }

                        await link.save()
                        await namelist.save()

                    }
                    else if (status.status === false) {
                        link.traited = true,
                            link.Toforce = false;
                        //PLACER DANS KSPR
                        new klist({
                            linkId: link._id,
                            user: link.user,
                            campagneId: link.nameListProspectId,
                            nom: link.nom.split(" ")[1],
                            prenom: link.nom.split(" ")[0],
                            url: link.url,
                            photo: link.photo,
                            idOfUrl: link.idOfUrl
                        })
                            .save()
                            .then(result => console.log("Le prospect n'a pas pu etre ajouté !", result))
                            .catch(err => console.log("Erreur :", err));

                        await link.save()

                    }
                    else if (status.status === true) {
                        console.log("FORCE ADD AJOUTÉ DANS status.status === Ajouté")
                        // SI AJOUTÉ LE REMETTRE DANS LE PROCESS
                        link.processed = true;
                        link.inQueue = false;
                        link.step = 1;
                        link.date = new Date();
                        link.Toforce = false;
                        // Recherche de l'index du "New Add" le plus récent dans namelist.timeline
                        let newestNewAddIndex = -1;
                        let newestAddDate = null;

                        for (let i = 0; i < namelist.timeline.length; i++) {
                            const entry = namelist.timeline[i];
                            if (entry.event === "Force Add") {
                                if (!newestAddDate || entry.date > newestAddDate) {
                                    newestAddDate = entry.date;
                                    newestNewAddIndex = i;
                                }
                            }
                        }

                        if (newestNewAddIndex !== -1) {
                            // Incrémente le nombre de "New Add" pour l'entrée la plus récente
                            namelist.timeline[newestNewAddIndex].numberOfadding += 1;
                        }

                        await link.save()


                    }
                    else if (status.status = "Amis") {
                        //SI AMIS LE PLACER DIRECTEMENT DANS LA BDD POUR LUI ENVOYÉ UN MSG (LA SUITE DU PROCESS)

                        link.user = userId;
                        link.nameListProspectId = campagnes[index]._id;
                        link.processed = true;
                        link.inQueue = false;
                        link.messageSent = false;
                        link.Kaspr = false;
                        link.traited = false;
                        link.Toforce = false;

                        await link.save()
                    }

                }

            }

        })

        // TACHE VERIFICATION ACCEPTATION
        cron.schedule("47 10 * * *", async () => {
            try {
                const campagnes = await NameListProspet.find({ active: true });
                const userIds = campagnes.map((camp) => camp.userId);

                const usersWithActiveCampaigns = await Model.find().where('_id').in(userIds);
                //NE PAS OUBLIER DE RAJOUTER MESSAGE SENT default FALSE DANS LA ROUTE /LOL POUR APRES CHANGER SON STATUT AU MOMENT OU LE STATUT PASSE A TRUE DANS ADDPROSPECT PUIS LE FAIRE RENTRER DANS LES CRITERE DE RECHERCHE DE LINKS
                for (const [index, user] of usersWithActiveCampaigns.entries()) {
                    const campagneActive = campagnes.find((camp) => camp.userId === user._id);
                    const userId = user._id;
                    const token = await Li_at.findOne({ user: userId });
                    //AJOUT D'UN DELAI 

                    const minDelay = 3000;
                    const maxDelay = 10000;
                    const delayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                    await delay(delayTime);

                    const invitationsOnHold = await verificationAcceptation(token.li_at);
                    const linksInBdd = await Links.find({
                        user: userId,
                        nameListProspectId: campagnes[index]._id,
                        processed: true,
                        inQueue: false,
                        messageSent: false,
                        Kaspr: false,
                        traited: false
                    });

                    for (const link of linksInBdd) {
                        const LinksUrlBdd = link.url;
                        const cleanedLinksInBddUrl = LinksUrlBdd.replace('https://www.linkedin.com', '');
                        const linksInBddUrlParts = cleanedLinksInBddUrl.split("?");
                        const linksInBddUrlWithoutQuery = linksInBddUrlParts[0] + "/";

                        const invitationExists = invitationsOnHold.some(invitation => invitation.link === linksInBddUrlWithoutQuery);
                        const nomComplet = link.nom.split(" ");

                        const nom = nomComplet[1];
                        const prenom = nomComplet[0];

                        if (invitationExists) {
                            const existingEntry = await personInvitationPendingSchema.findOne({
                                user: userId,
                                personneId: link._id,
                                campagneId: campagnes[index]._id
                            });
                            if (!existingEntry) {
                                new personInvitationPendingSchema({
                                    user: userId,
                                    personneId: link._id,
                                    campagneId: campagnes[index]._id,
                                    pending: true,
                                    lien: LinksUrlBdd,

                                })
                                    .save()
                                    .then(result => console.log("ajouté aux personnes en attente", result))
                                    .catch(err => console.log(err));
                            }
                        } else {
                            // SI UN DES LIENS NE CORRESPOND PAS, LE SUPPRIMER DE LA BDD DES INVITATIONS EN ATTENTE 
                            personInvitationPendingSchema.deleteOne({ user: userId, personneId: link._id })
                                .then(result => {
                                    if (result.deletedCount > 0) {
                                        console.log("Suppression réussie.", result);
                                    }
                                })
                                .catch(err => console.log(err));
                            // VERIFICATION DU STATUT DE L'INVITATION AVEC ET ENVOIE DU PREMIER MSG AVEC verifyInvitationStatus() 
                            // changer de logique : verification acceptation si accepter a ce moment la declanché un message le placer dans suivis response et le sortir du PROCESS , PROCESS = FALSE, sinon si verification acceptation false placer dans kspr , 
                            // ensuite verifier si cela fait plus de 3 jours que l'invitation a été envoyé  
                            // si plus de 3 jours envoyé sur Kaspr et supprimer de la BDD personInvitationPendingSchema et changer Statut de Link de KASPR SUR TRUE sinon reverifier si cela fais plus de 3jours 
                            //AJOUT D'UN DELAI 
                            const minDelay = 3000;
                            const maxDelay = 10000;
                            const delayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                            await delay(delayTime);

                            let invitation = await checkInivitation(token.li_at, LinksUrlBdd)

                            if (invitation === true) {
                                //AJOUT D'UN DELAI 
                                const minDelay = 3000;
                                const maxDelay = 10000;
                                const delayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                                await delay(delayTime);
                                let messageEnvoye = await verifyInvitationStatus(token.li_at, LinksUrlBdd, prenom)

                                if (messageEnvoye === true) {
                                    // UPDATE LINK.MSGSENT = TRUE
                                    await Links.findOneAndUpdate(
                                        { _id: link._id, user: userId },
                                        { $set: { messageSent: true, } }
                                    )
                                        .then(result => {
                                            console.log("Champ mis à jour :", result);
                                        })
                                        .catch(err => console.log("Erreur lors de la mise à jour du champ :", err));
                                    SuivisReponse.findOne({ user: userId, personneId: link._id })
                                        .then(existingEntry => {
                                            if (existingEntry) {
                                                console.log("Cette personne existe déjà.");
                                            } else {

                                                // AJOUTER L'ENTRÉE DANS LA BASE DE DONNÉES
                                                SuivisReponse({
                                                    user: userId,
                                                    personneId: link._id,
                                                    link: LinksUrlBdd,
                                                    prenom: prenom,
                                                    nom,
                                                    campagneId: link.nameListProspectId,
                                                    dateEnvoiMessage: new Date(),
                                                })
                                                    .save()
                                                    .then(result => {
                                                        console.log("Enregistré dans la base de données de suivi de réponses :", result);
                                                    })
                                                    .catch(err => console.log("Erreur :", err));
                                            }
                                        })
                                        .catch(err => console.log("Erreur lors de la recherche dans la base de données de suivi de réponses :", err));
                                }

                            } else {
                                await Links.findOneAndUpdate(
                                    { _id: link._id, user: userId },
                                    { $set: { inProcess: false, traited: true } }
                                )
                                    .then(() => {
                                        console.log("Prospect Traité !")
                                    })
                                    .catch(() => {
                                        console.log("erreur !")
                                    })
                                // VÉRIFIER SI LA PERSONNE EXISTE DÉJÀ DANS LA BASE DE DONNÉES
                                klist.findOne({ nom: nom, prenom: prenom })
                                    .then(existingPerson => {
                                        if (existingPerson) {
                                            console.log("Cette personne existe déjà dans la base de données.");
                                        } else {
                                            // AJOUTER LA PERSONNE À LA BASE DE DONNÉES
                                            new klist({
                                                linkId: link._id,
                                                user: userId,
                                                campagneId: link.nameListProspectId,
                                                nom,
                                                prenom,
                                                url: LinksUrlBdd,
                                                photo: link.photo,
                                                idOfUrl: link.idOfUrl
                                            })
                                                .save()
                                                .then(result => console.log("Cette personne a refusé la demande de connexion :", result))
                                                .catch(err => console.log("Erreur :", err));
                                        }
                                    })
                                    .catch(err => console.log("Erreur lors de la recherche dans la base de données :", err));
                            }
                        }
                    }
                }

            } catch (err) {
                console.log(err);

            }
        });
        //TACHE VERIFICATION PREMIERE REPONSE ET ENVOE Du DEUXIEME MSG SI CONDITION VERIFIER (A LANCER TOUT LES 3 JOURS)
        cron.schedule("47 10 * * *", async () => {
            try {
                const campagnes = await NameListProspet.find({ active: true });
                const userIds = campagnes.map((camp) => camp.userId);
                const usersWithActiveCampaigns = await Model.find().where('_id').in(userIds);
                for (const [index, user] of usersWithActiveCampaigns.entries()) {
                    const userId = user._id;
                    const token = await Li_at.findOne({ user: userId });
                    const linksInBdd = await Links.find({
                        user: userId,
                        nameListProspectId: campagnes[index]._id,
                        processed: true,
                        inQueue: false,
                        messageSent: true,
                        Kaspr: false,
                        inProcess: true,
                        SecondMessageSent: false,
                        traited: false
                    });
                    for (const link of linksInBdd) {
                        const nomComplet = link.nom.split(" ");
                        const nom = nomComplet[1];
                        const prenom = nomComplet[0];
                        await SuivisReponse.findOne({ user: userId, personneId: link._id, campagneId: campagnes[index]._id })
                            .then(async (responseSuivi) => {


                                const dateEnvoiPremierMessage = new Date(responseSuivi.dateEnvoiMessage);
                                const currentDate = new Date();
                                const timeDifference = Math.abs(currentDate.getTime() - dateEnvoiPremierMessage.getTime());
                                const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

                                // si pas de réponse et la date d'envoie du premier msg est plus grande que 3 jours => envoie deuxieme msg , sinon si reponse on sort du process , 
                                //AJOUT D'UN DELAI 
                                const minDelay = 3000;
                                const maxDelay = 10000;
                                const delayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                                await delay(delayTime);

                                let response1 = await checkResponsePerson(token.li_at, link.url);
                                console.log(response1)
                                if (response1 === true) {

                                    // Sortir du processus INPROCESS = FALSE , MSG RECEIVED = TRUE , KASPR = FALSE
                                    await Links.findByIdAndUpdate({ _id: link._id, user: userId, nameListProspectId: campagnes[index]._id, },
                                        { $set: { inProcess: false, responseMsg: true, Kaspr: false, traited: true } }
                                    )
                                    await SuivisReponse.findOneAndDelete({ personneId: link._id, user: userId, campagneId: campagnes[index]._id })
                                        .then(result => console.log("Supprimé avec Succes ! ", result))
                                        .catch(err => { console.log(err) })
                                }
                                //ICI !
                                else if (!response1 && daysDifference >= 2) {
                                    console.log("le prospect n'a pas repondu, Envoie du deuxieme message en cours... ")
                                    //AJOUT D'UN DELAI 
                                    const minDelay = 3000;
                                    const maxDelay = 10000;
                                    const delayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                                    await delay(delayTime);
                                    const secondMessage = await sendSecondMsg(token.li_at, link.url, prenom);
                                    if (secondMessage === true) {
                                        // Mettre à jour la date d'envoi du deuxième message
                                        await Links.findOneAndUpdate(
                                            { _id: link._id, user: userId },
                                            { $set: { SecondMessageSent: true } }
                                        )
                                            .then((result) => {
                                                console.log("Champ mis à jour :", result);
                                            })
                                            .catch((err) => console.log("Erreur lors de la mise à jour du champ :", err));

                                        await SuivisReponse.findOneAndUpdate({ personneId: link._id, user: userId, campagneId: campagnes[index]._id },
                                            { $set: { dateDeuxiemeMessage: new Date() } }
                                        )
                                            .then((result) => {
                                                console.log("Champ mis à jour :", result);
                                            })
                                            .catch((err) => console.log("Erreur lors de la mise à jour du champ :", err));

                                    } else {
                                        // sortir du process , kaspr true , ajouter dans la bdd kaspr , msg2sent = false , inProcess = false 
                                        await Links.findOneAndUpdate(
                                            { _id: link._id, user: userId },
                                            { $set: { SecondMessageSent: false, Kaspr: true, inProcess: false, traited: true } }
                                        )
                                            .then(result => {
                                                console.log("Champ mis à jour :", result);
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })

                                        klist.findOne({ nom, prenom })
                                            .then(existingPerson => {
                                                if (existingPerson) {
                                                    console.log("Cette personne existe déjà dans la base de données.");
                                                } else {
                                                    // AJOUTER LA PERSONNE À LA BASE DE DONNÉES
                                                    new klist({
                                                        linkId: link._id,
                                                        user: userId,
                                                        campagneId: link.nameListProspectId,
                                                        nom,
                                                        prenom,
                                                        url: link.url,
                                                        photo: link.photo,
                                                        idOfUrl: link.idOfUrl
                                                    })
                                                        .save()
                                                        .then(result => console.log("Le deuxieme message n'a pas pu etre envoyé a la personne", result))
                                                        .catch(err => console.log("Erreur :", err));
                                                }
                                            })
                                            .catch(err => console.log("Erreur :", err));

                                    }
                                }
                            })
                            .catch(err => { console.log(err) })
                    }


                }

            } catch (err) {
                console.log(err)
            }

        })

        //TACHE DE VERIFICATION Du deuxiemme Message 
        cron.schedule("47 10 * * *", async () => {
            try {
                const campagnes = await NameListProspet.find({ active: true });
                const userIds = campagnes.map((camp) => camp.userId);
                const usersWithActiveCampaigns = await Model.find().where('_id').in(userIds);
                for (const [index, user] of usersWithActiveCampaigns.entries()) {
                    const userId = user._id;
                    const token = await Li_at.findOne({ user: userId });
                    const linksInBdd = await Links.find({
                        user: userId,
                        nameListProspectId: campagnes[index]._id,
                        processed: true,
                        inQueue: false,
                        Kaspr: false,
                        inProcess: true,
                        messageSent: true,
                        SecondMessageSent: true
                    });
                    for (const link of linksInBdd) {
                        const nomComplet = link.nom.split(" ");
                        const nom = nomComplet[1];
                        const prenom = nomComplet[0];
                        await SuivisReponse.findOne({ user: userId, personneId: link._id, campagneId: campagnes[index]._id })
                            .then(async responseSuivi => {
                                const dateEnvoiPremierMessage = new Date(responseSuivi.dateDeuxiemeMessage);
                                const currentDate = new Date();
                                const timeDifference = Math.abs(currentDate.getTime() - dateEnvoiPremierMessage.getTime());
                                const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
                                //AJOUT D'UN DELAI 
                                const minDelay = 3000;
                                const maxDelay = 10000;
                                const delayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                                await delay(delayTime);

                                let response2 = await checkForAnotherRes(token.li_at, link.url)

                                if (response2 === true) {

                                    await Links.findOneAndUpdate({ _id: link._id, user: userId, nameListProspectId: campagnes[index]._id, },
                                        { $set: { inProcess: false, responseMsg: true, Kaspr: false, traited: true } }

                                    )
                                        .then((resultat) => { console.log('champ mis a jour !', resultat) })
                                        .catch(err => console.log(err))

                                    await SuivisReponse.findOneAndDelete({ personneId: link._id, user: userId, campagneId: campagnes[index]._id })
                                        .then((resultat) => { console.log("supprimé avec succes !", resultat) })
                                        .catch(err => { console.log(err) })

                                }
                                // A REVERIFIER 
                                else if (!response2 && daysDifference >= 2) {
                                    await Links.findOneAndUpdate(
                                        { _id: link._id, user: userId, nameListProspectId: campagnes[index]._id },
                                        { $set: { Kaspr: true, inProcess: false, traited: true } }
                                    )
                                        .then(result => {
                                            console.log("Champ mis à jour :", result);
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                    await SuivisReponse.findOneAndDelete({ personneId: link._id, user: userId, campagneId: campagnes[index]._id })
                                        .then((resultat) => { console.log("supprimé avec succes !", resultat) })
                                        .catch(err => { console.log(err) })

                                    klist.findOne({ nom, prenom })
                                        .then(existingPerson => {
                                            if (existingPerson) {
                                                console.log("Cette personne existe déjà dans la base de données.");
                                            } else {
                                                // AJOUTER LA PERSONNE À LA BASE DE DONNÉES
                                                new klist({
                                                    linkId: link._id,
                                                    user: userId,
                                                    campagneId: link.nameListProspectId,
                                                    nom,
                                                    prenom,
                                                    url: link.url,
                                                    photo: link.photo,
                                                    idOfUrl: link.idOfUrl
                                                })
                                                    .save()
                                                    .then(result => console.log("Le deuxieme message n'a pas pu etre envoyé a la personne", result))
                                                    .catch(err => console.log("Erreur :", err));
                                            }
                                        })
                                        .catch(err => console.log("Erreur :", err));

                                }
                            })
                            .catch(err => console.log(err))

                    }

                }
            } catch (error) {
                console.log(error)
            }
        })
        //VERIFICATION DE LA DATTE DES INVITATION EN ATTENTE (METTRE DANS LA TACHE DE VERIFICATION D'ACCEPTATION , VERIFIER SI LA PERSONNE ET TOUJOUR EN ATTENTE ET SI ELLE EST EN ATTENDTE  DE PLUS DE 3 JOURS DIRECTEMENT)
        cron.schedule("10 10 * * *", async () => {
            try {
                const campagnes = await NameListProspet.find({ active: true });
                const userIds = campagnes.map((camp) => camp.userId);
                const usersWithActiveCampaigns = await Model.find().where('_id').in(userIds);
                for (const [index, user] of usersWithActiveCampaigns.entries()) {
                    const userId = user._id;
                    const token = await Li_at.findOne({ user: userId });
                    const linksInBdd = await Links.find({
                        user: userId,
                        nameListProspectId: campagnes[index]._id,
                        processed: true,
                        inQueue: false,
                        Kaspr: false,
                        inProcess: true,
                        messageSent: false,
                        SecondMessageSent: false,
                        traited: false
                    });

                    for (const link of linksInBdd) {
                        const nomComplet = link.nom.split(" ");
                        const nom = nomComplet[1];
                        const prenom = nomComplet[0];
                        personInvitationPendingSchema.findOne({ user: userId, personneId: link._id, campagneId: campagnes[index]._id })
                            .then(async invitePending => {
                                const dateAjout = new Date(link.date);
                                const currentDate = new Date();
                                const timeDifference = Math.abs(currentDate.getTime() - dateAjout.getTime());
                                const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

                                if (daysDifference >= 2) {

                                    personInvitationPendingSchema.findOneAndDelete({ user: userId, personneId: link._id, campagneId: campagnes[index]._id })
                                        .then(deleted => console.log("supprimé avec succes !", deleted))

                                    await Links.findOneAndUpdate(
                                        { _id: link._id, user: userId, nameListProspectId: campagnes[index]._id },
                                        { $set: { Kaspr: true, inProcess: false, traited: true } }
                                    )
                                        .then(result => {
                                            console.log("Champ mis à jour :", result);
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })

                                    klist.findOne({ nom, prenom })
                                        .then(existingPerson => {
                                            if (existingPerson) {
                                                console.log("Cette personne existe déjà dans la base de données.");
                                            } else {
                                                // AJOUTER LA PERSONNE À LA BASE DE DONNÉES
                                                new klist({
                                                    linkId: link._id,
                                                    user: userId,
                                                    campagneId: link.nameListProspectId,
                                                    nom,
                                                    prenom,
                                                    url: link.url,
                                                    photo: link.photo,
                                                    idOfUrl: link.idOfUrl
                                                })
                                                    .save()
                                                    .then(result => console.log("Le deuxieme message n'a pas pu etre envoyé a la personne", result))
                                                    .catch(err => console.log("Erreur :", err));
                                            }
                                        })
                                        .catch(err => console.log("Erreur :", err));

                                }
                                else {
                                    console.log("toujours pas ,", daysDifference, "jours")
                                }
                            })
                            .catch(err => { console.log(err) })
                    }
                }
            } catch (error) {
                console.log(error)
            }
        })
        //TACHE QUI VERIFIE SI LA CAMPAGNE A TRAITÉ TOUT LES LIENS
        cron.schedule("10 10 * * *", async () => {
            const campagnes = await NameListProspet.find({ active: true });
            const userIds = campagnes.map((camp) => camp.userId);
            const campId = campagnes.map((camp) => camp._id);

            const usersWithActiveCampaigns = await Model.find().where('_id').in(userIds);
            const emails = usersWithActiveCampaigns.map(email => email.email)
            const prenom = usersWithActiveCampaigns.map(prenom => prenom.username)


            const filteredLinks = await Links.find({
                nameListProspectId: { $in: campId },
                user: { $in: userIds },

            });


            if (filteredLinks.length > 0) {

                const allLinksSatisfyConditions = filteredLinks.every((link) =>
                    link.traited === true,
                );

                if (allLinksSatisfyConditions) {
                    console.log("Oui");

                    await NameListProspet.findOneAndUpdate(
                        { _id: campId, userId: userIds }, // Rechercher la campagne par son ID
                        { $set: { step: 2 } },
                        { new: true } // Renvoyer la version mise à jour de la campagne
                    );

                    await klist.find({ campagneId: campId, user: userIds })
                        .then(async (prospects) => {

                            if (!prospects) {
                                console.log("pas de prospect")
                            }
                            else {
                                let processedCount = 0;
                                let sentEmailCount = 0;
                                for (let prospect of prospects) {

                                    const name = `${prospect.nom} ${prospect.prenom}`

                                    if (sentEmailCount < 40) {
                                        const prospectData = K(name, prospect.idOfUrl)
                                        const phonesArray = prospectData[0];
                                        const emailProArray = prospectData[1];
                                        if (emailProArray.length > 0 && phonesArray.length === 0) {
                                            for (let email of emailProArray) {
                                                let mailSent = await mailSender(email)
                                                if (mailSent === true) {

                                                    ProsK.findOne({ campagneId: campId, userId: userIds, num: num })
                                                        .then(existingProspect => {
                                                            if (existingProspect) {
                                                                console.log("Prospect déjà existant dans la base de données !");
                                                            } else {
                                                                // Ajouter l'élément dans la base de données
                                                                new ProsK({
                                                                    linkId: prospect.linkId,
                                                                    campagneId: campId,
                                                                    userId: userIds,
                                                                    nom: prospect.nom,
                                                                    prenom: prospect.prenom,
                                                                    email: emailProArray,
                                                                    mailSent: true
                                                                })
                                                                    .save()
                                                                    .then(async () => {

                                                                        await klist.deleteOne({ _id: prospect._id });
                                                                    })
                                                                    .catch(err => console.log(err));

                                                            }
                                                        })

                                                        .catch(err => console.log(err));
                                                    sentEmailCount++;
                                                }

                                            }
                                        }
                                        else if (phonesArray.length > 0 && emailProArray.length === 0) {
                                            // Vérifier si l'élément existe déjà dans la base de données
                                            ProsK.findOne({ campagneId: campId, userId: userIds, num: num })
                                                .then(existingProspect => {
                                                    if (existingProspect) {
                                                        console.log("Prospect déjà existant dans la base de données !");
                                                    } else {
                                                        // Ajouter l'élément dans la base de données
                                                        new ProsK({
                                                            linkId: prospect.linkId,
                                                            campagneId: campId,
                                                            userId: userIds,
                                                            nom: prospect.nom,
                                                            prenom: prospect.prenom,
                                                            num: num,
                                                            ToCall: true
                                                        })
                                                            .save()
                                                            .then(async () => {

                                                                await klist.deleteOne({ _id: prospect._id });
                                                            })
                                                            .catch(err => console.log(err));
                                                    }
                                                })
                                                .catch(err => console.log(err));
                                        }
                                        else if (phonesArray.length === 0 && emailProArray.length === 0) {
                                            console.log("pas d'enrichissement pour cette perssonne !")
                                            await klist.deleteOne({ _id: prospect._id });
                                        }

                                        else {
                                            for (let email of emailProArray) {
                                                let mailSent = await mailSender(email);
                                                if (mailSent === true) {

                                                    let existingEntry = await ProsK.findOne({ email: email }).exec();
                                                    if (existingEntry) {
                                                        console.log("Entrée déjà existante avec cet email :", existingEntry);
                                                    } else {

                                                        new ProsK({
                                                            linkId: prospect.linkId,
                                                            campagneId: campId,
                                                            userId: userIds,
                                                            nom: prospect.nom,
                                                            prenom: prospect.prenom,
                                                            email: email,
                                                            mailSent: true,
                                                        })
                                                            .save()
                                                            .then(async () => {
                                                                console.log("Enregistré avec succès !");

                                                                await klist.deleteOne({ _id: prospect._id });
                                                            })
                                                            .catch(err => console.log(err));
                                                    }
                                                    sentEmailCount++;
                                                } else if (mailSent === false) {
                                                    // Vérifier si une entrée existe déjà avec ce numéro
                                                    let existingEntry = await ProsK.findOne({ num: num }).exec();
                                                    if (existingEntry) {
                                                        console.log("Entrée déjà existante avec ce numéro :", existingEntry);
                                                    } else {
                                                        // Enregistrer la nouvelle entrée
                                                        new ProsK({
                                                            linkId: prospect.linkId,
                                                            campagneId: campId,
                                                            userId: userIds,
                                                            nom: prospect.nom,
                                                            prenom: prospect.prenom,
                                                            num: num,
                                                            ToCall: true
                                                        })
                                                            .save()
                                                            .then(async () => {
                                                                console.log("Enregistré avec succès !");
                                                                await klist.deleteOne({ _id: prospect._id });
                                                            })
                                                            .catch(err => console.log(err));
                                                    }
                                                }
                                            }

                                        }
                                    }
                                    //processedCount++

                                }

                                if (prospects.length === 0) {
                                    klist.deleteMany({ campagneId: campId, user: userIds })
                                        .then(() => {
                                            console.log("Tous les liens ont été traités.");
                                            // Mettre à jour NameListProspet à l'étape 3

                                        })
                                        .catch(err => console.log("Erreur lors de la mise à jour de NameListProspet :", err));
                                    NameListProspet.findOneAndUpdate(
                                        { _id: campId }, // Rechercher la campagne par son ID
                                        { $set: { step: 3, completed: true, active: false } },
                                        { new: true } // Renvoyer la version mise à jour de la campagne
                                        // envoyé un mail pour dire que la campagne a fini 
                                    )
                                        .then(async (updatedCampaign) => {
                                            console.log("NameListProspet mis à jour avec succès :", updatedCampaign);
                                            const mail = await mailForCampaignFinished(emails, prenom, updatedCampaign.nameListProspect)
                                            if (mail === true) {
                                                console.log("mail envoyé avec success ! ")
                                            }
                                            else {
                                                console.log("mail non envoyé")
                                            }

                                        })
                                        .catch(err => console.log("Erreur lors de la mise à jour de NameListProspet :", err));

                                }
                                else {
                                    console.log("Certains liens n'ont pas été traités.");
                                }

                            }


                        })
                        .catch(err => console.log(err))

                    // ICI ON LANCE LA FONCTION KASPR POUR TRAITÉ TOUT LES LIENS DEDANS par rapport à l'id de user et l'id de la campagne 
                    // SI UN LIEN RENVOIE MAIL LUI ENVOYER UN MAIL ET STOCKER SON MAIL ET NUM DANS LA BASE DE DONNÉES SI UN LIEN NE RENVOIE PAS DE MAIL 
                    //VOIR SI ON A SON NUM ET LE STOCKER DANS LA MEME BDD SI NI MAIL NI NUM NE RIEN FAIRE MAIS DANS TOUT LES CAS UNE FOIS QUE TOUT LES LIENS
                    //SERONT TRAITÉS RETIRER LE TOUT DE DE KLIST 
                    //METTRE LA CAMPAGNE SUR STEP 3 et la METTRE SUR COMPLETED TRUE 
                } else {
                    console.log("veuillez attendre que tout les liens soient traités !");
                }
            }
        });

        app.get("/invitePending", authMiddleware, (req, res) => {
            const user = req.user.userId
            NameListProspet.findOne({ userId: user, active: true })
                .then(result => {
                    console.log(result)
                    if (result) {
                        personInvitationPendingSchema.find({ user, campagneId: result._id })
                            .then(data => { res.json({ perssone: data }) })
                            .catch(err => { res.json({ err: err }) })
                    }
                    else {
                        console.log("no result")
                    }

                })

        })
        app.post("/personPending", authMiddleware, (req, res) => {
            const user = req.user.userId;
            const personId = req.body;

            Links.find({ _id: { $in: personId }, user })
                .then(result => {
                    res.json({ personnes: result });
                })
                .catch(err => {
                    res.json({ error: err });
                });

            console.log(personId);
        });

        app.get("/klist", authMiddleware, (req, res) => {
            const user = req.user.userId
            NameListProspet.findOne({ userId: user, active: true })
                .then(result => {
                    if (result) {
                        klist.find({ user, campagneId: result._id })
                            .then(resultat => {
                                res.json({ resultat })
                            })
                            .catch(err => console.log(err))
                    }
                })


        })

        app.get("/sendMailForCheckStep", authMiddleware, (req, res) => {

            const user = req.user
            console.log("TEST", user)


        })

        // Créer une route pour arrêter le processus
        app.post("/stop-campaign", authMiddleware, async (req, res) => {
            const user = req.user.userId
            try {

                const campActiv = NameListProspet.findOne({ userId: user, active: true, completed: false })
                    .then(async (campagne) => {


                        QueueItem.deleteMany({ user, nameListProspectId: campagne._id })
                            .then((queus) => { console.log("queus deleted successfully ! ", queus) })
                            .catch(err => { console.log(err) })

                        await NameListProspet.findOneAndUpdate(
                            { active: true },
                            { $set: { active: false, completed: true, step: 3 } },
                            { new: true }
                        );


                        klist.deleteMany({ user, campagneId: campagne._id })
                            .then((klist) => { console.log("klist deleted successfully ! ", klist) })
                            .catch(err => { console.log(err) })

                        SuivisReponse.deleteMany({ user, campagneId: campagne.id })
                            .then((suivisRes) => { console.log("suivisRes deleted successfully ! ", suivisRes) })
                            .catch(err => { console.log(err) })

                        personInvitationPendingSchema.deleteMany({ user, campagneId: campagne.id })
                            .then((invitePend) => { console.log("invitePend deleted successfully ! ", invitePend) })
                            .catch(err => { console.log(err) })

                        return res.status(200).json({ message: "La campagne a été arrêté avec succès." });
                    })
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Une erreur s'est produite lors de l'arrêt du processus." });
            }
        });


        app.get("/campaign-finished", authMiddleware, (req, res) => {
            res.render("campagnes")

        })

        app.get("/all-campaigns-finished", authMiddleware, (req, res) => {
            const user = req.user.userId
            console.log(user)
            NameListProspet.find({ active: false, completed: true, userId: user })
                .then(result => {
                    const nameListProspectIds = result.map((results) => results._id);
                    Links.find({ user: user, nameListProspectId: { $in: nameListProspectIds } })

                        .then(data => {
                            ProsK.find({ campagneId: { $in: nameListProspectIds }, userId: user })
                                .then(prosK => {
                                    res.json({ data, result, prosK })
                                })
                                .catch(err => console.log(err))




                        })
                        .catch("an error occured !")
                })
                .catch("an error occured ! ")
        })

        app.get("/addingProspectinCampagne", authMiddleware, async (req, res) => {
            const message = req.query.message;
            const nom = req.query.nom;
            const lien_linkedin = req.query.lien;
            const user = req.user.userId

            const liensLinkedin = req.query.LiensLinkedin

            let tableauLienLinkedin = JSON.parse(decodeURIComponent(liensLinkedin))


            console.log(tableauLienLinkedin)
            console.log(tableauLienLinkedin.length)
            console.log(typeof tableauLienLinkedin)



            Li_at.findOne({ user })
                .then(async result => {

                    const adding = await addProspect(result.li_at, lien_linkedin, message);
                    console.log(adding);

                    InvitationAll.findOneAndUpdate(
                        { nom, lien_linkedin, statut: adding.status }, // condition de recherche
                        {   // données à insérer ou mettre à jour
                            nom,
                            lien_linkedin,
                            statut: adding.status,
                            user: req.user.userId
                        },
                        {
                            upsert: true, // si non trouvé, crée un nouvel enregistrement
                            new: true, // retourne le document modifié plutôt que l'original
                            runValidators: true // valide le document avant les mises à jour
                        }
                    )
                        .then(response => {
                            console.log(response)

                            res.json({
                                lien_linkedin,
                                status: adding.status,
                            });
                        })
                        .catch(err => {
                            if (err.code === 11000) {  // 11000 est le code d'erreur pour les violations d'unicité dans MongoDB
                                console.log('Duplicate key error: ' + err);
                                // Gérer l'erreur, par exemple en envoyant une réponse appropriée
                            } else {
                                console.log(err)
                            }
                        });

                })
                .catch(err => console.log(err));
        });


        app.get("/getAllInvitationFromDataBase", authMiddleware, (req, res) => {

            InvitationAll.find({ user: req.user.userId, statut: "Invitation en attente" })

                .then(result => {
                    res.json(result)
                    console.log("ALLL INVITATION FROM DATABASE", result)
                })
                .catch(err => console.log(err))

        })

        app.use("/favoris", authMiddleware, routerFavoris)


        // vérifier si le prospect est dans les favoris
        app.get("/favoris/status", authMiddleware, (req, res) => {
            const prospectId = req.query.prospectId;
            console.log("PROSPECTID", prospectId)
            Favoris.findOne({ prospectId: prospectId })
                .then(result => {
                    if (result) {
                        res.json({ isFavorite: true });
                    } else {
                        res.json({ isFavorite: false });
                    }
                })
                .catch(err => console.log(err));
        });

        // ajouter un prospect aux favoris
        app.get("/favoris/add", authMiddleware, (req, res) => {
            const prospectId = req.query.prospectId;
            const user = req.user.userId
            ProspectRechecheModels.findOne({ _id: prospectId })
                .then(result => {
                    new Favoris({
                        userId: user,
                        photo_profile: result.photo_profile,
                        profile: result.profile,
                        emploie: result.emploie,
                        lieu_emploie: result.lieu_emploie,
                        lien_linkedin: result.lien_linkedin,
                        nameListProspect: result.nameListProspect,
                        prospectId,
                    })
                        .save()
                        .then(result => {
                            res.json(result)
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log("utilisateur introuvable"))
        });

        // enlever un prospect des favoris
        app.get("/favoris/remove", authMiddleware, (req, res) => {
            const prospectId = req.query.prospectId;

            Favoris.deleteOne({ prospectId: prospectId })
                .then(result => {
                    res.json({ removed: true });
                })
                .catch(err => console.log(err));
        });

        app.get("/get-favoris", authMiddleware, (req, res) => {
            const user = req.user.userId

            Favoris.find({ userId: user })
                .then(result => {
                    res.json({ result })
                })
                .catch(err => console.log(err))
        })



        app.get('/getAllInvitationFromLinkedin', authMiddleware, async (req, res) => {

            await Li_at.findOne({ user: req.user.userId })
                .then(async (result) => {
                    const invitations = await verificationAcceptation(result.li_at)
                    console.log("ALLL INVITATION FROM LINKEDIN", invitations)
                    res.json({
                        invitations,
                    })
                })
                .catch(err => console.log(err))


        })





        app.get("/findMails", authMiddleware, (req, res) => {

        })


        app.get("/campaigns/:id", authMiddleware, (req, res) => {


            const listID = req.params.id



            ProspectRechecheModels.find({ nameListProspect: listID })
                .then((result) => {
                    res.json((result));


                }
                )
                .catch((err) => {
                    console.log(err)
                }
                )

        })


        app.get("/enrichissementForDrop", authMiddleware, (req, res) => {
            Li_at.findOne({ user: req.user.userId })
                .then(async (result) => {
                    ProspectRechecheModels.find({ _id: prospectId })
                        .then(async (dataProspect) => {
                            console.log(dataProspect)
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        })


        app.get("/enrichissements", authMiddleware, async (req, res) => {

            Li_at.findOne({ user: req.user.userId })
                .then(async (data) => {

                    console.log("Voici votre LI_AT", data)
                    const lien = req.query.lien
                    const prospectId = req.query.prospectId
                    console.log(prospectId)
                    ProspectRechecheModels.findOne({ _id: prospectId })
                        .then(async (prospect) => {
                            console.log(prospect)
                            const enrich = await enrichissement(lien, data.li_at)

                            try {
                                console.log(enrich)
                                new ProspectEnrichis({
                                    nom_complet: enrich.Nom,
                                    Entreprise: enrich.Entreprise,
                                    Poste: enrich.Poste,
                                    NombreDeRelationDuProspect: enrich.NombreDeRelationDuProspect,
                                    lien_linkedin_entreprise: enrich.lien_linkedin_entreprise,
                                    experience: enrich.experience,
                                    entreprise_actuelle: enrich.entreprise_actuelle,
                                    temp_en_entreprise: enrich.temp_en_entreprise,
                                    nameListProspect: prospect.nameListProspect,
                                    ProspectRechecheModels: prospect._id

                                })
                                    .save()
                                    .then(newData => {
                                        console.log("BIEN ENREGISTRER", newData)


                                    }
                                    )




                                    .catch(err => console.log(err))




                            }
                            catch (err) {
                                console.log(err)
                            }
                        })
                        .catch(err => console.log(err))



                })


        })



        app.get("/campagne_mailing", authMiddleware, (req, res) => {

            res.render('Campagne_mailing')



        })

        app.get("/campagnes_mailing/:campaignId", authMiddleware, (req, res) => {

            const campagneId = req.params.campaignId
            const test = req.query.test
            console.log("TEssssssST", test)
            ProspectRechecheModels.find({ nameListProspect: campagneId })
                .then((result) => {

                    res.json(result)
                })
                .catch((err) => {

                    console.log(err)

                }
                )

        })


        app.post("/campagnes_mailing/:campaignId", authMiddleware, (req, res) => {
            const test = req.query.test
            console.log("TEssssssST", test)
            const campagneId = req.params.campaignId
            console.log("TEST", campagneId)
            const { persons } = req.body
            console.log(persons)
            ProspectRechecheModels.find({ nameListProspect: campagneId, })
                .then((result) => {

                    res.json(result)
                })
                .catch((err) => {

                    console.log(err)

                }
                )

        })
        app.get("/campagnes_mailing/:campaignId/:persons", authMiddleware, (req, res) => {
            const persons = req.params.persons.split(",")
            const personsArray = [];
            persons.forEach((person) => {
                const personId = person.substring(person.indexOf('=') + 1);
                personsArray.push(personId);
            });

            console.log("personsArray", personsArray);



            const campagneId = req.params.campaignId
            console.log("TEST", campagneId)


            ProspectRechecheModels.find({ nameListProspect: campagneId, _id: { $in: personsArray } })
                .then((result) => {

                    res.json(result)
                })
                .catch((err) => {

                    console.log(err)

                }
                )

        })

        app.get("/deleteInvitation", authMiddleware, (req, res) => {

            Li_at.findOne({ user: req.user.userId })
                .then(async (result) => {
                    const resultOfDelete = await deleteInvitationOnHold(result.li_at)

                    res.json({ resultOfDelete })
                })
                .catch(err => console.log(err))
        })


        app.get("/Testing_li_at", authMiddleware, (req, res) => {

            Li_at.findOne({ user: req.user.userId })
                .then(async (result) => {
                    const verification = await testingLiAt(result.li_at)
                    res.json({ verification })
                })
                .catch((err) => {
                    console.log(err)
                })

        })

        app.get("/donnees/:listId", authMiddleware, async (req, res) => {
            const userInput = req.originalUrl
            const listId = req.params.listId

            const url = removeBeforeHttps(userInput)

            Li_at.findOne({ user: req.user.userId })
                .then(async (result) => {
                    console.log("YUSSSS", result.li_at)
                    const jsonData = await getLinks(url, result.li_at)
                    if (!jsonData) {
                        console.log("serveuuuuuuuuuuuuuuuuuuur")
                    }
                    let compteur = 0
                    if (jsonData != null) {

                        for (let i = 0; i < jsonData.length; i++) {
                            const element = jsonData[i];
                            const Prospect = new ProspectRechecheModels({
                                photo_profile: element.photo_profile.src,
                                profile: element.profile,
                                emploie: element.emploie,
                                lieu_emploie: element.lieu_emploie,
                                entreprise_actuelle: element.entreprise_actuelle,
                                lien_linkedin: element.lien_linkedin,
                                email: element.email,
                                tel: element.tel,
                                nameListProspect: listId,
                            })
                            Prospect.save()
                                .then((result) => {

                                    console.log("Prospect enregistré avec succès", result)

                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                            compteur++

                        }

                        console.log(`Nombre de prospect : ${compteur}`)
                        res.json(jsonData)


                    } else {
                        res.json("Pas de données")
                    }

                }
                )
                .catch((err) => {
                    console.log(err)
                }
                )

        })


        app.get("/Sourcing", authMiddleware, (req, res) => {

            res.render("Sourcing", { message: null })
            Li_at.findOne({ user: req.user.userId })
                .then((result) => {
                    console.log("YUSSSS", result.li_at)
                }
                )
                .catch((err) => {
                    console.log(err)
                }
                )

        })

        function removeBeforeHttps(str) {
            const httpsIndex = str.indexOf("https");
            return str.slice(httpsIndex);
        }

        app.get("/li_at", (req, res) => {
            res.render("li_at")

        })

        app.get("/modify", authMiddleware, (req, res) => {
            res.render("modify")
        })

        app.post('/li_at', (req, res) => {
            const li_at = req.body.li_at;
            const userId = req.session.userId

            const newLi_at = new Li_at({
                li_at: li_at,
                user: userId
            });

            newLi_at.save()
                .then((result) => {
                    console.log("li_at enregistré avec succès dans la base de données Li_at");
                    delete req.session.userId
                    res.json({ li_at: result });
                })
                .catch((err) => {
                    console.log(err);
                });
        });



        app.get("/recup", authMiddleware, (req, res) => {
            Li_at.findOne({ user: req.user.userId })
                .then(async (result) => {
                    console.log("THIS IS LI_AT UN RECUP", result.li_at)
                    res.json({ li_at: result.li_at, user: req.user.userId, li_at_id: result._id })

                })
        })

        app.put('/modify/:id', authMiddleware, (req, res) => {
            const li_atId = req.params.id;
            const li_at = req.body.li_at;
            const userId = req.user.userId;

            console.log("li_atID", li_atId);
            console.log("li_at", li_at);
            console.log("userId", userId);

            const userIdObject = new ObjectId(userId);
            console.log("userIdObject", userIdObject);

            Li_at.findById(li_atId).exec()
                .then(foundLi_at => {
                    console.log("foundLi_at", foundLi_at.user);
                    if (foundLi_at.user.equals(userIdObject)) {

                        foundLi_at.li_at = li_at;
                        console.log("li_at modifié");
                        return foundLi_at.save().then(result => {
                            res.json({ li_at: result });
                        });
                    } else {
                        return res.status(403).send("Vous n'êtes pas autorisé à modifier ce li_at");
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send("Erreur serveur lors de la sauvegarde de li_at modifié");
                });
        });







        app.get("/sendmail", (req, res) => {
            res.render("sendmail")
        })
        // app.get("/data/:paras", async (request, response, next) => {

        //     if (request.params.paras == 'visits') {

        //         let result = await getProfileVisits()
        //         response.json(result)
        //         next()
        //     } else {
        //         let parametre = request.params.paras

        //         console.log(`Parametre : ${parametre}`)
        //         let result = await getLinks(parametre);

        //         response.json(result)

        //         next()
        //     }

        // })





        // MIDDLEWARE RECUPERER AMIS
        app.get("/freind", async (req, res, next) => {
            let result = await getRelationPersons()
            res.json(result)
            next()
        })



        app.get("/visits", async (req, res, next) => {

            let result = await getProfileVisits()
            res.json(result)
            next()
        })


        //MIDDLEWARE VISITS NUMBER 



        app.get("/getProfileViewCount", authMiddleware, async (req, res, next) => {



            Li_at.findOne({ user: req.user.userId })
                .then(async (result) => {
                    console.log("THIS IS LI_AT UN RECUP1", result.li_at)

                    let getProfileViewCountR = await getProfileViewCount(result.li_at)

                    const evolutionLinkedIn = new EvolutionLinkedIn({
                        userId: req.user.userId,
                        VuesDuProfil: getProfileViewCountR
                    });
                    evolutionLinkedIn.save()
                        .then((result) => {
                            console.log("EvolutionLinkedIn enregistré avec succès dans la base de données");
                            res.json({ evolutionLinkedIn: result, getProfileViewCountR });
                            console.log("THIS IS EVOLUTION LINKEDIN", getProfileViewCountR)
                        }
                        )
                        .catch((err) => {
                            console.log(err);
                        }
                        );

                })
                .catch(err => {
                    if (err.message = 'net::ERR_TOO_MANY_REDIRECTS') {
                        res.status(400).json({ msgError: "Erreur li_at" })
                    }
                    else {
                        console.log("err")
                    }
                })

        })

        app.get("/getRelationNumb", authMiddleware, async (req, res, next) => {

            Li_at.findOne({ user: req.user.userId })
                .then(async (result) => {
                    console.log("THIS IS LI_AT UN RECUP2", result.li_at)
                    let getRelationNumbR = await getRelationNumb(result.li_at)
                    const evolutionDesRelation = new EvolutionLinkedIn({
                        userId: req.user.userId,
                        Relation: getRelationNumbR
                    })
                    evolutionDesRelation.save()
                        .then((result) => {
                            console.log("evolution Des Relation enregistré avec succès dans la base de données");
                            res.json({ evolutionDesRelation: result, getRelationNumbR });
                            console.log("THIS IS EVOLUTION LINKEDIN", getRelationNumbR)
                        }
                        )
                        .catch((err) => {
                            console.log(err);
                        }
                        );

                })
                .catch(err => {
                    if (err.message = 'net::ERR_TOO_MANY_REDIRECTS') {
                        res.status(400).json({ msgError: "Erreur li_at" })
                    }
                    else {
                        console.log("err")
                    }
                })

        })

        app.get("/invitationOnHold", authMiddleware, async (req, res, next) => {
            Li_at.findOne({ user: req.user.userId })
                .then(async (result) => {
                    console.log("THIS IS LI_AT UN RECUP3", result.li_at)
                    let invitationHoldinR = await invitationOnHold(result.li_at)
                    console.log(invitationHoldinR)
                    const EvolutionDesInvitation = new EvolutionLinkedIn({
                        userId: req.user.userId,
                        enAttente: invitationHoldinR
                    })
                    EvolutionDesInvitation.save()
                        .then((result) => {
                            console.log("EvolutionDesInvitation enregistré avec succès dans la base de données");
                            res.json({ EvolutionDesInvitation: result, invitationHoldinR });
                            console.log("THIS IS EVOLUTION LINKEDIN", invitationHoldinR)
                        }
                        )
                        .catch((err) => {
                            console.log(err);
                        }
                        );
                })
                .catch(err => {
                    if (err.message = 'net::ERR_TOO_MANY_REDIRECTS') {
                        res.status(400).json({ msgError: "Erreur li_at" })
                    }
                    else {
                        console.log("err")
                    }
                })

        })


        app.get("/dataForChart", authMiddleware, (req, res) => {
            const user = req.user.userId;
            EvolutionLinkedIn.find({ userId: user }, { enAttente: 1, Relation: 1, VuesDuProfil: 1, _id: 0 })
                .then((data) => {

                    const tableauRelation = []
                    const tableauEnAttente = []
                    const tableauViews = []
                    for (let i = 0; i < data.length; i++) {


                        tableauRelation.push(data[i].Relation)
                        tableauEnAttente.push(data[i].enAttente)
                        tableauViews.push(data[i].VuesDuProfil)
                    }


                    function CleanTables(table) {
                        return [... new Set(table)]
                    }

                    res.json({
                        Relation: CleanTables(tableauRelation),
                        EnAttente: CleanTables(tableauEnAttente),
                        VuesDuProfil: CleanTables(tableauViews),
                    }); // envoyer les données au format JSON
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send("Erreur lors de la récupération des données");
                });
        });







        app.get("/inscription", (req, res) => {

            res.render("inscription", { message: null })
        })

        app.post('/inscription', async (req, res) => {
            const { nom, username, email, password, repetedPassword, photo } = req.body;

            // Vérifiez que les mots de passe sont identiques
            if (password !== repetedPassword) {
                const messageError = "Les mots de passe ne sont pas identiques !"
                return res.status(400).json({ message: messageError });
            }
            // Hash le mot de passe avant de le stocker en base de données
            const hash = bcrypt.hashSync(password, 10);

            const data = {
                nom,
                username,
                email,
                password: hash,
                repetedPassword: hash,
                role: 'user'
            };

            console.log(req.files.photo) // FIXED: make sure the file is uploaded

            if (req.files && req.files.photo) {

                data.photo = req.files.photo.name;

                const folderPath = path.join(__dirname, './public/assets/uploads/', username);

                fs.mkdirSync(folderPath, { recursive: true });
                const localPath = path.join(folderPath, req.files.photo.name);
                await req.files.photo.mv(localPath);
                console.log('Image saved to:', localPath);
            } else {
                data.photo = './public/assets/Access_icon.ico';
                console.log('No image received. Using default image.');
            }
            // Validez les données avec le schéma de validation
            const { error } = validationInscriptionSchema(data).userInscription;
            if (error) {
                const messageError = `${error.details[0].message}`
                return res.render("page-error", { message: messageError })
            }

            // Enregistrez l'utilisateur en base de données
            new UserInscription(data)
                .save()
                .then(user => {
                    const token = jwt.sign({ userId: user._id, email }, keySec, { expiresIn: "12h" });
                    user.token = token;
                    req.session.userId = user._id;
                    res.json(user);
                })
                .catch(err => {
                    console.error(err);
                    const messageError = "Une erreur s'est produite lors de la création de l'utilisateur"
                    return res.render('page-error', { message: messageError });
                });
        });



        app.get("/connexion", (req, res) => {
            res.render("connexion", { message: "" })

        })

        app.get("/index", (req, res) => {
            res.render("index")
        })

        app.post('/connexion', async (req, res) => {

            //res.setHeader('Cache-Control', 'no-cache');
            const { email, password } = req.body;
            // Recherchez l'utilisateur en base de données
            try {
                const user = await UserInscription.findOne({ email: email });
                if (!user || !bcrypt.compareSync(password, user.password) || user.role !== "user") {
                    const errorMessage = "Adresse email ou mot de passe incorrect !";
                    return res.json({ messageError: errorMessage });
                }

                const token = jwt.sign({ userId: user.id, email: email }, keySec, { expiresIn: "2h" });

                // Stockez le token JWT dans un cookie sécurisé (avec l'option httpOnly pour empêcher le script côté client de lire le cookie)
                res.cookie('access_token', token, { httpOnly: false, secure: false });

                console.log("token :", token)


                // Envoyez une réponse avec le token JWT




                res.redirect("/dashbord")
            } catch (err) {
                console.error(err);
                res.status(500).json({ erreur: "Erreur Serveur !" });
            }

        });


        app.get("/dashbord", authMiddleware, async (req, res) => {



            const user = req.user.userId

            res.render("Dashbord")




        })

        app.get("/infos", authMiddleware, (req, res) => {
            const user = req.user.userId
            UserInscription.findById(user)

                .then(user => {
                    res.json({ nom: user.username, username: user.username, photo: user.photo })
                })
                .catch((err) => {
                    console.log(err)
                }
                )
        })

        app.get("/campagne", authMiddleware, (req, res) => {

            res.render("CampagneActive")


        })

        app.get("/campagneElement/:campaignId", authMiddleware, (req, res) => {

            const idOfCampaign = req.params.campaignId
            const user = req.user.userId

            NameListProspet.findOne({ _id: idOfCampaign, userId: user })
                .then(data => {
                    const inQueueTruePromise = Links.find({ inQueue: true, nameListProspectId: idOfCampaign, user });
                    const inQueueFalsePromise = Links.find({ inQueue: false, nameListProspectId: idOfCampaign, user });
                    const linksData = Links.find({ nameListProspectId: idOfCampaign, user });
                    Promise.all([inQueueTruePromise, inQueueFalsePromise, linksData])
                        .then(([inQueueTrueResult, inQueueFalseResult, linksData]) => {
                            res.json({ results: { inQueueTrue: inQueueTrueResult, inQueueFalse: inQueueFalseResult, prospects: linksData }, data: data });
                        })
                        .catch(err => console.log(err));


                })
        })

        app.delete("/deleteProspectfromProcess/:prospectId", authMiddleware, (req, res) => {

            const user = req.user.userId
            const prospectId = req.params.prospectId



            Links.findOneAndDelete({ processed: true, inQueue: false, _id: prospectId, user })
                .then(result => res.json({ message: "supprimé avec success ! ", result }))
                .catch(err => res.json({ message: "Non supprimé ", err }))
        })



        app.get("/leads", authMiddleware, (req, res) => {

            res.render("leads")

        })



        app.get("/page-error", (req, res) => {
            res.render("page-error", { message: null })
        })

        app.get("/deconnexion", (req, res) => {
            req.session.destroy(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.clearCookie('access_token')
                    res.clearCookie('AL')
                    res.redirect('/connexion');

                }
            });
        })


        app.post("/nameListProspect", authMiddleware, async (req, res) => {
            const nameListProspect = req.body.nameListProspect;
            const user = req.user.userId;

            try {
                const existingNameList = await NameListProspet.findOne({
                    nameListProspect: nameListProspect,
                    userId: user,
                });

                if (existingNameList) {
                    res.status(400).json({ message: "La liste existe déjà." });
                } else {
                    const nameList = new NameListProspet({
                        nameListProspect: nameListProspect,
                        userId: user,
                    });
                    const result = await nameList.save();

                    res.json(result);
                }
            } catch (err) {
                res.status(500).json({ message: "Erreur serveur." });
                console.error(err);
            }
        });


        app.get("/nameListProspect", authMiddleware, async (req, res) => {
            try {
                const user = req.user.userId; // Récupère l'ID de l'utilisateur connecté à partir du middleware
                const result = await NameListProspet.find({ userId: user }); // Récupère uniquement les listes de noms de prospects de l'utilisateur connecté
                res.json(result);
            } catch (err) {
                res.status(500).json({ message: 'Erreur serveur.' });
            }
        });

        app.get("/nameListProspect/:id", authMiddleware, async (req, res) => {
            try {
                const listeID = req.params.id;

                const result = await NameListProspet.findOne({ _id: listeID });
                res.json(result);
            } catch (err) {
                res.status(500).json({ message: 'Erreur serveur.' });
            }
        });


        app.delete("/nameListProspect/:id", authMiddleware, async (req, res) => {
            try {
                const listeID = req.params.id;

                const result = await NameListProspet.deleteOne({ _id: listeID });
                res.json(result);
            } catch (err) {
                res.status(500).json({ message: 'Erreur serveur.' });
            }
        });

        app.put("/nameListProspect/:id", authMiddleware, async (req, res) => {
            try {
                const listeID = req.params.id;
                const nameListProspect = req.body.nameListProspect;
                const user = req.user.userId;


                const result = await NameListProspet.updateOne({ _id: listeID }, { nameListProspect: nameListProspect });
                res.json(result);
            } catch (err) {
                res.status(500).json({ message: 'Erreur serveur.' });
            }
        });



        app.get("/", (req, res) => {
            res.redirect("connexion")
        })



        app.get("/ProspectRechecheModels/:id", authMiddleware, async (req, res) => {
            try {

                const listeID = req.params.id;

                const result = await ProspectRechecheModels.find({ nameListProspect: listeID });

                res.json(result);

            } catch (err) {

                res.status(500).json({ message: 'Erreur serveur.' });

            }

        });

        app.use((req, res, next) => {
            res.render('page-not-found')
        })

        app.listen(port, () => {
            console.log(`running at http://127.0.0.1:${port}`)
        })

    } catch (error) {
        console.error(error)
    }
}




//getWhoVisitMyProfil()


main()


// Usage