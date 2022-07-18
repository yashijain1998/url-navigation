const EVENT_TYPES = {
    WebPageView: 'WebPageView'
}

const SUB_SYSTEMS = {
    CambridgeOne: 'c1'
}

const URL_ENDPOINTS = {
    ServerAnalytics: '/apigateway/cav-analytics'
}

const KAFKA_TOPICS = {
    WebPageView: 'webpage-event'
}

const APP_METADATA = {
    AppVersion: 'v2'
}


module.exports = {
    EVENT_TYPES,
    SUB_SYSTEMS,
    URL_ENDPOINTS,
    APP_METADATA,
    KAFKA_TOPICS
}