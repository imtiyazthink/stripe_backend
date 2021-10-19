const cors = require("cors");
const express = require("express");
require('dotenv').config()
const stripe = require("stripe")(process.env.SECRECT_KEY);
const uuid = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("It Works");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("Product ", product);
  console.log("Price ", product.price);
  const idempontencyKey = uuid.v4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
      name: token.card.name,
      address: {
        line1: token.card.address_line1,
        city: token.card.address_city,
        postal_code: token.card.address_zip,
        country: token.card.address_country,
      },
    })
    .then((customer) => {
        console.log('customer',customer);
      stripe.charges.create(
        {
          amount: 100,
          currency: "usd",
          customer: customer.id,
          description: `purchase of ${product.name}`,
          shipping: {
            name: "imtiyaz",
            address: {
              city: "raichur",
            }
          }
        }
        // { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

app.listen(5000, () => console.log("Listening At Port 5000"));
