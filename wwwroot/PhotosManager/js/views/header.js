//header

function variableExist(name) {
    if (typeof name !== "undefined" && name !== undefined) {
        return true;
    } return false;
}

export function get(title,isLoggedFunc,loggedUser) {
    // console.log("salut");
    let isAdmin = false;
    let connected = false;
    let profilPictureLink = "";

    if(!profilPictureLink.includes("jpeg"))
    {
        // console.log("is empty");
        profilPictureLink = "images/no-avatar.png";
    }

    if(isLoggedFunc()){
        connected = true;
        if(loggedUser.Authorizations.writeAccess == 3){
            isAdmin = true;
        }
    }
    return `
    <div id="header">
    <span title="${title}" id="listPhotosCmd">
            <img src="images/PhotoCloudLogo.png" class="appLogo">
        </span>
        <span class="viewTitle">${title}
            <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
        </span>
        <div class="headerMenusContainer">
            <span>&nbsp;</span> <!--filler-->
            
            <img style="height: 40px; margin-right: 10px;" src="${profilPictureLink}"/>

            <div class="dropdown ms-auto">
                <div data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
                <div class="dropdown-menu noselect">
                    ${getDropdown(connected,isAdmin)}
                </div>
            </div>

        </div>
    </div>
    `;
}

function getDropdown(connected,isAdmin) {
    if (connected == true)
        return getDropDownConnected(isAdmin);
    else
        return getDropDownAnonyme();
}
function getDropDownAnonyme() {
    return `
    <div class="dropdown-item" id="loginCmd">
        <i class="menuIcon fa fa-sign-in mx-2"></i> Connexion
    </div>
    <div class="dropdown-divider"></div>

    <div class="dropdown-item" id="aboutCmd">
            <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
    </div>
    
    `;
}
function getDropDownConnected(isAdmin) {
    return `
    ${isAdmin? `<span class="dropdown-item" id="manageUserCmd">
    <i class="menuIcon fas fa-user-cog mx-2"></i>
    Gestion des usagers
    </span><div class="dropdown-divider"></div>
    <span class="dropdown-item" id="logoutCmd">
    <i class="menuIcon fa fa-sign-out mx-2"></i>
    Déconnexion
    </span>` : ""}

<span class="dropdown-item" id="editProfilMenuCmd">
<i class="menuIcon fa fa-user-edit mx-2"></i>
Modifier votre profil
</span>
<div class="dropdown-divider"></div>
<span class="dropdown-item" id="listPhotosMenuCmd">
<i class="menuIcon fa fa-image mx-2"></i>
Liste des photos
</span>
<div class="dropdown-divider"></div>
<span class="dropdown-item hfiltre" id="sortByDateCmd">
<i class="menuIcon fa fa-check mx-2"></i>
<i class="menuIcon fa fa-calendar mx-2"></i>
Photos par date de création
</span>
<span class="dropdown-item hfiltre" id="sortByOwnersCmd">
<i class="menuIcon fa fa-fw mx-2"></i>
<i class="menuIcon fa fa-users mx-2"></i>
Photos par créateur
</span>
<span class="dropdown-item hfiltre" id="sortByLikesCmd">
<i class="menuIcon fa fa-fw mx-2"></i>
<i class="menuIcon fa fa-user mx-2"></i>
Photos les plus aiméés
</span>
<span class="dropdown-item hfiltre" id="ownerOnlyCmd">
<i class="menuIcon fa fa-fw mx-2"></i>
<i class="menuIcon fa fa-user mx-2"></i>
Mes photos
</span>
<div class="dropdown-divider"></div>
<span class="dropdown-item" id="aboutCmd">
<i class="menuIcon fa fa-info-circle mx-2"></i>
À propos...
</span>

    
    `;
    
    return `
    <div class="dropdown-item" id="logoutCmd">
        <i class="menuIcon fa fa-sign-out mx-2"></i> Déconnexion
    </div>
    <div class="dropdown-divider"></div>
    <div class="dropdown-item" id="lsphotosSpan">
        <i class="menuIcon fa fa-image mx-2"></i> Liste des photos
    </div>
    <div class="dropdown-divider"></div>
    ${getFiltresHeader()}
    <div class="dropdown-divider"></div>

    <div class="dropdown-item" id="aboutCmd">
            <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
    </div>
    
    `;
}

export function loadScript(logoutClickFunc){
    function deselectAll(){
        $("i.fa-check").replaceWith($(`<i class="menuIcon fa fa-fw mx-2"></i>`));
    }
    $(".hfiltre").on("click",function(){
        deselectAll();
        $(this).find("i.fa-fw").replaceWith($(`<i class="menuIcon fa fa-check mx-2"></i>`))
        console.log($(this).attr("id")); //voila le id
    })

    $("#logoutCmd").on("click",function(){
        logoutClickFunc();
    })
}