    const puppeteer = require("puppeteer")




    async function deleteInvitationOnHold(li_at) {
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
        const page = await browser.newPage();
    
        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        })
    
        await page.goto('https://www.linkedin.com/mynetwork/invitation-manager/sent/?filterCriteria=&invitationType=');
    
        await page.waitForSelector('.artdeco-list.mn-invitation-list > .invitation-card.artdeco-list__item');
    
        let invitationButtons = await page.$$('.invitation-card__action-container.pl3 > .artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--tertiary.ember-view.invitation-card__action-btn');
    
        if (invitationButtons.length === 0) {
            console.log("Aucune invitation à supprimer n'a été trouvée.");
            await browser.close();
            return;
        }
        let numberOfInvitationCanceld = 0
        let numberOfInvitationCanceldNotCanceld = 0
        async function processInvitation(index) {
            invitationButtons = await page.$$('.invitation-card__action-container.pl3 > .artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--tertiary.ember-view.invitation-card__action-btn');
            

            if (index >= invitationButtons.length) {
            console.log("nombre d'invitation annulé : " ,numberOfInvitationCanceld );
            console.log("nombre d'invitation non annulé : " ,numberOfInvitationCanceldNotCanceld );

            await browser.close();
            return;
            }
            
            const invitationButton = invitationButtons[index];
    
            await invitationButton.click();
            
            await new Promise((resolve) => setTimeout(resolve, 4000));
            

            const confirmButton = await page.$('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view');
            if (confirmButton) {
            await confirmButton.click();
            console.log('Invitation supprimée avec succès.');
            numberOfInvitationCanceld++
            
            } else {
            console.log('La modal de confirmation n\'a pas été trouvée.');
            numberOfInvitationCanceldNotCanceld++
            }
    
            await processInvitation(index + 1);
        }
    
        await processInvitation(0);
        } catch (error) {
        console.log(error);
        }
        finally{
            if(browser){
                browser.close()
            }
        }
    }    
    module.exports = deleteInvitationOnHold