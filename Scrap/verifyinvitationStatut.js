const puppeteer = require("puppeteer");
require('./../Helpers/Brwoser')

async function verifyInvitationStatus(li_at, lien_linkedin, prenom) {
  // Lancer le navigateur Puppeteer avec des options personnalisées
  const browser = await  initializeBrowser();

  try {
    const message = `Bonjour ${prenom},
Ravi de rejoindre votre réseau…
Pour me présenter brièvement, je suis analyste en maîtrise énergétique pour la société ACCESS ENERGIES. À la différence des courtiers en énergies qui proposent de faire des économies en renégociant votre contrat, nous accompagnons les entreprises de toute taille à maîtriser et optimiser le budget énergétique en agissant sur chaque composante de votre facture en balayant l’ensemble du spectre énergétique.
Pourriez-vous à votre tour vous présenter brièvement et me dire quel a été l'impact de la crise énergétique sur votre budget et les actions mises en place ?
`;

    let page = await browser.newPage();

    // Définir le cookie de connexion LinkedIn
    await page.setCookie({
      name: "li_at",
      value: li_at,
      domain: "www.linkedin.com",
    });

    // Accéder au profil LinkedIn
    await page.goto(lien_linkedin, { waitUntil: "networkidle2" });

    await page.waitForSelector(".pvs-profile-actions");

    // Vérifier si le bouton d'envoi de message est disponible
    const isMessageAvailable = await page.evaluate(() => {
      const statusMessage = document.querySelector(
        ".entry-point.pvs-profile-actions__action > button"
      );

      return statusMessage.getAttribute("aria-label") ? true : false;
    });

    console.log(isMessageAvailable);

    const messageButton = await page.$('.entry-point.pvs-profile-actions__action > button');
    const messageContainer = '.msg-form__contenteditable'; // Sélecteur CSS

    if (isMessageAvailable) {
      // Cliquer sur le bouton d'envoi de message
      await messageButton.click();

      await page.waitForSelector(messageContainer);

      await page.click(messageContainer);

      // Saisir le message caractère par caractère avec un délai aléatoire
      for (let i = 0; i < message.length; i++) {
        await page.type(messageContainer, message[i], { delay: Math.random() * 100 + 50 });
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
      }

      const btn_envoyer_mtn = ".msg-form__send-button.artdeco-button.artdeco-button--1";

      await page.waitForSelector(btn_envoyer_mtn);

      // Attendre un délai avant d'envoyer le message pour simuler un temps de réflexion
      await new Promise(resolve => setTimeout(resolve, Math.random() * 4000 + 1000));

      // Cliquer sur le bouton "Envoyer"
      await page.click(btn_envoyer_mtn);

      // Attendre un délai avant de fermer le navigateur pour éviter une fermeture brutale
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));

      await browser.close();

      return true;
    } else {
      // Si le bouton d'envoi de message n'est pas disponible, fermer le navigateur
      await browser.close();
      return false;
    }
  } catch (err) {
    console.log(err);
    await browser.close();
  }
}

module.exports = verifyInvitationStatus;
