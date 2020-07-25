const fs = require('fs');
const data = require("../data.json") 
const { date } = require('../utils')


exports.index = function(req, res) {

    return res.render("members/index", { members: data.members })
}
//CREATE
exports.create = function(req, res){
    return res.render("members/create")
}
// post
exports.post = function(req, res) {
    
    const keys = Object.keys(req.body)
       
    /*==== VAlidação ====*/
    for(key of keys){
        if (req.body[key] == ""){
            return res.send(`Erro ao preencher o campo ${key}`)
        }
         
    }
    
    /*==== Tratamento dos arquivos ====*/

    birth = Date.parse(req.body.birth)

    let id = 1
    const lastmember = data.members[data.members.length - 1]

    if (lastmember) {
        id = lastmember.id + 1
    }

    /*==== Enviando arquivos para base de dados ====*/ 

    data.members.push({
        id,
        ...req.body,
        birth
    });

    /*==== Criando arquivo Json ====*/
    fs.writeFile("data.json",JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send("Write file error")

        return res.redirect(`/members/${id}`)
    })

}
// SHOW
exports.show = function(req, res){
    const { id } = req.params

    //Estrutura de repetição buscando o ID na Data
    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember) return res.send("member not found");
    
    
    const member = {

        ...foundMember,
        birth: date(foundMember.birth).birthDay
    }

    return res.render("members/show", {
        member: member
    })
} 
//EDIT
exports.edit = function(req,res) {

    const { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember) return res.send("member not found");

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso,
    }

    
    return res.render('members/edit', { member } )
}

//ATUALISAR
exports.put = function(req, res) {
    const { id } = req.body
    
    let index = 0
    //Encontrando o instrutor da vez
    const foundMember = data.members.find(function(member, foundIndex){
        if (member.id == id){
            index = foundIndex
            return true
        }
    })

    if(!foundMember) return res.send("member not found");

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error")
    })
    return res.redirect(`/members/${id}`)

}

//DELETE
exports.delete = function(req, res){
    const { id } = req.body

    const filteredMembers = data.members.filter(function(member){
        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error")

        return res.redirect("/members")
    })
}

