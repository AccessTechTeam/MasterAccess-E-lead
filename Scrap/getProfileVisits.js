
const puppeteer = require("puppeteer");

async function getProfileVisits() {
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
    const page = await browser.newPage();
    await page.setCookie({
        name: "li_at",
        value: "AQEDATcJZwoCLahAAAABh29IsKgAAAGHk1U0qE4ASPrkSC9ykkGBrx9r3PrxE4QveqyPLl5sgWr_U5Wa1heIEGDfGtaynCA-2SoRD88xy6fhFaCokMBiuwWegxZXVBdPEmUfXXDoWAarih1PXaNAM4r3",
        domain: "www.linkedin.com"
    })


    await page.goto('https://www.linkedin.com/analytics/profile-views//'); // Remplacez "your_profile_url" par l'URL de votre profil LinkedIn

    scrollDown(page)
    try {
        setTimeout(async () => {
            await page.waitForSelector('.display-flex.align-items-center > .mr1.hoverable-link-text.t-bold > span ')

            await page.$eval('.display-flex.align-items-center > .mr1.hoverable-link-text.t-bold > span ', el => el.click());
        }, 2000)

        const data = await scrollUntilSelector(page, '#main > div > div.member-analytics-addon-entity-list > div > div.scaffold-finite-scroll__content > ul > li:nth-child(134) > div > div > div.member-analytics-addon-entity__cta-item > a', browser)

        console.log(data)
        browser.close()

        return data
    } catch (error) {

    }

    // await page.$eval('li.artdeco-list__item.member-analytics-addon-entity-list__item > div> .display-flex.full-width > .member-analytics-addon-entity-list__entity.artdeco-entity-lockup.artdeco-entity-lockup--size-3.ember-view > .artdeco-entity-lockup__image.artdeco-entity-lockup__image--type-square.ember-view') 


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
async function scrollUntilSelector(page, selector, browser) {
    let isSelectorPresent = await page.$(selector) !== null;



    console.log(!!isSelectorPresent)

    let data_Visits = []
    let compteur = 1
    while (!isSelectorPresent) {
        // Scroll to the bottom of the page
        console.log(compteur++)
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        // Wait for a short time to allow new content to load
        await page.waitForTimeout(1000);

        // Check if the selector is now present on the page
        isSelectorPresent = await page.$(selector) !== null;

        console.log(isSelectorPresent)

    }
    console.log("finedish")
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
    console.log("salut2")
    for (let b = 0; b < profile_name.length; b++) {

        data_Visits.push({
            profile_pic: profile_pic[b] ?? "png",
            profile_name: profile_name[b],
            emploie: emploie[b],
            time: time[b]
        })
    };
    console.log(data_Visits)
    await browser.close()
    return data_Visits


}


module.exports = getProfileVisits

