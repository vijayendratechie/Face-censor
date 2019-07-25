var express = require("express");
var mysql = require("mysql");
var path = require("path");
var bodyparser = require("body-parser");

//var flash = require("connect-flash");
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine","ejs");


app.use(bodyparser());
app.use(express.static(path.join(__dirname,"static")));

const port=process.env.PORT || 3000
app.listen(port,function()
{
	console.log("listen to port 3000");
});


app.get("/",function(req,res)
{
	res.render("imageupload");
})

app.get("/canvas",function(req,res)
{
	res.render("canvas");
})
