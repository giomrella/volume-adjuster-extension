//query active tab to find audio tags and create a volume slider for each one
chrome.tabs.query({active: true, currentWindow: true}, tabs=> {
	chrome.tabs.executeScript( tabs[0].id,
	//{code: "[...document.getElementsByTagName('audio')].map(e=> e.volume = e.volume >= .5? .1 : 1);"},
	//give each audio element an id if none exists, return element??
		{code: "[...document.getElementsByTagName('audio')].map((e,i)=> {e.id = e.id || ('audio_'+i);return {id:e.id, volume: e.volume}})"},
		val=>{
			console.log('return val: ',val);
			val[0].forEach(volumeLevel => createSliderPerAudioTag(volumeLevel));
		}
)});

//create an audio slider for each audio tag and add a label with the audio tag's id
const createSliderPerAudioTag = (audioTag) => {
	const volumeSlider = document.createElement('input');	
	volumeSlider.type = 'range';
	volumeSlider.min = 0;
	volumeSlider.max = 1;
	volumeSlider.step = .1;
	volumeSlider.value = audioTag.volume;
	volumeSlider.id = `slider-${audioTag.id}`;
	//const setVolume = () => {
	//console.log('audioTag: ', audioTag);
	function setVolume(){
		chrome.tabs.query({active: true, currentWindow: true}, tabs=> {
			chrome.tabs.executeScript( tabs[0].id,
			{code: `${audioTag.id}.volume = ${volumeSlider.value}`}
			//{code: `console.log(${audioTag.id});document.getElementById(${audioTag.id}).volume = ${volumeSlider.value}`}
		)});
	};
	volumeSlider.addEventListener('change', setVolume)
	volumeSlider.addEventListener('input', setVolume)
	const label = document.createElement('label');
	label.innerHTML = audioTag.id;
	document.body.appendChild(label);
	document.body.appendChild(volumeSlider);
};

