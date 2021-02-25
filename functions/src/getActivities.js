const admin = require("firebase-admin");
const serviceAccount = require("../credentials.json");
let db;


function authDB() {
  if(!admin.apps.length) {
      admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
    })
    db = admin.firestore()
  } 
}


exports.getActivities = (req, res) => {
    authDB()
    db.collection('activities').get()
      .then((collection) => {
        const activitiesResults = collection.docs.map(doc => {
          let activity = doc.data();
          activity.id = doc.id;
          return activity;
        });
        res.status(200).json({
          status: "Activities successfully returned",
          data: activitiesResults,
          message: "Activities loaded",
          statusCode: "200",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          status: "errrrrr",
          data: err,
          message: "shits broke, no activities for you",
          statusCode: "500",
        });
      });
  };

exports.postActivity = (req, res) => {
  // if(!req.body || !req.body.name || !req.body.userId){
  //   res.status(401).send('Insufficient data')
  // }
  authDB()
  let now = admin.firestore.FieldValue.serverTimestamp()
  let newActivity = {
    name: req.body.name,
    totalDuration: 0,
    userId: req.body.userId,
    logs: [],
    created: now,
    updated: now,
  }

db.collection('activities').add(newActivity)
  .then(() => {
    this.getActivities(req, res)
  })
  .catch(e => {
    res.status(500).send('Error creating new activity:' + e)
  })
}



exports.updateActivity = (req, res) => {
  if(!req.body || !req.body.duration || !req.params.acticityID)
    res.status(400).send('Invalid request, must have body, duration, and activity Id')
  authDB()
  const now = admin.firestore.FieldValue.serverTimestamp()
  db.collection('activities').doc(req.params.activityId).update({
    updated: now,
    logs: admin.firestore.FieldValue.arrayUnion(req.body),
    totalDuration: FieldValue.increment(parseInt(req.body.duration))
  })
    .then(() => {
        this.getActivities(req, res)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          status: "errrrrr",
          data: err,
          message: "Nothing updated.",
          statusCode: "500",
        });
      })
    
  ;
}