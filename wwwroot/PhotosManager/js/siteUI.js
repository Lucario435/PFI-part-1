import { get as getHeader, loadScript as lsHeader } from "./views/header.js";
import { get as getCreateProfile, loadScript as lsCP } from "./views/createProfile.js";
import { get as getLogin, loadScript as lsLogin } from "./views/login.js";
import { get as getEditProfile, loadScript as lsEP } from "./views/editProfile.js";
import { get as getConfirmDeleteAccount } from "./views/confirmDeleteProfile.js";
import { get as getVerify, loadScript as lsVF } from "./views/verify.js";
import { get as getProbleme, loadScript as lsPB } from "./views/probleme.js";


let contentScrollPosition = 0;
let currPage = "";
let loggedUser = undefined; //API.retrieveLoggedUser();
let atoken = undefined; //API.retrieveAccessToken();
let atokenExpire = undefined;

window.loggedUser = loggedUser;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
}
function eraseContent() {
    $("#content").empty();
}
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}

/*
setTimeout(function () { // reload chaque seconde
    // window.location.reload();
}, 2000);
*/

let _onPageChangeFuncs = [];
function UpdateHeader(titre, pagename) {
    $("#header").replaceWith(getHeader(titre, isLogged, loggedUser)); //empty();
    //$("#header").append(getHeader());
    lsHeader(logoutClick);
    currPage = pagename;
    onPageChanged();
}
function logoutClick() {
    // console.log("log out")
    API.logout();
    loggedUser = undefined;
    atoken = undefined;
    atokenExpire = undefined;
    renderDefault();
}
function onPageChange(func) {
    _onPageChangeFuncs.push(func);
}
function onPageChanged() {
    _onPageChangeFuncs.forEach(func => {
        func(currPage);
    });
}

