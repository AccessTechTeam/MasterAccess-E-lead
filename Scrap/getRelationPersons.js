const puppeteer = require("puppeteer");

async function getRelationPersons() {
    try {
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
        
        const page = await browser.newPage()

        await page.setCookie({
            name: "li_at",
            value: "AQEDATcJZwoCLahAAAABh29IsKgAAAGHk1U0qE4ASPrkSC9ykkGBrx9r3PrxE4QveqyPLl5sgWr_U5Wa1heIEGDfGtaynCA-2SoRD88xy6fhFaCokMBiuwWegxZXVBdPEmUfXXDoWAarih1PXaNAM4r3",
            domain: "www.linkedin.com"
        })

        await page.goto("https://www.linkedin.com/", {
            waitUntil: "networkidle2"
        })

        await page.waitForSelector(".ember-view.block")

        await page.$eval(".ember-view.block", el => el.click())

        await page.waitForSelector(".text-body-small > a.ember-view")

        await page.$$eval(".text-body-small > a.ember-view ", el => el[1].click())

        setTimeout(async () => {
            await scrollDown(page)
        }, 3000)

        let a = 4
        let RelationProfileData = []
        let compteur = 0
        while (compteur < parseInt(a)) {

            scrollDown(page)

            await page.waitForSelector(".artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view")

            await page.$eval(".artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view", el => el.click())
            await page.waitForSelector(".reusable-search__entity-result-list.list-style-none")

            await page.waitForSelector(".artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button.search-reusables__filter-pill-button")

            console.log(`Debut de la recuperation des liens`)

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
            })

            const lien_linkedin = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div >.t-roman.t-sans > .display-flex > .entity-result__title-line.entity-result__title-line--2-lines > .entity-result__title-text.t-16 > a")).map(el => el.getAttribute("href"))
            })

            const profiles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .mb1 > .t-roman.t-sans > .display-flex > .entity-result__title-line.entity-result__title-line--2-lines > .entity-result__title-text.t-16 > .app-aware-link ")).map(el => el.innerText)
            })

            const emploie = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .mb1 > .linked-area.flex-1.cursor-pointer > .entity-result__primary-subtitle.t-14.t-black.t-normal")).map((el) => el.innerText)
            })

            const lieu_emploie = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .mb1 > .linked-area.flex-1.cursor-pointer > .entity-result__secondary-subtitle.t-14.t-normal")).map((el => el.innerText))
            })

            const entreprise_actuel = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > .reusable-search__result-container > .entity-result > .entity-result__item > .entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > .linked-area.flex-1.cursor-pointer > .entity-result__summary.entity-result__summary--2-lines.t-12.t-black--light")).map(el => el.innerText)
            })
            console.log(`Links obtenus : ${profiles}`)
            console.log(`Fin de la recuperation des liens`)
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
                    
                })

            };

            await new Promise(resolve => setTimeout(resolve, randomCrawPagelTimer(4000)));

            console.log("", compteur)

        }
        console.log(RelationProfileData)
        browser.close()
        return RelationProfileData

    } catch (err) {
        console.error(`Erreur dans getLinks : ${err}`)
        throw err
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
    return Math.floor(Math.random() * max)
}




module.exports =getRelationPersons