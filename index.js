// let's hack
// Author: Andile Jaden Mbele
// Program: index.js
// Purpose: webhook for my virtual assistant

const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');



var admin = require("firebase-admin");

var serviceAccount = require("./config/lynxwebhook-firebase-adminsdk-q590u-6fb2939cc9.json");

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://lynxwebhook.firebaseio.com"
    });

    console.log("Connected to DB");
    
} catch (error) {
    console.log(`Error here ${error}`);
}

var db = admin.firestore();


//Let's define port number
const port = process.env.PORT || 8080

app.get('/', (req, res)=> {
    res.send("Yes the server is live dude, go to bed.")
});

app.post('/dialogflow-fulfillment', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({
        request : req,
        response : res
    });

    function demo(agent) {
        agent.add("We are live, sending response from Webhook server as [Version 1.1.11.1]");
        agent.add("Okay lett's see what we can get up to today");
    }

    function customPayloadDemo(agent){
        var payloadData = {
            "richContent": [
                [
                    {
                        "type": "accordion",
                        "title": "Accordion title",
                        "subtitle": "Accordion subtitle",
                        "image": {
                        "src": {
                            "rawUrl": "https://example.com/images/logo.png"
                            }
                        },
                        "text": "Accordion text"
                    }
                ]
            ]
        }

        agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true }) )
        //agent.add("This is the custom payload function")
    }
    // Confirming #capture-fullname.firstname #capture-fullname.lastname with phone number $phone-number wishes to travel from #capture-to.travel-from to #capture-date.travel-to on #capture-schedule.travel-date.original in the #confirm-booking.travel-time

    function confirmationMessage(agent){
        var firstname = agent.context.get("capture-fullname").parameters.firstname;
        var lastname = agent.context.get("capture-fullname").parameters.lastname;
        var phone = agent.context.get("confirm-ticket").parameters["phone-number"];
        var travelFrom = agent.context.get("capture-to").parameters["travel-from"];
        var travelTo = agent.context.get("capture-date").parameters["travel-to"];
        var travelDate = agent.context.get("capture-schedule").parameters["travel-date"];
        var travelTime = agent.context.get("confirm-booking").parameters["travel-time"];

        agent.add("Dummy Response");

        return db.collection('tickets').add({
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            travelFrom: travelFrom,
            travelTo: travelTo,
            travelDate: travelDate,
            travelTime: travelTime,
            time: Date.now()

        }).then(ref =>
            //fetching free slots
            console.log("Ticket details added")
            )
    }

    var intentMap = new Map();
    intentMap.set('webhookDemo', demo)
    intentMap.set('customPayloadDemo', customPayloadDemo)
    intentMap.set('confirmationMessage', confirmationMessage)

    agent.handleRequest(intentMap);
});

app.listen(port, () => {
    console.log(`Server is live at port ${port}`)
});