const puppeteer = require("puppeteer");
const { initializeBrowser } = require('./../Helpers/Brwoser');

async function putComments() {
    const browser = await initializeBrowser();
    const page = await browser.newPage();

    await page.setCookie({
        name: "li_at",
        value: "AQEDATcJZwoCLahAAAABh29IsKgAAAGHk1U0qE4ASPrkSC9ykkGBrx9r3PrxE4QveqyPLl5sgWr_U5Wa1heIEGDfGtaynCA-2SoRD88xy6fhFaCokMBiuwWegxZXVBdPEmUfXXDoWAarih1PXaNAM4r3",
        domain: "www.linkedin.com"
    });

    await page.goto("https://www.linkedin.com/search/results/content/?keywords=boulangerie&origin=SWITCH_SEARCH_VERTICAL&sid=l7X", {
        waitUntil: "networkidle2"
    });
    // Reste du code pour interagir avec la page LinkedIn ici
}

putComments();
