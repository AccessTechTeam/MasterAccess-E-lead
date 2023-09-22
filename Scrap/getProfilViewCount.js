const puppeteer = require("puppeteer");
const { initializeBrowser } = require('./../Helpers/Brwoser');

async function getProfileViewCount(li_at) {
    const browser = await initializeBrowser();
    const page = await browser.newPage();
    await page.setCookie({
        name: "li_at",
        value: li_at,
        domain: "www.linkedin.com"
    })

    await page.goto('https://www.linkedin.com/dashboard/'); // Remplacez "your_profile_url" par l'URL de votre profil LinkedIn

    await page.waitForSelector('.app-aware-link.pcd-analytics-view-item__container > .artdeco-card.ember-view.overflow-hidden.full-height > .pcd-analytics-view-item > div > p')
    const viewCountElement = await page.$('.app-aware-link.pcd-analytics-view-item__container > .artdeco-card.ember-view.overflow-hidden.full-height > .pcd-analytics-view-item > div > p');
    
    const viewCountText = await page.evaluate(viewCountElement => viewCountElement.textContent, viewCountElement);
    const viewCount = parseInt(viewCountText.match(/\d+/)[0]);
    await browser.close();
    return viewCount;
}

module.exports = getProfileViewCount;
