var WebsiteUrl;
var WebsiteHostName;

// get website hostname on the current page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    WebsiteUrl = tabs[0].url
    WebsiteHostName = new URL(tabs[0].url).hostname
    document.getElementById("url").innerText = WebsiteHostName
})

// if on blcoked web, show blocked
// need to make sure it is not undef

// show error message
function ShowError(text) {
    var div = document.createElement('div');
    div.setAttribute('id', 'ERRORcontainer');
    div.innerHTML = `
                <div class="ERROR">
                    <p>${text}</p>
                </div>`
    document.getElementsByClassName("bottomItem")[0].appendChild(div)

    setTimeout(() => {
        document.getElementById("ERRORcontainer").remove()
    }, 3000)
}

chrome.storage.local.get("BlockedUrls", (data) => {
    if (data.BlockedUrls !== undefined) {
        if (data.BlockedUrls.some((e) => e.url === WebsiteHostName && e.status === "BLOCKED")) {
            document.getElementById("btn").innerText = "BLOCKED"
        }
    }

})


// click on the button, block the whole domain
document.getElementById("btn").addEventListener("click", () => {
    if (WebsiteUrl.toLowerCase().includes("chrome://")) {
        ShowError("Cannot block chrome page")
    }
    else {
        chrome.storage.local.get("BlockedUrls", (data) => {
            if (data.BlockedUrls === undefined) {
                chrome.storage.local.set({ BlockedUrls: [{ status: "BLOCKED", url: WebsiteHostName }] })
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        { from: "popup", subject: "startTimer" }
                    )
                    console.log("popup: sent message")
                })
            }
            else {
                if (data.BlockedUrls.some((e) => e.url === WebsiteHostName && e.status === "BLOCKED")) {
                    ShowError("It's already blocked honey")
                }
                else {
                    chrome.storage.local.set({ BlockedUrls: [...data.BlockedUrls, { status: "BLOCKED", url: WebsiteHostName }] })
                    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                        chrome.tabs.sendMessage(
                            tabs[0].id,
                            { from: "popup", subject: "startTimer" }
                        )
                    })
                }
            }

        })
    }
})
