var currentWord = "";
var hints = {}
var hintIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("searchButton").addEventListener("click", onsearch);
    document.getElementById("hintButton").addEventListener("click", onhint);
    document.getElementById("answerButton").addEventListener("click", onanswer);
    document.getElementById("clearHistoryButton").addEventListener("click", onClearHistory);
});

function onsearch()
{
    getSearchUrl(function(searchUrl) {
        chrome.tabs.update(null, {url: searchUrl});
    });
}

function onClearHistory()
{
    chrome.storage.local.clear();
}

function getSearchUrl(callback) {
    currentWord = document.getElementById("word").value;
    var query = document.getElementById("query").value;
    getPastContexts(currentWord, function(pastContexts) {
        if (Object.keys(pastContexts).length > 0)
            startQuiz(pastContexts);
        else
            startSearch(query, callback);
    });
}

function startQuiz(contexts) {
    var searchArea = document.getElementById("search");
    var quizArea = document.getElementById("quiz");
    searchArea.style.display = 'none';
    quizArea.style.display = 'block';
    var span = document.getElementById("searchedForAlready");
    span.innerHTML = currentWord;
    hints = contexts;
}

function startSearch(query, callback) {
    addContextMenuItem();
    callback("http://google.ca/search?q=" + encodeURIComponent(query));
}

function getPastContexts(word, callback) {
    chrome.storage.local.get(word, callback);
}

function addContextMenuItem() {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create(
        {
            "title": "Set answer for: " + currentWord,
            "contexts": ["selection"],
            "onclick": onClickSetAnswerCallback(currentWord)
        }
    );
}

function onClickSetAnswerCallback(word)
{
    return function(info, tab)
    {
        onClickSetAnswer(info, tab, word);
    }
}

function onClickSetAnswer(info, tab, word) {
    //TODO: add to the set, not just set it
    chrome.storage.local.get(word, function(pastContexts) {
        var items;
        if (Object.keys(pastContexts).length == 0)
            items = [];
        else
            items = pastContexts;
        items.push(info.selectionText);
        var set = {}
        set[currentWord] = items;
        chrome.storage.local.set(set);
    });
}

function onhint() {
    var hintText = document.getElementById("hint");
    hintText.style.display = 'block';
    hintText.innerHTML = hints[Object.keys(hints)[hintIndex]];
    hintIndex++;
}

function onanswer() {
    
}