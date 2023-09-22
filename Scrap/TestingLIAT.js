const puppeteer = require("puppeteer");

// Importez la fonction initializeBrowser depuis votre fichier d'aide
const { initializeBrowser } = require('./../Helpers/Brwoser');

async function testingLiAt(li_at) {
    const browser = await initializeBrowser();

    try {
        const page = await browser.newPage();

        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        });

        await page.goto("https://www.linkedin.com/mynetwork/");

        // Attendez 2 secondes pour permettre le chargement de la page
        setTimeout(async () => {
            await browser.close();
        }, 2000);

        return true;
    } catch (err) {
        if (err.message.includes('net::ERR_TOO_MANY_REDIRECTS')) {
            console.log("Problème de redirection");

            // Fermez le navigateur en cas d'erreur de redirection
            browser.close();
            return false;
        } else {
            console.log(err);
        }
    }
}

module.exports = testingLiAt;
