const puppeteer = require("puppeteer");
const { initializeBrowser } = require('./../Helpers/Brwoser');

// Fonction principale pour récupérer les données de visite de profil
async function getProfileVisits() {
    const browser = await initializeBrowser();
    const page = await browser.newPage();
    await page.setCookie({
        name: "li_at",
        value: "AQEDATcJZwoCLahAAAABh29IsKgAAAGHk1U0qE4ASPrkSC9ykkGBrx9r3PrxE4QveqyPLl5sgWr_U5Wa1heIEGDfGtaynCA-2SoRD88xy6fhFaCokMBiuwWegxZXVBdPEmUfXXDoWAarih1PXaNAM4r3",
        domain: "www.linkedin.com"
    })

    await page.goto('https://www.linkedin.com/analytics/profile-views/');

    // Faites défiler la page vers le bas pour charger les données
    scrollDown(page);

    try {
        // Attendre que le sélecteur pour afficher plus de détails des visiteurs soit disponible
        await page.waitForSelector('.display-flex.align-items-center > .mr1.hoverable-link-text.t-bold > span');

        // Cliquez sur le sélecteur pour afficher plus de détails des visiteurs
        await page.$eval('.display-flex.align-items-center > .mr1.hoverable-link-text.t-bold > span', el => el.click());
    } catch (error) {
        console.error('Erreur lors de l\'attente du sélecteur :', error);
    }

    // Récupérer les données de visite de profil en faisant défiler jusqu'à ce qu'un sélecteur spécifique soit présent
    const data = await scrollUntilSelector(page, '#main > div > div.member-analytics-addon-entity-list > div > div.scaffold-finite-scroll__content > ul > li:nth-child(134) > div > div > div.member-analytics-addon-entity__cta-item > a', browser);

    console.log(data);
    browser.close();

    return data;
}

// Fonction pour faire défiler la page vers le bas pour charger plus de données
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

// Fonction pour faire défiler jusqu'à ce qu'un sélecteur spécifique soit présent
async function scrollUntilSelector(page, selector, browser) {
    let isSelectorPresent = await page.$(selector) !== null;
    let dataVisits = [];
    let compteur = 1;

    while (!isSelectorPresent) {
        console.log(compteur++);
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await page.waitForTimeout(1000);

        isSelectorPresent = await page.$(selector) !== null;
        console.log(isSelectorPresent);
    }

    console.log("Finished");

    // Récupérer les données des visiteurs de profil
    const profile_name = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("li > div > .display-flex.full-width > .app-aware-link.full-width.member-analytics-addon__cta-list-item-content.member-analytics-addon-entity-list__link.member-analytics-addon-entity-list__link--no-underline-hover > .member-analytics-addon-entity-list__entity.artdeco-entity-lockup.artdeco-entity-lockup--size-3.ember-view > .artdeco-entity-lockup__content.ember-view.member-analytics-addon-entity-list__entity-content > div > .artdeco-entity-lockup__title.ember-view.member-analytics-addon-entity-list__entity-content-title > span > span:first-child")).map(el => el.innerText)
    });

    const profile_pic = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("li > div > .display-flex.full-width > .app-aware-link.full-width.member-analytics-addon__cta-list-item-content.member-analytics-addon-entity-list__link.member-analytics-addon-entity-list__link--no-underline-hover > .member-analytics-addon-entity-list__entity.artdeco-entity-lockup.artdeco-entity-lockup--size-3.ember-view > .artdeco-entity-lockup__image.artdeco-entity-lockup__image--type-circle.ember-view > .ivm-image-view-model > .ivm-view-attr__img-wrapper.ivm-view-attr__img-wrapper--use-img-tag.display-flex > img ")).map(el => el.getAttribute("src"))
    })

    const emploie = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("li > div > .display-flex.full-width > .app-aware-link.full-width.member-analytics-addon__cta-list-item-content.member-analytics-addon-entity-list__link.member-analytics-addon-entity-list__link--no-underline-hover > .member-analytics-addon-entity-list__entity.artdeco-entity-lockup.artdeco-entity-lockup--size-3.ember-view > .artdeco-entity-lockup__content.ember-view.member-analytics-addon-entity-list__entity-content > div > .artdeco-entity-lockup__subtitle.ember-view")).map(el => el.innerText)
    })

    const time = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("li > div > .display-flex.full-width > .app-aware-link.full-width.member-analytics-addon__cta-list-item-content.member-analytics-addon-entity-list__link.member-analytics-addon-entity-list__link--no-underline-hover > .member-analytics-addon-entity-list__entity.artdeco-entity-lockup.artdeco-entity-lockup--size-3.ember-view > .artdeco-entity-lockup__content.ember-view.member-analytics-addon-entity-list__entity-content > div > .artdeco-entity-lockup__caption.ember-view")).map(el => el.innerText)
    })

    // Construire le tableau de données
    for (let b = 0; b < profile_name.length; b++) {
        dataVisits.push({
            profile_pic: profile_pic[b] ?? "png",
            profile_name: profile_name[b],
            emploie: emploie[b],
            time: time[b]
        });
    }

    console.log(dataVisits);
    return dataVisits;
}

module.exports = getProfileVisits;
