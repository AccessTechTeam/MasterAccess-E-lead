const puppeteer = require ("puppeteer")



async function verifySecondResponsePerson(li_at, lien_linkedin) {
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
        
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        
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
            ".entry-point.pvs-profile-actions__action > button"
          );
    
          return statusMessage.getAttribute("aria-label") ? true : false;
        });
    
        console.log(isMessageAvailable);
        const messageButton = await page.$('.entry-point.pvs-profile-actions__action > button');
        const messageContainer = '.msg-form__contenteditable'; // Sélecteur CSS
        
        

        if (isMessageAvailable) {
            await messageButton.click();
            
            await page.waitForSelector(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled" , {visible :true })
                
            const response1 = await new Promise(async (resolve) => {
                await delay(5000);
            
                const element = await page.evaluate(() => {
                  const nbOfMessages = document.querySelectorAll(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled");
                  return nbOfMessages.length;
                });
            
                console.log("C'EST çA", element);
            
                if (element > 2) {
                  console.log("HERE");
                  await delay(3000);
                  await browser.close();
                  resolve(true);
                } else if (element <= 2) {
                  console.log("HERE");
                  await delay(3000);
                  await browser.close();
                  resolve(false);
                }
              });
    
              console.log("RESPONSE" , response1)
              return response1
    
            
            
            }
    }
    catch (err) {
        console.log(err);
        await browser.close();
        return false 
    } 

    }

    module.exports = verifySecondResponsePerson
