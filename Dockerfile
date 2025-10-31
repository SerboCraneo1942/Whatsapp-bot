FROM node:18-bullseye

RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /app

COPY node.js-connection/package*.json ./node.js-connection/
RUN cd node.js-connection && npm install

COPY . .

RUN if [ -f python-logic/requirements.txt ]; then pip3 install -r python-logic/requirements.txt; fi

CMD ["node", "node.js-connection/index.cjs"]