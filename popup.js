'use strict'
document.getElementById('test').onclick = () => { alert('test'); };
document.getElementById('audio').onclick = () => { 
	[...document.getElementsByTagName('audio')].forEach(e=>e.volume = e.volume >= .5? .1 : 1)
};
document.getElementById('audio').onclick = 
//function(element){ 
//	//alert('audio');
//	chrome.tabs.getCurrent(function(tab) {
//		alert(tab.title);
//		console.log('tab: ', tab);
//		//[...tab.getElementsByTagName('audio')].forEach(e=>e.volume = e.volume >= .5? .1 : 1);
//	});
//};
function(element){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: "[...document.getElementsByTagName('audio')].forEach(e=>e.volume = e.volume >= .5? .1 : 1)"});
  });
}
