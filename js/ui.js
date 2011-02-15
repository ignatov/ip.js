/**
 * User: ignatov
 * Date: Feb 13, 2011
 */

var aryHistory = [];

function addHistory(imagedata, label, duration) {
  aryHistory.push({data: imagedata, label: label, duration: duration});
  jQuery('#history ul').empty();
  for (i = aryHistory.length - 1; i >= 0; i--) {
    jQuery('#history ul').append(
            '<li><a href="#" class="history" rel="' + i + '">' + aryHistory[i].label + ' (' + aryHistory[i].duration + ' ms)' + '</a></li>'
            );
  }
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

function getCurrentImageData() {
  var canvas = document.getElementById("image");
  var context = canvas.getContext("2d");
  return context.getImageData(0, 0, canvas.width, canvas.height);
}

function handleFileSelect(evt) {
  var files = evt.target.files;

  for (var i = 0, f; f = files[i]; i++) {

    if (!f.type.match("image.*")) {
      continue;
    }

    var reader = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        var can = document.getElementById("image");
        var ctx = can.getContext("2d");

        var img = new Image();
        img.src = e.target.result;
        img.name = theFile.name;

        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var data = ctx.getImageData(0, 0, can.width, can.height);
        addHistory(data, "Load " + img.name, 0);
      };
    })(f);

    reader.readAsDataURL(f);
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
      case 'invertion' :
        image.pixastic("invert");
        break;
      case 'dilation' :
        image.pixastic("dilation");
        break;
      case 'erosion' :
        image.pixastic("erosion");
        break;
    }
    var endTime = new Date();
    cleanResult();
    var duration = endTime.getTime() - startTime.getTime();
    addHistory(getCurrentImageData(), label, duration);
  }, 10);
});

jQuery('#history a').live('click', function(e) {
  e.preventDefault();
  var rel = jQuery(this).attr('rel');
  var currentImageData = aryHistory[rel].data;
  var canvas = document.getElementById("image");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, jQuery('#image').attr('width'), jQuery('#image').attr('height'));
  context.putImageData(currentImageData, 0, 0);
});

$("#convert-to-png").click(function(e) {
  e.preventDefault();
  convertToPNG();
});

document.getElementById('file-loader').addEventListener('change', handleFileSelect, false);

$(document).ready(function () {
  BrowserDetect.init();
  if (BrowserDetect.browser === "Firefox")
    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
});