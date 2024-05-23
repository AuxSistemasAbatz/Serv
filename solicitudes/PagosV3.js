import { MercadoPagoConfig, Payment } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.TOKEN_DE_MERCADOPAGO,
  options: {
    timeout: 5000,
  },
});

const CrearPago = (req, res) => {
  const payment = new Payment(client);
  let body = req.body;
  payment
    .create({ body })
    .then((response) => {
      console.log(response.status, response.status_detail);
      res.send(response);
    })
    .catch((error) => console.log("error", error));
};

export default CrearPago;
