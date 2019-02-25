const KeyPress = (e) => {
    var e = window.event? event : e;

    if (!e.ctrlKey) return;

    if (e.keyCode === 66) {
        
    } 
    switch (e.keyCode) {
        case 66:
            if (bkmrkChecked === true) {
                removeBookmark(searchBox.value);
                bkmrkChecked = false;
            } else {
                addBookmark(searchBox.value);
                bkmrkChecked = true;
            }
            break;
        case 82:
            background(select.value);
            break;
    }
}

searchBox.onkeyup = KeyPress;