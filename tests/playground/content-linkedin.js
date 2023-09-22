const puppeteer = require('puppeteer');

// Fonction pour trouver les emails dans une chaîne de caractères
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
    // Lancer le navigateur Puppeteer
    const browser = await puppeteer.launch({
        headless: false, // Vous pouvez définir ceci sur true pour le mode headless (sans interface graphique)
    });

    // Ouvrir une nouvelle page
    const page = await browser.newPage();

    // Mettez ici la valeur de votre cookie "li_at"
    const li_at = "AQEDATcJZwoELc8wAAABiICQPfkAAAGIpJzB-U4AVOUQzPkc1jlVP-kauOtiU5aCa8JKF1XHb1olaUosknYBmamKBiWHdQ11_aGzjIshoBqrRW2a_pT548bG6LXRPEqSyWiAI8nwVPXp8suyKH1UhskD";

    // Ajouter le cookie LinkedIn
    await page.setCookie({
        name: "li_at",
        value: li_at,
        domain: "www.linkedin.com"
    });

    // Visiter la page LinkedIn que vous souhaitez
    await page.goto('https://www.linkedin.com/in/marya-kechiouche-/', { waitUntil: 'networkidle2' });

    // Récupérer le contenu de la page
    let bodyHTML = await page.content();

    // Afficher le contenu HTML dans la console (pour vérification)
    console.log(bodyHTML);

    // Chercher les emails dans le contenu de la page
    let emails = findEmails(bodyHTML);

    // Afficher les emails trouvés dans la console
    console.log("Emails trouvés :");
    console.log(emails);

    // Fermer le navigateur Puppeteer
    await browser.close();
})();
