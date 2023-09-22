const puppeteer = require('puppeteer');

let targetUrl = 'https://www.splayce.eu/fr/index.html'; 
let urlsToScrape = [targetUrl];
let scrapedUrls = new Set();
let emails = new Set();
let counter = 0;

async function scrape(url, browser) {

  
  if (counter >= 100) {
    return;
  }

  console.log(`Traitement de ${url}`);
  counter++;

  const page = await browser.newPage();
  if (url.startsWith('http')) { 
    await page.goto(url, { waitUntil: 'networkidle2' });
} 


  const html = await page.content();
  let newEmails = html.match(/[a-z0-9\.\-+_]+@[a-z0-9\.\-+_]+\.[a-z]+/gi);
  if (newEmails) {
    newEmails.forEach(email => emails.add(email));
  }

  const hrefs = await page.$$eval('a', as => as.map(a => a.href));
  hrefs.forEach(href => {
    if (!scrapedUrls.has(href) && !urlsToScrape.includes(href)) {
      urlsToScrape.push(href);
    }
  });
  
  await page.close();
}

async function main() {
  const browser = await puppeteer.launch();

  while (urlsToScrape.length > 0) {
    let url = urlsToScrape.shift();
    scrapedUrls.add(url);
    await scrape(url, browser);
  }

  await browser.close();

  console.log('Mails trouvés:');
  emails.forEach(email => console.log(email));
}

main();
