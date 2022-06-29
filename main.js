// main.js

// Initialize the SDK and get
// a reference to the project
var project = grandeur.init("grandeurl4pgaw7x1uhv0pxf2te6fyxe", "accessl4tpw33d1vqq0pxfbhtl77df", "eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNkltRmpZMlZ6YzJ3MGRIQjNNek5rTVhaeGNUQndlR1ppYUhSc056ZGtaaUlzSW5SNWNHVWlPaUpoWTJObGMzTWlMQ0pwWVhRaU9qRTJOVFl4TlRFMU9ERjkuSkJhYVBobUtLUVNtYUtqbDI3NnRXT1h2R3ZvUENVU3BGRTktQkpNMmxwayJ9");

// Variable to store state and deviseID
var deviceState = 0;
var deviceID = "devicel4pgax7j1uhy0pxf8o5c5dlq";

// Function to login user
var loginUser = async () => {
  // Create Loader
  var loading = await startLoading("Submitting Request");

  // Get email and password
  // from the form
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  
  // Get reference to the auth class
  var auth = project.auth();

  // Use try and catch block in order to 
  // use async await otherwise promises are also supported
  // use async await otherwise promises are also supported
  try {
    // Submit request
    var res = await auth.login(email, password);

    // Dismiss the Loader
    loading.dismiss();

    // Clear the form
    document.getElementById("login-form").reset();

    // Generate an alert
    switch(res.code) {
      case "AUTH-ACCOUNT-LOGGEDIN": 
        // User Authenticated
        toast("User has logged in to the account.")
        break;

      case "DATA-INVALID": 
        // Logging failed due
        // to invalid data
        toast("User data is invalid.");
        break;

      case "AUTH-ACCOUNT-ALREADY-LOGGEDIN":
        // A user account is already authenticated
        toast("Please logout the already loggedin user.");
        break;

    }
  }
  catch(err) {
    // Error usually got generated when
    // we are not connected to the internet
    // Create a Toast
    console.log(err);
    toast("Failed to authenticate the user due to connectivity issue.");
  }
}

let toggleBtn = document.querySelector("#toggle-btn");

// Function to toggle state of a device paired to a
// user account
var toggleDeviceState = async () => {
  // Get reference to the auth class
  var devices = project.devices();

  // Use try and catch block in order to 
  // use async await otherwise promises are also supported
  try {
    // Get parameters first
    var res = await devices.device(deviceID).getParms();
    
    // Got the response to request
    // so log it in console
    console.log(res);
    
    // Verify that the device parameters are returned
    switch(res.code) {
        case "DEVICE-PARMS-FETCHED":
            // Store the state into the variable
            // after toggling
            deviceState = res.deviceParms.state == 1? 0: 1;
            break; 
        
        default: {
            // In case of an error while fetching the state
            // simply generate an error
            alert("Error: Failed to update the state of the device");
            return;
        }
    }

    // Set parameters
    var res = await devices.device(deviceID).setParms({state: deviceState});

    // Got the response to request
    // so log it in console
    console.log(res);

    // Generate an alert
    switch(res.code) {
      case "DEVICE-PARMS-UPDATED":  
        // Updated the parms
        // now update them
        alert(`SUCCESS: State is now ${deviceState == 1? "ON": "OFF"}`);
        break;

      default: 
        // Fetch failed
        alert("Error: Failed to get device parms");
    }
  }
  catch(err) {
    // Error usually got generated when
    // we are not connected to the internet
    // Log the error to the console
    console.log(err);

    // Generate an alert
    alert("Error: Failed to toggle device state");
  }
}
toggleBtn.addEventListener("click", toggleDeviceState)

let logoutBtn = document.querySelector("#logout-btn");
// Function to logout user
var logoutFunc = async () => {
  // Create Loader
  var loading = await startLoading("Submitting Request");

  // Get reference to the auth class
  var auth = project.auth();

  // Use try and catch block in order to 
  // use async await otherwise promises are also supported
  try {
    // Submit request
    var res = await auth.logout();

    // Dismiss Loading
    loading.dismiss();

    // Generate an alert
    switch(res.code) {
      case "AUTH-ACCOUNT-LOGGEDOUT": 
        // User Authenticated
        toast("User has Logged out");
        break;

      case "AUTH-UNAUTHORIZED": 
        // User is not authenticated
        toast("User is not authenticated.");
    }
  }
  catch(err) {
    // Error usually got generated when
    // we are not connected to the internet
    toast("Failed to logout the user");
  }
}
logoutBtn.addEventListener("click", logoutFunc)



// Function to create a Toast
var toast = async (message) => {
  // Create a new toast
  const ionToast = document.createElement('ion-toast');

  // Set message and duration
  ionToast.message = message;
  ionToast.duration = 2000;

  // Append
  document.body.appendChild(ionToast);

  // Present
  await ionToast.present();
}

// Function to present loader
var startLoading = async (message) => {
  // Create a new Loader
  const loading = document.createElement('ion-loading');

  // Set message
  loading.message = message;

  // Present Loader
  document.body.appendChild(loading);
  await loading.present();

  // return handler
  return loading;
}

// Sync with server on app restart
getDeviceState();