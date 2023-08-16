const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Webhook endpoint
app.post("/orderid", async (req, res) => {
  try {
    const userOrderID = req.body.queryResult.parameters.number;

    const shipmentDetails = await fetchShipmentDetails(userOrderID);

    const response = {
      fulfillmentMessages: [
        {
          text: {
            text: [shipmentDetails],
          },
        },
      ],
    };
    console.log(response);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
});

async function fetchShipmentDetails(orderID) {
  try {
    //sending POST request to API
    const response = await axios.post(
      "https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus",
      { orderId: orderID }
    );
    const shipmentDate = response.data.shipmentDate;
    const formattedDate = await dateFormatter(shipmentDate);
    return `Your order ${orderID} will be shipped on ${formattedDate}.`;
  } catch (error) {
    console.error(error);
    return "Unable to fetch shipment details at the moment.";
  }
}

async function dateFormatter(date) {
  var shipmentDate = new Date(date);
  const dayInWords = await dayMapper(shipmentDate.getDay());
  const monthInWords = await monthMapper(shipmentDate.getMonth())
  shipmentDate = `${dayInWords}, ${shipmentDate.getDate()} ${monthInWords} ${shipmentDate.getFullYear()}`;
  return shipmentDate;
}

async function monthMapper(month) {
  switch (month) {
    case 1:
      return "January";
      break;
    case 2:
      return "February";
      break;
    case 3:
      return "March";
      break;
    case 4:
      return "April";
      break;
    case 5:
      return "May";
      break;
    case 6:
      return "June";
      break;
    case 7:
      return "July";
      break;
    case 8:
      return "August";
      break;
    case 9:
      return "September";
      break;
    case 10:
      return "Octuber";
      break;
    case 11:
      return "November";
      break;
    case 12:
      return "December";
      break;
  }
}

async function dayMapper(day) {
  switch (day) {
    case 1:
      return "Mon";
      break;
    case 2:
      return "Tue";
      break;
    case 3:
      return "Wed";
      break;
    case 4:
      return "Thu";
      break;
    case 5:
      return "Fri";
      break;
    case 6:
      return "Sat";
      break;
    case 7:
      return "Sun";
      break;
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
