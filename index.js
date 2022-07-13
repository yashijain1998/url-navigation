import 'url-change-event';

function getNavigationUrl() {
    window.addEventListener('urlchangeevent', function(e) {
        console.log('from', e.oldURL.href);
        if(e.newURL !== null) {
            console.log('to', e.newURL.href);
        }
        
    })
}
export default getNavigationUrl