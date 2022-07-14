require('url-change-event');
const axios = require('axios');
let app;

function init(appName){
    app = appName;
}

function capturePageViewEvents() {
    window.addEventListener('urlchangeevent', function(eventData) {
        const webPageEvent = constructPageViewEvent(eventData)
        sendToServer(webPageEvent);
    })
}

function constructPageViewEvent(eventData) {
    const userAgent = window.navigator.userAgent;
    const title = window.document.title;
    const webPageEvent = {
        'EVENT_TYPE': 'WebPageView',
        'url': eventData.newURL.href,
        'host': eventData.newURL.host,
        'path': eventData.newURL.pathname,
        'title': title,
        'origin': eventData.oldURL.href,
        'userAgent': userAgent,
        'app': app
    }
    return webPageEvent;
}

function sendToServer(event) {
    const url = 'localhost:8080/apigateway/cav-analytics'
    axios.post(url, event)
      .then((response)=>{
        console.log(response);
      })
}

module.exports = {
    init,
    capturePageViewEvents
}