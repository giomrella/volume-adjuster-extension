//query active tab to find audio or video tags with active src and create a volume slider for each one
runCodeOnCurrentTab(
"[...document.getElementsByTagName('video'),...document.getElementsByTagName('audio')].filter(e=>e.srcObject).map(e=> ({ id: `${e.tagName}_${e.srcObject.id}`, volume: e.volume}))"
, 
	ret => {
		ret = ret.pop();//always seems to wrap return in an array
		!ret || !ret.length ? createLabelForNoMediaTags() : ret.forEach(mediaTag => createSliderPerMediaTag(mediaTag));
	}
);

//create a volume slider for each media tag and add a label with the media tag's id
function createSliderPerMediaTag(mediaTag){
	const volumeSlider = document.createElement('input');	
	volumeSlider.type = 'range';
	volumeSlider.min = 0;
	volumeSlider.max = 1;
	volumeSlider.step = .1;
	volumeSlider.value = mediaTag.volume;
	volumeSlider.id = `slider-${mediaTag.id}`;
	const setVolume = () => runCodeOnCurrentTab(`${mediaTag.id}.volume = ${volumeSlider.value}`,()=>{});
	volumeSlider.addEventListener('change', setVolume)
	volumeSlider.addEventListener('input', setVolume)
	const label = document.createElement('label');
	label.innerHTML = mediaTag.id;
	document.body.appendChild(label);
	document.body.appendChild(volumeSlider);
};

function createLabelForNoMediaTags() {
	const label = document.createElement('label');
	label.innerHTML = 'No audio or video tags found on this page';
	label.style = 'white-space: nowrap;';
	document.body.appendChild(label);
}

function runCodeOnCurrentTab(codeString, callback) {
	chrome.tabs.query(
		{active: true, currentWindow: true},
		tabs=> { chrome.tabs.executeScript( tabs[0].id, {code: codeString},
		callback)}
	);
}
