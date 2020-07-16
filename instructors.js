const fs = require('fs');
const data = require("./data.json") 
const { age, date } = require('./utils')


exports.index = function(req, res) {

    return res.render("instructors/index", {instructors: data.instructors})
}

// SHOW
exports.show = function(req, res){
    const { id } = req.params

    //Estrutura de repetição buscando o ID na Data
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

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth),
    }

    
    return res.render('instructors/edit', { instructor } )
}

//ATUALISAR
exports.put = function(req, res) {
    const { id } = req.body
    
    let index = 0
    //Encontrando o instrutor da vez
    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if (instructor.id == id){
            index = foundIndex
            return true
        }
    })

    if(!foundInstructor) return res.send("instructor not found");

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error")
    })
    return res.redirect(`/instructors/${id}`)

}

//DELETE
exports.delete = function(req, res){
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error")

        return res.redirect("/instructors")
    })
}

