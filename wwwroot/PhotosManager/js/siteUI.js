import { get as getHeader, loadScript as lsHeader } from "./views/header.js";
import { get as getCreateProfile, loadScript as lsCP } from "./views/createProfile.js";
import { get as getLogin, loadScript as lsLogin } from "./views/login.js";
import { get as getEditProfile, loadScript as lsEP} from "./views/editProfile.js";

let contentScrollPosition = 0;
let currPage = "";
let loggedUser = API.retrieveLoggedUser();

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

setTimeout(function () { // reload chaque seconde
    // window.location.reload();
}, 2000);

let _onPageChangeFuncs = [];
function UpdateHeader(titre, pagename) {
    $("#header").replaceWith(getHeader(titre)); //empty();
    //$("#header").append(getHeader());
    lsHeader();
    currPage = pagename;
    onPageChanged();
}
function onPageChange(func){
    _onPageChangeFuncs.push(func);
}
function onPageChanged(){
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

function renderLoginForm(loginMessage,Email,passwordError,EmailError) {
    eraseContent();
    UpdateHeader("Connexion", "login");
    $("#newPhotoCmd").hide();
    $("#content").append(getLogin(loginMessage,Email,passwordError,EmailError));
    
    $("#loginCmd").on("click", () => { renderLoginForm() })
    $("#createProfilCmd").on("click", (e) => {renderCreateProfil() })
    $("#abortCmd").on("click",(e)=>{e.preventDefault(); });    
    
    $("#loginForm").on("submit",function(e){
        e.preventDefault();
        let datas = getFormData($(this));
        let result = API.login(datas.Email,datas.Password)
        console.log(result);
    })
    
    onPageChanged();
    lsLogin();
}

function renderCreateProfil() {
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
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        
        showWaitingGif(); // afficher GIF d’attente
        // createProfil(profil); // commander la création au service API
        console.log(profil);
        let profileData = API.register(profil);
        profileData.then(function(x){
            renderLoginForm("Votre compte a été créé. Veuillez vérifier vos courriels pour récupérer le code de vérification qui sera demandé à la connexion.")
        },function(error){ renderLoginForm("Une erreur est survenue lors de l'inscription.") });
    });
    onPageChanged();
    
    // initImageUploaders();
    $('#loginCmd').on('click', renderLoginForm); // call back sur clic
    $('#abortCmd').on('click', (e)=>{console.log("ok"); e.preventDefault();renderLoginForm(); }); // call back sur clic
    lsCP(initFormValidation);// initFormValidation(); -- loadé dedans 
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUserCmd');
}

function renderEditProfil()
{
    //À vérifier : Enlever du header la partie edit profil si pas connecté
    //Vérifier si le user est connecté
    if(loggedUser != null)
    {
        noTimeout(); // ne pas limiter le temps d’inactivité
        eraseContent(); // effacer le conteneur #content
        UpdateHeader("Modification de profil", "editProfil"); // mettre à jour l’entête et menu
        $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
        $("#content").html(getEditProfile(loggedUser));
        onPageChanged();
        lsEP(initFormValidation);
        addConflictValidation(API.checkConflictURL(), 'Email', 'saveUserCmd');
    }
    //Sinon, on redirige vers la page de connexion
    else
    {
        renderLoginForm();
    }
}

$(() => {
    renderLoginForm();
    onPageChange(()=>{
        $("#loginCmd").on("click", (e) => {e.preventDefault();  renderLoginForm() })
        $("#createProfilCmd").on("click", (e) => {e.preventDefault(); renderCreateProfil() })    
        $("#abortCmd").on("click",(e)=>{e.preventDefault();});
        $("#aboutCmd").on("click",renderAbout)
        $("#editProfilMenuCmd").on("click",renderEditProfil)
        console.log("pageChanged");
        // initImageUploaders();
        // initFormValidation(); seront loadé sur les loadScript de page le voulant a place
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