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
	return res.json({
    fulfillmentText: req.body.queryResult.parameters.device +' now is: '+req.body.queryResult.parameters.status,
    source: 'chatbot'
  })
})

app.listen(port, () => {
	console.log(`🌏 Server is running at http://localhost:${port}`)
})
//
