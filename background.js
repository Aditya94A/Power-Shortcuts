const SEARCH = "q=";
let savedData;

//init saved data


chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        console.log(details.url);
        if (details.url.includes('aditya')) {
            console.log("adit");
            chrome.runtime.openOptionsPage();
            return {redirectUrl: ""};
        }
        else {
            console.log("not adit");
        }
        let query = details.url.substring(details.url.indexOf(SEARCH), details.url.indexOf("&"))
            .replace(SEARCH, "");
        let newQuery = replaceQuery(query);
        if (newQuery === null)
            return {redirectUrl: details.url};
        let newUrl = details.url.replace(query, newQuery);
        return {redirectUrl: newUrl};
    },
    {
        urls: GOOGLE_DOMAINS,
        types: ["main_frame", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);

function updateData() {
    chrome.storage.sync.get({
        data: REPLACEMENTS,
    }, function (saved) {
        console.log(saved);
        savedData = saved.data;
    });
}

updateData();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.updateData) updateData();
    });

function replaceQuery(query) {
    query = query.trim();
    console.log("Got query " + query);
    for (let i = 0; i < savedData.length; i++)
        if (query.startsWith(savedData[i].from))
            return query.replace(savedData[i].from, savedData[i].to);
    return null;
}
