const puppeteer = require("puppeteer");


async function invitationOnHold(li_at) {
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

    await page.goto('https://www.linkedin.com/mynetwork/invitation-manager/sent/');

    await page.waitForSelector(".mn-filters-toolbar > .mt3.mr3.artdeco-pill.artdeco-pill--blue.artdeco-pill--3.artdeco-pill--toggle.artdeco-pill--selected.ember-view")

    const numb = await page.$(".mn-filters-toolbar > .mt3.mr3.artdeco-pill.artdeco-pill--blue.artdeco-pill--3.artdeco-pill--toggle.artdeco-pill--selected.ember-view");

    const content = await page.evaluate(numb => numb.textContent, numb);
    const invitationHolding = parseInt(content.match(/\d+/)[0]);
    await browser.close();

    return invitationHolding

}


module.exports = invitationOnHold