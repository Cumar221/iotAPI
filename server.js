var express = require('express')
var device = require('./SimulatedDevice.js')
var app = express()
const port = 3000
var bodyParser = require('body-parser')

var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyAtGcdAZXJ4UoP8QzzdyB67OF9y15es3kg",
    authDomain: "arrest-the-pest-guest.firebaseapp.com",
    databaseURL: "https://arrest-the-pest-guest.firebaseio.com",
    projectId: "arrest-the-pest-guest",
    storageBucket: "arrest-the-pest-guest.appspot.com",
    messagingSenderId: "42445137870"
};

firebase.initializeApp(config);

app.use( bodyParser.json() );     
app.use(bodyParser.urlencoded({  
    extended: true
}));

app.use(express.json());
app.use(express.urlencoded()); 

app.post('/send_to_iot', function (req, res) {
    var data = req.body.key
    console.log('----->', data)
    device.sendMessage(data)
    firebase.database().ref('/iot').set({trigger: data});
    res.send('POST request to the homepage')
})

app.get('/get_toggle', function (req,res){
    console.log('----->', 'toggle')
    firebase.database().ref('/status').set({toggle: '1'});

    var userReference = firebase.database().ref("/status/");

    //Attach an asynchronous callback to read the data
    userReference.on("value",
		     function(snapshot) {
			 console.log(snapshot.val());
			 res.json(snapshot.val());
			 userReference.off("value");
		     },
		     function (errorObject) {
			 console.log("The read failed: " + errorObject.code);
			 res.send("The read failed: " + errorObject.code);
		     });
    
    res.send('GET toggle')

})

app.get('/get_trigger', function (req, res) {

    console.log("HTTP Get Request");
    var userReference = firebase.database().ref("/iot/");

    //Attach an asynchronous callback to read the data
    userReference.on("value",
		     function(snapshot) {
			 console.log(snapshot.val());
			 res.json(snapshot.val());
			 userReference.off("value");
		     },
		     function (errorObject) {
			 console.log("The read failed: " + errorObject.code);
			 res.send("The read failed: " + errorObject.code);
		     });
});

app.get('/', function (req, res) {
    res.send('hello world')
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
