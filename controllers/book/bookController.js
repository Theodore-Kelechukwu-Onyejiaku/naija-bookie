var Book = require('../../models/book');
var Author = require('../../models/author');
var Genre = require('../../models/genre');
const bodyParser = require("body-parser");
const Comment = require("../../models/comment");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");




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

        if(err){
            return next(err)
        }
        var welcomedUser;
        welcomedUser = req.user;

        res.render("books/index", { title: 'Naija Bookie', error: err, data: results, user: req.user, welcomedUser: welcomedUser});
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
        res.render("books/book_list", {title: "Book List",user: req.user, book_list: list_books})
    })    
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    async.parallel({
        book: function(callback){

            Book.findById(req.params.id)
                .populate("author")
                .populate("genre")
                .populate("like")
                .populate({path: "comments", populate: {path: "replies", populate : {path: "whoReplied"}}})
                .populate({path: "comments", populate: {path: "whoCommented"}})
                .populate("whoCommented")
                .populate("whoCreated")
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

        console.log(results.book.comments.whoCommented)
        //Successful
        res.render("books/book_detail", {title: results.book.title, book: results.book, user: req.user})
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
        res.render("books/book_form", { title: 'Create Book', authors: results.authors, genres: results.genres, user: req.user});
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
    body('reason', 'Reason must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
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
                if (req.body.genre.indexOf(results.genres[i]._id) > -1) {
                    results.genres[i].checked='true';
                }
            }
            if(req.fileValidationError){
               return  res.render("books/book_form", { title: 'Create Book',authors:results.authors, genres:results.genres, book: req.body, fileError: req.fileValidationError });
            }
        });
       
                
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
            reason: req.body.reason,
            isbn: req.body.isbn,
            genre: req.body.genre,
            picture : picture,
            whoCreated : req.body.whoCreated
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

// ADD COMMENTS TO BOOK
exports.book_post_comment = async(req, res, next) =>{
    try {
        console.log(req.body);
        var newComment = new Comment({
            comment: req.body.comment,
            whoCommented: req.body.whoCommented,
        });
    
        let book = await Book.findById(req.params.id).populate("comments");
    
        if (book == null) {
          return res.status(404).json("No such poem exists");
        }
        book.comments.push(newComment);
    
        await newComment.save();
        // console.log(newComment);
        await book.save();
        res.redirect("/catalog/book/"+req.params.id);
      } catch (error) {
        next(error);
      }
}

// Like or unlike
exports.book_post_like = async (req, res, next) => {
    try {
      let book = await Book.findById(req.params.id);
  
      if (book == null) {
        return res.status(400).json("No such book exists");
      }
  
      //Check if the person has reacted before
      var hasLiked;
      var likeIndex
      for (let i = 0; i < book.like.length; i++) {
        if (book.like[i] == req.user._id) {
          console.log(book.like[i], req.user._id)
          hasLiked = true;
          likeIndex= i;
          break;
        } else {
            console.log(book.like[i], req.user._id)
          hasLiked = false;
        }
      }
      
      console.log(hasLiked)
      if (hasLiked) {
        Book.findByIdAndUpdate(req.params.id, {$pullAll: {like: [req.user._id]}}, {new: true}, async function(err, doc){
            if(err){
                return  res.status(404).json({"message": "Ooops! Something wrong happened"})
            }
            await doc.save();
            console.log("hellooooo")
             return res.redirect("/catalog/book/"+req.params.id)
        })
      }else{
        book.like.push(req.user._id);
        console.log("user has not liked this oooo!")
        await book.save();
        // console.log(book.likes)
        res.redirect("/catalog/book/"+req.params.id)
      }
        
    } catch (error) {
      next(error);
    }
  };
  
  exports.book_comments_like_post = async(req, res, next)=>{
        try {
            
            let comment = await Comment.findById(req.params.commentId)
            console.log(comment)
            //Check if the person has reacted before
            var hasLiked;
            var likeIndex
            for (let i = 0; i < comment.like.length; i++) {
                if (comment.like[i] == req.user._id) {
                console.log(comment.like[i], req.user._id)
                hasLiked = true;
                likeIndex= i;
                break;
                } else {
                    console.log(comment.like[i], req.user._id)
                hasLiked = false;
                }
            }

            console.log(hasLiked)
            if (hasLiked) {
                Comment.findByIdAndUpdate(req.params.commentId, {$pullAll: {like: [req.user._id]}}, {new: true}, async function(err, doc){
                    if(err){
                        return  res.status(404).json({"message": "Ooops! Something wrong happened"})
                    }
                    await doc.save();
                    console.log("hellooooo")
                    return res.redirect("/catalog/book/"+req.params.id)
                })
            }else{
                comment.like.push(req.user._id);
                console.log("user has not liked this oooo!")
                await comment.save();
                // console.log(book.likes)
                res.redirect("/catalog/book/"+req.params.id)
            }
            

        } catch (error) {
            next(error);
        }
  }


  exports.book_comments_reply_post = async(req, res, next)=>{
      try {
            let comment = await Comment.findById(req.params.commentId).exec();
            console.log(comment, req.body);
            comment.replies.push(req.body);
            await comment.save();
            res.redirect("/catalog/book/"+req.params.id);
      } catch (error) {
            next(error);          
      }
  }