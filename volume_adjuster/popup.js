// a code string that gets all video and audio tags with a srcObject
const getAllValidMediaTagsCodeString = "[...document.getElementsByTagName('video'),...document.getElementsByTagName('audio')].filter(e=>e.srcObject||e.src)";

//query active tab to find audio or video tags with active src and create a volume slider for each one
runCodeOnCurrentTab(
    getAllValidMediaTagsCodeString + ".map((e,i)=> {const id = e.id || `${e.tagName}_${i}`; e.id = id;return { id, volume: e.volume, muted: e.muted }})"
    ,
    ret => {
        if (!ret || !ret[0] || !ret[0].length) {
            document.body.appendChild(createLabel('No video or audio tags found', 'white-space: nowrap;'));
        } else {
            ret = ret.pop()
            const masterMutedCheckbox = createCheckbox('checkbox-master', true, muted => {
                [...document.getElementsByTagName('input')].forEach(e => { if (e.type === 'checkbox') { e.value = e.checked = muted } });
                runCodeOnCurrentTab(getAllValidMediaTagsCodeString + `.forEach(e=>e.muted=${muted})`);
            });
            const masterMutedSlider = createSlider('slider-master', 1,
                volume => {
                    [...document.getElementsByTagName('input')].forEach(e => { if (e.type === 'range') { e.value = volume } });
                    runCodeOnCurrentTab(getAllValidMediaTagsCodeString + `.forEach(e=>e.volume=${volume})`);
                }
            );
            const masterRows = [
                ce('tr', ce('td', createLabel('Master Volume'))),
                ce('tr',
                    ce('td', masterMutedSlider),
                    ce('th', masterMutedCheckbox)
                )
            ]
            const mediaRows = ret.reduce((acc, mediaTag) => {
                const checkbox = createCheckbox(mediaTag.id, mediaTag.muted, muted => { runCodeOnCurrentTab(`document.getElementById('${mediaTag.id}').muted = ${muted}`) });
                const slider = createSlider(mediaTag.id, mediaTag.volume, volume => runCodeOnCurrentTab(`document.getElementById('${mediaTag.id}').volume = ${volume}`));
                return [
                    ...acc,
                    ce('tr', ce('td', createLabel(mediaTag.id))),
                    ce('tr',
                        ce('td', slider),
                        ce('th', checkbox)
                    )
                ];
            }, ret.length > 1 ? masterRows : []);
            document.body.appendChild(
                ce('table',
                    ce('thead',
                        ce('tr',
                            ce('th', createLabel('Tag ID')),
                            ce('th', createLabel('Muted'))
                        )
                    ),
                    ce('tbody',
                        ...mediaRows
                    )
                )
            );
            document.getElementsByTagName('table');
        }

    }
);

//append a label to the document body, optional style string param
function createLabel(text, style = '') {
    const label = document.createElement('label');
    label.innerHTML = text;
    label.style = style;
    return label;
}

//append a slider to the document body
function createSlider(id, volume, eventFunction) {
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = .1;
    volumeSlider.value = volume;
    volumeSlider.id = `slider-${id}`;
    volumeSlider.addEventListener('change', () => eventFunction(volumeSlider.value));
    volumeSlider.addEventListener('input', () => eventFunction(volumeSlider.value));
    return volumeSlider;
}

//append a checkbox to the document body
function createCheckbox(id, muted, eventFunction) {
    const mutedCheckbox = document.createElement('input');
    mutedCheckbox.type = 'checkbox';
    mutedCheckbox.id = `checkbox-${id}`;
    mutedCheckbox.value = muted;
    mutedCheckbox.checked = muted;
    mutedCheckbox.addEventListener('change', () => eventFunction(mutedCheckbox.checked));
    return mutedCheckbox;
}

function runCodeOnCurrentTab(codeString, callback = () => { }) {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        tabs => { chrome.tabs.executeScript(tabs[0].id, { code: codeString }, callback) }
    );
}

function ce(type, ...children) { const el = document.createElement(type); children.forEach(child => { if (type === 'tr') { child.setAttribute("colspan", 3 - children.length); } el.appendChild(child); }); return el }