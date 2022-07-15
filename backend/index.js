const { Kafka, Partitioners } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const constants = require('../constants');

const saslUsername = process.env.kafka_sasl_username;
const saslPassword = process.env.kafka_sasl_password;
const kafkaBroker = process.env.kafka_bootstrap_server;
const kafkaTopic = 'webpage-event';
let producer = null;

async function init(clientId) {
    const kafka = new Kafka({
        clientId,
        brokers: [kafkaBroker],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: saslUsername,
          password: saslPassword
        },
      })
    producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    await producer.connect();
}

function enrichEvent(data, ip) {
    const currentTime = new Date().getTime();
    const uuid = uuidv4();
    const eventData = {
        ...data,
        'eventId': uuid,
        'timestamp': currentTime,
        'subSystem': constants.SUB_SYSTEMS.CambridgeOne,
        'ip': ip,
    }
    return eventData;
}

function sendToCavalier(producer, eventData) {
	if(producer === null) {
        console.log('please initialize init() method');
        return;
    }
    const options = {
        topic: kafkaTopic,
        messages: [{ value: JSON.stringify(eventData) }]
    }
    producer.send(options)
    .catch(err => console.log(err));
}

function requestHandler(req,res) {
    let data = req.body;
    const ip = req.socket.remoteAddress;
    const eventData = enrichEvent(data, ip);
    sendToCavalier(eventData);
    res.send('successfully logged to kafka');
}

module.exports = {
    init,
    requestHandler
}