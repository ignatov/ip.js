/**
 * User: ignatov
 * Date: Feb 13, 2011
 */
function invert() {
  $("#image").pixastic("invert");
  cleanResult();
}
function dilation() {
  $("#image").pixastic("dilation");
  cleanResult();
}
function erosion() {
  $("#image").pixastic("erosion");
  cleanResult();
}
function reset() {
  Pixastic.revert(document.getElementById("image"));
  cleanResult();
}
function convertToPNG() {
  var canvas = document.getElementById("image");
  var context = canvas.getContext("2d");
  var img = canvas.toDataURL("image/png");
  $("#result").html('<img src=' + img + ' /><br />Right click the image and select "save as" in order to save it.');
}
function cleanResult() {
  $("#result").empty();
}
function readURI(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $(".hidden").hide();
      img.src = e.target.result;
      reset();
      $('.hidden').show();
    };
    reader.readAsDataURL(input.files[0]);
  }
}
$(document).ready(function () {
  BrowserDetect.init();
  if (BrowserDetect.browser === "Firefox")
    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
});