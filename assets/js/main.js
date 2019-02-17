let tlds;
$.getJSON("assets/json/info.json", (json) => {
    tlds = json["tlds"];
});

let xxxlocation;
var engineTemp = localStorage.getItem("engine");    
switch (engineTemp) {
    case "google.com":
        xxxlocation = "https://google.com/search?q=";
        break;
    case "yahoo.com":
        xxxlocation = "https://search.yahoo.com/search?q=";
        break;
    case "bing.com":
        xxxlocation = "https://bing.com/search?q=";
        break;
    default:
        xxxlocation = "https://duckduckgo.com/?q=";
        break;
}

const search = (id) => {
    var str = document.getElementById(id).value.toLowerCase();

    if (!isLink(str)) {
        window.location.href = xxxlocation + encodeURI(str);
    } else {
        str = str.toLowerCase()
        if (str.startsWith("http://")) {
            window.location.href = "https://" + str.split("http://")[1];
        } else if (!str.startsWith("https") && !str.startsWith("file://") && !str.startsWith("localhost")) {
            window.location.href = "https://" + str;
        } else if (str.startsWith("localhost")) {
            window.location.href = "http://localhost";
        } else {
            window.location.href = str;
        }
    }
}

let isLink = (string) => {
    if (string.startsWith("http")) return true;                                             //# if http or https link
    if (string.startsWith("file://")) return true;                                          //# if file protocol
    for (var i = 0; i < tlds.length; i++) {
        string = string.split("/")[0];                                                      //# Get rid of path in url
        if (string.includes(":")) string = string.split(":")[0];                            //# Allow ports
        if (string.endsWith(tlds[i].toLowerCase()) && !string.includes(" ")) return true;   //# if ends with a tld after getting rid of ports and paths
    }
    return false;
} 

document.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        search("search");
    }
})