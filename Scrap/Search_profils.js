const puppeteer = require("puppeteer");





async function getLinks(param, li_at) {

    const browser = await puppeteer.launch({
        args: [
            '--enable-features=NetworkService',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--shm-size=3gb',
        ],
        ignoreHTTPSErrors: true,
        headless: true,
        defaultViewport: {
            width: 1300,
            height: 1000
        },
        executablePath: "/usr/bin/chromium"
    });

    console.log(`Dans getLinks avec links : ${param}`)
    try {

        const page = await browser.newPage()

        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        })


        await page.goto(`${param}&page=${1}`)

        await page.waitForSelector(".reusable-search__entity-result-list.list-style-none")


        await page.waitForSelector(".artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button.search-reusables__filter-pill-button")

        await scrollDown(page)

        await page.waitForSelector("ul.artdeco-pagination__pages.artdeco-pagination__pages--number > li")

        const numb_of_pages = await page.$$eval("ul.artdeco-pagination__pages.artdeco-pagination__pages--number > li", el => el.length)
        console.log(numb_of_pages)


        const total_numb_of_pages = numb_of_pages - 1

        const numb_of_last_page = await page.$$eval("ul.artdeco-pagination__pages.artdeco-pagination__pages--number > li", el => el[9].getAttribute("data-test-pagination-page-btn"))

        const intNumber = parseInt(numb_of_last_page, 10);

        console.log(intNumber)

        let a = intNumber > 40 ? 40 : intNumber
        let rawData = []
        let compteur = 2
        console.log('a', a)

        while (compteur < parseInt(a)) {

            await scrollDown(page)

            console.log(`Debut de la recuperation des liens `)

            const photo_profile = await page.evaluate(() => {
                const resultContainers = document.querySelectorAll('.reusable-search__result-container > .entity-result >.entity-result__item > .entity-result__universal-image >.display-flex.align-items-center >.app-aware-link.scale-down > .ivm-image-view-model > .ivm-view-attr__img-wrapper.ivm-view-attr__img-wrapper--use-img-tag.display-flex > div');

                // Initialiser le tableau pour tous les éléments
                const allElements = [];

                // Boucle à travers chaque container de résultat
                resultContainers.forEach(container => {
                    // Sélectionner tous les éléments enfants avec la classe ".photo"
                    const photoElements = container.querySelectorAll('img');

                    // Si aucun élément avec la classe ".photo" n'est trouvé, ajouter une chaîne "Pas d'image" au tableau pour tous les éléments
                    if (photoElements.length === 0) {
                        allElements.push({ src: './assets/Access_icon.ico' });
                    } else {
                        // Sinon, ajouter tous les enfants avec la classe ".photo" au tableau pour tous les éléments
                        photoElements.forEach(photoElement => {
                            allElements.push({ src: photoElement.getAttribute('src') });
                        });
                    }
                });

                return allElements;
            });

            const lien_linkedin = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div >.t-roman.t-sans > .display-flex > .entity-result__title-line.entity-result__title-line--2-lines > .entity-result__title-text.t-16 > a")).map(el => el.getAttribute("href"))
            })

            const profiles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > .t-roman.t-sans > .display-flex > .entity-result__title-line.entity-result__title-line--2-lines > .entity-result__title-text.t-16 > .app-aware-link ")).map(el => el.innerText == "Utilisateur LinkedIn" ? el.innerText : el.innerText.split("\n")[0])

            })

            const emploie = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div >.linked-area.flex-1.cursor-pointer .entity-result__primary-subtitle.t-14.t-black.t-normal")).map((el) => el.innerText)
            })

            const lieu_emploie = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".reusable-search__result-container >.entity-result > .entity-result__item >.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div .entity-result__secondary-subtitle.t-14.t-normal")).map((el => el.innerText))
            })

            const entreprise_actuel = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .linked-area.flex-1.cursor-pointer > .entity-result__summary.entity-result__summary--2-lines.t-12.t-black--light")).map(el => el.innerText)
            })

            // await page.waitForSelector(".artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view")

            // await page.$eval(".artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view", el => el.click())

            await page.goto(`${param}&page=${compteur}`)

            try {
                await page.waitForSelector(".reusable-search__entity-result-list.list-style-none")
            } catch (error) {
                console.log(`la page n°${compteur} est vide`)
                compteur++;
                continue

            }


            await page.waitForSelector(".artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button.search-reusables__filter-pill-button")
            console.log(`Links obtenus : ${profiles}`)
            console.log(`Fin de la recuperation des liens`)
            compteur++

            for (let b = 0; b < profiles.length; b++) {
                let photo = photo_profile[b]
                let profile = profiles[b] ? profiles[b].trim() : "non renseigné";
                let job = emploie[b] ? emploie[b].trim() : "non renseigné";
                let job_location = lieu_emploie[b] ? lieu_emploie[b].trim() : "non renseigné";
                let current_company = entreprise_actuel[b] ? entreprise_actuel[b].trim() : "non renseigné";
                let linkedin_link = lien_linkedin[b] ? lien_linkedin[b].trim() : "non renseigné";

                if (photo !== "" && profile !== "") {
                    rawData.push({
                        photo_profile: photo,
                        profile: profile,
                        emploie: job,
                        lieu_emploie: job_location,
                        entreprise_actuelle: current_company,
                        lien_linkedin: linkedin_link,
                        email: "comming@soon.fr",
                        tel: "0000001"
                    });
                }
            };

            await new Promise(resolve => setTimeout(resolve, randomCrawPagelTimer()));

            console.log("", compteur)


        }


        console.log(rawData)


        if (rawData.length > 0) {

            return rawData;

        }

        browser.target().createCDPSession().then(async (session) => {
            await session.send('Network.clearBrowserCookies');
        }
        );

        await browser.close();


    } catch (err) {
        if (err.message.includes('net::ERR_TOO_MANY_REDIRECTS')) {
            console.log("Problème de redirection");
            await browser.close();
            return false;

        }

        else {
            console.log(err);
            await browser.close();
            return false;
        }

    }
    finally {
        if (browser) {
            await browser.close()
        }
    }
}

