
export function get(erreurMsg){
    return `
    <form class="form" id="verifyForm">
    <span>Entrez votre code de vérification pour compléter l'inscription</span>
    <input type='text'
    name='vcode'
    class="form-control"
    required
    RequireMessage = 'Veuillez entrer votre code de vérification'
    placeholder="Code vérification" >
    <span style='color:red'>${erreurMsg ? erreurMsg : ""}</span>
    <hr>
    <button class="form-control btn-primary btn" id="verifySendCmd">Soumettre</button>
    `;
}


export function loadScript(){

}