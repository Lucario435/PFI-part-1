

export function get(){

    return `
    <h3 style="text-align:center;">Voulez-vous vraiment effacer votre compte?</h3>
    <br>
    <div class="cancel">
    <button type="button" class="form-control btn-danger" id="deleteAccountCmd">Effacer mon compte</button>
    <br>
    <button type="button" class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>`;
}