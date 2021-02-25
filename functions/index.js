const functions = require("firebase-functions");
const  express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {getActivities, postActivity, deleteActivity, updateActivity} = require('./src/getActivities')
const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/activities', getActivities)
app.post('/activities', postActivity)
app.delete('/activities/:activityId', deleteActivity )
app.patch('/activities/:activityId'), updateActivity


exports.app = functions.https.onRequest(app)

