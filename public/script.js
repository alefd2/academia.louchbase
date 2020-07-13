const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card');

for(let card of cards){
    card.addEventListener("click", () => {
        const videdoID = card.getAttribute("id");
        window.location.href = `/video?id=${videdoID}`;
       
    });
}


//metodo de fechar o modal!
/*document.querySelector('.close-modal').addEventListener("click", () => {
    modalOverlay.classList.remove('active');
    modalOverlay.querySelector("iframe").src = "";
})
*/
