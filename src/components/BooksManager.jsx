import React from 'react';
import { useState, useEffect } from 'react';
import axiosInstance from "../instances/axiosInstance.js";


const BooksManager = () => {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ title: '', author: '', publishDate: '' });
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState(null);

    const fetchBooks = async () => {
        try {
            const response = await axiosInstance.get('/books');            
            setBooks(response.data);
        } catch (err) {
            setError('Failed to fetch books');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    //method to Insert a new book
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //check if it is a new entry or an update
            if (editId) {
                await axiosInstance.put(`/books/${editId}`, form);
            } else {
                await axiosInstance.post('/books', form);
            }
            setForm({ title: '', author: '',publishDate: '' });
            setEditId(null);
            fetchBooks();
            
        } catch (err) {
            setError('Failed to save book');
        }
    };

    const handleEdit = (book) => {
       let date=book.publishDate && book.publishDate.split('T')[0]
        setForm({ title: book.title, author: book.author, publishDate: date });
        setEditId(book._id);
    };

    const handleDelete = async (id) => {
        try {
            if (
                window.confirm(
                    "Are you sure? This will delete the book and all the data related to it"
                )
            ) {
                await axiosInstance.delete(`/books/${id}`);
                fetchBooks();
            }
        } catch (err) {
            setError('Failed to delete book');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div className="p-4">


            {error && <div className="text-red-500 mb-4">{error}</div>}

            <h1 className="text-2xl font-bold mb-4">Books Manager</h1>

            {/* Form */}
            <div className="flex justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                    <h2 className="text-xl font-semibold text-center mb-6">
                        {editId ? 'Update Book' : 'Add Book'}
                    </h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter book title"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={form.author}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter author name"
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className="block text-gray-700">PublishDate</label>
                        <input name="publishDate" type="date"
                            value={form.publishDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {editId ? 'Update Book' : 'Add Book'}
                    </button>
                </form>
            </div>


            <h1 className="text-2xl font-bold mb-4 pt-5">Books List</h1>
            {/* Table */}
            <table
                className="min-w-full bg-white border rounded-lg bg-white rounded-lg shadow-lg border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Title</th>
                        <th className="py-2 px-4 border-b text-left">Author</th>
                        <th className="py-2 px-4 border-b text-left">Publish Date</th>
                        <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{book.title}</td>
                            <td className="py-2 px-4 border-b">{book.author}</td>
                            <td className="py-2 px-4 border-b">
                                {new Date(book.publishDate).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleEdit(book)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(book._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BooksManager;
