const youtubeShorts = 'https://www.youtube.com/shorts/'

function pauseRunningVideos () {
  document.querySelectorAll(".video-stream.html5-main-video")
  .forEach(element => {
    element.pause()
  })
}

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(youtubeShorts)) {
    const videoId = tab.url.split("/")[4]
    var url = "https://www.youtube.com/watch?v=" + videoId;

    chrome.scripting
    .executeScript({
      target : {tabId : tab.id},
      func : pauseRunningVideos,
    })
    .then(() => console.log("Wola! write to me at tarunj9878@gmail.com if you find this useful."));

    chrome.tabs.create({url: url});
  }
});
chrome.runtime.onUpdateAvailable.addListener(() => {
    chrome.runtime.reload();
});