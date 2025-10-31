const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// 👉 Token permanente de Meta
const TOKEN = "EAAP076jd3SABP0OHZBQwhrQQG1lXW4087KZBgwe8GruUlhMrrGNZBF7H6AbCTOkLHFQHM1ZBBMJ2SOOqQpEfVCfXqRxyVRzjLcvDrT6H9AsX0mhZC0s8yeg4CJa7LsotTZA8kON5ovcPsSXS4sHkucQpq8172CaQtuHU3fmyjKz7Bq47twxxZCBo86vtMD9B61rLQZDZD";

// ✅ Verificación del webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "mi_token_de_verificacion";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificado ✅");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ✅ Recepción de mensajes
app.post("/webhook", (req, res) => {
  const data = req.body;

  if (data.object) {
    const entry = data.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body;
      const phone_number_id = changes.value.metadata.phone_number_id;

      console.log("📩 Mensaje recibido:", text);

      // ✅ Ejecutar lógica Python
      const python = spawn("python", ["C:/Users/user/Desktop/whatsapp-bot/main.py", text]);

      python.stdout.on("data", async (data) => {
        // ✅ Limpiar espacios, saltos, tabulaciones
        const respuesta = data.toString().replace(/\s+/g, "").trim();

        if (!respuesta) {
          console.log("🤖 Bot apagado. No se envía respuesta.");
          return;
        }

        const mensajeFinal = data.toString().trim(); // conservar formato original para WhatsApp
        console.log("🧠 Respuesta desde Python:", mensajeFinal);

        // ✅ Enviar respuesta a WhatsApp
        try {
          await axios.post(
            `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
            {
              messaging_product: "whatsapp",
              to: from,
              text: { body: mensajeFinal },
            },
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
        } catch (err) {
          console.error("❌ Error enviando mensaje a WhatsApp:", err.response?.data || err.message);
        }
      });

      python.stderr.on("data", (data) => {
        console.error("🐍 Error en Python:", data.toString());
      });
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("🚀 Servidor corriendo en puerto 3000"));