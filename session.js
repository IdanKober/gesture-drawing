var startASessionDiv = document.getElementById("start-a-session");
var sessionDiv = document.getElementById("session");

function startSession() {
    actionsQueue = createQueueFromSessionJSON();

    startASessionDiv.style.display = "none";
    sessionDiv.style.display = "block";

    nextAction();
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
        const nextAction = actionsQueue.shift();

        if (nextAction.type == "image") {
            showImage(nextAction);
        } else if (nextAction.type == "break") {
            breakTime(nextAction);
        }
    }
}

function showImage(imageConfiguration) {
    const imageId = files[Math.floor(Math.random() * files.length)].id;
    console.log("show image: " + imageId);

    document.getElementById("slideshow_image").src = "https://drive.google.com/uc?id=" + imageId;
    setTimeout(nextAction, imageConfiguration.time * 1000);
}

function breakTime(breakConfiguration) {
    console.log("break time: " + breakConfiguration.text)

    setTimeout(nextAction, breakConfiguration.time * 1000);
}