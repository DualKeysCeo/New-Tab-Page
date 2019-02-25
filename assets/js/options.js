let select = $("#theme")[0];
let engine = $("#searchEngine")[0];
let blur = $("#blur")[0];
let searchBox = $("#search")[0];
let bookmarkButton = $(".bookmarkButton")[0];
let favoriteButton = $(".favoriteButton")[0];
let bkmrkChecked = false;
let favChecked = false;
let darkmode = $(".darkMode")[0];
let dark = false;
let bookmarks = localStorage.getItem("bookmarks").split(";");

let currentBack;
let favBack;

const getBookmarks = () => {
    return $(".bookmarks");
};

const addBookmark = (value) => {
    if (value === "") return;
    var linkValue = value;
    var linkName = value;
    if (!isLink(linkValue)) {
        linkName += " - Search";
        linkValue = xxxlocation + encodeURI(linkValue);
    } else {
        linkValue = linkValue.toLowerCase();
        if (linkValue.startsWith("http://")) {
            linkValue = "https://" + linkValue.split("http://")[1];
        } else if (!linkValue.startsWith("https") && !linkValue.startsWith("file://") && !linkValue.startsWith("localhost")) {
            linkValue = "https://" + linkValue;
        } else if (linkValue.startsWith("localhost")) {
            linkValue = "http://localhost";
        }
    }

    var bookmark = document.createElement("div");
    bookmark.className = "bookmark";
    bookmark.innerHTML = `<a href="${linkValue}">${linkName}</a>`;
    getBookmarks()[0].appendChild(bookmark);
    if (bookmarks) {
        localStorage.setItem("bookmarks", bookmarks.join(";") + value + ";");
    } else {
        localStorage.setItem("bookmarks", value + ";");
    }
};

const removeBookmark = (value) => {
    if (bookmarks.includes(value)) {
        var index = bookmarks.indexOf(value);
        if (index > -1) {
            localStorage.setItem("bookmarks", bookmarks.join(";"));
            for (var i = 0; i < $(".bookmark").length; i++) {
                if ($(".bookmark")[i].innerHTML.includes(value))
                    $(".bookmark")[i].remove();
            }
        }
    }
};

const background = (_background, fav = false) => {
    currentBack = `${_background}/bg-${Math.floor(Math.random()*10)}.jpg`;
    favBack = currentBack;
    if (fav)
        $("#background").css("background-image", `url('assets/img/${_background}')`);
    else
        $("#background").css("background-image", `url('assets/img/${currentBack}')`);
};

const colorTheme = (dark) => {
    var background,
        color;
    if (dark) {
        background = "#222";
        color = "#eee";
        invert = 1;
    } else {
        background = "#fff";
        color = "black";
        invert = 0;
    }
    var settings = $(".settings").children();
    for (var i = 0; i < settings.length; i++) {
        if (settings[i].localName === "button") {
            try { settings[i].children[0].style.filter = "invert("+invert+")"; } 
            catch (error) { settings[i].style.color = color; }
        }
        settings[i].style.background = background;
        settings[i].style.color = color;
    }
    var wrapper = $(".searchbox").children();
    for (var i = 0; i < wrapper.length; i++) {
        if (wrapper[i].localName === "button") {
            try { wrapper[i].children[0].style.filter = "invert("+invert+")"; } 
            catch (error) { wrapper[i].style.color = color; }
        }
        wrapper[i].style.background = background;
        wrapper[i].style.color = color;
    }
    for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i] !== "") {
            $(".bookmarks").children()[i].style.background = background;
            $(".bookmarks").children()[i].children[0].style.color = color;
        }
    }
}

