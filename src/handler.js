const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    if (!name) {
        return h
        .response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        .code(400);
    }

    if (readPage > pageCount) {
        return h
        .response({
            status: 'fail',
            message:
                'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
    }

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    const response = isSuccess
        ? h
            .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                bookId: id,
                },
            })
            .code(201)
        : h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
        }).code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter(
            (book) => book.reading === Boolean(Number(reading))
        );
    }

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter(
            (book) => book.finished === Boolean(Number(finished))
        );
    }

    const mappedBooks = filteredBooks.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
    }));

    return h.response({
        status: "success",
        data: {
            books: mappedBooks,
        },
    }).code(200);
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.find((b) => b.id === id);

    const response = book 
        ? { status: 'success', data: { book } } 
        : { status: 'fail', message: 'Buku tidak ditemukan' };

    return h.response(response).code(book ? 200 : 404);
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }
    
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }
    
    if (index !== -1) {
        const finished = pageCount === readPage;
        const updatedBook = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        };
        books[index] = updatedBook;
    
        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
            data: {
                bookId: id
            }
        }).code(200);
    }
    
    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404);
};


const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};
