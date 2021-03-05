var express = require('express');
var searchRouter = express.Router();
var axios = require("axios");

/* GET home page. */
searchRouter.get('/book', function(req, res) {
    console.log(req.query)
    let query = req.query.title;
    console.log(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_API_KEY}`)
        
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_API_KEY}&maxResults=20`)
        .then(function (response) {
            let books = response.data.items;
           res.render("books/onlineBookPreview", {books, title: "Search Result", query: query})
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            return res.json({message : error.message});
        })
    
});

module.exports = searchRouter;