$(function () {
    let themeCookie = localStorage.getItem("theme");
    let engineCookie = localStorage.getItem("engine");
    let blurCookie = localStorage.getItem("blur");
    let favCookie = localStorage.getItem("favBack");
    let darkCookie = localStorage.getItem("dark");

    //# bookmark stuff
    if (bookmarks) {
        $(".bkmrkImg")[0].src = "assets/img/bookmark-regular.svg";
        bookmarks.forEach((value) => {
            var linkValue = value;
            var linkName = value;
            if (!isLink(linkValue)) {
                linkName += " - Search";
                linkValue = xxxlocation + encodeURI(linkValue);
            } else {
                linkValue = linkValue.toLowerCase();
                if (linkValue.startsWith("http://")) {
                    linkValue = "https://" + linkValue.split("http://")[1];
                } else if (!linkValue.startsWith("https") && !linkValue.startsWith("file://") && !linkValue.startsWith("localhost")) {
                    linkValue = "https://" + linkValue;
                } else if (linkValue.startsWith("localhost")) {
                    linkValue = "http://localhost";
                }
            }
            if (value !== "") {
                var bookmarkItem = document.createElement("div");
                bookmarkItem.className = "bookmark";
                bookmarkItem.innerHTML = `<a href="${linkValue}">${linkName}</a>`;
                getBookmarks()[0].appendChild(bookmarkItem);
            }
        });
    } else {
        $(".bkmrkImg")[0].src = "assets/img/bookmark-regular.svg";
        bookmarks = [];
        localStorage.setItem("bookmarks", "");
    }

    //# Dark mode
    if (darkCookie === "true") {
        $(".darkImg")[0].src = "assets/img/moon-solid.svg";
        colorTheme(true);
    } else {
        $(".darkImg")[0].src = "assets/img/moon-regular.svg";
        colorTheme(false);
    }

    //# Blur cookie stuff
    if (blurCookie === "true") {
        blur.checked = true;
        $("#background").css("transform", "scale(1.01)");
        $("#background").css("filter", "blur(5px)");
    } else {
        localStorage.setItem("blur", blur.checked);
    }

    //# Favorite cookie stuff
    if (favCookie) {
        $(".favImg")[0].src = "assets/img/star-solid.svg";
        background(favCookie, true);
        favChecked = true;
        var options = $("#theme").children();
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === favCookie.split("/")[0]) {
                options[i].outerHTML = `<option id="themeOptions" selected>${options[i].innerHTML}</option>`;
            }
        }
    } else {
        $(".favImg")[0].src = "assets/img/star-regular.svg";
        localStorage.setItem("favBack", "");
    }

    //# Engine cookie stuff
    if (engineCookie) {
        var options = $("#searchEngine").children();
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === engineCookie) {
                options[i].outerHTML = `<option id="engineOptions" selected>${options[i].innerHTML}</option>`;
            }
        }
    } else {
        localStorage.setItem("engine", engine.value);
    }
    $("link")[1].href = "https://" + engine.value + "/favicon.ico";

    //# theme cookie stuff
    if (themeCookie && !favCookie) {
        options = $("#theme").children();
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === themeCookie) {
                options[i].outerHTML = `<option id="themeOptions" selected>${options[i].innerHTML}</option>`;
            }
        }
        background(select.value);
    } else if (!themeCookie && !favCookie){
        localStorage.setItem("theme", select.value);
        background(select.value);
    }
});

bookmarkButton.onclick = (event) => {
    bkmrkChecked = !bkmrkChecked;
    if (searchBox.value === "") {
        bkmrkChecked = false;
        return;
    }
    if (!bkmrkChecked) {
        $(".bkmrkImg")[0].src = "assets/img/bookmark-regular.svg";
        removeBookmark(searchBox.value);
    } else {
        $(".bkmrkImg")[0].src = "assets/img/bookmark-solid.svg";
        addBookmark(searchBox.value);
        bookmarks = localStorage.getItem("bookmarks");
    }
};

var lastChanged = "";
setInterval(() => {
    if (lastChanged !== searchBox.value && searchBox.value !== "") {
        lastChanged = searchBox.value;
        var split = bookmarks;
        for (var i = 0; i < split.length; i++) {
            if (split[i] === searchBox.value) {
                bkmrkChecked = true;
                $(".bkmrkImg")[0].src = "assets/img/bookmark-solid.svg";
                return;
            } else {
                bkmrkChecked = false;
                $(".bkmrkImg")[0].src = "assets/img/bookmark-regular.svg";
            }
        }
    }
});

darkmode.onclick = (event) => {
    dark = !dark;
    if (dark) {
        $(".darkImg")[0].src = "assets/img/moon-solid.svg";
        colorTheme(true);
        localStorage.setItem("dark", true);
    } else {
        $(".darkImg")[0].src = "assets/img/moon-regular.svg";
        localStorage.setItem("dark", false);
        colorTheme(false);
    }
}

favoriteButton.onclick = (event) => {
    favChecked = !favChecked;
    if (favChecked) {
        $(".favImg")[0].src = "assets/img/star-solid.svg";
        favBack = currentBack;
        localStorage.setItem("favBack", currentBack);
    } else {
        $(".favImg")[0].src = "assets/img/star-regular.svg";
        localStorage.setItem("favBack", "");
        favBack = "";
    }
}

select.onchange = (event) => {
    localStorage.setItem("theme", event.target.value);
    localStorage.setItem("favBack", "");
    favChecked = false;
    background(event.target.value);
};

engine.onchange = (event) => {
    localStorage.setItem("engine", event.target.value);
    $("link")[1].href = "https://" + engine.value + "/favicon.ico";
    setEngine();
};

blur.onchange = (event) => {
    if (event.target.checked) {
        $("#background").css("filter", "blur(5px)");
        $("#background").css("transform", "scale(1.01)");
    } else {
        $("#background").css("filter", "unset");
        $("#background").css("transform", "scale(1)");
    }
    localStorage.setItem("blur", event.target.checked);
};

