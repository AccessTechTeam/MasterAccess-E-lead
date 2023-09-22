const puppeteer = require("puppeteer");


async function getRelationNumb(li_at) {
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

    await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/');

    let selectorExists = true;
    try {
        await page.waitForSelector('.mn-connections__header > .t-18.t-black.t-normal');
        const numb = await page.$(".mn-connections__header > .t-18.t-black.t-normal");

        const content = await page.evaluate(numb => numb.textContent, numb);
        const numberOfConnections = parseInt(content.match(/\d+/)[0]);
        console.log("FROM SCRAP", numberOfConnections)
        return numberOfConnections
    } catch (error) {
        selectorExists = false;
    }

    if (!selectorExists) {
        console.log('null');
        await browser.close();
        return 0

    }



}


module.exports = getRelationNumb