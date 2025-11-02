# Dockerfile (usar en la raíz del repo)
FROM node:18-bullseye

# Instala Python y pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --upgrade pip

# Directorio de trabajo
WORKDIR /app

# Copia las carpetas (ajusta nombres exactamente como están en repo)
COPY node.js-connection/ ./node.js-connection/
COPY python-logic/ ./python-logic/

# Instala dependencias Node.js
WORKDIR /app/node.js-connection
RUN npm install --production

# Instala dependencias Python
WORKDIR /app/python-logic
# Asegúrate de que requirements.txt incluya flask
RUN pip3 install -r requirements.txt

# Exponer puertos (opcional, logs y pruebas)
EXPOSE 10000 5000

# Establece PYTHON_URL a localhost para que Node apunte al Flask en el mismo contenedor
ENV PYTHON_URL="http://localhost:5000"

# CMD: arranca Node (detached) y Python en primer plano para que Docker mantenga el contenedor vivo
CMD ["bash", "-c", "node /app/node.js-connection/index.cjs & python3 /app/python-logic/main.py"]