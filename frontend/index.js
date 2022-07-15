require('url-change-event');
const axios = require('axios');
const constants = require('../constants');
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
        'EVENT_TYPE': constants.EVENT_TYPES.WebPageView,
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
    const domain = window.location.origin;
    const url = `${domain}${constants.ENDPOINT.CavalierAnalytics}`;
    axios.post(url, event, {
        headers: {
          'cambridgeone-app-version': constants.HEADER_PROPERTIES.CambridgeoneAppVersion,
          'content-type': 'application/json',
          'csrf-token': getCsrfToken()
        }
      })
}

function getCsrfToken() {
    const cookie = Object.fromEntries(document.cookie.split('; ').map(v=>v.split(/=/).map(decodeURIComponent)));
    return cookie['csrf-token'];
}

module.exports = {
    init,
    capturePageViewEvents
}