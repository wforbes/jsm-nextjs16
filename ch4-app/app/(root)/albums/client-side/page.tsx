'use client';

import { useState, useEffect } from 'react'


const ClientAlbums = () => {
	const [albums, setAlbums] = useState<{ id: number, title: string }[]>([])

	useEffect(() => {
		const fetchAlbums = async () => {
			try {
				const response = await fetch('https://jsonplaceholder.typicode.com/albums')
				const data = await response.json()
				setAlbums(data)
			} catch (error) {
				console.error('Error fetching albums:', error)
			}
		}

		fetchAlbums()
	}, [])

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols gap-2 p-4">
			{albums.map((album: { id: number, title: string }) => (
				<div key={album.id} className="bg-white shadow-md rounded-lg p-4">
					<h2 className="text-lg font-bold mb-2 text-black">{album.title}</h2>
					<p className="text-gray-600">Album ID: {album.id}</p>
				</div>
			))}
		</div>
	)
}

export default ClientAlbums