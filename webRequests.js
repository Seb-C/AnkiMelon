function catchRequest(url) {
    return new Promise((resolve, reject) => {
        browser.webRequest.onBeforeRequest.addListener(function (request) {
            var stream = browser.webRequest.filterResponseData(request.requestId);
            var decoder = new TextDecoder("utf-8");

            var data = '';
            stream.ondata = event => {
                data += decoder.decode(event.data);
                stream.write(event.data);
            };
            stream.onstop = event => {
                resolve(JSON.parse(data));
                stream.disconnect();
            };
        }, {urls: [url]}, ["blocking"]);
    });
}

catchRequest("*://animelon.com/api/*/translationHistoryAll/jp*")
    .then(data => console.log(data));
