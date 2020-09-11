const express = require('express')
// will use this later to send requests
const http = require('http')
// import env variables
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.status(200).send('Server is working.')
})

app.post('/chatbot', (req, res) => {
	const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie
  ? req.body.queryResult.parameters.movie
  : 'Fight Club'

	const reqUrl = encodeURI(
		`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${process.env.API_KEY}`
	)
	http.get(
		reqUrl,
		responseFromAPI => {
			let completeResponse = ''
			responseFromAPI.on('data', chunk => {
				completeResponse += chunk
			})
			responseFromAPI.on('end', () => {
				const movie = JSON.parse(completeResponse)

				let dataToSend = movieToSearch
				dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${
					movie.Director
				} and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}.
                }`

				return res.json({
					fulfillmentText: dataToSend,
					source: 'chatbot'
				})
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'chatbot'
			})
		}
	)
})

app.listen(port, () => {
	console.log(`🌏 Server is running at http://localhost:${port}`)
})
//