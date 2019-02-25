let select = $("#theme")[0];
let engine = $("#searchEngine")[0];
let blur = $("#blur")[0];
let searchBox = $("#search")[0];
let bookmarkButton = $(".bookmarkButton")[0];
let favoriteButton = $(".favoriteButton")[0];
let bkmrkChecked = false;
let favChecked = false;

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
        localStorage.setItem("bookmarks", bookmarks + value + ";");
    } else {
        localStorage.setItem("bookmarks", value + ";");
    }
};

const removeBookmark = (value) => {
    bookmarks = bookmarks.split(";");
    if (bookmarks.includes(value)) {
        var index = bookmarks.indexOf(value);
        if (index > -1) {
            bookmarks.splice(index, 1);
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

$(function () {
    let themeCookie = localStorage.getItem("theme");
    let engineCookie = localStorage.getItem("engine");
    let blurCookie = localStorage.getItem("blur");
    let favCookie = localStorage.getItem("favBack");

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
        background(favCookie, true);
        favChecked = true;
        var options = $("#theme").children();
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === favCookie.split("/")[0]) {
                options[i].outerHTML = `<option id="themeOptions" selected>${options[i].innerHTML}</option>`;
            }
        }
    } else {
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

    //# bookmark stuff
    let bookmarks = localStorage.getItem("bookmarks");
    if (bookmarks) {
        bookmarks = bookmarks.split(";");
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
        bookmarks = [];
        localStorage.setItem("bookmarks", "");
    }
});

var lastChanged = "";
setInterval(() => {
    if (lastChanged !== searchBox.value && searchBox.value !== "") {
        lastChanged = searchBox.value;
        var split = bookmarks.split(";");
        for (var i = 0; i < split.length; i++) {
            if (split[i] === searchBox.value) {
                bkmrkChecked = true;
                return;
            } else {
                bkmrkChecked = false;
            }
        }
    }

    if (bkmrkChecked) {
        $(".bkmrkImg")[0].src = "assets/img/bookmark-solid.svg";
    } else {
        $(".bkmrkImg")[0].src = "assets/img/bookmark-regular.svg";
    }

    if (favChecked) {
        $(".favImg")[0].src = "assets/img/star-solid.svg";
    } else {
        $(".favImg")[0].src = "assets/img/star-regular.svg";
    }

    bookmarks = localStorage.getItem("bookmarks");
});

bookmarkButton.onclick = (event) => {
    bkmrkChecked = !bkmrkChecked;
    if (searchBox.value === "") {
        bkmrkChecked = false;
        return;
    }
    if (bkmrkChecked === false) {
        removeBookmark(searchBox.value);
    } else {
        addBookmark(searchBox.value);
    }
};

favoriteButton.onclick = (event) => {
    favChecked = !favChecked;
    if (favChecked === true) {
        favBack = currentBack;
        localStorage.setItem("favBack", currentBack);
    } else {
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