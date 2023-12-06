

export function get(loggedUser){

    console.log(loggedUser);
    let email = loggedUser.Email;
    let name = loggedUser.Name;
    let password = loggedUser.Password;
    let verifyCode = loggedUser.VerifyCode;
    let id = loggedUser.Id;
    let profilPictureLink = loggedUser.Avatar;


    if(!profilPictureLink.includes("jpeg"))
    {
        console.log("is empty");
        profilPictureLink = "images/no-avatar.png";
    }
    return `
    <form class="form" id="editProfilForm">
        <input type="hidden" name="Id" value="${id}"/>
        <input type="hidden" name="VerifyCode" value="${verifyCode}" />

        <fieldset>
            <legend>Adresse courriel</legend>
            <input type="email"
            class="form-control Email"
            name="Email"
            id="Email"
            value="${email}"
            placeholder="Courriel" required
            RequireMessage = 'Veuillez entrer votre courriel'
            InvalidMessage = 'Courriel invalide'
            CustomErrorMessage ="Ce courriel est déjà utilisé"/>

            <input class="form-control MatchedInput"
            type="text"
            matchedInputId="Email"
            name="matchedEmail"
            id="matchedEmail"
            value="${email}"
            placeholder="Vérification"
            required
            RequireMessage = 'Veuillez entrez de nouveau votre courriel'
            InvalidMessage="Les courriels ne correspondent pas" />
        </fieldset>

        <fieldset>
            <legend>Mot de passe</legend>
            <input type="password"
            class="form-control"
            name="Password"
            id="Password"
            placeholder="Mot de passe"
            required
            RequireMessage = 'Veuillez entrer un mot de passe'
            InvalidMessage = 'Mot de passe trop court'/>
            
            <input class="form-control MatchedInput"
            type="password"
            matchedInputId="Password"
            name="matchedPassword"
            id="matchedPassword"
            placeholder="Vérification" required
            InvalidMessage="Ne correspond pas au mot de passe" />
        </fieldset>

        <fieldset>
            <legend>Nom</legend>
            <input type="text"
            class="form-control Alpha"
            name="Name"
            id="Name"
            value="${name}"
            placeholder="Nom"
            required
            RequireMessage = 'Veuillez entrer votre nom'
            InvalidMessage = 'Nom invalide'/>
        </fieldset>

        <fieldset>
            <legend>Avatar</legend>
            <div class='imageUploader'
            newImage='false'
            controlId='Avatar'
            imageSrc="${profilPictureLink}"
            waitingImage="images/Loading_icon.gif">
            </div>
        </fieldset>

        <input type='submit' name='submit' id='editUserCmd' value="Enregistrer" class="form-control btn-primary">

    </form>

    <div class="cancel">
        <button type="button" class="form-control btn-secondary" id="abortCmd">Annuler</button>
        <hr>
        <button type="button" class="form-control btn-warning" id="deletePageCmd">Effacer le compte</button>
    </div>`;

}

export function loadScript(initform){
    initform();
    initImageUploaders();
}