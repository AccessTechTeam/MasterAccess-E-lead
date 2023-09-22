const puppeteer = require("puppeteer")


async function testingLiAt(li_at) {


    

    const browser = await puppeteer.launch({
        args: [
            '--enable-features=NetworkService',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--shm-size=3gb', // this solves the issue
        ],
        ignoreHTTPSErrors: true,
        headless: true,
        defaultViewport: {
            width: 1300,
            height: 1000
        },
        executablePath: "/usr/bin/chromium"
        
    })

    try{
        const page = await browser.newPage()
            
            await page.setCookie({
                name: "li_at",
                value: li_at,

                domain: "www.linkedin.com"
            })

            await page.goto("https://www.linkedin.com/mynetwork/")

            setTimeout(async()=>{
                await browser.close()
            }, 2000)
            
            return true



    }
    catch(err){
        if (err.message.includes('net::ERR_TOO_MANY_REDIRECTS')) {
            console.log("Problème de redirection");
            
            browser.close();
            return false;
            
            
          } else {
            console.log(err);
          }
    }
}

module.exports = testingLiAt