const { Kafka, Partitioners } = require('kafkajs');
const saslUsername = process.env.kafka_sasl_username;
const saslPassword = process.env.kafka_sasl_password;
const kafkaBroker = process.env.kafka_bootstrap_server;
// let producer = null;

async function init() {
    const kafka = new Kafka({
        clientId: 'kafkajs-produce',
        brokers: [kafkaBroker],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: saslUsername,
          password: saslPassword
        },
      })
    const producer  = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    await producer.connect();
    return producer;
}

function enrichEvent(data, ip) {
    const currentTime = new Date().getTime();
    const eventData = {
        ...data,
        'eventId': crypto.randomUUID(),
        'timestamp': currentTime,
        'subSystem': 'c1',
        'ip': ip,
    }
    return eventData;
}

async function sendToCavalier(producer, eventData) {
	if(producer === null) {
        console.log('please initialize init() method');
        return;
    }
    const options = {
        'topic' :"webpage-event",
        'message': eventData
    }
    await producer.send(options);
}

async function requestHandler(req,res) {
    const producer = await init();
    const data = req.body;
    const ip = request.socket.remoteAddress;
    const eventData = enrichEvent(data, ip);
    await sendToCavalier(producer, eventData);
}

module.exports = {
    requestHandler
}