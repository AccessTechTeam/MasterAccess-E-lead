const puppeteer = require('puppeteer');

async function  enrichissement(lien_linkedin, li_at){
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
        const page = await browser.newPage()


    

        

        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        })
        
        console.log(lien_linkedin)
        await page.goto(`${lien_linkedin}`)
        
        
        
        
        await page.waitForSelector(".text-heading-xlarge.inline.t-24.v-align-middle.break-words")
    


            scrollDown(page)
        
        
            const Nom = await page.evaluate(() => {
                console.log("ok GOOD")
    
                return (document.querySelector(".text-heading-xlarge.inline.t-24.v-align-middle.break-words").innerText.toLocaleUpperCase())
                
            })
        
        
        
        
        // await page.waitForSelector(".pv-text-details__right-panel > .pv-text-details__right-panel-item > .pv-text-details__right-panel-item-link.text-align-left > .pv-text-details__right-panel-item-text.hoverable-link-text.break-words.text-body-small.t-black > div")
        

        const Entreprise = await page.evaluate(()=>{
            
            const entreprises = document.querySelector('.pv-text-details__right-panel > .pv-text-details__right-panel-item > .pv-text-details__right-panel-item-link.text-align-left > .pv-text-details__right-panel-item-text.hoverable-link-text.break-words.text-body-small.t-black > div');
            return entreprises ? entreprises.innerText.toLocaleUpperCase() : null;
        })
        

        
        
        const Poste = await page.evaluate(()=>{
            const postes = document.querySelector('.text-body-medium.break-words');
            return postes ? postes.innerText.toLocaleUpperCase().split(" ") : null;
        })


        
        const Poste_Split = Poste[0]

        

        // INFORMATION SUPPLEMENTAIRE DE LA MODAL 


        // try{

        //     await page.waitForSelector(".pv-text-details__left-panel.mt2 > .pv-text-details__separator.t-black--light >a")
            

        //     // await page.evaluate(() => {

        //     //     document.querySelector(".pv-text-details__left-panel.mt2 > .pv-text-details__separator.t-black--light >a ").click()
        //     // })

            
        //     await page.waitForSelector(".artdeco-modal.artdeco-modal--layer-default")


        //     const Coordonnees  = await page.evaluate(() => {
        //         return Array.from(document.querySelectorAll(".pv-profile-section__section-info.section-info > section")).map(el => el.innerText.split("\n"))
        //     })
            
            
        //     await page.evaluate(() => {

        //         document.querySelector(".artdeco-modal__dismiss.artdeco-button.artdeco-button--circle.artdeco-button--muted.artdeco-button--2.artdeco-button--tertiary.ember-view").click()

        //     })


        //     // ON PEUT FAIRE MIEUX ICI
        //     /***********************************************************************************************************************
        //     /*          ON PEUT PRENDRE LE LIEN     https://www.linkedin.com/in/mounir-dahdah-884135194/overlay/contact-info/      *
        //     /*          QUI SERT A OUVRIR L'OVERLAY                                                                                *
        //     /*          ET SCRAPER DEPUIS CE LIEN                                                                                  *
        //     /*          IDEE  : AJOUTER  /overlay/contact-info/ DANS LE LIEN DES PROSPECTS QU'ON VEUT ENRICHIR                     *
        //     /*                                                                                                                     *
        //      ***********************************************************************************************************************/


        // }catch{
        //     console.log("Pas de coordonnées")
        // }

        await page.waitForSelector(".pv-top-card--list.pv-top-card--list-bullet > li > .t-black--light > .t-bold")

        const NombreDeRelationDuProspect =  await page.evaluate(() => {
            return (document.querySelector(".pv-top-card--list.pv-top-card--list-bullet > li > .t-black--light > .t-bold").innerText)
        })

        
        
        


        // // SECTION EXPREIENCE SUR LINKEDIN 

        await page.waitForSelector(".pvs-list__outer-container > .pvs-list > .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns > div > a[data-field='experience_company_logo']")

        const lien_linkedin_entreprise  = await page.evaluate(() => {
            const link = document.querySelector('.pvs-list__outer-container > .pvs-list > .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns > div > a[data-field="experience_company_logo"]');
            return link ? link.getAttribute('href') : null;
        })
        
            

        
        await page.waitForSelector(".pvs-list__outer-container > .pvs-list > .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns > .display-flex.flex-column.full-width.align-self-center > .display-flex.flex-row.justify-space-between > .display-flex.flex-column.full-width > .display-flex.flex-wrap.align-items-center.full-height > .mr1.t-bold > span[aria-hidden='true']")

        const experience = await page.evaluate(() => {
            const experiences = document.querySelector(".pvs-list__outer-container > .pvs-list > .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns > .display-flex.flex-column.full-width.align-self-center > .display-flex.flex-row.justify-space-between > .display-flex.flex-column.full-width > .display-flex.flex-wrap.align-items-center.full-height > .mr1.t-bold > span[aria-hidden='true']");
            return experiences ? experiences.innerText : null;
          });
        

          const entreprise_actuelle = await page.evaluate(() => {
            const nom_entreprise_actuel = document.querySelector(".pvs-list__outer-container > .pvs-list > .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns > .display-flex.flex-column.full-width.align-self-center > .display-flex.flex-row.justify-space-between > .display-flex.flex-column.full-width > .t-14.t-normal [aria-hidden='true']");
            return nom_entreprise_actuel ? nom_entreprise_actuel.innerText : null;
          });

          const temp_en_entreprise = await page.evaluate(() => {
            const duree = document.querySelector(".pvs-list__outer-container > .pvs-list > .artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column > .pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns > .display-flex.flex-column.full-width.align-self-center > .display-flex.flex-row.justify-space-between > .display-flex.flex-column.full-width > .t-14.t-normal.t-black--light [aria-hidden='true'] ");
            return duree ? duree.innerText : null;
          });
          
          

        
            
        
            //drop Contact 

            const token = "uKsF2w2CKofvDygJjvcHyPAK1wElfo"


            const myHeaders = new Headers();
            myHeaders.append("X-Access-Token", "uKsF2w2CKofvDygJjvcHyPAK1wElfo");
            myHeaders.append("Content-Type", "application/json");


                    
            

        


        
        // // SECTION EDUCATION SUR LINKEDIN
        

        const TableauEnrichissement = {
            Nom: Nom,
            Entreprise: Entreprise,
            Poste: Poste_Split,
            NombreDeRelationDuProspect: NombreDeRelationDuProspect,
            lien_linkedin_entreprise: lien_linkedin_entreprise,
            experience: experience,
            entreprise_actuelle,
            temp_en_entreprise
        }

        console.log(TableauEnrichissement)

        return TableauEnrichissement
        

    } catch (err) {
        if (err.message.includes('net::ERR_TOO_MANY_REDIRECTS')) {
            console.log("Problème de redirection");
            browser.close();
            return false;
            
        } else {
            console.log(err);
        }

    }
    finally{
        if(browser){
            browser.close()
        }
    }

    

    
}

async function scrollDown(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


module.exports = enrichissement