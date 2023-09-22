const puppeteer = require ("puppeteer")


async function checkMyLinkedinInvitation(li_at){

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
            value: li_at,
            domain: "www.linkedin.com"
        })

        await page.goto(`https://www.linkedin.com/mynetwork/invitation-manager/sent/?filterCriteria=&invitationType=&page=1`, {
            waitUntil: "networkidle2"
        })
        
        await page.waitForSelector(".artdeco-list.mn-invitation-list")

        
        const List_en_attente = await page.evaluate(()=>{

            return document.querySelectorAll(".artdeco-list.mn-invitation-list > .invitation-card.artdeco-list__item").length

        })
        
        const numb_of_pages = await page.$$eval("ul.artdeco-pagination__pages.artdeco-pagination__pages--number > li", el => el.length)

        console.log(numb_of_pages)
        console.log(List_en_attente)
        let compteur = 0 
        const invitationDetails = [];

        while (compteur <= parseInt(numb_of_pages)) {
            await scrollDown(page);

            const nextButton = await page.$(".artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view");
            

            const details = await page.evaluate(() => {
                const invitationElements = document.querySelectorAll('.artdeco-list.mn-invitation-list > .invitation-card.artdeco-list__item');
                const details = [];

                for (const element of invitationElements) {
                    const name = element.querySelector('.invitation-card__title.t-16.t-black.t-bold')?.innerText || '';
                    const link = element.querySelector(".display-flex.flex-1.align-items-center.pl0 > a")?.getAttribute("href") || ''; 
                    const occupation = element.querySelector('.invitation-card__subtitle.t-14.t-black--light.t-normal')?.innerText || '';
                    const daysAgo = parseInt(element.querySelector('.time-badge.t-12.t-black--light.t-normal')?.innerText.match(/\d+/)[0] || '');
                    const profileUrl = element.querySelector('.display-flex.flex-1.align-items-center.pl0 > a')?.href || '';
                    const messageElement = element.querySelector('.invitation-card__custom-message-container .ember-view.invitation-card__custom-message.t-14.t-normal');
                    let message = '';
                    if (messageElement) {
                        message = messageElement.innerText;
                    }
                    console.log("DETAILS" , name , link)
                    details.push({ name,link,  occupation, daysAgo, message, profileUrl});


                }

                return details;
            });

            invitationDetails.push(...details);
            if (nextButton) {
                
                await nextButton.click();
            }
            
            compteur++;

            await new Promise(resolve => setTimeout(resolve, randomCrawPagelTimer(1000)));
        }

        await browser.close()

        

        return invitationDetails;

    }
    catch(err){
        console.log(err)
    }
    finally{
        if(browser){
            await browser.close()
        }
    }

}


function randomCrawPagelTimer(max) {
    let randomTime = Math.floor(Math.random() * max);
    console.log('Random time:', randomTime);
    return randomTime;
}

async function scrollDown(page) {
    await page.evaluate(async () => {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const scrollStep = 100; // Hauteur de défilement à chaque étape
        const minDelay = 200; // Délai minimum entre chaque étape
        const maxDelay = 500; // Délai maximum entre chaque étape

        const scrollHeight = document.body.scrollHeight;
        let totalHeight = 0;

        while (totalHeight < scrollHeight) {
            const remainingHeight = scrollHeight - totalHeight;
            const currentScrollStep = Math.min(scrollStep, remainingHeight);

            window.scrollBy(0, currentScrollStep);
            totalHeight += currentScrollStep;

            const delay = Math.random() * (maxDelay - minDelay) + minDelay;
            await sleep(delay);
        }
    });
}


//checkMyLinkedinInvitation("AQEDATcJZwoBfCdZAAABiNKRDwAAAAGI9p2TAE0Ah7lOHM0UZUd_19P2l6ve_yV6MbSwZ92qdL6TblaxPhpazXd_fikfqeTkoAqyJ_ac_U5sarK6XK6Oz4Ev-yfY1dT26n7VFXGiZsCiUYQQtugLPzaC")

module.exports = checkMyLinkedinInvitation

