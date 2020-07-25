const formDelete = document.querySlector("#form-delete")
formDelete.addEventListner("submit" , function(e){
const confirmation = comfirm("Deseja deletar?")
if(!confirmation){
    e.preventDefault()
}
})