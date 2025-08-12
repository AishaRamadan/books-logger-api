const Books = require('../models/books.model');

exports.getallBooks = async (req, res) => {
    try {
        let books;
        if (req.role === 'admin') {
            books = await Books.find().populate('userId', 'userName email firstName lastName ').exec();
        }
        else {
            books = await Books.find({ userId: req.id }).populate('userId', 'userName email firstName lastName ').exec();
        }
        if (books) {
            if (books.length > 0) {
                return res.status(200).json({ message: "get books successfully", Books: books });
            }
            else return res.status(404).json({ message: "No books to display" })
        }
    } catch (err) {
        return res.status(404).json({ message: "something went wrong" })
    }
}

exports.getBooksByUserId = async (req, res) => {
    const user_id = req.params.id;
    try {
        const book = await Books.find({ userId: user_id }).populate('userId', 'userName email firstName lastName ').exec();
        if (book) {
            return res.status(200).json({ message: "got books successfully", Books: book })
        }
    } catch (err) {
        return res.status(404).json({ message: "this user don't have books", error: err })
    }
}

exports.addNewBook = async (req, res) => {
    try {
        const user_id = req.id;
        const newBook = new Books(req.body);
        newBook.userId = user_id;
        const book = await newBook.save();
        res.status(201).json({ message: "book logger created successfully", createdBook: book });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: "Validation Error", errors: messages });
        }
        else return res.status(400).json({ message: "something went wrong", errors: error });
    }

}
exports.updateBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, author, rate, notes } = req.body;
        const book = await Books.findById(bookId);
        if (book) {
            (title ? book.title = title : "");
            (author ? book.author = author : "");
            (rate ? book.rate = rate : "");
            (notes ? book.notes = notes : "");
            b = await book.save();
            return res.status(200).json({ message: "Books updated successfully", updatedBook: b });
        } else {
            return res.status(404).json({ message: "this id isn't exist", error });
        }
    } catch (err) {
        return res.status(404).json({ message: "failed to update", error: err.message });  // 304 => not modified 
    }
}

exports.deleteBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Books.findByIdAndDelete(bookId);
        if (book) {
            return res.status(200).json({ message: "book deleted successfully" });
        }
    } catch (err) {
        return res.status(404).json({ message: "this id isn't exist", error: err });
    }
}

