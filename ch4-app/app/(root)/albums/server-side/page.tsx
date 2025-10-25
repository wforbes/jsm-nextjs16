import React from 'react'

const ServerAlbums = async () => {
	const albums = await fetch('https://jsonplaceholder.typicode.com/albums', {cache: 'no-store'})
	if (!albums?.ok) {
		throw new Error('Failed to fetch albums')
	}
	
	const albumData = await albums.json()

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols gap-2 p-4">
			{albumData.map((album: { id: number, title: string }) => (
				<div key={album.id} className="bg-white shadow-md rounded-lg p-4">
					<h2 className="text-lg font-bold mb-2 text-black">{album.title}</h2>
					<p className="text-gray-600">Album ID: {album.id}</p>
				</div>
			))}
		</div>
	)
}

export default ServerAlbums