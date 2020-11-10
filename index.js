const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');

app.get('/', (req, res)=> {
    res.send("Yes the server is live dude, go to bed.")
});

app.post('/', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({
        request : req,
        response : res
    });

    function demo(agent) {
        agent.add("Sending response from Webhook server as [Version 1.1.11.1]");
    }

    function customPayloadDemo(agent){
        var payloadData = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Info item title",
                        "subtitle": "Info item subtitle",
                        "image": {
                        "src": {
                            "rawUrl": "https://example.com/images/logo.png"
                        }
                        },
                        "actionLink": "https://example.com"
                    }
                ]
            ]
        }

        agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}) )
    }
    // Confirming #capture-fullname.firstname #capture-fullname.lastname with phone number $phone-number wishes to travel from #capture-to.travel-from to #capture-date.travel-to on #capture-schedule.travel-date.original in the #confirm-booking.travel-time

    function confirmationMessage(agent){
        var fullname = agent.context("capture-fullname");
        var phone = agent.context("phone-number");
        var travelFrom = agent.context("capture-to");
        var travelTo = agent.context("capture-date");
        var travelDate = agent.context("capture-schedule");
        var travelTime = agent.context("confirm-booking");
    }

    var intentMap = new Map();

    intentMap.set('webhookDemo', demo)
    intentMap.set('customPayloadDemo', customPayloadDemo)
    intentMap.set('confirmationMessage', confirmationMessage)

    agent.handleRequest(intentMap);
});

app.listen(3333, ()=>console.log("Server is live at port 3333"));