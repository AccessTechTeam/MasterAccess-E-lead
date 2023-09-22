const puppeteer = require("puppeteer")


async function checkInvitation(li_at, lien_linkedin) {
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

    try {


        let page = await browser.newPage();

        // Définir le cookie de connexion
        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com",
        });


        // Accéder au profil LinkedIn
        await page.goto(lien_linkedin, { waitUntil: "networkidle2" });

        await page.waitForSelector(".pvs-profile-actions");

        const isMessageAvailable = await page.evaluate(() => {
            const statusMessage = document.querySelector(
                ".entry-point.pvs-profile-actions__action > button "
            );
            return statusMessage.getAttribute("aria-label") ? true : false;
        });



        const messageButton = await page.$('.entry-point.pvs-profile-actions__action > button');

        const messageContainer = '.msg-form__contenteditable'; // Sélecteur CSS

        if (isMessageAvailable) {
            console.log(true)
            await browser.close()
            return true
        }
        else {
            console.log(false)
            await browser.close()
            return false
        }
    }
    catch (err) {
        console.log(err)

    }
}




module.exports = checkInvitation