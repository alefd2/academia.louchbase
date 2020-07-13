const express = require('express'); //
const nunjucks = require('nunjucks');
const routes = require("./routes")
const server = express();


//config
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(routes)

//config a engine njk    
server.set("view engine", "njk")

// pages config
nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
});

//server 5000
server.listen(process.env.PORT || 5000,  ()=> {
    console.log("server is runing")
});