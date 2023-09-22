const puppeteer = require("puppeteer");
require('./../Helpers/Brwoser')

async function CheckFriends(li_at) {
  const browser = await initializeBrowser();

  try {
    const page = await browser.newPage();

    // Définir le cookie de connexion LinkedIn
    await page.setCookie({
      name: "li_at",
      value: li_at,
      domain: "www.linkedin.com",
    });

    // Accéder à la page de recherche des amis LinkedIn
    await page.goto("https://www.linkedin.com/search/results/people/?network=%5B%22F%22%5D", {
      waitUntil: "networkidle2",
    });

    // Récupérer le contenu de la page
    const content = await page.content();

    // Extraire les informations des amis de la page
    const allFriendsInPage = await page.$$eval('.reusable-search__entity-result-list.list-style-none > li', (elements) => {
      // Utiliser le contenu HTML des éléments pour extraire les informations souhaitées
      return elements.map((element) => {
        return element.innerHTML; // Vous pouvez également récupérer d'autres attributs ou données ici
      });
    });

    console.log(allFriendsInPage);
  } catch (error) {
    console.error("Une erreur s'est produite : ", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Remplacez le cookie li_at avec la valeur correcte
CheckFriends("VotreCookieLI_AT");
