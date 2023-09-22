const puppeteer = require("puppeteer")



async function verifyInvitationStatus(li_at, lien_linkedin, prenom) {
  const browser = await puppeteer.launch({
    args: [
      '--enable-features=NetworkService',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--shm-size=3gb', // this solves the issue
    ],
    ignoreHTTPSErrors: true,
    headless: true,
    defaultViewport: {
      width: 1300,
      height: 550
    },
    executablePath: "/usr/bin/chromium"
  });

  try {
    const message = `Bonjour ${prenom},
Ravi de rejoindre votre réseaux…
Pour me présenter brièvement, je suis analyste en maitrise énergétique pour la société ACCESS ENERGIES et à la différence des courtiers en énergies qui propose de faire des économies en renégociant votre contrat, nous accompagnons les entreprises de toute taille à maitriser et optimiser le budget énergétique en agissant sur chaque composante de votre facture en balayant l’ensemble du spectre énergétique.
Pourriez vous à votre tour vous présenter brièvement et me dire qu’elle a était l’impact de la crise énergétique sur votre budget et les actions mis en place ?
        `

    let page = await browser.newPage();

    // Définir le cookie de connexion
    await page.setCookie({
      name: "li_at",
      value: li_at,
      domain: "www.linkedin.com",
    });

    // Accéder au profil LinkedIn
    await page.goto(lien_linkedin, { waitUntil: "networkidle2" });

    await page.waitForSelector(".pvs-profile-actions");

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
      await messageButton.click();


      await page.waitForSelector(messageContainer); // Utilisez waitFor avec le sélecteur CSS

      await page.click(messageContainer);
      for (let i = 0; i < message.length; i++) {
        await page.type(messageContainer, message[i], { delay: Math.random() * 100 + 50 }); // Délai entre 50 et 150 ms
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500)); // Pause aléatoire
      }

      const btn_envoyer_mtn = ".msg-form__send-button.artdeco-button.artdeco-button--1";

      await page.waitForSelector(btn_envoyer_mtn);


      await new Promise(resolve => setTimeout(resolve, Math.random() * 4000 + 1000)); // Délai entre 1 et 3 secondes

      await page.click(btn_envoyer_mtn);

      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));

      await browser.close();

      return true

    } else {

      await browser.close();
      return false

    }
  } catch (err) {
    console.log(err);
    await browser.close();


  }
}




module.exports = verifyInvitationStatus