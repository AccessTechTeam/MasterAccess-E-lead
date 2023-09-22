const puppeteer = require("puppeteer");


async function addProspect(li_at, lien_linkedin, message) {

    let message_envoyé = false



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

        console.log("LIEN FONCTION", lien_linkedin)


        await page.goto(`${lien_linkedin}`, { waitUntil: "networkidle2" })


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
                console.log("BOUTTON : ", ariaLabel);

                if (ariaLabel.includes("En attente")) {
                    console.log("Vous avez deja envoyé une demande d'ajout a cette personne");

                    setTimeout(async () => {
                        await browser.close()
                    }, 3000)
                    return { status: false };

                } else if (ariaLabel.includes("Invitez")) {

                    const btn_invité = await page.evaluate((i) => {

                        const btn = document.querySelectorAll(".pvs-profile-actions > button")[i];
                        btn.click();
                        setTimeout(async () => {
                            await browser.close()
                        }, 3000)
                        btnEnvoyerClicked = true;
                        return true;
                    }, i);
                    console.log("BOUTTON INVITER: ", btn_invité);
                    await page.waitForSelector(".artdeco-modal__actionbar.ember-view.text-align-right");

                    const number_of_btns = await page.evaluate(() => {
                        return document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button ").length;
                    });
                    console.log("2 NUMBERS", number_of_btns);

                    for (let i = 0; i < number_of_btns; i++) {
                        const ariaLabel = await page.evaluate((i) => {
                            const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button ")[i];
                            console.log(btn.getAttribute("aria-label") ? btn.getAttribute("aria-label") : "non")
                            return btn.getAttribute("aria-label") ? btn.getAttribute("aria-label") : "non";
                        }, i);
                        console.log(ariaLabel);

                        if (message.length === 0) {
                            if (ariaLabel.includes("Envoyer")) {
                                const btn_envoyer = await page.evaluate((i) => {
                                    const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button")[i];
                                    btn.click();
                                    setTimeout(async () => {
                                        await browser.close()
                                    }, 3000)

                                    return true;
                                }, i);
                                console.log("BOUTTON ENVOYER: ", btn_envoyer);

                                if (btn_envoyer) {
                                    setTimeout(async () => {
                                        await browser.close();
                                    }, 3000)
                                    btnEnvoyerClicked = true;
                                    return { status: true };

                                }
                                else {
                                    setTimeout(async () => {
                                        await browser.close();
                                    }, 3000)
                                    return { status: false };
                                }

                            }
                        }
                        else {

                            if (ariaLabel.includes("Ajouter une note")) {

                                const btnAddMsg = await page.evaluate(async (i) => {

                                    const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button")[i];

                                    console.log("BTNNSS", btn)
                                    setTimeout(async () => {
                                        btn.click();
                                    }, 3000)

                                    btnEnvoyerClicked = true;
                                    return true;
                                }, i);

                                if (btnAddMsg) {
                                    const textArea = ".relative > .ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3";

                                    // Attente jusqu'à ce que le textarea soit visible
                                    await page.waitForSelector(textArea, { visible: true });

                                    // Clic sur l'élément textarea pour y mettre le focus
                                    await page.click(textArea);

                                    // Log du message à envoyer
                                    console.log("MSG A ENVOYER", message);

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

                                    // Fermer le navigateur après un délai pour éviter la fermeture brutale
                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                    await browser.close();
                                    btnEnvoyerClicked = true;
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
                console.log("DIV : ", ariaLabel);
                if (!ariaLabel) {
                    setTimeout(async () => {
                        await browser.close()
                    }, 3000)
                    return { status: false };
                }

                if (ariaLabel.includes("Plus")) {



                    const div_plus = await page.evaluate((i) => {


                        const btn = document.querySelectorAll(".pvs-profile-actions > div > button")[i];
                        btn.click();

                        return true

                    }, i);

                    console.log("BOUTTON PLUS CLICKER :", div_plus)
                    await page.waitForSelector(".pvs-overflow-actions-dropdown__content.artdeco-dropdown__content.artdeco-dropdown--is-dropdown-element.artdeco-dropdown__content--justification-left.artdeco-dropdown__content--placement-bottom.ember-view")


                    const number_of_action_plus = await page.evaluate(() => {
                        return document.querySelectorAll(".artdeco-dropdown__content-inner > ul > li > div ").length
                    })

                    for (let i = 0; i < number_of_action_plus; i++) {
                        const ariaLabel = await page.evaluate((i) => {
                            const btn = document.querySelectorAll(".artdeco-dropdown__content-inner > ul > li > div ")[i];
                            console.log(btn)
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
                                return { status: true };
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
                                return { status: true };
                            }

                        }

                        if (ariaLabel.includes("Invitez")) {

                            const div_inviter = await page.evaluate((i) => {
                                const btn = document.querySelectorAll(".artdeco-dropdown__content-inner > ul > li > div")[i];
                                btn.click();


                            }, i);

                            console.log("BOUTTON INVITER CLICKER :", div_inviter ? div_inviter : "NON")

                            await page.waitForSelector(".artdeco-modal__actionbar.ember-view.text-align-right")

                            const number_of_btns = await page.evaluate(() => {
                                return document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button ").length
                            })

                            console.log("2 NUMBERS", number_of_btns)

                            for (let i = 0; i < number_of_btns; i++) {


                                const ariaLabel = await page.evaluate((i) => {
                                    const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button ")[i];
                                    return btn.getAttribute("aria-label") ? btn.getAttribute("aria-label") : "non";
                                }, i);
                                console.log(ariaLabel)


                                if (message.length === 0) {
                                    if (ariaLabel.includes("Envoyer")) {

                                        const div_envoyer = await page.evaluate((i) => {
                                            const btn = document.querySelectorAll(".artdeco-modal__actionbar.ember-view.text-align-right > button")[i];
                                            btn.click();
                                            return true
                                        }, i);
                                        console.log("VOTRE INVITATION A BIEN ETE ENVOYER", div_envoyer)
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

                                            console.log("BTNNSS", btn)
                                            btn.click();

                                            return true;
                                        }, i);

                                        if (btnAddMsg) {
                                            const textArea = ".relative > .ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3";
                                            await page.waitForSelector(textArea);
                                            await page.click(textArea);
                                            await page.focus(textArea);
                                            console.log("MSG A ENVOYER", message)
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

    }
    catch (err) {
        console.log(err);
        browser.close();
        return { status: false };

    }

}







// addProspect()

// FUNCTION SCROLL DOWN

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

async function scrollUp(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, -distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}







module.exports = addProspect

