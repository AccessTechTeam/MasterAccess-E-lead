async function putComments() {
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

    await page.goto("https://www.linkedin.com/search/results/content/?keywords=boulangerie&origin=SWITCH_SEARCH_VERTICAL&sid=l7X", {
        waitUntil: "networkidle2"
    })
}
