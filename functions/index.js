const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

admin.initializeApp();
const db = admin.database();
// const orderCollection = admin.firestore().collection('order').
const app = express();
app.use(
    bodyParser.json({
      verify: function(req, res, buf, encoding) {
        req.rawBody = buf.toString(encoding || "utf-8");
      },
    }),
);
app.use(cors({origin: true}));

// handle upload image
exports.bannerUploadHandler = functions
    .region("asia-southeast1")
    .storage.object()
    .onFinalize(async (object) => {
      let imageUrl = "https://firebasestorage.googleapis.com/v0/b/";
      const dirName = object.name.substring(0, object.name.indexOf("/"));
      imageUrl = object.selfLink.replace(
          "https://www.googleapis.com/storage/v1/b/",
          imageUrl,
      );
      imageUrl +=
      "?alt=media&token=" + object.metadata.firebaseStorageDownloadTokens;
      // https://firebasestorage.googleapis.com/v0/b/switch-on-coffee-and-keto.appspot.com/o/fullscreen%2FScreen%20Shot%202565-01-30%20at%2018.28.29.png?alt=media&token=8568c879-be28-4856-95e4-bd74a1cbf28c
      //
      if (dirName == "fullscreen") {
        console.log("update imageUrl for fullscreen");
        await db.ref("banner/fullscreen").set({a0: imageUrl});
      } else if (dirName == "halfscreen") {
        console.log("update imageUrl for halfscreen");
        await db.ref("banner/halfscreen").set({a0: imageUrl});
      }
    });

// Validation of Square webhook
const crypto = require("crypto");
const NOTIFICATION_URL = process.env.SQUARE_NOTIFICATION_URL;
const SIG_KEY = process.env.SQUARE_SIG_KEY;
const isFromSquare = (sigKey, notificationUrl, squareSignature, rawBody) => {
  // create hmac signature
  const hmac = crypto.createHmac("sha1", sigKey);
  hmac.update(notificationUrl + rawBody);
  const hash = hmac.digest("base64");

  // compare to square signature
  return hash === squareSignature;
};

// handle SquareAPI
const {Client, Environment} = require("square");
const clientSquare = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_TOKEN,
});
const catalog = {
  "6SMXXP7WXY2IOGV3R3DWA7XY": "desserts",
};

// handle Orders
app.post("/hook/payment-created", async (req, res) => {
  // console.log(req.body) // Call your action on the request here
  const squareSignature = req.headers["x-square-signature"];
  const eventIsFromSquare = isFromSquare(
      SIG_KEY,
      NOTIFICATION_URL,
      squareSignature,
      req.rawBody,
  );
  if (eventIsFromSquare) {
    res.status(200).end(); // Responding is important
    // eject drawer if pay by cash
    const paymentMethod = req.body.data.object.payment.source_type;
    // const amount =
    // "" + req.body.data.object.payment.amount_money.amount / 100;
    console.log("payment method: ", paymentMethod);
    if (paymentMethod === "CASH") {
      db.ref("alert/").set({drawer: "active"});
    }

    // fetch orders details with payment
    const response = await clientSquare.ordersApi.retrieveOrder(
        req.body.data.object.payment.order_id,
    );
    // send orders details to GAS
    postOrderDetail(response.body);
    console.log("response: ", response.body);
    console.log("retriving orderID: ", req.body.data.object.payment.order_id);
    console.log(
        "catalogObjectId of first item: ",
        response.result.order.lineItems[0].catalogObjectId,
    );
    console.log(
        "variation of first item: ",
        response.result.order.lineItems[0].variationName,
    );

    // create orders object
    let previousCatalog = "drinks";
    const lineItems = response.result.order.lineItems
        .filter((item) => {
          if (item.name == "Delivery Partner") {
            return false;
          }
          return true;
        })
        .map((item, index) => {
          let modifiers = "";
          previousCatalog = catalog[item.catalogObjectId] ?
          catalog[item.catalogObjectId] :
          previousCatalog;
          if (item.modifiers) {
            item.modifiers.map((modifier) => {
              modifiers +=
              modifiers === "" ? modifier.name : ", " + modifier.name;
            });
          }
          return {
            id: index,
            name: item.name,
            categories: previousCatalog,
            variation: item.variationName,
            modifier: modifiers,
            quantity: item.quantity,
            state: "process",
          };
        });
    const newOrder = {
      is_paid: paymentMethod === "CASH" ? true : false,
      items: lineItems,
    };
    console.log("newOrder", JSON.stringify(newOrder));
    db.ref("orders/").push(newOrder);
  } else {
    res.status(403).end(); // Responding is important
  }
});

// send orders details to GAS
const postOrderDetail = (data) => {
  const headers = {
    "Content-Type": "application/json",
  };
  console.log("Posting Data to GAS");
  axios
      .post(
          "https://script.google.com/macros/s/AKfycbxpYmQVZflPrIDHR_tVwYGTtsQt3mQrOXbBBu0QWc8g-JvKSa04wrgUDPrVxVtGTcb0OA/exec",
          data,
          {
            headers: headers,
          },
      )
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
};

exports.app = functions.region("asia-southeast1").https.onRequest(app);
