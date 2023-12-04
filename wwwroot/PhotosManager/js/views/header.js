//header

function variableExist(name) {
    if (typeof name !== "undefined" && name !== undefined) {
        return true;
    } return false;
}

export function get(title) {
    console.log("salut");
    let luser;
    let connected = false;
    try {
        if (loggedUser)
            connected = true;
    } catch (err) { connected = false; }
    if (!connected) {
        luser = { "Id": -1, "Avatar": "" };
    } else {
        // console.log(loggedUser);
        luser = loggedUser;
    }
    // ${
    //     exists ? `<i class="fa fa-edit" title="Modifier votre profil">
    //         <div class="UserAvatarSmall" userid="${luser.Id}" id="editProfilCmd"
    //         style="background-image:url('${luser.Avatar}')"
    //         title="Nicolas Chourot"></div>
    //     </i>` : ""
    // }
    connected = true;
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
            

            <div class="dropdown ms-auto">
                <div data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
                <div class="dropdown-menu noselect">
                    ${getDropdown(connected)}
                </div>
            </div>

        </div>
    </div>
    `;
}

function getDropdown(connected) {
    if (connected)
        return getDropDownConnected();
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
function getDropDownConnected() {
    
    return `
    <span class="dropdown-item" id="manageUserCm">
<i class="menuIcon fas fa-user-cog mx-2"></i>
Gestion des usagers
</span>
<div class="dropdown-divider"></div>
<span class="dropdown-item" id="logoutCmd">
<i class="menuIcon fa fa-sign-out mx-2"></i>
Déconnexion
</span>
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
    <div class="dropdown-item" id="editProfilCmd">
        <i class="menuIcon fa fa-sign-in mx-2"></i> Connexion
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

export function loadScript(){
    function deselectAll(){
        $("i.fa-check").replaceWith($(`<i class="menuIcon fa fa-fw mx-2"></i>`));
    }
    $(".hfiltre").on("click",function(){
        deselectAll();
        $(this).find("i.fa-fw").replaceWith($(`<i class="menuIcon fa fa-check mx-2"></i>`))
        console.log($(this).attr("id")); //voila le id
    })
}