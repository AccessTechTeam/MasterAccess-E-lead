const puppeteer = require("puppeteer");
require('./../Helpers/Brwoser'); // Assurez-vous que le chemin est correct

async function deleteInvitationOnHold(li_at) {
    const browser = await initializeBrowser(); // Assurez-vous que la fonction initializeBrowser() est définie

    try {
        const page = await browser.newPage();

        // Configuration des cookies pour l'authentification LinkedIn
        await page.setCookie({
            name: "li_at",
            value: li_at,
            domain: "www.linkedin.com"
        });

        // Accès à la page des invitations envoyées sur LinkedIn
        await page.goto('https://www.linkedin.com/mynetwork/invitation-manager/sent/?filterCriteria=&invitationType=');

        // Attente de la chargement de la liste des invitations
        await page.waitForSelector('.artdeco-list.mn-invitation-list > .invitation-card.artdeco-list__item');

        // Recherche de tous les boutons d'annulation d'invitation
        let invitationButtons = await page.$$('.invitation-card__action-container.pl3 > .artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--tertiary.ember-view.invitation-card__action-btn');

        if (invitationButtons.length === 0) {
            console.log("Aucune invitation à supprimer n'a été trouvée.");
            await browser.close();
            return;
        }

        let numberOfInvitationCanceld = 0;
        let numberOfInvitationCanceldNotCanceld = 0;

        // Fonction récursive pour traiter chaque invitation
        async function processInvitation(index) {
            // Recherche à nouveau des boutons d'annulation d'invitation
            invitationButtons = await page.$$('.invitation-card__action-container.pl3 > .artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--tertiary.ember-view.invitation-card__action-btn');

            if (index >= invitationButtons.length) {
                console.log("Nombre d'invitations annulées : ", numberOfInvitationCanceld);
                console.log("Nombre d'invitations non annulées : ", numberOfInvitationCanceldNotCanceld);

                await browser.close();
                return;
            }

            const invitationButton = invitationButtons[index];

            // Cliquez sur le bouton d'annulation de l'invitation
            await invitationButton.click();

            // Attente pour laisser la fenêtre modale de confirmation apparaître
            await new Promise((resolve) => setTimeout(resolve, 4000));

            // Recherche du bouton de confirmation dans la fenêtre modale
            const confirmButton = await page.$('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view');

            if (confirmButton) {
                // Si le bouton de confirmation est trouvé, cliquez dessus
                await confirmButton.click();
                console.log('Invitation supprimée avec succès.');
                numberOfInvitationCanceld++;
            } else {
                console.log('La fenêtre modale de confirmation n\'a pas été trouvée.');
                numberOfInvitationCanceldNotCanceld++;
            }

            // Traitez la prochaine invitation récursivement
            await processInvitation(index + 1);
        }

        // Démarrez le traitement des invitations à partir de la première invitation
        await processInvitation(0);
    } catch (error) {
        console.log(error);
    } finally {
        if (browser) {
            browser.close();
        }
    }
}

module.exports = deleteInvitationOnHold;
