let select = $("#theme")[0];
let engine = $("#searchEngine")[0];
let blur = $("#blur")[0];
let searchBox = $("#search")[0];
let bookmarkButton = $(".bookmarkButton")[0];
let checked = false;

const addBookmark = (value) => {
    if (value === "") return
    var linkValue = value
    if (!isLink(linkValue)) {
        linkValue = xxxlocation + encodeURI(linkValue);
    } else {
        linkValue = linkValue.toLowerCase()
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
    bookmark.innerHTML = `<a href="${linkValue}">${value}</a>`;
    $(".bookmarks")[0].appendChild(bookmark);
    if (bookmarks) {
        localStorage.setItem("bookmarks", bookmarks + value + ";");
    } else {
        localStorage.setItem("bookmarks", value + ";");
    }
}

const removeBookmark = (value) => {
    bookmarks = bookmarks.split(";");
    if (bookmarks.includes(value)) {
        var index = bookmarks.indexOf(value);
        if (index > -1) {
            bookmarks.splice(index, 1);
            console.log("bookmarks")
            localStorage.setItem("bookmarks", bookmarks.join(";"));
            for (var i = 0; i < $(".bookmark").length; i++) {
                if ($(".bookmark")[i].innerHTML.includes(value)) {
                    $(".bookmark")[i].remove();
                }
            }
        }
    }
}

const background = (_background) => {
    if (_background.startsWith("#")) {
        $("#background").css("background-image", _background);
        return;
    }
    $("#background").css("background-image", `url('assets/img/${_background}/bg-${Math.floor(Math.random()*10)}.jpg')`);
};

let bookmarks = localStorage.getItem("bookmarks");

if (bookmarks) {
    bookmarks = bookmarks.split(";");
    bookmarks.forEach((bookmark) => {
        console.log(bookmark);
        if (bookmark != "") {
            var bookmarkItem = document.createElement("div");
            bookmarkItem.className = "bookmark";
            bookmarkItem.innerHTML = `<a href="${bookmark}">${bookmark}</a>`;
            $(".bookmarks")[0].appendChild(bookmarkItem);
        }
    });
} else {
    bookmarks = [];
    localStorage.setItem("bookmarks", "")
}

$(function () {
    let themeCookie = localStorage.getItem("theme");
    let engineCookie = localStorage.getItem("engine");
    let blurCookie = localStorage.getItem("blur");

    //# Blur cookie stuff
    if (blurCookie) {
        if (blurCookie == "true") {
            blur.checked = true
            $("#background").css("transform", "scale(1.01)");
            $("#background").css("filter", "blur(5px)");
        }
    } else {
        localStorage.setItem("blur", blur.checked);
    }

    //# Engine cookie stuff
    if (engineCookie) {
        var options = $("#searchEngine").children();
        for (var i = 0; i < options.length; i++) {
            if (options[i].value == engineCookie) {
                options[i].outerHTML = `<option id="engineOptions" selected>${options[i].innerHTML}</option>`;
            }
        } 
    } else {
        localStorage.setItem("engine", engine.value);
    }
    $("link")[1].href = "https://" + engine.value + "/favicon.ico";

    //# theme cookie stuff
    if (themeCookie) {
        var options = $("#theme").children();
        if (themeCookie.startsWith("#")) {
            var pick = document.createElement("input");
            pick.addAttribute("type", "color");
            pick.addAttribute("onchange", "clickColor(0, -1, -1, 5)");
            pick.click();
        } else {
            for (var i = 0; i < options.length; i++) {
                if (options[i].value == themeCookie) {
                    options[i].outerHTML = `<option id="themeOptions" selected>${options[i].innerHTML}</option>`;
                }
            }
        }
    } else {
        localStorage.setItem("theme", select.value);
    }
    background(select.value);
});

var lastChanged = "";
setInterval(() => {
    if (lastChanged !== searchBox.value && searchBox.value != "") {
        lastChanged = searchBox.value;
        var split = bookmarks.split(";");
        for (var i = 0; i < split.length; i++) {
            if (split[i] === searchBox.value) {
                checked = true;
                return;
            } else {
                checked = false;
            }
        }
    }
    if (checked) {
        $(".bkmrkImg")[0].src = "assets/img/bookmark-solid.svg";
    } else {
        $(".bkmrkImg")[0].src = "assets/img/bookmark-regular.svg";
    }

    bookmarks = localStorage.getItem("bookmarks");
});

bookmarkButton.onclick = (event) => {
    checked = !checked
    if (searchBox.value === "") {
        checked = false;
        return;
    }
    if (checked === false) {
        console.log("removed");
        removeBookmark(searchBox.value);
    } else {
        console.log("added");
        addBookmark(searchBox.value);
    }
    console.log(checked);
}

select.onchange = (event) => {
    var inputText = event.target.value;
    if (inputText === "Color") {
        var pick = document.createElement("input");
        pick.setAttribute("type", "color");
        pick.setAttribute("onchange", "clickColor(0, -1, -1, 5)");
        pick.click();
        background(pick.value);
        localStorage.setItem("theme", pick.value);
    } else {
        localStorage.setItem("theme", event.target.value);
        background(event.target.value);
    }
}

engine.onchange = (event) => {
    var inputText = event.target.value;
    localStorage.setItem("engine", event.target.value);
    $("link")[1].href = "https://" + engine.value + "/favicon.ico";
}

blur.onchange = (event) => {
    if (event.target.checked) {
        $("#background").css("filter", "blur(5px)");
        $("#background").css("transform", "scale(1.01)");
    } else {
        $("#background").css("filter", "unset");
        $("#background").css("transform", "scale(1)");
    }
    localStorage.setItem("blur", event.target.checked);
}