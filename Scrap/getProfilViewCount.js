const puppeteer = require("puppeteer");


async function getProfileViewCount(li_at) {
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
        value: li_at,
        domain: "www.linkedin.com"
    })

    await page.goto('https://www.linkedin.com/dashboard/'); // Remplacez "your_profile_url" par l'URL de votre profil LinkedIn

    await page.waitForSelector('.app-aware-link.pcd-analytics-view-item__container > .artdeco-card.ember-view.overflow-hidden.full-height > .pcd-analytics-view-item > div > p')
    const viewCountElement = await page.$$eval('.app-aware-link.pcd-analytics-view-item__container > .artdeco-card.ember-view.overflow-hidden.full-height > .pcd-analytics-view-item > div > p', el => el[4].textContent);
    
    const viewCount = parseInt(viewCountElement.match(/\d+/)[0]);
    await browser.close();
    return viewCount
    
}





module.exports = getProfileViewCount 