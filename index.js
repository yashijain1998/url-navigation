import 'url-change-event';
let app;

export function init(appName){
    app = appName;
}

export function capturePageViewEvents() {
    window.addEventListener('urlchangeevent', function(eventData) {
        const webPageEvent = constructPageViewEvent(eventData)
        sendToServer(webPageEvent);
    })
}

function constructPageViewEvent(eventData) {
    const currentTime = new Date().getTime();
    const userAgent = window.navigator.userAgent;
    const webPageEvent = {
        'eventId': crypto.randomUUID(),
        'EVENT_TYPE': 'WebPageView',
        'timestamp': currentTime,
        'url': eventData.newURL.href,
        'host': eventData.newURL.host,
        'path': eventData.newURL.pathname,
        'title': '',
        'origin': eventData.oldURL.href,
        'userAgent': userAgent,
        'subSystem': 'c1',
        'app': app
    }
    return webPageEvent;
}

function sendToServer(event){
    console.log(event);
}

// exports.init = init;
// exports.capturePageViewEvents = capturePageViewEvents;