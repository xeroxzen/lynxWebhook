// Prompt the user for where they're travelling from
// function askBookingFrom(agent) {
//   const departure =
//     "Please tell us where you are traveling from? \n\nRoutes covered include Bulawayo, Chegutu, Gweru, Kadoma, Kwekwe and Harare.";
//   agent.add(departure);
// }

// Prompt the user for where they're travelling to
// function askBookingTo(agent) {
//   const destination =
//     "What is your travel destination? \n\nRoutes covered include Bulawayo, Chegutu, Gweru, Kadoma, Kwekwe and Harare.";
//   agent.add(destination);
// }

// Confirm data before saving to db
// function confirmBooking(agent) {
//   var firstname = agent.context.get("capture-fullname").parameters.firstname;
//   var lastname = agent.context.get("capture-fullname").parameters.lastname;
//   var person = agent.context.get("capture-fullname").parameters.person;
//   var phone = agent.context.get("confirm-ticket").parameters.phoneNumber;
//   var travelFrom = agent.context.get("capture-to").parameters.travelFrom;
//   var travelTo = agent.context.get("capture-date").parameters.travelTo;
//   var travelDate = agent.context.get("capture-schedule").parameters[
//     "travel-date"
//   ];
//   var travelTime = agent.context.get("confirm-booking").parameters[
//     "travel-time"
//   ];
//
//   // Let's join firstname, lastname and person.
//   var fullname = `${firstname} ${lastname}`;
//
//   // Let's talk to our agent
//   agent.add(
//     `Confirm ${
//       fullname || person
//     } with phone number ${phone} wishes to travel from ${travelFrom} to ${travelTo} on ${travelDate} in the ${travelTime}. \nTo proceed type Yes or No to Cancel`
//   );
// {
//   "fulfillmentMessages": [
//     {
//       "quickReplies": {
//         "title": "Confirm Ticket Reservation",
//         "quickReplies": [
//           "Yes",
//           "No"
//         ]
//       },
//       "platform": "TELEGRAM"
//     }
// }

// }
