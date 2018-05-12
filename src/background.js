import Word from './classes/Word.js';

function catchRequest(url) {
    return new Promise((resolve, reject) => {
        browser.webRequest.onBeforeRequest.addListener(request => {
            var stream = browser.webRequest.filterResponseData(request.requestId);
            var decoder = new TextDecoder("utf-8");

            var data = '';
            stream.ondata = event => {
                data += decoder.decode(event.data);
                stream.write(event.data);
            };
            stream.onstop = event => {
                stream.disconnect();
                var resultData = JSON.parse(data);
                if (resultData && resultData.error) {
                    reject(resultData.error);
                } else {
                    resolve(resultData);
                }
            };
            stream.onerror = event => {
                reject(filter.error);
            };
        }, {urls: [url]}, ["blocking"]);
    });
}

function createWordFromHistoryFormat(wordData) {
    var translations = [];
    wordData.phrase.translations.forEach(lang => {
        if (lang.language == 'en') {
            translations = translations.push(...lang.translations);
        }
    });

    return new Word(
        wordData._id,
        wordData.phrase.phonetics.text,
        translations
    );
}

catchRequest("*://animelon.com/api/*/translationHistoryAll/jp*")
    .then(data => data.resArray.forEach(createWordFromHistoryFormat));
