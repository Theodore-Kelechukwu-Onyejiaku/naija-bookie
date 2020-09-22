## Points to Note

1)virtuals: a field added to a document in a collection but not real
2)async_parallel
3)Book.find({}, "title author") : returns the Book Object with only "title" and "author" fields. This is projection in mongoose!!! Wowww
4).populate("author"): returns the details of this author field instead of just its id, since it is a document inside the Book Collection.
5).execute(): this is used after the .populate() method
6)book_list.sort(): this is an array that will sort the list of books alphabetically