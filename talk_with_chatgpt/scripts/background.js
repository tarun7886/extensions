chrome.runtime.onUpdateAvailable.addListener(() => {
  chrome.runtime.reload();
});

console.log('background.js');