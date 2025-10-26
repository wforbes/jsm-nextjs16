import { revalidatePath } from "next/cache"

const Books = async () => {
	const books = await fetch('http://localhost:3000/api/books', {cache: 'no-store'})
	if (!books?.ok) {
		throw new Error('Failed to fetch books')
	}
	const bookData = await books.json()

	const addBook = async (data: FormData) => {
		'use server'
		const title = data.get('title')?.toString() || ''
		const author = data.get('author')?.toString() || ''
		await fetch('http://localhost:3000/api/books', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title, author }),
		})
		.then(() => {
			console.log('Book added successfully')
		})
		.catch((error) => {
			console.error('Error adding book:', error)
		})
		revalidatePath('/books');
	}

	const deleteBook = (id: number) => async () => {
		'use server'
		await fetch(`http://localhost:3000/api/books/${id}`, {
			method: 'DELETE',
		})
		.then(() => {
			console.log('Book deleted successfully')
		})
		.catch((error) => {
			console.error('Error deleting book:', error)
		})
		revalidatePath('/books');
	}


	return (<>
		<form action={addBook} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-[40%] mx-auto">
			<h1 className="text-2xl font-bold m-4 text-black">Book Form</h1>
			<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
					Title
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" name="title" type="text" placeholder="Book Title" required />
			</div>
			<div className="mb-6">
				<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
					Author
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="author" name="author" type="text" placeholder="Author Name" required />
			</div>
			<div className="flex items-center justify-between">
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
					Add Book
				</button>
			</div>
		</form>
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols gap-2 p-4">
			{bookData.map((book: { id: number, title: string, author: string }) => (
				<div key={book.id} className="bg-white shadow-md rounded-lg p-4 flex flex-row justify-between">
					<div>
						<div className="text-sm text-gray-500 mb-2">ID: {book.id}</div>
						<h2 className="text-lg font-bold mb-2 text-black">{book.title}</h2>
						<p className="text-gray-600">Author: {book.author}</p>
					</div>
					<div className="w-[20%] mt-4 flex justify-end gap-2">
						<button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
							Edit
						</button>
						<button onClick={deleteBook(book.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	</>)
}

export default Books