//header
export function get() {
    console.log("salut");
    return `
    <div id="header">
        <span title="Liste des photos" id="listPhotosCmd">
            <img src="images/PhotoCloudLogo.png" class="appLogo">
        </span>
        <span class="viewTitle">Liste des photos
            <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
        </span>
        <div class="headerMenusContainer">
            <span>&nbsp;</span> <!--filler-->
            <i title="Modifier votre profil">
                <div class="UserAvatarSmall" userid="${loggedUser.Id}" id="editProfilCmd"
                style="background-image:url('${loggedUser.Avatar}')"
                title="Nicolas Chourot"></div>
            </i>
            <div class="dropdown ms-auto dropdownLayout">
            <!-- Articles de menu -->
            </div>
        </div>
    </div>
    `;
}