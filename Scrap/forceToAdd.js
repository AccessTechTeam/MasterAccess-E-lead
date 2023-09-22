const puppeteer = require("puppeteer");

async function forceToAdd(li_at, url, message = "") {




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
        let page = await browser.newPage()

        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        })

        page.goto(url, { waitUntil: "domcontentloaded" })

        // console.log("LIEN FONCTION", url)

        await page.waitForSelector(".pvs-profile-actions")


        const btns_action_length = await page.evaluate(() => {
            return document.querySelectorAll(".pvs-profile-actions > button").length

        })

        const div_action_length = await page.evaluate(() => {
            return document.querySelectorAll(".pvs-profile-actions > div > button").length
        })


        let btnEnvoyerClicked = false;

        if (btns_action_length > 0) {
            for (let i = 0; i < btns_action_length; i++) {
                const ariaLabel = await page.evaluate((i) => {
                    const btn = document.querySelectorAll(".pvs-profile-actions > button")[i];
                    return btn.getAttribute("aria-label");
                }, i);

                if (ariaLabel.includes("En attente")) {
                    console.log("Vous avez deja envoyé une demande d'ajout a cette personne");

                    setTimeout(async () => {
                        await browser.close()
                    }, 3000)

                    return { status: "Attente" };

                }
                else if (ariaLabel.includes("Invitez")) {

                    const btn_invité = await page.evaluate(async (i) => {
                        const btn = document.querySelectorAll(".pvs-profile-actions > button")[i];
                        const minDelay = 3000;
                        const maxDelay = 10000;
                        const time = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                        async function delay(ms) {
                            console.log(ms)
                            return new Promise((resolve) => setTimeout(resolve, ms));
                        }
                        await delay(time)
                        btn.click();
                        setTimeout(async () => {
                            await browser.close()
                        }, 3000)

                        return true;
                    }, i);
                    btnEnvoyerClicked = btn_invité

                    await page.waitForSelector(".artdeco-modal__actionbar.ember-view.text-align-right");

                    const number_of_btns = await page.evaluate(() => {
                        return document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button ").length;
                    });


                    for (let i = 0; i < number_of_btns; i++) {
                        const ariaLabel = await page.evaluate((i) => {
                            const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button ")[i];
                            return btn.getAttribute("aria-label") ? btn.getAttribute("aria-label") : "non";
                        }, i);


                        if (message.length === 0) {
                            if (ariaLabel.includes("Envoyer")) {
                                const btn_envoyer = await page.evaluate(async (i) => {
                                    const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button")[i];
                                    const minDelay = 3000;
                                    const maxDelay = 10000;
                                    const time = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                                    async function delay(ms) {
                                        console.log(ms)
                                        return new Promise((resolve) => setTimeout(resolve, ms));
                                    }
                                    await delay(time)
                                    btn.click();

                                    setTimeout(async () => {
                                        await browser.close()
                                    }, 3000)

                                    return { status: "Ajouté", bool: true }
                                }, i);

                                btnEnvoyerClicked = btn_envoyer.bool;
                                if (!btn_envoyer.bool) {
                                    setTimeout(async () => {
                                        await browser.close();
                                    }, 3000)
                                    btnEnvoyerClicked = false;

                                    return { status: false };

                                }
                                if (btn_envoyer.bool) {
                                    setTimeout(async () => {
                                        await browser.close();
                                    }, 3000)
                                    btnEnvoyerClicked = true;

                                    return { status: true };

                                }

                            }
                        }
                        else {

                            if (ariaLabel.includes("Ajouter une note")) {

                                const btnAddMsg = await page.evaluate(async (i) => {

                                    const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button")[i];


                                    setTimeout(async () => {
                                        btn.click();

                                    }, 3000)


                                    return true
                                }, i);
                                btnEnvoyerClicked = btnAddMsg;

                                if (btnAddMsg) {
                                    const textArea = ".relative > .ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3";

                                    // Attente jusqu'à ce que le textarea soit visible
                                    await page.waitForSelector(textArea, { visible: true });

                                    // Clic sur l'élément textarea pour y mettre le focus
                                    await page.click(textArea);

                                    // Log du message à envoyer


                                    // Écrire le message dans l'élément textarea caractère par caractère avec un délai aléatoire
                                    for (let i = 0; i < message.length; i++) {
                                        await page.type(textArea, message[i], { delay: Math.random() * 100 + 50 }); // Délai entre 50 et 150 ms
                                        await new Promise(resolve => setTimeout(resolve, Math.random() * 500)); // Pause aléatoire
                                    }

                                    const btn_envoyer_mtn = ".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1";

                                    // Attente jusqu'à ce que le bouton d'envoi soit visible
                                    await page.waitForSelector(btn_envoyer_mtn, { visible: true });

                                    // Délai avant le clic pour simuler le temps de réflexion
                                    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Délai entre 1 et 3 secondes

                                    // Clic sur le bouton d'envoi
                                    await page.click(btn_envoyer_mtn);
                                    btnEnvoyerClicked = true;
                                    // Fermer le navigateur après un délai pour éviter la fermeture brutale
                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                    await browser.close();


                                    return { status: true };
                                }


                            }
                        }

                    }
                }
            }
        }
        if (!btnEnvoyerClicked && div_action_length > 0) {


            await page.waitForSelector(".pvs-profile-actions > div > button")

            for (let i = 0; i < div_action_length; i++) {
                const ariaLabel = await page.evaluate((i) => {
                    const btn = document.querySelectorAll(".pvs-profile-actions > div > button")[i];
                    return btn.getAttribute("aria-label");
                }, i);

                if (!ariaLabel) {
                    setTimeout(async () => {
                        await browser.close()
                    }, 3000)

                    return { status: false };
                }

                if (ariaLabel.includes("Plus")) {



                    const div_plus = await page.evaluate(async (i) => {


                        const btn = document.querySelectorAll(".pvs-profile-actions > div > button")[i];
                        const minDelay = 3000;
                        const maxDelay = 10000;
                        const time = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                        async function delay(ms) {
                            console.log(ms)
                            return new Promise((resolve) => setTimeout(resolve, ms));
                        }
                        await delay(time)
                        btn.click();

                        return true

                    }, i);


                    await page.waitForSelector(".pvs-overflow-actions-dropdown__content.artdeco-dropdown__content.artdeco-dropdown--is-dropdown-element.artdeco-dropdown__content--justification-left.artdeco-dropdown__content--placement-bottom.ember-view")


                    const number_of_action_plus = await page.evaluate(() => {
                        return document.querySelectorAll(".artdeco-dropdown__content-inner > ul > li > div ").length
                    })

                    for (let i = 0; i < number_of_action_plus; i++) {
                        const ariaLabel = await page.evaluate((i) => {
                            const btn = document.querySelectorAll(".artdeco-dropdown__content-inner > ul > li > div ")[i];

                            return btn.getAttribute("aria-label") ? btn.getAttribute("aria-label") : "non";

                        }, i);

                        if (ariaLabel.includes("En attente")) {

                            const div_retirer = await page.evaluate((i) => {
                                document.querySelectorAll(".artdeco-dropdown__content-inner > ul > li > div")[i];

                                return true

                            }, i);
                            if (div_retirer) {

                                setTimeout(async () => {
                                    await browser.close();
                                }, 3000)

                                return { status: "Attente" };
                            }

                        }

                        if (ariaLabel.includes("Retirez")) {

                            const div_retirer_la_relation = await page.evaluate((i) => {
                                document.querySelectorAll(".artdeco-dropdown__content-inner > ul > li > div")[i];
                                return true

                            }, i);
                            if (div_retirer_la_relation) {

                                setTimeout(async () => {
                                    await browser.close();
                                }, 3000)

                                return { status: "Amis" };
                            }

                        }

                        if (ariaLabel.includes("Invitez")) {

                            const div_inviter = await page.evaluate(async (i) => {
                                const btn = document.querySelectorAll(".artdeco-dropdown__content-inner > ul > li > div")[i];
                                const minDelay = 3000;
                                const maxDelay = 10000;
                                const time = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

                                async function delay(ms) {
                                    console.log(ms)
                                    return new Promise((resolve) => setTimeout(resolve, ms));
                                }
                                await delay(time)
                                btn.click();
                                setTimeout(async () => {
                                    await browser.close()
                                }, 3000)

                                return true;

                            }, i);





                            await page.waitForSelector(".artdeco-modal__actionbar.ember-view.text-align-right")

                            const number_of_btns = await page.evaluate(() => {
                                return document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button ").length
                            })



                            for (let i = 0; i < number_of_btns; i++) {


                                const ariaLabel = await page.evaluate((i) => {
                                    const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button ")[i];
                                    return btn.getAttribute("aria-label") ? btn.getAttribute("aria-label") : "non";
                                }, i);



                                if (message.length === 0) {
                                    if (ariaLabel.includes("Envoyer")) {

                                        const div_envoyer = await page.evaluate(async (i) => {
                                            const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button")[i];
                                            const minDelay = 3000;
                                            const maxDelay = 10000;
                                            const time = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                                            async function delay(ms) {
                                                console.log(ms)
                                                return new Promise((resolve) => setTimeout(resolve, ms));
                                            }
                                            await delay(time)
                                            btn.click();
                                            return true
                                        }, i);

                                        if (div_envoyer) {

                                            setTimeout(async () => {
                                                await browser.close();
                                            }, 3000)

                                            return { status: true };

                                        }
                                        else {
                                            setTimeout(async () => {
                                                await browser.close();
                                            }, 3000)

                                            return { status: false };
                                        }
                                    }
                                } else {
                                    if (ariaLabel.includes("Ajouter une note")) {

                                        const btnAddMsg = await page.evaluate(async (i) => {

                                            const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button")[i];
                                            const minDelay = 3000;
                                            const maxDelay = 10000;
                                            const time = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                                            async function delay(ms) {
                                                console.log(ms)
                                                return new Promise((resolve) => setTimeout(resolve, ms));
                                            }
                                            await delay(time)

                                            btn.click();

                                            return true;
                                        }, i);

                                        if (btnAddMsg) {
                                            const textArea = ".relative > .ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3";
                                            await page.waitForSelector(textArea);
                                            await page.click(textArea);
                                            await page.focus(textArea);

                                            await page.type(textArea, message);


                                            const btn_envoyer_mtn = ".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1"
                                            await page.waitForSelector(btn_envoyer_mtn)
                                            setTimeout(async () => {
                                                await page.click(btn_envoyer_mtn)
                                                await browser.close();
                                            }, 3000)

                                            return { status: true };
                                        }

                                    }
                                }


                            }


                        }

                    }

                }


            }
        }

    } catch (error) {
        console.log(error);
        browser.close();
        return { status: false };
    }


}







module.exports = forceToAdd