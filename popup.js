// a code string that gets all video and audio tags with a srcObject
const getAllValidMediaTagsCodeString = "[...document.getElementsByTagName('video'),...document.getElementsByTagName('audio')].filter(e=>e.srcObject)";

//query active tab to find audio or video tags with active src and create a volume slider for each one
runCodeOnCurrentTab(
    getAllValidMediaTagsCodeString + ".map(e=> {const id = `${e.tagName}_${e.srcObject.id}`; e.id = id;return { id, volume: e.volume}})"
    ,
    ret => {
        ret = ret.pop();//always seems to wrap return in an array
        //!ret || !ret.length ? createLabel('No video or audio tags found') : ret.forEach(mediaTag => createSliderPerMediaTag(mediaTag));
        if (!ret || !ret.length) {
            createLabel('No video or audio tags found','white-space: nowrap;');
        } else {
            //createMasterSlider();
            createLabel('Master Slider');
            createSlider('slider-master', 1,
                value => {
                    [...document.getElementsByTagName('input')].forEach(e => { if (e.type === 'range') { e.value = value } });
                    runCodeOnCurrentTab(getAllValidMediaTagsCodeString + `.forEach(e=>e.volume=${value})`, () => { });
                }
            );
            //ret.forEach(mediaTag => createSliderPerMediaTag(mediaTag));
            ret.forEach(mediaTag => {
                createLabel(mediaTag.id);
                createSlider(mediaTag.id, mediaTag.volume, value => runCodeOnCurrentTab(`document.getElementById('${mediaTag.id}').volume = ${value}`, () => { }));
            });
        }

    }
);

function createLabel(text, style='') {
    const label = document.createElement('label');
    label.innerHTML = text;
    label.style = style;
    document.body.appendChild(label);
}

//append a slider to the document with a label
function createSlider(id, value, eventFunction) {
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = .1;
    volumeSlider.value = value;
    volumeSlider.id = id;
    volumeSlider.addEventListener('change', () => eventFunction(volumeSlider.value));
    volumeSlider.addEventListener('input', () => eventFunction(volumeSlider.value));
    document.body.appendChild(volumeSlider);
}

function runCodeOnCurrentTab(codeString, callback) {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        tabs => {
            chrome.tabs.executeScript(tabs[0].id, { code: codeString },
                callback)
        }
    );
}


