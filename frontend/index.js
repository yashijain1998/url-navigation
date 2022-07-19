require('url-change-event');

const axios = require('axios');
const { EVENT_TYPES, URL_ENDPOINTS, APP_METADATA } = require('../constants');

let app;

function init(appName){
    app = appName;
}

function capturePageViewEvents() {
    window.addEventListener('urlchangeevent', function(eventData) {
        const webPageEvent = constructPageViewEvent(eventData.newURL, eventData.oldURL)
        postEventData(webPageEvent);
    });
}

function constructPageViewEvent(newURL, oldURL) {
    const userAgent = window.navigator.userAgent;
    const title = window.document.title;

    const webPageEvent = {
        'EVENT_TYPE': EVENT_TYPES.WebPageView,
        'url': newURL ? newURL.href : null,
        'host': newURL ? newURL.host : null,
        'path': newURL ? newURL.pathname : null,
        'origin': oldURL ? oldURL.href : null,
        'title': title,
        'userAgent': userAgent,
        'app': app
    }
    return webPageEvent;
}

function postEventData(event) {
    const domain = window.location.origin;
    const url = `${domain}${URL_ENDPOINTS.ServerAnalytics}`;
    axios.post(url, event, {
        headers: {
          'cambridgeone-app-version': APP_METADATA.AppVersion,
          'content-type': 'application/json',
          'csrf-token': getCsrfToken()
        }
      });
}

function getCsrfToken() {
    const cookie = Object.fromEntries(document.cookie.split('; ').map(v=>v.split('=').map(decodeURIComponent)));
    return cookie['csrf-token'];
}

module.exports = {
    init,
    capturePageViewEvents
}