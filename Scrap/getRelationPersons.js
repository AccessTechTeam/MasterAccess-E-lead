const puppeteer = require("puppeteer");
const { initializeBrowser } = require('./../Helpers/Brwoser');

async function getRelationPersons(li_at, pageCount = 4) {
    try {
        // Initialisation du navigateur Puppeteer
        const browser = await initializeBrowser();
        const page = await browser.newPage();

        // Configuration des cookies pour l'authentification LinkedIn
        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        });

        // Accéder à la page LinkedIn
        await page.goto("https://www.linkedin.com/", {
            waitUntil: "networkidle2"
        });

        // Attente de l'apparition de certains éléments sur la page
        await page.waitForSelector(".ember-view.block");
        await page.$eval(".ember-view.block", el => el.click());
        await page.waitForSelector(".text-body-small > a.ember-view");
        await page.$$eval(".text-body-small > a.ember-view", el => el[1].click());

        const RelationProfileData = [];

        for (let compteur = 0; compteur < pageCount; compteur++) {
            // Faire défiler la page pour charger plus de résultats
            await scrollDown(page);

            // Attente des éléments nécessaires sur la page
            await page.waitForSelector(".reusable-search__entity-result-list.list-style-none");
            await page.waitForSelector(".artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button.search-reusables__filter-pill-button");

            console.log(`Début de la récupération des liens`);

            // Extraction des données des profils
            const photo_profile = await page.evaluate(() => {
                const resultContainers = document.querySelectorAll('.reusable-search__result-container > .entity-result >.entity-result__item > .entity-result__universal-image >.display-flex.align-items-center >.app-aware-link.scale-down > .ivm-image-view-model > .ivm-view-attr__img-wrapper.ivm-view-attr__img-wrapper--use-img-tag.display-flex > div');
                const allElements = [];

                resultContainers.forEach(container => {
                    const photoElements = container.querySelectorAll('img');

                    if (photoElements.length === 0) {
                        allElements.push({ src: './assets/Access_icon.ico' });
                    } else {
                        photoElements.forEach(photoElement => {
                            allElements.push({ src: photoElement.getAttribute('src') });
                        });
                    }
                });

                return allElements;
            });

            const lien_linkedin = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div >.t-roman.t-sans > .display-flex > .entity-result__title-line.entity-result__title-line--2-lines > .entity-result__title-text.t-16 > a")).map(el => el.getAttribute("href"))
            });

            const profiles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .mb1 > .t-roman.t-sans > .display-flex > .entity-result__title-line.entity-result__title-line--2-lines > .entity-result__title-text.t-16 > .app-aware-link ")).map(el => el.innerText)
            });

            const emploie = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .mb1 > .linked-area.flex-1.cursor-pointer > .entity-result__primary-subtitle.t-14.t-black.t-normal")).map((el) => el.innerText)
            });

            const lieu_emploie = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .mb1 > .linked-area.flex-1.cursor-pointer > .entity-result__secondary-subtitle.t-14.t-normal")).map((el => el.innerText))
            });

            const entreprise_actuel = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .linked-area.flex-1.cursor-pointer > .entity-result__summary.entity-result__summary--2-lines.t-12.t-black--light")).map(el => el.innerText)
            });
            console.log(`Links obtenus : ${profiles}`);
            console.log(`Fin de la récupération des liens`);
            compteur++
            for (let b = 0; b < profiles.length; b++) {
                
                RelationProfileData.push({

                    photo_profile: photo_profile[b] ?? "png",
                    profile: profiles[b],
                    emploie: emploie[b],
                    lieu_emploie: lieu_emploie[b],
                    entreprise_actuelle: entreprise_actuel[b],
                    email: "comming@soon.fr",
                    tel: "0000001"
                    
                });

            };

            // Ajout d'une pause aléatoire avant la prochaine itération
            await new Promise(resolve => setTimeout(resolve, randomCrawPagelTimer(4000)));

            console.log("", compteur)

        }
        console.log(RelationProfileData);
        
        // Fermeture du navigateur
        await browser.close();

        return RelationProfileData;

    } catch (err) {
        console.error(`Erreur dans getLinks : ${err}`);
        throw err;
    }
}

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

function randomCrawPagelTimer(max) {
    return Math.floor(Math.random() * max);
}

module.exports = getRelationPersons;
