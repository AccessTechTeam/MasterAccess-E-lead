const puppeteer = require("puppeteer");
const { initializeBrowser } = require('./../Helpers/Brwoser');

async function getInvitationsOnHold(li_at) {
    const browser = await initializeBrowser();

    try {
        const page = await browser.newPage();
        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        });

        await page.goto('https://www.linkedin.com/mynetwork/invitation-manager/sent/');

        // Attendez que le sélecteur spécifié apparaisse sur la page
        await page.waitForSelector(".mn-filters-toolbar > .mt3.mr3.artdeco-pill.artdeco-pill--blue.artdeco-pill--3.artdeco-pill--toggle.artdeco-pill--selected.ember-view");

        // Récupérez le texte du sélecteur pour obtenir le nombre d'invitations en attente
        const inviteElement = await page.$(".mn-filters-toolbar > .mt3.mr3.artdeco-pill.artdeco-pill--blue.artdeco-pill--3.artdeco-pill--toggle.artdeco-pill--selected.ember-view");
        const inviteText = await page.evaluate(inviteElement => inviteElement.textContent, inviteElement);
        
        // Utilisez une expression régulière pour extraire le nombre
        const invitationHolding = parseInt(inviteText.match(/\d+/)[0]);
        
        return invitationHolding;
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        return -1; // Valeur par défaut pour indiquer une erreur
    } finally {
        await browser.close();
    }
}

module.exports = getInvitationsOnHold;
