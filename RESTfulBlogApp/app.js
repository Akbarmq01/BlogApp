var bodyParser       = require("body-parser"),
    methodOverride   = require('method-override'), 
    expresssanitizer = require("express-sanitizer"), 
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();
    
// APP CONFIG

mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));   // look or it. what it does???
app.use(bodyParser.urlencoded({extended: true}));
app.use(expresssanitizer());     // this line has to come after body parser 
app.use(methodOverride("_method"));

// MONGOOSE/MODEL/CONFIG
var blogSchema = new mongoose.Schema({
    Title: String,
    Image: String,
    Body: String,
    Created: {type: Date, default: Date.now()}   // takes today's date
});

// model
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
        
//         Title:"The Blog",
//         Image: "https://farm1.staticflickr.com/6/11343551_2dcd7e7104.jpg",
//         Body: "Very Nice and tall tree"
// });


// RESTFUL ROUTES

app.get("/", function(req, res){
        res.render("index");
});

// INDEX

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err)
            console.log("ERROR!!")
       else
            res.render("index", {blogs: blogs});
    });
});

// NEW

app.get("/blogs/new", function(req, res){
        res.render("new");
});

// CREATE

app.post("/blogs", function(req,res){
    var name = req.body.title;
    var image = req.body.image;
    var blogContent = req.sanitize(req.body.blogbody);
    
    var newBlog = {Title: name,
                   Image: image,
                   Body: blogContent
    };
    // create a blog
    Blog.create(newBlog, function(err, newBlog){
        if(err)
            res.render("new");
        else
            res.redirect("/blogs");
    });
});


// EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            res.render("/blogs");
        else
            res.render("edit", {blog: foundBlog});
    });
  
});


// UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    
        var updatedBlog = {Title: req.body.title,
                   Image: req.body.image,
                   Body: req.sanitize(req.body.blogbody)
    };
        Blog.findByIdAndUpdate(req.params.id, updatedBlog, function(err, updateBlog){
         if(err)
            res.redirect("/blogs");
         else
            res.redirect("/blogs/" + updateBlog._id);
        });
});

app.delete("/blogs/:id", function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
   }); 
});

// SHOW

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err)
            res.render("/blogs");
       else
            res.render("show", {blogs: foundBlog});
   }); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    
    console.log("Blog Server running");
});