const fs = require('fs');
const data = require("./data.json") 
const { age } = require('./utils')


// SHOW
exports.show = function(req, res){
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundInstructor) return res.send("instructor not found");
    
    
    const instructor = {

        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(','),
        created_at: new Intl.DateTimeFormat('en-GB').format(foundInstructor.created_at),
    }


    return res.render("instructors/show", {
        instructor: instructor
    })
} 

// CREATE
exports.post = function(req, res) {
    
    const keys = Object.keys(req.body)
       
    /*==== VAlidação ====*/
    for(key of keys){
        if (req.body[key] == ""){
            return res.send(`Erro ao preencher o campo ${key}`)
                }
         
    }
    let { avatar_url, name, birth, gender, services} = (req.body) 
    
    /*==== Tratamento dos arquivos ====*/

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    /*==== Enviando arquivos para base de dados ====*/

 

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    });

    /*==== Criando arquivo Json ====*/
    fs.writeFile("data.json",JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send("Write file error")

        return res.redirect("/instructors")
    })

}

//EDIT
exports.edit = function(req,res) {

    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundInstructor) return res.send("instructor not found");


    return res.render('instructors/edit', { instructor: foundInstructor } )
}
