const puppeteer = require("puppeteer");
require('./../Helpers/Brwoser'); // Assurez-vous que le chemin est correct

async function verifyResponsePerson(li_at, lien_linkedin) {
  const browser = await initializeBrowser(); // Assurez-vous que la fonction initializeBrowser() est définie

  try {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let page = await browser.newPage();

    // Définir le cookie de connexion LinkedIn
    await page.setCookie({
      name: "li_at",
      value: li_at,
      domain: "www.linkedin.com",
    });

    // Accéder au profil LinkedIn donné
    await page.goto(lien_linkedin);

    // Attendre que le sélecteur ".pvs-profile-actions" soit présent sur la page
    await page.waitForSelector(".pvs-profile-actions");

    // Vérifier si le bouton "Message" est disponible
    const isMessageAvailable = await page.evaluate(() => {
      const statusMessage = document.querySelector(
        ".entry-point.pvs-profile-actions__action > button"
      );

      return statusMessage.getAttribute("aria-label") ? true : false;
    });

    const messageButton = await page.$('.entry-point.pvs-profile-actions__action > button');
    const messageContainer = '.msg-form__contenteditable'; // Sélecteur CSS pour le champ de message

    if (isMessageAvailable) {
      // Cliquez sur le bouton "Message"
      await messageButton.click();

      // Attendez que le champ de message soit visible
      await page.waitForSelector(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled", { visible: true });

      // Effectuez des vérifications supplémentaires ici, si nécessaire

      // Exemple de vérification basée sur un délai
      const response1 = await new Promise(async (resolve) => {
        await delay(7000);

        const element = await page.evaluate(() => {
          const nbOfMessages = document.querySelectorAll(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled");
          return nbOfMessages.length;
        });

        console.log("Nombre de messages :", element);

        if (element > 1) {
          console.log("Réponse : true");
          await delay(4000);
          await browser.close();
          resolve(true);
        } else if (element <= 1) {
          console.log("Réponse : false");
          await delay(4000);
          await browser.close();
          resolve(false);
        }
      });

      console.log("RESPONSE", response1);
      await browser.close();
      return response1;
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (browser) {
      browser.close();
    }
  }
}

// Exemple d'utilisation de la fonction verifyResponsePerson
// verifyResponsePerson("Votre_token_li_at", "URL_du_profil_LinkedIn");

module.exports = verifyResponsePerson;
