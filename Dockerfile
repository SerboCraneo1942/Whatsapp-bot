FROM node:18-bullseye

RUN apt-get update && apt-get install -y python3 python3-pip curl

WORKDIR /app

# Install node deps for the subproject
COPY node.js-connection/package*.json ./node.js-connection/
RUN cd node.js-connection && npm install

# Copy source
COPY . .

# Install Python deps (Flask is in requirements.txt)
RUN if [ -f python-logic/requirements.txt ]; then pip3 install -r python-logic/requirements.txt; fi

# Start Flask (background), wait until /ping responds, then start Node
# Uses $PORT if provided by Render; default 10000
CMD ["sh", "-c", "\
  PORT=${PORT:-10000}; \
  export FLASK_APP=python-logic.main; \
  python3 -m flask run --host=0.0.0.0 --port=$PORT & \
  until curl -sSf http://127.0.0.1:$PORT/ping >/dev/null 2>&1; do sleep 0.5; done; \
  export PYTHON_URL=http://127.0.0.1:$PORT; \
  node node.js-connection/index.cjs"]