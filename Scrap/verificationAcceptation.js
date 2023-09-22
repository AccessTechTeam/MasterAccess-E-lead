const puppeteer = require("puppeteer");

// Importez la fonction initializeBrowser depuis votre fichier d'aide
const { initializeBrowser } = require('./../Helpers/Brwoser');

async function checkMyLinkedinInvitation(li_at) {
  const browser = await initializeBrowser(); // Utilisez la fonction initializeBrowser pour initialiser le navigateur

  try {
    let page = await browser.newPage();

    // Configurez le cookie de connexion LinkedIn
    await page.setCookie({
      name: "li_at",
      value: li_at,
      domain: "www.linkedin.com",
    });

    // Accédez à la page des invitations LinkedIn
    await page.goto(
      `https://www.linkedin.com/mynetwork/invitation-manager/sent/?filterCriteria=&invitationType=&page=1`,
      {
        waitUntil: "networkidle2",
      }
    );

    // Attendez que la liste des invitations soit chargée
    await page.waitForSelector(".artdeco-list.mn-invitation-list");

    // Comptez le nombre d'invitations en attente
    const List_en_attente = await page.evaluate(() => {
      return document.querySelectorAll(
        ".artdeco-list.mn-invitation-list > .invitation-card.artdeco-list__item"
      ).length;
    });

    // Comptez le nombre de pages de pagination
    const numb_of_pages = await page.$$eval(
      "ul.artdeco-pagination__pages.artdeco-pagination__pages--number > li",
      (el) => el.length
    );

    console.log(numb_of_pages);
    console.log(List_en_attente);
    let compteur = 0;
    const invitationDetails = [];

    // Parcourez les pages de pagination
    while (compteur <= parseInt(numb_of_pages)) {
      await scrollDown(page);

      const nextButton = await page.$(
        ".artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view"
      );

      // Extrayez les détails des invitations sur la page actuelle
      const details = await page.evaluate(() => {
        const invitationElements = document.querySelectorAll(
          '.artdeco-list.mn-invitation-list > .invitation-card.artdeco-list__item'
        );
        const details = [];

        for (const element of invitationElements) {
          const name =
            element.querySelector('.invitation-card__title.t-16.t-black.t-bold')
              ?.innerText || '';
          const link =
            element.querySelector(".display-flex.flex-1.align-items-center.pl0 > a")
              ?.getAttribute("href") || '';
          const occupation =
            element.querySelector('.invitation-card__subtitle.t-14.t-black--light.t-normal')
              ?.innerText || '';
          const daysAgo = parseInt(
            element.querySelector('.time-badge.t-12.t-black--light.t-normal')
              ?.innerText.match(/\d+/)[0] || ''
          );
          const profileUrl =
            element.querySelector('.display-flex.flex-1.align-items-center.pl0 > a')
              ?.href || '';
          const messageElement = element.querySelector(
            '.invitation-card__custom-message-container .ember-view.invitation-card__custom-message.t-14.t-normal'
          );
          let message = '';
          if (messageElement) {
            message = messageElement.innerText;
          }
          console.log("DETAILS", name, link);
          details.push({ name, link, occupation, daysAgo, message, profileUrl });
        }

        return details;
      });

      invitationDetails.push(...details);
      if (nextButton) {
        await nextButton.click();
      }

      compteur++;

      // Attendez un délai aléatoire entre les pages
      await new Promise((resolve) =>
        setTimeout(resolve, randomCrawPagelTimer(1000))
      );
    }

    return invitationDetails;
  } catch (err) {
    console.log(err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Fonction pour générer un délai aléatoire entre les pages
function randomCrawPagelTimer(max) {
  let randomTime = Math.floor(Math.random() * max);
  console.log('Random time:', randomTime);
  return randomTime;
}

// Fonction pour faire défiler la page vers le bas
async function scrollDown(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const scrollStep = 100; // Hauteur de défilement à chaque étape
    const minDelay = 200; // Délai minimum entre chaque étape
    const maxDelay = 500; // Délai maximum entre chaque étape

    const scrollHeight = document.body.scrollHeight;
    let totalHeight = 0;

    while (totalHeight < scrollHeight) {
      const remainingHeight = scrollHeight - totalHeight;
      const currentScrollStep = Math.min(scrollStep, remainingHeight);

      window.scrollBy(0, currentScrollStep);
      totalHeight += currentScrollStep;

      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      await sleep(delay);
    }
  });
}

// Exportez la fonction pour l'utiliser dans d'autres modules
module.exports = checkMyLinkedinInvitation;
