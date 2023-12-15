
export function get(userlist){
    let buildstr = "";
    userlist.forEach(user => {
        let str = getUserTile(user);
        buildstr += str;
    });
    return buildstr;
}

function getUserTile(user){
    let authz = user.Authorizations;

    let isAdmin = authz.readAccess >= 2 && authz.writeAccess >= 2 ? true : false;
    let isBanned = authz.readAccess == 0 && authz.writeAccess == 0 ? true : false;

    let userIconClass = isAdmin ? "fas fa-user-cog" : "fas fa-user-alt";
    let userBannedIconClass = isBanned ? "fa fa-ban redCmd " : "fa-regular fa-circle greenCmd";

    return `
    <div class="utile">
        <img src="${user.Avatar}" />
        <div class="txtVertical2">
            <span class="biggerx">${user.Name}</span>
            <a href="">${user.Email}</a>
        </div>
        <div style="align-items:center;gap:10px;" class="utileBtnsPack" id="xuid.${user.Id}">
            <i title="Type d'utilisateur" style="color:#0d6efd;" class="pnt fas ${userIconClass} xpromote" isadmin="${isAdmin.toString()}" ></i>
            <i title="Bloquer" class="pnt fas ${userBannedIconClass} xban" isbanned="${isBanned.toString()}"></i>
            <i title="Supprimer" class="pnt fas fas fa-user-slash goldenrodCmd xdelete"></i>
        </div>
    </div>`;
}

export function loadScript(renderManageUsersx,adminModifyUser){
    $(".xpromote").on("click",function(e){
        let balise = $(this);
        let uid = balise.parent().attr("id")
        uid = uid.replace("xuid.","");
    
        let isAdmin = balise.attr("isadmin");
        let callBackx = ()=>{renderManageUsersx()}
        // console.log(isAdmin);
        // element.className = "";
        if( "true" == isAdmin || JSON.parse(isAdmin))
            adminModifyUser(uid,"Authorizations",{readAccess:1, writeAccess:1},callBackx);
            // balise.removeClass("")
        else{
            adminModifyUser(uid,"Authorizations",{readAccess:2, writeAccess:2},callBackx);
        }
    })
    $(".xban").on("click",function(e){
        let balise = $(this);
        let uid = balise.parent().attr("id")
        uid = uid.replace("xuid.","");

        let isBanned = balise.attr("isbanned");
        let callBack = ()=>{renderManageUsers()}

        if(JSON.parse(isBanned)) adminModifyUser(uid,"Authorizations",{readAccess:1, writeAccess:1},callBack)
        else adminModifyUser(uid,"Authorizations",{readAccess:0, writeAccess:0},callBack);
    })
    $(".xdelete").on("click",function(e){
        let balise = $(this);
        let uid = balise.parent().attr("id")
        uid = uid.replace("xuid.","");

        let callBack = ()=>{renderManageUsers()}
    })

    $("#content").append(`
    <style>
        .utile{
            height:4rem;
            display:grid;
            grid-template-columns: 4rem auto 5rem;
            padding-left:1rem;
            padding-right:1rem;
            padding-top:1rem;
            padding-bottom:.5rem;
        }
        .utile>img{
            width: 3rem;
            height: 3rem;
            border-radius:100%;
        }
        .pnt{
            cursor:pointer;
        }
        .pnt:hover{
            color:black;
        }
        .txtVertical2{
            display:grid;
            grid-template-rows: auto; auto;
            font-size:.9rem;
        }
        span.biggerx{
            font-size:1.1rem;
        }
        .utileBtnsPack>i{
            font-size: 1.5rem;
        }
        .utileBtnsPack{
            float:right;
            display:grid;
            grid-template-columns:auto auto auto;
            width: fit-content;
        }
    </style>
    
    `);
}