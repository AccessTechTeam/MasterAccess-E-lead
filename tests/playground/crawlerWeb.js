const puppeteer = require('puppeteer');

let targetUrl = 'https://www.splayce.eu/fr/index.html'; // L'URL de départ pour le scraping
let urlsToScrape = [targetUrl]; // Une liste d'URL à scraper, commence avec l'URL cible
let scrapedUrls = new Set(); // Un ensemble pour stocker les URL déjà scrapées
let emails = new Set(); // Un ensemble pour stocker les adresses e-mail uniques trouvées
let counter = 0; // Un compteur pour limiter le nombre de pages à scraper (ici, 100 pages)

async function scrape(url, browser) {
  if (counter >= 100) {
    return; // Limite le nombre de pages à scraper à 100
  }

  console.log(`Traitement de ${url}`);
  counter++;

  const page = await browser.newPage();
  if (url.startsWith('http')) {
    await page.goto(url, { waitUntil: 'networkidle2' }); // Charge la page web
  }

  const html = await page.content();
  let newEmails = html.match(/[a-z0-9\.\-+_]+@[a-z0-9\.\-+_]+\.[a-z]+/gi); // Recherche d'adresses e-mail dans le contenu de la page
  if (newEmails) {
    newEmails.forEach(email => emails.add(email)); // Ajoute les adresses e-mail trouvées à l'ensemble
  }

  const hrefs = await page.$$eval('a', as => as.map(a => a.href)); // Récupère les liens de la page
  hrefs.forEach(href => {
    if (!scrapedUrls.has(href) && !urlsToScrape.includes(href)) {
      urlsToScrape.push(href); // Ajoute les nouveaux liens à la liste des URL à scraper
    }
  });

  await page.close(); // Ferme la page courante
}

async function main() {
  const browser = await puppeteer.launch(); // Lance une instance de navigateur Puppeteer

  while (urlsToScrape.length > 0) {
    let url = urlsToScrape.shift();
    scrapedUrls.add(url);
    await scrape(url, browser); // Appelle la fonction de scraping pour chaque URL
  }

  await browser.close(); // Ferme le navigateur Puppeteer

  console.log('Mails trouvés:');
  emails.forEach(email => console.log(email)); // Affiche les adresses e-mail trouvées
}

main(); // Appelle la fonction principale pour démarrer le scraping
