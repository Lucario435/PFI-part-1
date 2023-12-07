export function get(){
    API.GetAccounts().then(accounts);

    console.log(accounts);
    let content = "";

    accounts.forEach(element => {
        content += 
        `<div style="display:flex;">
            ${element.Name}
        </div>
        <br>`; 
    });

    return content;
}