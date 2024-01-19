var recognition = new (window.SpeechRecognition ||
	window.webkitSpeechRecognition ||
	window.mozSpeechRecognition ||
	window.msSpeechRecognition)()

recognition.continuous = true
recognition.interimResults = true
// recognition.lang = "en-US"

var recognizing = false
var currentTextInput = ""
var textArea = null

recognition.onstart = function () {
	recognizing = true
  currentTextInput = textArea.value
}

recognition.onerror = function (event) {
	if (["no-speech", "audio-capture", "not-allowed"].includes(event.error)) {
		// ignore_onend = true
	}
}
recognition.onend = function () {
	recognizing = false
}
recognition.onresult = function (event) {
	var interim_transcript = ""
	for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (recognizing === false) {
      // To stop midway exits from listening
      return
    }

		if (event.results[i].isFinal) {
      textArea.value = currentTextInput + event.results[i][0].transcript
      currentTextInput = textArea.value
		} else {
      interim_transcript += event.results[i][0].transcript
      textArea.value = currentTextInput + interim_transcript
      var inputEvent = new Event("input", { bubbles: true });
      textArea.dispatchEvent(inputEvent);
		}
  }
}

function stopRecognition() {
  recognition.stop()
  recognizing = false
  button.removeChild(stop)
  button.appendChild(image)
}


var button = document.createElement("button")
var image = document.createElement("img")
image.src = chrome.runtime.getURL("images/microphone.png")
image.style.height = "24px"

var stop = document.createElement("div")
stop.style.height = "12px"
stop.style.width = "12px"
stop.style.backgroundColor = "#ad0b0b"
stop.style.borderRadius = "50%"

button.appendChild(image)

button.classList.add("absolute","border","border-black","dark:bg-white","md:bottom-3","p-0.5","rounded", "flex", "items-center", "justify-center", "h-[30px]", "w-[30px]", "right-8%")
button.style.right = "8%"

function toggleListening(event) {
  event.stopPropagation()
  event.preventDefault()
  if (recognizing) {
    stopRecognition()
    return
  }
  this.removeChild(image)
  this.appendChild(stop)
  recognition.start()
  currentTextInput = textArea.value
}

button.addEventListener("click", toggleListening)

document.addEventListener("click", (event) => {
  if (recognizing) {
    stopRecognition()
  }
})

function init() {
  textArea = document.getElementById("prompt-textarea")
  
  if (!textArea || textArea.nextElementSibling === button) {
    return
  }

  textArea.insertAdjacentElement("afterend", button)

  if (recognizing) {
    stopRecognition()
  }
}

init()

const navObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    init()
  })
})

function getObservableNode() {
    return document.getElementsByTagName("nav")[0];
}

navObserver.observe(
  getObservableNode(), {
    subtree: true,
    attributeFilter: ["class"],
});