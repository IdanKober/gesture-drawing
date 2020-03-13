var refreshTotalTime = function (text) {
  var jsonText;
  var totalSeconds = 0;

  try {
      jsonText = JSON.parse(text);
  } catch (e) {}
  
  if (jsonText) {
    jsonText.session.forEach(item => {
      totalSeconds += item["images_to_show"] * (item["time_per_image"] + item["time_between_images"]);
    });
  }
  document.getElementById("total-time").innerText = Math.ceil(totalSeconds/60) + " minutes"
}

// JSON Editor initialization
const container = document.getElementById("jsoneditor")
const options = {
  mode: "code",
  enableSort: false,
  enableTransform: false,
  statusBar: false,
  onChangeText: refreshTotalTime
}

const editor = new JSONEditor(container, options)

const initialJson = {
    session: [
      {
        "type": "slideshow",
        "images_to_show": 20,
        "time_per_image": 30,
        "time_between_images": 1
      }
    ]
}

if (localStorage.getItem("sessionJSON")) {
  editor.set(JSON.parse(localStorage.getItem("sessionJSON")));
} else {
  editor.set(initialJson);
}

refreshTotalTime(editor.getText());

var session = editor.get();
var actionsQueue = [];