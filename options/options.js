let ui = {}, data, alreadySaved;

function initUI() {
    ui.list = $('#list');
    ui.saveButton = $('#saveButton');
    ui.statusMessage = $('#statusMessage');
}

function init() {
    updateList();
    updateListeners();
}

function updateList() {
    for (let i = 0; i < data.length; i++)
        ui.list.append(getListItem(i, data[i].from, data[i].to));
}

function getListItem(i, from, to) {
    return "<li class=\"grid-container\">" +
        "<input tabindex=\"" + ((i * 3) + 1) + "\" value=\"" + from + "\" id=\"from" + i + "\" placeholder=\"Shortcut\" class=\"from not-empty grid-item\"/>" +
        "<input tabindex=\"" + ((i * 3) + 2) + "\" value=\"" + to + "\" id=\"to" + i + "\" placeholder=\"Replacement\" class=\"to not-empty grid-item\"/>" +
        "<a tabindex=\"" + ((i * 3) + 3) + "\" id=\"remove" + i + "\" class=\"remove grid-item\"><svg style=\"width:20px;height:20px\" viewBox=\"0 0 24 24\"><path fill=\"#333\" d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\" /></svg></a></li>"
}

function updateListeners() {
    setNotEmptyOrDuplicateListener();
    setRemoveListener();
    setKeyPressListener();
}

function setNotEmptyOrDuplicateListener() {
    const inputs = $('input.not-empty');
    inputs.on('input', function () {
        for (let i = 0; i < inputs.length; i++)
            if (!inputs[i].value.trim()) {
                enableSave(false);
                showStatus("Cannot be empty");
                return;
            }
        for (let i = 0; i < inputs.length; i++)
            if (hasDuplicateShortcuts()) {
                enableSave(false);
                showStatus("'" + hasDuplicateShortcuts() + "' used twice");
                return;
            }
        hideStatus(); //all good
        update();
    });
}

function setRemoveListener() {
    $('a.remove').on('click', function () {
        data.splice($(this).parent().index(), 1);
        $(this).parent().remove();
        enableSave(true)
    });
}

function setKeyPressListener() {
    $(document).unbind('keydown');
    $(document).keydown(function (e) {
            if (e.keyCode === 39) {//next
                if (e.target.tagName.toLowerCase() === "a") {
                    const next = $(":focus").parent().next().children().first();
                    next.focus();
                    next.select();
                    e.preventDefault();
                }
                else if (e.target.value && e.target.selectionStart === e.target.value.length) {
                    const next = $(":focus").next();
                    next.focus();
                    next.select();
                    e.preventDefault();
                }
            } else if (e.keyCode === 37) {//prev
                if (e.target.id.includes('from') &&
                    (e.target.value.length === 0 || (e.target.selectionStart === 0
                        && e.target.selectionEnd != e.target.value.length))) {
                    const prev = $(":focus").parent().prev().children().last();
                    prev.focus();
                    prev.select();
                    e.preventDefault();
                }
                else if (e.target.tagName.toLowerCase() === "a" || e.target.value.length === 0
                    || (e.target.selectionStart === 0 && e.target.selectionEnd != e.target.value.length)) {
                    const prev = $(":focus").prev();
                    prev.focus();
                    prev.select();
                    e.preventDefault();
                }
            } else if (e.keyCode === 40) { //down
                if (e.target.tagName.toLowerCase() === "a" || (e.target.value.length === 0) ||
                    (e.target.selectionStart === e.target.value.length)) {
                    const below = $(":focus").parent().next().children().eq($(":focus").index());
                    below.focus();
                    below.select();
                    e.preventDefault();
                }
            } else if (e.keyCode === 38) { //up
                if (e.target.tagName.toLowerCase() === "a" || (e.target.value.length === 0) ||
                    (e.target.selectionEnd === 0)) {
                    const above = $(":focus").parent().prev().children().eq($(":focus").index());
                    above.focus();
                    above.select();
                    e.preventDefault();
                }
            }
            else if (e.keyCode === 13) {//enter
                if (e.target.tagName.toLowerCase() === "a") {
                    const focusedDeleteButton = $(":focus");
                    const next = focusedDeleteButton.parent().next().children().first(); //focus on next
                    next.focus();
                    next.select();
                    focusedDeleteButton.click();
                    e.preventDefault();
                }
            }
        }
    );
}

function update() {
    const from = $('.from');
    const to = $('.to');
    for (let i = 0; i < from.length; i++)
        data[i] = {
            from: from.eq(i).val(),
            to: to.eq(i).val()
        }
    enableSave(isDataChanged());
}


function addRow() {
    data.push({
        from: '',
        to: ''
    });
    ui.list.append(getListItem(data.length - 1, '', ''));
    enableSave(isDataChanged());
    showStatus("Cannot be empty");
    updateListeners();
}

//status messages

function showStatus(status, hideSoon) {
    if (ui.statusMessage.is(":visible") && ui.statusMessage.text() === status)
        return;
    ui.statusMessage.text(status);
    ui.statusMessage.fadeIn();
    if (hideSoon)
        hideStatus();
}

function hideStatus() {
    ui.statusMessage.fadeOut();
}


//storage
function enableSave(enable) {
    ui.saveButton.prop('disabled', !enable);
}

function saveData() {
    chrome.storage.sync.set({
        data: data
    }, function () {
        alreadySaved = clone(data);
        enableSave(false);
        showStatus("Saved", true);
        updateBackgroundScript();
    });
}

function isDataChanged() {
    if (data.length !== alreadySaved.length)
        return true;
    for (let i = 0; i < data.length; i++)
        if (data[i].from !== alreadySaved[i].from || data[i].to !== alreadySaved[i].to)
            return true;
    return false;
}

function deleteData() {
    chrome.storage.sync.clear();
}

function getSavedData() {
    chrome.storage.sync.get({
        data: REPLACEMENTS,
    }, function (saved) {
        data = saved.data;
        alreadySaved = clone(data);
        initUI();
        init();
    });
}

function hasDuplicateShortcuts() {
    const from = $('.from');
    const temp = [];
    for (let i = 0; i < from.length; i++)
        if (temp.includes(from.eq(i).val()))
            return from.eq(i).val();
        else temp.push(from.eq(i).val());
    return false;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function updateBackgroundScript() {
    chrome.runtime.sendMessage({updateData: true});
}

document.addEventListener('DOMContentLoaded', getSavedData);
document.getElementById('saveButton').addEventListener('click', saveData);
document.getElementById('addButton').addEventListener('click', addRow);