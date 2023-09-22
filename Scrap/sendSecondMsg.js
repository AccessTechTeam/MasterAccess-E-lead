const puppeteer = require ("puppeteer")


async function sendSecondeMsg(li_at, lien_linkedin, prenom) {
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
        const message = `Bonjour ${prenom},
J’espère que vous allez bien…
Cela fait maintenant quasiment 1 semaines que nous sommes connectés et nous n’avons pas encore eu la possibilité d’échanger ….
Pour vous remercier d’avoir accepter mon invitation et pour faire connaissance, je vous propose d’échanger intelligemment sur la gestion de votre budget énergétique.
A la fin de ce RDV je serais en mesure de vous éclairer sur les éventuels leviers à optimiser et cette étude vous sera offert et totalement gratuit.
Nous comptons à ce jour + de 3 000 satisfait et surtout surpris des actions simples et peu couteuse à mettre en place pour faire des économies.
Je vous laisse le choix de déterminer le jour de votre choix pour un appel téléphonique qui durera en moyenne 30 minute.
📆 https://calendly.com/h-diakite/prise-de-rendez-vous
Qu’en pensez-vous ?
        `
        
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
            
        
            const element = await page.evaluate(()=>{
                const nbOfMessages = document.querySelectorAll(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled")
    
                return nbOfMessages.length
            })
            
            console.log(element)
            
                // il n'a pas repondu il faut lui envoyé un 2eme message 
            await page.waitForSelector(messageContainer);
            await page.click(messageContainer); 

            for(let i=0; i<message.length; i++){
                await page.type(messageContainer, message[i], { delay: Math.random() * 100 + 50 }); // Délai entre 50 et 150 ms
                await new Promise(resolve => setTimeout(resolve, Math.random() * 500)); // Pause aléatoire
            }

            const btn_envoyer_mtn = ".msg-form__send-button.artdeco-button.artdeco-button--1";

            await page.waitForSelector(btn_envoyer_mtn, { visible: true });


            await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Délai entre 1 et 3 secondes

            await page.click(btn_envoyer_mtn);
            await new Promise(resolve => setTimeout(resolve, 3000));

            await browser.close();

            return true
            
        
        }else{
            return false
        }
    }
    catch (err) {
        console.log(err);
    } 

    }



    module.exports = sendSecondeMsg