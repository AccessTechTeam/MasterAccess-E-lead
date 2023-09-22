const puppeteer = require("puppeteer");
const { initializeBrowser } = require('./../Helpers/Brwoser');

async function getRelationNumb(li_at) {
    const browser = await initializeBrowser();
    const page = await browser.newPage();

    // Configuration des cookies pour l'authentification LinkedIn
    await page.setCookie({
        name: "li_at",
        value: li_at,
        domain: "www.linkedin.com"
    });

    // Accéder à la page des connexions LinkedIn
    await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/');

    let selectorExists = true;
    try {
        // Attendre que le sélecteur de l'en-tête des connexions soit visible
        await page.waitForSelector('.mn-connections__header > .t-18.t-black.t-normal');
        const numb = await page.$(".mn-connections__header > .t-18.t-black.t-normal");

        // Extraire le contenu texte de l'en-tête
        const content = await page.evaluate(numb => numb.textContent, numb);

        // Analyser le texte pour obtenir le nombre de connexions
        const numberOfConnections = parseInt(content.match(/\d+/)[0]);
        console.log("FROM SCRAP", numberOfConnections);

        return numberOfConnections;
    } catch (error) {
        // Le sélecteur n'existe pas, donc la personne n'a peut-être pas de connexions
        selectorExists = false;
    }

    if (!selectorExists) {
        console.log('null');
        await browser.close();
        return 0;
    }
}

module.exports = getRelationNumb;
