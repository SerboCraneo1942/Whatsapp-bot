FROM node:18-bullseye

RUN apt-get update && apt-get install -y python3 python3-pip curl

WORKDIR /app

# Install root Node deps (so /app/node_modules exists)
COPY package*.json ./
RUN npm install

# Install subproject Node deps
COPY node.js-connection/package*.json ./node.js-connection/
RUN cd node.js-connection && npm install

# Copy source
COPY . .

# Install Python deps if exist
RUN if [ -f python-logic/requirements.txt ]; then pip3 install -r python-logic/requirements.txt; fi

# Start Python (uvicorn) in background, wait until /ping responds, then start Node
CMD ["sh", "-c", "python3 -m uvicorn python-logic.main:app --host 0.0.0.0 --port 10000 & \
until curl -sSf http://127.0.0.1:10000/ping >/dev/null 2>&1; do sleep 0.5; done; \
export PYTHON_URL=http://127.0.0.1:10000; \
node node.js-connection/index.cjs"]