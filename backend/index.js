const { Kafka, Partitioners } = require('kafkajs');
const saslUsername = process.env.kafka_sasl_username;
const saslPassword = process.env.kafka_sasl_password;
const kafkaBroker = process.env.kafka_bootstrap_server;
// let producer = null;

async function init() {
    console.log('init function called');
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
    console.log('producer connected');
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
    console.log('events starts logging');
    const response = await producer.send(options);
    console.log('response from kafka',response);
}

async function requestHandler(req,res) {
    console.log('start request handler');
    const producer = await init();
    const data = req.body;
    const ip = request.socket.remoteAddress;
    const eventData = enrichEvent(data, ip);
    console.log('eventData',eventData);
    await sendToCavalier(producer, eventData);
    console.log('request handler finished');
    res.send('successfully logged to kafka')
}

module.exports = {
    requestHandler
}