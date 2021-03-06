var express = require('express');
var router = express.Router();

// Require controller modules.
var book_controller = require('../../controllers/book/bookController');
var author_controller = require('../../controllers/book/authorController');
var genre_controller = require('../../controllers/book/genreController');
var {upload} = require("../../middlewares/uploadBookImage");
var verification = require("../../middlewares/validation/validateToken");


// GET catalog home page.
router.get('/', verification.verifyIfLoggedIn, book_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create',verification.verifyIfLoggedIn, book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create',  upload.single("picture"), book_controller.book_create_post);

router.post("/book/:id/comment", verification.verifyUser, book_controller.book_post_comment);
router.post("/book/:id/comment/:commentId/like", verification.verifyUser, book_controller.book_comments_like_post);
router.post("/book/:id/comment/:commentId/reply", verification.verifyUser, book_controller.book_comments_reply_post);

router.post("/book/:id/like", verification.verifyUser, book_controller.book_post_like);

// GET request to delete Book.
router.get('/book/:id/delete',verification.verifyIfLoggedIn, book_controller.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', verification.verifyIfLoggedIn, book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', verification.verifyIfLoggedIn, book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books',verification.verifyIfLoggedIn, book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);



//COMMENTS
// router.get("/book/:id/comments", book_controller.getComments);


module.exports = router;