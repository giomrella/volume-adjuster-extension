// a code string that gets all video and audio tags with a srcObject
const getAllValidMediaTagsCodeString = "[...document.getElementsByTagName('video'),...document.getElementsByTagName('audio')].filter(e=>e.srcObject)";

//query active tab to find audio or video tags with active src and create a volume slider for each one
runCodeOnCurrentTab(
getAllValidMediaTagsCodeString+".map(e=> {const id = `${e.tagName}_${e.srcObject.id}`; e.id = id;return { id, volume: e.volume}})"
, 
	ret => {
		ret = ret.pop();//always seems to wrap return in an array
		//!ret || !ret.length ? createLabelForNoMediaTags() : ret.forEach(mediaTag => createSliderPerMediaTag(mediaTag));
		if(!ret || !ret.length){
			createLabelForNoMediaTags();
		} else {
			createMasterSlider();
			ret.forEach(mediaTag => createSliderPerMediaTag(mediaTag));
		}

	}
);

function createLabelForNoMediaTags() {
	const label = document.createElement('label');
	label.innerHTML = 'No audio or video tags found on this page';
	label.style = 'white-space: nowrap;';
	document.body.appendChild(label);
}

//create a master volume slider to adjust the volume of all media tags
function createMasterSlider() {
	//TODO: this
	const volumeSlider = document.createElement('input');	
	volumeSlider.type = 'range';
	volumeSlider.min = 0;
	volumeSlider.max = 1;
	volumeSlider.step = .1;
	volumeSlider.value = 1;
	volumeSlider.id = `slider-master`;
	const setVolume = () => {
		[...document.getElementsByTagName('input')].forEach(e=>{if(e.type==='range'){e.value=volumeSlider.value}});
		runCodeOnCurrentTab(getAllValidMediaTagsCodeString+`.forEach(e=>e.volume=${volumeSlider.value})`,()=>{});
	}
	volumeSlider.addEventListener('change', setVolume)
	volumeSlider.addEventListener('input', setVolume)
	const label = document.createElement('label');
	label.innerHTML = 'Master Volume';
	document.body.appendChild(label);
	document.body.appendChild(volumeSlider);
}

//create a volume slider for each media tag and add a label with the media tag's id
function createSliderPerMediaTag(mediaTag){
	const volumeSlider = document.createElement('input');	
	volumeSlider.type = 'range';
	volumeSlider.min = 0;
	volumeSlider.max = 1;
	volumeSlider.step = .1;
	volumeSlider.value = mediaTag.volume;
	volumeSlider.id = `slider-${mediaTag.id}`;
	const setVolume = () => runCodeOnCurrentTab(`document.getElementById('${mediaTag.id}').volume = ${volumeSlider.value}`,()=>{});
	volumeSlider.addEventListener('change', setVolume)
	volumeSlider.addEventListener('input', setVolume)
	const label = document.createElement('label');
	label.innerHTML = mediaTag.id;
	document.body.appendChild(label);
	document.body.appendChild(volumeSlider);
};

function runCodeOnCurrentTab(codeString, callback) {
	chrome.tabs.query(
		{active: true, currentWindow: true},
		tabs=> { chrome.tabs.executeScript( tabs[0].id, {code: codeString},
		callback)}
	);
}
