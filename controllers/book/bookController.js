var Book = require('../../models/book');
var Author = require('../../models/author');
var Genre = require('../../models/genre');
const bodyParser = require("body-parser");
const Comment = require("../../models/comment");




var async = require('async');
var {body, validationResult } = require("express-validator");


exports.index = function(req, res, next) {

    //The async_parallel allows you to run multiple queries. It accepts two parameters, the object(where you have the functions and the callback to take the results)
    async.parallel({
        book_count: function(callback) {
            //Note the callback here is to handle any error encountered and should be used normally 
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render("books/index", { title: 'Naija Bookie', error: err, data: results });
    });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    Book.find({}, "title author")   //Finds all books and return only title and author fields. It will also return _id and virtual fields
    .populate("author") //This will display all the author field details instead of the author id, since it references another document
    .exec((err, list_books)=>{
        
        //If not successful
        if(err){ return next(err)}

        //If successful
        res.render("books/book_list", {title: "Book List", book_list: list_books})
    })    
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    async.parallel({
        book: function(callback){

            Book.findById(req.params.id)
                .populate("author")
                .populate("genre")
                .exec(callback)
        }
    },function(err, results){

        if(err){
            return next(err)
        }
        if(results.book == null){   //No book found
            var err = new Error("Book not found");
            err.status = 404;
            return next(err)
        }

        //Successful
        console.log(results.book_instance)
        res.render("books/book_detail", {title: results.book.title, book: results.book})
    })
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) { 
      
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render("books/book_form", { title: 'Create Book', authors: results.authors, genres: results.genres});
    });
    
};

// Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.genre = [];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitise fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        console.log(req.file);

        //image file
        const picture = "/bookImages/"+req.file.filename;
        console.log(picture);

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
            picture : picture
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render("books/book_form", { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   console.log(book);
                   res.redirect(book.url);
            });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book update POST');
};


//COMMENTS
// exports.getComments = async (req, res, next) => {
//     try {
//       let poem = await Book.findById({ _id: req.params.id }).populate("comments");
  
//       if (poem == null) {
//         return res.status(404).json("No such poem exists");
//       }
  
//       res.render("", {poem: poem});
//     } catch (error) {
//       next(error);
//     }
//   };