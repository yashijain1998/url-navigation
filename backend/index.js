const { Kafka, Partitioners } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const { SUB_SYSTEMS, KAFKA_TOPICS, EVENT_TYPES } = require('../constants');

const saslUsername = process.env.kafka_sasl_username;
const saslPassword = process.env.kafka_sasl_password;
const kafkaBroker = process.env.kafka_bootstrap_server;
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
        }
      });
    producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    await producer.connect();
}

function enrichEvent(data, options) {
    const currentTime = new Date().getTime();
    const uuid = uuidv4();
    const eventData = {
        ...data,
        'eventId': uuid,
        'timestamp': currentTime,
        'subSystem': SUB_SYSTEMS.CambridgeOne,
        'ip': options.ip,
        'userId': options.userId
    }
    return eventData;
}

function getTopicName(type){
    let topicName;
    switch(type) {
        case EVENT_TYPES.WebPageView:
            topicName = KAFKA_TOPICS.WebPageView
        break;
    }
    return topicName;
}

function postToKafka(eventData) {
	if(producer === null) {
        console.log('please initialize init() method');
        return;
    }
    const options = {
        topic: getTopicName(eventData.EVENT_TYPE),
        messages: [{ value: JSON.stringify(eventData) }]
    }
    producer.send(options)
    .catch(err => console.log(err));
}

function requestHandler(req, res) {
    let data = req.body;
    let userId = null;
    if(req.session?.extUserId) {
        userId = req.session?.extUserId;
    }

    const options = {
        userId: userId,
        ip: req.ip
    }
    const eventData = enrichEvent(data, options);
    
    postToKafka(eventData);
    res.json({
        'success': 'true'
    });
}

module.exports = {
    init,
    requestHandler
}