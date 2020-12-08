chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.executeScript( tabs[0].id,
	{code: "[...document.getElementsByTagName('audio')].forEach(e=> e.volume = e.volume >= .5? .1 : 1);"}
)});
