var express      = require("express"),
    bodyparser   = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
  methodoverride = require("method-override"),
    mongoose     = require("mongoose"),
    app          = express();

mongoose.connect("mongodb://localhost:27017/blogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodoverride("_method"));

var blogschema= new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:  {type:Date, default:Date.now}
});
var blog= mongoose.model("blog", blogschema);

app.get("/",function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req, res){
    blog.find({},function(err, blogs){
        if(err){
            console.log("error found!!!");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});
app.get("/blogs/new", function(req,res){
    res.render("new");
})

app.post("/blogs",function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err, newblog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//Added faltu ka comment

 
app.get("/blogs/:id",function(req, res){
    blog.findById(req.params.id, function(err, found){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:found});
        }
    });

});

app.get("/blogs/:id/edit",function(req, res){
    blog.findById(req.params.id, function(err, found){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:found});
        }
    });
});

app.put("/blogs/:id",function(req, res){
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateblog){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
    });

app.delete("/blogs/:id",function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000);