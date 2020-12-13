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

  // First function, let's test if we are running live
  function demo(agent) {
    agent.add(
      "We are live, sending response from Webhook server as [Version 1.1.11.1]"
    );
    agent.add("Okay let's see what we can get up to today");
  }

  // Second function: this is for telling something nice
  function somethingNice(agent) {
    agent.add("Awesome Work");
  }

  // Third function: tells a joke
  function somethingCrazy(agent) {
    agent.add(
      "Why were they called the Dark Ages? Because there were lots of knights."
    );
  }

  function askName(agent) {
    agent.add("I am an AI assistant, you can call me Lynx");
  }

  function bitOff(agent) {
    agent.add("That's what I'm trying to figure out...");
  }

  // Prompt the user for where they're travelling from
  function askBookingFrom(agent) {
    const departure =
      "Please tell us where you are traveling from? \n\nRoutes covered include Bulawayo, Chegutu, Gweru, Kadoma, Kwekwe and Harare.";
    agent.add(departure);
  }

  // Prompt the user for where they're travelling to
  function askBookingTo(agent) {
    const destination =
      "What is your travel destination? \n\nRoutes covered include Bulawayo, Chegutu, Gweru, Kadoma, Kwekwe and Harare.";
    agent.add(destination);
  }

  function askBookingDate(agent) {
    let travelFrom = agent.context.get("capture-to").parameters.travelFrom;
    let travelTo = agent.context.get("capture-date").parameters.travelTo;

    // simplify
    var trip = `${travelFrom} to ${travelTo}`;

    if (travelFrom == travelTo) {
      console.log(trip);
      agent.add(
        `The trip departure point cannot be the same as the destination. Please start again your booking process. Type Start Over`
      );
    } else if (travelFrom == null) {
      console.log("Blank departure point");
      agent.add(
        `The trip departure point cannot be empty. Please start again your booking process. Type Start Over`
      );
    } else {
      console.log(trip);
      agent.add(
        `On what date would you like to travel? \n\nExample: 30 December 2020 or next week Thursday`
      );
    }
  }

  // Confirm data before saving to db
  function confirmBooking(agent) {
    var firstname = agent.context.get("capture-fullname").parameters.firstname;
    var lastname = agent.context.get("capture-fullname").parameters.lastname;
    var person = agent.context.get("capture-fullname").parameters.person;
    var phone = agent.context.get("confirm-ticket").parameters["phone-number"];
    var travelFrom = agent.context.get("capture-to").parameters.travelFrom;
    var travelTo = agent.context.get("capture-date").parameters.travelTo;
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

  // Save the user data to the db
  function confirmationMessage(agent) {
    var firstname = agent.context.get("capture-fullname").parameters.firstname;
    var lastname = agent.context.get("capture-fullname").parameters.lastname;
    var person = agent.context.get("capture-fullname").parameters.person;
    var phone = agent.context.get("confirm-ticket").parameters["phone-number"];
    var travelFrom = agent.context.get("capture-to").parameters.travelFrom;
    var travelTo = agent.context.get("capture-date").parameters.travelTo;
    var travelDate = agent.context
      .get("capture-schedule")
      .parameters["travel-date"].split("T")[0];
    var travelTime = agent.context.get("confirm-booking").parameters[
      "travel-time"
    ];

    // Save human readable date
    const dateObject = new Date();

    // Let's join firstname, lastname
    var fullname = `${firstname} ${lastname}`;
    var busRider = `${person}`;
    var trip = `${travelFrom} to ${travelTo}`; // save trip instead of travelFrom and travelTo

    if (travelFrom == travelTo) {
      agent.add(
        `The trip departure point cannot be the same as the destination. Please start again your booking process. Type Start Over`
      );
    } else {
      agent.add(
        `BOOKING CONFIRMATION \n\nNAME: ${fullname} \nPHONE NUMBER: ${phone} \nTRIP: ${trip} \nDATE: ${travelDate} \nTIME: ${travelTime} \n\nSafe Travels with City Link Luxury Coaches`
      );

      return db
        .collection("tickets")
        .add({
          //firstname: firstname,
          //lastname: lastname,
          fullname: fullname,
          busRider: busRider,
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
  }

  // view all ordered tickets
  function viewTickets(agent) {
    agent.add(`Give us the name of the person whom the ticket was issued to.`);
  }

  // reading data from db
  // function issuedTo(agent) {
  //     // name
  //     var name = agent.context.get("viewTicket").parameters["given-name"];
  //     var surname = agent.context.get("viewTicket").parameters["last-name"];
  //
  //     // combine name and surname
  //     var issue = `${name} ${surname}`;
  //     // get collection
  //     var tickets = await db.collection('tickets').get();
  //
  //     //get document
  //     var ticketUser = await db.collection('tickets').doc(issue).get();
  //
  //     if (!ticketUser.exists) {
  //         console.log('Does not exist');
  //         agent.add(`Ticket does not exist`);
  //     } else {
  //         console.log(ticketUser.data());
  //         agent.add(ticketUser.data());
  //     }
  // }

  // intentMaps, more like a register for all functions
  var intentMap = new Map();
  intentMap.set("webhookDemo", demo);
  intentMap.set("askBookingFrom", askBookingFrom);
  intentMap.set("askBookingTo", askBookingTo);
  intentMap.set("askBookingDate", askBookingDate);
  intentMap.set("askName", askName);
  intentMap.set("bitOff", bitOff);
  intentMap.set("confirmBooking", confirmBooking);
  intentMap.set("confirmationMessage", confirmationMessage);
  intentMap.set("viewTickets", viewTickets);
  // intentMap.set("issuedTo", issuedTo);
  intentMap.set("somethingNice", somethingNice);
  intentMap.set("somethingCrazy", somethingCrazy);

  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log(`Server is live at port ${port}`);
  console.log("Press Ctrl+C to abort connection");
});
