// let's hack
// Author: Andile Jaden Mbele
// Program: index.js
// Purpose: webhook for my virtual assistant

const express = require("express");
const app = express();
const dfff = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");

var admin = require("firebase-admin");

var serviceAccount = require("./config/lynxwebhook-firebase-adminsdk-q590u-6fb2939cc9.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lynxwebhook.firebaseio.com",
  });

  console.log("Connected to DB");
} catch (error) {
  console.log(`Error here ${error}`);
}

var db = admin.firestore();

//Let's define port number
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Yes the server is live dude, go to bed.");
});

app.post("/dialogflow-fulfillment", express.json(), (req, res) => {
  const agent = new dfff.WebhookClient({
    request: req,
    response: res,
  });

  function demo(agent) {
    agent.add(
      "We are live, sending response from Webhook server as [Version 1.1.11.1]"
    );
    agent.add("Okay lett's see what we can get up to today");
  }

  function somethingNice(agent) {
    agent.add(
      "You are amazing bro. 120 lines of code in 5 hours, 1hr 40mins of actually keystrokes and 18 git commits, not forgetting that you also deployed to Google Cloud Functions and Heroku as well and the whole thing works flawlessly. That's pretty dope to me."
    );
  }

  function somethingCrazy(agent) {
    agent.add(
      "Let's dismantle all that we have done in the last 30 days and start afresh, this time 10x faster. Simply because I know you can haha"
    );
  }

  function customPayloadDemo(agent) {
    var payloadData = {
      richContent: [
        [
          {
            type: "accordion",
            title: "Accordion title",
            subtitle: "Accordion subtitle",
            image: {
              src: {
                rawUrl: "https://example.com/images/logo.png",
              },
            },
            text: "Accordion text",
          },
        ],
      ],
    };

    agent.add(
      new dfff.Payload(agent.UNSPECIFIED, payloadData, {
        sendAsMessage: true,
        rawPayload: true,
      })
    );
    //agent.add("This is the custom payload function")
  }

  function askBookingFrom(agent) {
    agent.add(
      "Please tell us where you are traveling from? \n\nThe routes we cover include only Bulawayo, Chegutu, Gweru, Kadoma, Kwekwe and Harare"
    );
  }

  function askBookingTo(agent) {
    agent.add(
      "What is your travel destination? \n\nRoutes covered include Bulawayo, Chegutu, Gweru, Kadoma, Kwekwe and Harare."
    );
  }

  function confirmBooking(agent) {
    var firstname = agent.context.get("capture-fullname").parameters.firstname;
    var lastname = agent.context.get("capture-fullname").parameters.lastname;
    var person = agent.context.get("capture-fullname").parameters.person;
    var phone = agent.context.get("confirm-ticket").parameters["phone-number"];
    var travelFrom = agent.context.get("capture-to").parameters["travel-from"];
    var travelTo = agent.context.get("capture-date").parameters["travel-to"];
    var travelDate = agent.context.get("capture-schedule").parameters[
      "travel-date"
    ];
    var travelTime = agent.context.get("confirm-booking").parameters[
      "travel-time"
    ];

    // Let's join firstname, lastname and person.
    var fullname = `${firstname} ${lastname}`;

    // Let's talk to our agent
    agent.add(
      `Confirm ${
        fullname || person
      } with phone number ${phone} wishes to travel from ${travelFrom} to ${travelTo} on ${travelDate} in the ${travelTime}. \nTo proceed type Yes or No to Cancel`
    );
  }

  // Confirming #capture-fullname.firstname #capture-fullname.lastname with phone number $phone-number wishes to travel from #capture-to.travel-from to #capture-date.travel-to on #capture-schedule.travel-date.original in the #confirm-booking.travel-time

  function confirmationMessage(agent) {
    var firstname = agent.context.get("capture-fullname").parameters.firstname;
    var lastname = agent.context.get("capture-fullname").parameters.lastname;
    var person = agent.context.get("capture-fullname").parameters.person;
    var phone = agent.context.get("confirm-ticket").parameters["phone-number"];
    var travelFrom = agent.context.get("capture-to").parameters["travel-from"];
    var travelTo = agent.context.get("capture-date").parameters["travel-to"];
    var travelDate = agent.context.get("capture-schedule").parameters[
      "travel-date"
    ];
    var travelTime = agent.context.get("confirm-booking").parameters[
      "travel-time"
    ];

    // Save human readable date
    const dateObject = new Date();

    // Let's join firstname, lastname
    var fullname = `${firstname} ${lastname}`;
    var busRider = `${person || fullname}`;
    var trip = `${travelFrom} to ${travelTo}`; // save trip instead of travelFrom and travelTo

    agent.add(
      `BOOKING CONFIRMATION \nNAME: ${
        fullname || busRider[0]
      } \nPHONE NUMBER: ${phone} \nTRIP: ${trip} \nDATE: ${travelDate} \nTIME: ${travelTime} \n\nSafe Travels with City Link Luxury Coaches`
    );

    return db
      .collection("tickets")
      .add({
        //firstname: firstname,
        //lastname: lastname,
        fullname: fullname,
        busRider: busRider.toString(),
        phone: phone,
        trip: trip,
        dateOfTravel: travelDate,
        timeOfTravel: travelTime,
        time: dateObject,
      })
      .then(
        (ref) =>
          //fetching free slots
          console.log("Ticket successfully added."),
        agent.add("Ticket reservation successful")
      );
  }

  function viewTickets() {
    agent.add(`We're yet to work on this function...`);
  }

  var intentMap = new Map();
  intentMap.set("webhookDemo", demo);
  intentMap.set("customPayloadDemo", customPayloadDemo);
  intentMap.set("confirmBooking", confirmBooking);
  intentMap.set("confirmationMessage", confirmationMessage);
  intentMap.set("viewTickets", viewTickets);
  intentMap.set("somethingNice", somethingNice);
  intentMap.set("somethingCrazy", somethingCrazy);

  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log(`Server is live at port ${port}`);
  console.log("Press Ctrl+C to abort connection");
});
