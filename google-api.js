// Client ID and API key from the Developer Console
var CLIENT_ID = '600336160266-hkamin8jh7209c9quit1rj8a5910gusp.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDxvW8B8uLgJdpodYldqXyX_umff3Tnf3w';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
var scope = ['https://www.googleapis.com/auth/drive.file'];

var authorizeButton = document.getElementById('sign-in-button');
var signoutButton = document.getElementById('sign-out-button');
var selectFolderButton = document.getElementById('select-folder-button');
var selectFolderButtonSpinner = document.getElementById('select-folder-button-spinner');
var numberOfFilesSpan = document.getElementById('number-of-files');

var oauthToken;

var files = [];

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
  gapi.load('picker');
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    console.log(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

//TODO: Retrieve all files in all child directories
function retrieveAllFiles(folderId, callback) {
  var retrievePageOfFiles = function(request, result) {
    request.execute(function(resp) {
      files = files.concat(resp.files);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.drive.files.list({
          'pageToken': nextPageToken,
          'pageSize': 100,
          'fields': "nextPageToken, files(id, name)",
          'q': "'" + folderId + "' in parents and mimeType = 'image/jpeg'"
        });
        retrievePageOfFiles(request, files);
        numberOfFilesSpan.innerText = files.length + " images found"
      } else {
        callback();
      }
    });
  }
  var initialRequest = gapi.client.drive.files.list({
    'pageSize': 100,
    'fields': "nextPageToken, files(id, name)",
    'q': "'" + folderId + "' in parents and mimeType = 'image/jpeg'"
  });
  retrievePageOfFiles(initialRequest, []);
}

// Create and render a Picker object for searching images.
function createPicker() {
  var view = new google.picker.DocsView()
    .setIncludeFolders(true)
    .setMimeTypes('application/vnd.google-apps.folder')
    .setSelectFolderEnabled(true);
    
  var picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true).access_token)
      .addView(view)
      .setCallback(pickerCallback)
      .build();
  picker.setVisible(true);
}

function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    
    selectFolderButtonSpinner.style.display = "inline-block";
    selectFolderButton.disabled = true;

    retrieveAllFiles(fileId, doneRetrievingAllFiles)
  }
}

function doneRetrievingAllFiles() {
    selectFolderButton.disabled = false;
    selectFolderButtonSpinner.style.display = "none";
    numberOfFilesSpan.innerText = files.length + " images found"
    console.log("all files retrieved");
}