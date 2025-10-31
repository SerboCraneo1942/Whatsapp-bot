// index.js
import { makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import { spawn } from "child_process"

async function startBot() {
  // Guardar sesión en carpeta "auth"
  const { state, saveCreds } = await useMultiFileAuthState("auth")

  const sock = makeWASocket({
    auth: state
  })

  // Guardar credenciales cada vez que cambien
  sock.ev.on("creds.update", saveCreds)

  // Manejo de conexión y QR
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log("📲 Escanea este QR con tu WhatsApp:", qr)
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect.error = new Boom(lastDisconnect?.error))?.output?.statusCode !== 401
      if (shouldReconnect) startBot()
    } else if (connection === "open") {
      console.log("✅ Bot conectado a WhatsApp")
    }
  })

  // Manejo de mensajes entrantes
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    console.log("📩 Mensaje recibido:", text)

    // 👉 Invocar tu script Python
    const python = spawn("python", ["main.py", text])

    python.stdout.on("data", async (data) => {
      const respuesta = data.toString().trim()
      if (!respuesta) {
        console.log("🤖 Bot apagado. No se envía respuesta.")
        return
      }

      console.log("🧠 Respuesta desde Python:", respuesta)

      // Enviar respuesta a WhatsApp
      await sock.sendMessage(from, { text: respuesta })
    })

    python.stderr.on("data", (data) => {
      console.error("🐍 Error en Python:", data.toString())
    })
  })
}

startBot()