const https = require("https");
const nodemailer = require("nodemailer");

const LATITUDE = -8.05;
const LONGITUDE = -34.88;
const DESTINO_EMAIL = process.env.DESTINO_EMAIL;
const ENVIO_EMAIL = process.env.ENVIO_EMAIL;
const SENHA_EMAIL = process.env.SENHA_EMAIL;

const URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LATITUDE}&longitude=${LONGITUDE}` +
  `&daily=precipitation_sum` +
  `&timezone=America/Recife` +
  `&forecast_days=1`;

https.get(URL, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));

  res.on("end", async () => {
    const dados = JSON.parse(data);
    const chuva_mm = dados.daily.precipitation_sum[0];

    if (chuva_mm > 0) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: ENVIO_EMAIL,
          pass: SENHA_EMAIL,
        },
      });

      await transporter.sendMail({
        from: ENVIO_EMAIL,
        to: DESTINO_EMAIL,
        subject: "⛈️ Alerta de chuva hoje em Recife!",
        text: `A previsão é de ${chuva_mm} mm de chuva hoje. Leve o guarda-chuva!`,
      });

      console.log("Email enviado!");
    } else {
      console.log("Sem chuva prevista. Nenhum email enviado.");
    }
  });
});