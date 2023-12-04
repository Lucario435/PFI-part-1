//header

function variableExist(name){
    if(typeof name !== "undefined" && name !== undefined){
        return true;
    } return false;
}

export function get(title) {
    console.log("salut");
    let luser;
    let exists = false;
    try{
        if(loggedUser)
            exists = true;
    } catch(err){exists = false;}
    if(!exists){
        luser = {"Id": -1, "Avatar": ""};
    } else{
        console.log(loggedUser);
        luser = loggedUser;
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
            ${exists? `<i class="fa fa-edit" title="Modifier votre profil">
            <div class="UserAvatarSmall" userid="${luser.Id}" id="editProfilCmd"
            style="background-image:url('${luser.Avatar}')"
            title="Nicolas Chourot"></div>
        </i>` : ""}
            <div class="dropdown ms-auto dropdownLayout">
            <!-- Articles de menu -->
                <li>Déconnexion</li>
            </div>
        </div>
    </div>
    `;
}