function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    UpdateHeader("À propos...", "about");

    $("#content").append(
        $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: Nicolas Chourot
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `))
    onPageChanged();
}

function renderLoginForm(loginMessage, Email, passwordError, EmailError) {
    // API.eraseLoggedUser();
    eraseContent();
    UpdateHeader("Connexion", "login");
    $("#newPhotoCmd").hide();
    $("#content").append(getLogin(loginMessage, Email, passwordError, EmailError));

    $("#loginCmd").on("click", () => { renderLoginForm() })
    $("#createProfilCmd").on("click", (e) => { renderCreateProfil() })
    $("#abortCmd").on("click", (e) => { e.preventDefault(); });

    $("#loginForm").on("submit", function (e) {
        e.preventDefault();
        let datas = getFormData($(this));
        let result = API.login(datas.Email, datas.Password)
        // console.log(result);
        result.then((u) => {
            atoken = API.retrieveAccessToken();
            atokenExpire = API.retrieveAtokenExpire();
            loggedUser = u;
            // console.log(atoken);
            if (atoken != undefined) {
                renderDefault();
            }
        })
    })

    onPageChanged();
    lsLogin();
}
function renderVerify() {
    UpdateHeader("Vérifiez votre compte", "verify");
    $("#newPhotoCmd").hide();
    $("#content").html(getVerify());
    lsVF();
}
function renderProbleme(msg) {
    UpdateHeader("Problème", "problem");
    $("#content").html(getProbleme());
    lsPB();
}
function renderDefault() { //page sur laquelle on va si non logged
    if (loggedUser != undefined)
        if (loggedUser.VerifyCode != "verified")
            return renderVerify();

    if (atoken == undefined)
        return renderLoginForm();

    return renderAbout() //si on  est connecté et vérifie
}
let isNotLogged = () => !isLogged(); 

function isLogged() {
    console.log(atokenExpire + " // " + Math.floor((Date.now() / 1000)))
    if (atokenExpire < Math.floor((Date.now() / 1000))) {
        atoken = undefined;
        loggedUser = undefined;
        // console.log("und");
        return renderProbleme("Session expiré!");
    }
    let firstbool = atoken != undefined && loggedUser != undefined;
    console.log(firstbool);
    console.log(loggedUser);
    if (firstbool)
        firstbool = firstbool && loggedUser.VerifyCode == "verified";

    console.log("islogged: " + firstbool);
    return firstbool;
}

function renderCreateProfil() {
    if (isLogged()) { return renderDefault(); }
    noTimeout(); // ne pas limiter le temps d’inactivité
    eraseContent(); // effacer le conteneur #content
    UpdateHeader("Inscription", "createProfil"); // mettre à jour l’entête et menu
    $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo

    $("#content").html(getCreateProfile());

    // ajouter le mécanisme de vérification de doublon de courriel
    // call back la soumission du formulaire

    $('#createProfilForm').on("submit", function (event) {
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        let profil = getFormData($(this));
        delete profil.submit;
        delete profil.undefined;
        delete profil.matchedPassword;
        delete profil.matchedEmail;

        showWaitingGif(); // afficher GIF d’attente
        // createProfil(profil); // commander la création au service API
        let profileData = API.register(profil);
        profileData.then(function (x) {
            renderLoginForm("Votre compte a été créé. Veuillez vérifier vos courriels pour récupérer le code de vérification qui sera demandé à la connexion.")
        }, function (error) { renderLoginForm("Une erreur est survenue lors de l'inscription.") });
    });
    onPageChanged();

    // initImageUploaders();
    $('#loginCmd').on('click', renderLoginForm); // call back sur clic
    $('#abortCmd').on('click', (e) => { console.log("ok"); e.preventDefault(); renderLoginForm(); }); // call back sur clic
    lsCP(initFormValidation);// initFormValidation(); -- loadé dedans 
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUserCmd');
}

function renderEditProfil() {
    if (isNotLogged()) { return renderDefault(); }
    noTimeout(); // ne pas limiter le temps d’inactivité
    eraseContent(); // effacer le conteneur #content
    UpdateHeader("Modification de profil", "editProfil"); // mettre à jour l’entête et menu
    $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
    $("#content").html(getEditProfile(loggedUser));

    $('#editProfilForm').on("submit", function (event) {
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        let profil = getFormData($(this));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        showWaitingGif(); // afficher GIF d’attente
        // createProfil(profil); // commander la création au service API

        let profileData = API.modifyUserProfil(profil);
        profileData.then(function (x) {
            renderLoginForm("Votre compte a été modifié!")
        }, function (error) { renderLoginForm("Une erreur est survenue lors de la modification.") });
    });

    onPageChanged();
    lsEP(initFormValidation);
    //addConflictValidation(API.checkConflictURL(), 'Email', 'editUserCmd');
}

function renderConfirmDeleteAccount() {
    //Vérifier si le user est connecté
    if (isNotLogged()) { return renderDefault(); }
    noTimeout(); // ne pas limiter le temps d’inactivité
    eraseContent(); // effacer le conteneur #content
    $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
    UpdateHeader("Retrait de compte", "deleteProfil"); // mettre à jour l’entête et menu
    $("#content").html(getConfirmDeleteAccount());
    onPageChanged();
    $("#abortCmd").on("click", (e) => { e.preventDefault(); renderEditProfil() });
}

function deleteAccount() {
    console.log(loggedUser.Id)
    API.unsubscribeAccount(loggedUser.Id);
    renderLoginForm("Votre compte a été supprimé!")
}

$(() => {
    renderLoginForm();
    onPageChange(() => {
        $("#loginCmd").on("click", (e) => { e.preventDefault(); renderLoginForm() })
        $("#createProfilCmd").on("click", (e) => { e.preventDefault(); renderCreateProfil() })
        $("#abortCmd").on("click", (e) => { e.preventDefault(); });
        $("#aboutCmd").on("click", renderAbout)

        //-------EDIT PROFIL
        $("#editProfilMenuCmd").on("click", (e) => { e.preventDefault(); renderEditProfil() })
        //------------------

        //-------DELETE ACCOUNT
        $("#deletePageCmd").on("click", (e) => { e.preventDefault(); renderConfirmDeleteAccount() });
        $("#deleteAccountCmd").on("click", (e) => { e.preventDefault(); deleteAccount() });//delete account
        //-----------------------
    })
    onPageChanged();
})

function getFormData($form) {
    var formData = {};
    $form.find('input, select, textarea').each(function () {
        var $input = $(this);
        var name = $input.attr('name');
        var value = $input.val();
        formData[name] = value;
    });
    return formData;
}