var startASessionDiv = document.getElementById("start-a-session");
var sessionDiv = document.getElementById("session");
var slideshow_image = document.getElementById("slideshow_image");
var actionProgressBar;
var currentTimeoutId;
var currentImageId;
var currentAction;
var skippedImages = [];

function startSession() {
    saveSettingsToLocalStorage();
    initSkippedImages();
    actionsQueue = createQueueFromSessionJSON();

    startASessionDiv.style.display = "none";
    sessionDiv.style.display = "block";

    actionProgressBar = new ProgressBar.Circle('#action-progress-bar', {
        strokeWidth: 2,
        color: '#FFFFFF',
        warnings: true
    });

    nextAction();
}

function initSkippedImages() {
  if (localStorage.getItem("skippedImages")) {
    skippedImages = JSON.parse(localStorage.getItem("skippedImages"));
  }
}

function saveSettingsToLocalStorage() {
  localStorage.setItem("sessionJSON", JSON.stringify(editor.get()));
}

function createQueueFromSessionJSON() {
  let session = editor.get().session;
  let queue = [];

  session.forEach(section => {
    if (section.type = "slideshow") {
      for (let index = 0; index < section.images_to_show; index++) {
        queue.push({
          type: "image",
          time: section.time_per_image
        });
        queue.push({
          type: "break",
          text: "get ready for next image",
          time: section.time_between_images
        });
      }
    }
  });

  return queue;
}

function nextAction() {
  if (actionsQueue.length > 0) {
      currentAction = actionsQueue.shift();

      if (currentAction.type == "image") {
          showImage(currentAction);
      } else if (currentAction.type == "break") {
          breakTime(currentAction);
      }
  }
}

function showImage(imageConfiguration) {
  currentImageId = files[Math.floor(Math.random() * files.length)].id;
  while (skippedImages.includes(currentImageId)) {
    currentImageId = files[Math.floor(Math.random() * files.length)].id;
  }
  
  slideshow_image.src = "https://drive.google.com/uc?id=" + currentImageId;
  actionProgressBar.set(0);
  slideshow_image.onload = function () {
      actionProgressBar.animate(1, {duration: imageConfiguration.time * 1000 - 1000});
      currentTimeoutId = setTimeout(nextAction, imageConfiguration.time * 1000);
  };
}

function breakTime(breakConfiguration) {
  slideshow_image.src = "";
  actionProgressBar.set(0);
  currentTimeoutId = setTimeout(nextAction, breakConfiguration.time * 1000 - 1000);
}

function skipAction() {
  if (currentAction.type == "image") {
    skippedImages.push(currentImageId);
    localStorage.setItem("skippedImages", JSON.stringify(skippedImages));
  }

  actionProgressBar.stop();
  clearTimeout(currentTimeoutId);
  actionsQueue.push(currentAction);
  nextAction();
}