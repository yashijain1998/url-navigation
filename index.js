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
        'eventId': 1234,
        'EVENT_TYPE': 'WebPageView',
        'timestamp': currentTime,
        'url': eventData.newUrl.href,
        'host': eventData.newUrl.host,
        'path': eventData.newUrl.pathname,
        'title': '',
        'origin': eventData.oldUrl.href,
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