var Author = require("../models/author");
var Book = require("../models/book")
var async = require("async");
var moment = require("moment")

//Display list of all Authors.
exports.author_list = function(req, res, next){
    Author.find()
    .then(data =>{
        res.render("author_list", {title: "Author List", author_list : data})
    })
    .catch(err =>{
        console.log(err)  
    })
};

//Display detail page for a specific Author.
exports.author_detail = function(req, res, next){
    async.parallel({
        author: function(callback){
            Author.findById(req.params.id)
                .exec(callback)
        },
        author_books: function(callback){
            Book.find({"author": req.params.id}, "title summary")
                .exec(callback)
        }
    }, (err, result)=>{
        if(err){
            return next(err);
        }
        if(result.author == null){
            var err = new Error("Author not found");
            err.status = 404;
            return next(err)
        }

        res.render("author_detail", {title: "Author Detail",author: result.author,author_books: result.author_books, date_born: moment(result.author.date_of_birth).format("YYYY"), date_dead: moment(result.author.date_of_death).format("YYYY")})
    })
}

//Display Author create form on GET.
exports.author_create_get = function(req, res){
    res.send("NOT IMPLEMENTED: Author create GET")
}

//Handle Author create on POST
exports.author_create_post = function(){
    res.send("NOT IMPLEMENTED: Author create POST");
}

//Display Author delete form on GET
exports.author_delete_get = function(){
    res.send("NOT IMPLEMENTED: Author delete GET")
}

//Handle Author Delete on POST
exports.author_delete_post = function(){
    res.send("NOT IMPLEMENTED: Author delete POST")
}

//Display Author update form on GET
exports.author_update_get = function(){
    res.send("NOT IMPLEMENTED: Author update GET");
}

//Handle Author update on POST.
exports.author_update_post = function(){
    res.send("NOT IMPLEMENTED: Author update POST");
}