var goBack = function() {
    window.history.back();
};

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    navigator.splashscreen.hide()
}