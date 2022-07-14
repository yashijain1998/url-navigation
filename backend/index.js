const { Kafka, Partitioners } = require('kafkajs');
const saslUsername = process.env.kafka_sasl_username;
const saslPassword = process.env.kafka_sasl_password;
const kafkaBroker = process.env.kafka_bootstrap_server;
let producer = null;

function init() {
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
    producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
}

function enrichEvent(eventData, ip) {
    const currentTime = new Date().getTime();
    const data = {
        ...eventData,
        'eventId': crypto.randomUUID(),
        'timestamp': currentTime,
        'subSystem': 'c1',
        'ip': ip,
    }
    return data;
}

function sendToCavalier(eventData) {
	if(producer === null) {
        console.log('please initialize init() method');
        return;
    }
    const options = {
        'topic' :"test-topic",
        'message': eventData
    }
    producer.send(options);
}

module.exports = {
    init,
    enrichEvent,
    sendToCavalier
}