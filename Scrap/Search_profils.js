const puppeteer = require("puppeteer");
require('./../Helpers/Brwoser');

// Constantes pour les délais
const SCROLL_DURATION = 1000;
const SCROLL_DELAY = 200;
const SCROLL_DISTANCE = 100;
const MIN_DELAY = 1000;
const MAX_DELAY = 5000;

async function getLinks(searchParam, li_at) {
    const browser = await initializeBrowser();
    console.log(`Dans getLinks avec paramètre : ${searchParam}`);
    
    try {
        const page = await browser.newPage();
        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        });

        await page.goto(`${searchParam}&page=${1}`);
        await page.waitForSelector(".reusable-search__entity-result-list.list-style-none");
        await page.waitForSelector(".artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button.search-reusables__filter-pill-button");
        
        await scrollDown(page);
        await page.waitForSelector("ul.artdeco-pagination__pages.artdeco-pagination__pages--number > li");
        
        const numPages = await page.$$eval("ul.artdeco-pagination__pages.artdeco-pagination__pages--number > li", el => el.length);
        console.log(numPages);

        const totalPages = numPages - 1;
        const lastPage = await page.$$eval("ul.artdeco-pagination__pages.artdeco-pagination__pages--number > li", el => el[9].getAttribute("data-test-pagination-page-btn"));
        const lastPageNumber = parseInt(lastPage, 10);
        console.log(lastPageNumber);

        const a = lastPageNumber > 40 ? 40 : lastPageNumber;
        const rawData = [];
        let compteur = 2;
        console.log('a', a);

        while (compteur < parseInt(a)) {
            await scrollDown(page);
            console.log(`Début de la récupération des liens `);
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
                return Array.from(document.querySelectorAll(".reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > .t-roman.t-sans > .display-flex > .entity-result__title-line.entity-result__title-line--2-lines > .entity-result__title-text.t-16 > .app-aware-link ")).map(el => el.innerText == "Utilisateur LinkedIn" ? el.innerText : el.innerText.split("\n")[0])
            });

            const emploie = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div >.linked-area.flex-1.cursor-pointer .entity-result__primary-subtitle.t-14.t-black.t-normal")).map((el) => el.innerText)
            });

            const lieu_emploi = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".reusable-search__result-container >.entity-result > .entity-result__item >.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div .entity-result__secondary-subtitle.t-14.t-normal")).map((el => el.innerText))
            });

            const entreprise_actuelle = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .linked-area.flex-1.cursor-pointer > .entity-result__summary.entity-result__summary--2-lines.t-12.t-black--light")).map(el => el.innerText)
            });

            await page.goto(`${searchParam}&page=${compteur}`);

            try {
                await page.waitForSelector(".reusable-search__entity-result-list.list-style-none");
            } catch (error) {
                console.log(`la page n°${compteur} est vide`);
                compteur++;
                continue;
            }

            await page.waitForSelector(".artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button");
            console.log(`Liens obtenus : ${profiles}`);
            console.log(`Fin de la récupération des liens`);
            compteur++;

            for (let b = 0; b < profiles.length; b++) {
                let photo = photo_profile[b];
                let profile = profiles[b] ? profiles[b].trim() : "non renseigné";
                let job = emploie[b] ? emploie[b].trim() : "non renseigné";
                let job_location = lieu_emploi[b] ? lieu_emploi[b].trim() : "non renseigné";
                let current_company = entreprise_actuelle[b] ? entreprise_actuelle[b].trim() : "non renseigné";
                let linkedin_link = lien_linkedin[b] ? lien_linkedin[b].trim() : "non renseigné";

                if (photo !== "" && profile !== "") {
                    rawData.push({
                        photo_profile: photo,
                        profile: profile,
                        emploie: job,
                        lieu_emploie: job_location,
                        entreprise_actuelle: current_company,
                        lien_linkedin: linkedin_link,
                        email: "coming@soon.fr",
                        tel: "0000001"
                    });
                }
            }

            await new Promise(resolve => setTimeout(resolve, randomCrawlPageTimer()));
            console.log("", compteur);
        }

        console.log(rawData);

        if (rawData.length > 0) {
            return rawData;
        }

        await clearCookies(browser);

    } catch (err) {
        console.error(err);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function clearCookies(browser) {
    try {
        const session = await browser.target().createCDPSession();
        await session.send('Network.clearBrowserCookies');
    } catch (err) {
        console.error(err);
    }
}

async function randomCrawlPageTimer() {
    const delay = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
    return delay;
}

async function scrollDown(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let scrollHeight = document.body.scrollHeight;
            let scrollCount = 0;

            const scrollInterval = setInterval(() => {
                let remainingHeight = scrollHeight - totalHeight;

                if (remainingHeight >= SCROLL_DISTANCE) {
                    window.scrollBy(0, SCROLL_DISTANCE);
                    totalHeight += SCROLL_DISTANCE;
                    scrollCount++;
                } else {
                    window.scrollBy(0, remainingHeight);
                    totalHeight += remainingHeight;
                    scrollCount++;
                }

                if (totalHeight >= scrollHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                }
            }, SCROLL_DELAY);

            setTimeout(() => {
                clearInterval(scrollInterval);
                resolve();
            }, SCROLL_DURATION);
        });
    });
}

module.exports = getLinks;
