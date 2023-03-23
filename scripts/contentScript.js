function CloseTab(goodbye_message) {
    alert(goodbye_message)
    chrome.runtime.sendMessage({ CloseMe: true })
}

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.from === "popup" && message.subject === "startTimer") {
        chrome.storage.local.get("BlockedUrls", (data) => {
            if (data.BlockedUrls !== undefined) {
                if (data.BlockedUrls.some((e) => e.url === window.location.hostname && e.status === "BLOCKED")) {
                    console.log("close tab")
                    CloseTab("WOW PyControl just smashed me!!")
                }
            }
        })
    }
})


chrome.storage.local.get("BlockedUrls", (data) => {
    if (data.BlockedUrls !== undefined) {
        if (data.BlockedUrls.some((e) => e.url === window.location.hostname && e.status === "BLOCKED")) {
            console.log("close tab")
            CloseTab("Hey I'm so sorry we won't hang out anymore, but I'm glad you're doing great work!")
        }
    }
})
console.log("you're on content script now")
