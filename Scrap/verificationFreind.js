const puppeteer = require ("puppeteer")


async function Checkfreinds(li_at){

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

    try{
        let page = await browser.newPage()

        await page.setCookie({
            name: "li_at",
            value: "AQEDATcJZwoELc8wAAABiICQPfkAAAGIpJzB-U4AVOUQzPkc1jlVP-kauOtiU5aCa8JKF1XHb1olaUosknYBmamKBiWHdQ11_aGzjIshoBqrRW2a_pT548bG6LXRPEqSyWiAI8nwVPXp8suyKH1UhskD",
            domain: "www.linkedin.com"
        })

        await page.goto(`https://www.linkedin.com/search/results/people/?network=%5B%22F%22%5D`, {
            waitUntil: "networkidle2"
        })
        
        const content = await page.content();

        const allOfFreindsinThePage = await page.$$eval('.reusable-search__entity-result-list.list-style-none > li', (elements) => {
        // Utilisez le contenu HTML de la page (la variable `content`) pour extraire les éléments souhaités
        return elements.map((element) => {
            return element.innerHTML; // Vous pouvez également récupérer d'autres attributs ou données ici
        });
});

console.log(allOfFreindsinThePage);


    }catch(error){
        console.log(error)
    }
    finally{
        if(browser){
            await browser.close()
        }
    }

}

Checkfreinds()