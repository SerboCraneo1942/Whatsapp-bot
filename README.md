# WhatsApp bot (Node + Python)

## Servicios
- node-bot: Baileys y envío/recepción de mensajes
- python-core: API de procesamiento (FastAPI/Flask)

## Deploy (Render)
- Servicio Node:
  - Root: node-bot
  - Build: npm install
  - Start: node index.js
- Servicio Python:
  - Root: python-core
  - Build: pip install -r requirements.txt
  - Start: uvicorn main:app --host 0.0.0.0 --port 10000
