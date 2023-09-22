const puppeteer = require('puppeteer');

// La fonction pour trouver les emails dans une chaîne de caractères
function findEmails(text) {
    let result = [];
    let regex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z|a-z]{2,7}\b/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
        result.push(match[0]);
    }
    return result;
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    // Mettez ici la valeur de votre cookie "li_at"
    const li_at = "AQEDATcJZwoELc8wAAABiICQPfkAAAGIpJzB-U4AVOUQzPkc1jlVP-kauOtiU5aCa8JKF1XHb1olaUosknYBmamKBiWHdQ11_aGzjIshoBqrRW2a_pT548bG6LXRPEqSyWiAI8nwVPXp8suyKH1UhskD";

    await page.setCookie({
        name: "li_at",
        value: li_at,
        domain: "www.linkedin.com"
    });

    // Visitez la page que vous souhaitez
    await page.goto('https://www.linkedin.com/in/marya-kechiouche-/', {waitUntil: 'networkidle2'});

    // Récupérez le contenu de la page
    
    let bodyHTML2 = await page.content()
    console.log(bodyHTML2)

    // Cherchez les emails dans le contenu
    let emails = findEmails(bodyHTML2);

    console.log(emails);

    await browser.close();
})();
