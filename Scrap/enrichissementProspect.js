const puppeteer = require('puppeteer');
require('./../Helpers/Brwoser'); // Assurez-vous que le chemin est correct

async function enrichissement(lien_linkedin, li_at) {
    const browser = await initializeBrowser(); // Assurez-vous que la fonction initializeBrowser() est définie

    try {
        const page = await browser.newPage();

        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        });

        console.log(lien_linkedin);
        await page.goto(`${lien_linkedin}`);

        await page.waitForSelector(".text-heading-xlarge.inline.t-24.v-align-middle.break-words");

        scrollDown(page);

        // Extraction du nom de la personne
        const Nom = await page.evaluate(() => {
            console.log("ok GOOD");
            return (document.querySelector(".text-heading-xlarge.inline.t-24.v-align-middle.break-words").innerText.toLocaleUpperCase());
        });

        // Extraction du nom de l'entreprise actuelle
        const Entreprise = await page.evaluate(() => {
            const entreprises = document.querySelector('.pv-text-details__right-panel > .pv-text-details__right-panel-item > .pv-text-details__right-panel-item-link.text-align-left > .pv-text-details__right-panel-item-text.hoverable-link-text.break-words.text-body-small.t-black > div');
            return entreprises ? entreprises.innerText.toLocaleUpperCase() : null;
        });

        // Extraction du poste
        const Poste = await page.evaluate(() => {
            const postes = document.querySelector('.text-body-medium.break-words');
            return postes ? postes.innerText.toLocaleUpperCase().split(" ") : null;
        });

        const Poste_Split = Poste[0];

        // INFORMATION SUPPLEMENTAIRE DE LA MODAL 
        // Essayez de décommenter cette section si elle est actuellement commentée

        // Attendre la section des coordonnées du prospect
        await page.waitForSelector(".pv-top-card--list.pv-top-card--list-bullet > li > .t-black--light > .t-bold");
        const NombreDeRelationDuProspect =  await page.evaluate(() => {
            return (document.querySelector(".pv-top-card--list.pv-top-card--list-bullet > li > .t-black--light > .t-bold").innerText);
        });

        // SECTION EXPERIENCE SUR LINKEDIN
        await page.waitForSelector(".pvs-list__outer-container > .pvs-list > .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns > div > a[data-field='experience_company_logo']");

        const lien_linkedin_entreprise  = await page.evaluate(() => {
            const link = document.querySelector('.pvs-list__outer-container > .pvs-list > .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns > div > a[data-field="experience_company_logo"]');
            return link ? link.getAttribute('href') : null;
        });

        // ... autres évaluations pour obtenir des informations sur l'expérience

        // Supprimer le contact : Assurez-vous que l'API et les en-têtes sont correctement configurés
        const token = "uKsF2w2CKofvDygJjvcHyPAK1wElfo";
        const myHeaders = new Headers();
        myHeaders.append("X-Access-Token", "uKsF2w2CKofvDygJjvcHyPAK1wElfo");
        myHeaders.append("Content-Type", "application/json");

        // SECTION EDUCATION SUR LINKEDIN : Vous pouvez ajouter cette section si elle est nécessaire pour votre cas d'utilisation

        const TableauEnrichissement = {
            Nom: Nom,
            Entreprise: Entreprise,
            Poste: Poste_Split,
            NombreDeRelationDuProspect: NombreDeRelationDuProspect,
            lien_linkedin_entreprise: lien_linkedin_entreprise,
            // ... autres données
        };

        console.log(TableauEnrichissement);

        return TableauEnrichissement;
    } catch (err) {
        if (err.message.includes('net::ERR_TOO_MANY_REDIRECTS')) {
            console.log("Problème de redirection");
            browser.close();
            return false;
        } else {
            console.log(err);
        }
    } finally {
        if (browser) {
            browser.close();
        }
    }
}

// Cette fonction fait défiler la page vers le bas
async function scrollDown(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = enrichissement;
