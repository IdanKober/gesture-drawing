 // JSON Editor initialization
 const container = document.getElementById("jsoneditor")
 const options = {
   mode: "code"
 }
 const editor = new JSONEditor(container, options)

 // set json
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
 editor.set(initialJson);

 var session = editor.get();
 var actionsQueue = [];

