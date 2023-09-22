const puppeteer = require("puppeteer");
require('./../Helpers/Brwoser'); // Assurez-vous que le chemin vers le module est correct

async function verifySecondResponsePerson(li_at, lien_linkedin) {
  const browser = await initializeBrowser(); // Assurez-vous que la fonction initializeBrowser() est correctement définie

  try {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
        ".entry-point.pvs-profile-actions__action > button"
      );

      return statusMessage.getAttribute("aria-label") ? true : false;
    });

    console.log(isMessageAvailable);
    const messageButton = await page.$('.entry-point.pvs-profile-actions__action > button');
    const messageContainer = '.msg-form__contenteditable'; // Sélecteur CSS pour le champ de message

    if (isMessageAvailable) {
      await messageButton.click();

      // Attendre que les bulles de message soient visibles
      await page.waitForSelector(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled", { visible: true });

      const response1 = await new Promise(async (resolve) => {
        await delay(5000);

        const element = await page.evaluate(() => {
          const nbOfMessages = document.querySelectorAll(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled");
          return nbOfMessages.length;
        });

        console.log("Nombre de messages :", element);

        if (element > 2) {
          console.log("Plus de 2 messages trouvés.");
          await delay(3000);
          await browser.close();
          resolve(true);
        } else if (element <= 2) {
          console.log("2 messages ou moins trouvés.");
          await delay(3000);
          await browser.close();
          resolve(false);
        }
      });

      console.log("Réponse :", response1);
      return response1;
    }
  } catch (err) {
    console.log(err);
    await browser.close();
    return false;
  }
}

// Exportez la fonction pour l'utiliser ailleurs
module.exports = verifySecondResponsePerson;
