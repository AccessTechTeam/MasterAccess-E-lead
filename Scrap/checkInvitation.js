const puppeteer = require("puppeteer");
require('./../Helpers/Brwoser'); // Assurez-vous que le chemin vers le module est correct

async function checkInvitation(li_at, lien_linkedin) {
    const browser = await initializeBrowser(); // Assurez-vous que la fonction initializeBrowser() est correctement définie

    try {
        let page = await browser.newPage();

        // Définir le cookie de connexion LinkedIn
        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com",
        });

        // Accéder au profil LinkedIn
        await page.goto(lien_linkedin, { waitUntil: "networkidle2" });

        // Attendre que le sélecteur ".pvs-profile-actions" soit présent sur la page
        await page.waitForSelector(".pvs-profile-actions");

        // Vérifier si le bouton "Message" est disponible sur le profil LinkedIn
        const isMessageAvailable = await page.evaluate(() => {
            const statusMessage = document.querySelector(
                ".entry-point.pvs-profile-actions__action > button "
            );
            return statusMessage.getAttribute("aria-label") ? true : false;
        });

        const messageButton = await page.$('.entry-point.pvs-profile-actions__action > button');
        const messageContainer = '.msg-form__contenteditable'; // Sélecteur CSS pour le champ de message

        if (isMessageAvailable) {
            console.log(true); // Le bouton "Message" est disponible sur le profil LinkedIn
            await browser.close();
            return true;
        } else {
            console.log(false); // Le bouton "Message" n'est pas disponible sur le profil LinkedIn
            await browser.close();
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

// Exportez la fonction pour l'utiliser ailleurs
module.exports = checkInvitation;
