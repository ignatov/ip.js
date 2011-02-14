/**
 * User: ignatov
 * Date: Feb 13, 2011
 */

function reset() {
  Pixastic.revert(document.getElementById("image"));
  $("#log").empty();
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

$('#filters a').click(function(e) {
  e.preventDefault();
  var action = jQuery(this).attr('id');
  var label = jQuery(this).text();
  var image = $("#image");

  setTimeout(function() {
    var startTime = new Date();
    switch (action) {
      case 'invert' :
        image.pixastic("invert");
        break;
      case 'dilation' :
        image.pixastic("dilation");
        break;
      case 'erosion' :
        image.pixastic("erosion");
        break;
    }
    cleanResult();
    var endTime = new Date();
    var duration = endTime.getTime() - startTime.getTime();
    jQuery('#log').prepend(label + " - " + duration + "ms<br />");
  }, 10);
});

$(document).ready(function () {
  BrowserDetect.init();
  if (BrowserDetect.browser === "Firefox")
    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
});