//MINI FUNCTION TO SCROLL

async function scrollDown(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            const SCROLL_DURATION = 1000; // Durée de défilement en millisecondes
            const SCROLL_DELAY = 200; // Délai entre chaque défilement en millisecondes
            const SCROLL_DISTANCE = 100; // Distance de défilement à chaque fois

            let totalHeight = 0;
            let scrollHeight = document.body.scrollHeight;
            let scrollCount = 0;

            const scrollInterval = setInterval(() => {
                // Calcule la distance de défilement restante
                let remainingHeight = scrollHeight - totalHeight;

                // Défile seulement si la distance restante est suffisante
                if (remainingHeight >= SCROLL_DISTANCE) {
                    window.scrollBy(0, SCROLL_DISTANCE);
                    totalHeight += SCROLL_DISTANCE;
                    scrollCount++;
                } else {
                    // Si la distance restante est inférieure à la distance de défilement, défile jusqu'à la fin
                    window.scrollBy(0, remainingHeight);
                    totalHeight += remainingHeight;
                    scrollCount++;
                }

                // Vérifie si on a atteint la fin de la page
                if (totalHeight >= scrollHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                }
            }, SCROLL_DELAY);

            // Arrête le défilement après une durée maximale même si on n'a pas atteint la fin de la page
            setTimeout(() => {
                clearInterval(scrollInterval);
                resolve();
            }, SCROLL_DURATION);
        });
    });
}


function randomCrawPagelTimer() {
    const MIN_DELAY = 1000; // Délai minimum en millisecondes
    const MAX_DELAY = 5000; // Délai maximum en millisecondes

    // Génère un délai aléatoire entre MIN_DELAY et MAX_DELAY
    const delay = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;

    return delay;
}


function indexOf(str, search) {
    const index = str.indexOf(search);
    if (index >= 0) {
        return str.slice(0, index);
    }
    return str;
}

module.exports = getLinks

