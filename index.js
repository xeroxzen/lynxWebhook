// let's hack
// Author: Andile Jaden Mbele
// Program: index.js
// Purpose: webhook for my virtual assistant

const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');


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

        agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}) )
        //agent.add("This is the custom payload function")
    }
    // Confirming #capture-fullname.firstname #capture-fullname.lastname with phone number $phone-number wishes to travel from #capture-to.travel-from to #capture-date.travel-to on #capture-schedule.travel-date.original in the #confirm-booking.travel-time

    function confirmationMessage(agent){
        var fullname = agent.context.get("capture-fullname");
        var phone = agent.context.get("phone-number");
        var travelFrom = agent.context.get("capture-to");
        var travelTo = agent.context.get("capture-date");
        var travelDate = agent.context.get("capture-schedule");
        var travelTime = agent.context.get("confirm-booking");

        console.log(fullname);
        console.log(phone);
        console.log(travelFrom);
        console.log(travelTo);
        console.log(travelDate);
        console.log(travelTime);

        agent.add("Dummy Response");
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