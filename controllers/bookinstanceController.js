var BookInstance = require('../models/bookinstance');
var Genre = require("../models/genre");
var Author = require("../models/author");
var async = require("async");
var moment = require("moment");

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
        .populate("book")
        .exec((err, list_bookinstances)=>{
            //If error
            if(err) return next(err);

            //If successful
            res.render("bookinstance_list", {title: "Book Instance List", bookinstance_list: list_bookinstances})
        })
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res) {
    BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, book)=>{
        if(err) return next(err);

        async.parallel({
            book_genre_detail: function(callback){
                Genre.findById(book.book.genre)
                .exec(callback)
            },
            author_detail: function(callback){
                Author.findById(book.book.author)
                .exec(callback)
            }
        }, function(err, result){
            res.render("bookinstance_detail", {title: "BookInstance detail", book_instance: book, due_back : moment(book.due_back).format("MMMM Do, YYYY"), author_detail: result.author_detail, book_genre_detail: result.book_genre_detail})
        })
        
    })
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};