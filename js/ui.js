/**
 * User: ignatov
 * Date: Feb 13, 2011
 */

var historyArray = [];

function addHistory(imagedata, label, duration) {
  historyArray.push({data: imagedata, label: label, duration: duration});
  jQuery('#history ul').empty();
  for (var i = historyArray.length - 1; i >= 0; i--) {
    jQuery('#history ul').append(
            '<li><a href="#" class="history" rel="' + i + '">' + historyArray[i].label + ' (' + historyArray[i].duration + ' ms)' + '</a></li>'
            );
  }
}

function convertToPNG() {
  var canvas = document.getElementById("canvas");
  var img = canvas.toDataURL("image/png");
  $("#result").html('<img src=' + img + ' /><br />Right click the image and select "save as" in order to save it.');
}

function cleanResult() {
  $("#result").empty();
}

function getCurrentImageData() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  return context.getImageData(0, 0, canvas.width, canvas.height);
}

function getKernelFromTable(selector) {
  var s = selector + ' tr';
  var kernel = [];
  $(s).each(function(i, tr) {
    var row = [];
    $('td', tr).each(function(i, td) {
      row.push(parseInt($(td).html()));
    });
    kernel.push(row);
  });
  return kernel;
}

function handleFileSelect(evt) {
  var files = evt.target.files;

  for (var i = 0, f; f = files[i]; i++) {

    if (!f.type.match(RegExp("image.*"))) {
      continue;
    }

    var reader = new FileReader();

    reader.onloadend = (function(theFile) {
      return function(e) {

        var can = document.getElementById("canvas");
        var ctx = can.getContext("2d");

        var img = new Image();
        img.onload = function() {
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          addHistory(getCurrentImageData(), "Load " + theFile.name, 0);
        };
        img.src = e.target.result;
      };
    })(f);

    reader.readAsDataURL(f);
  }
}

$('#filters a').click(function(e) {
  e.preventDefault();
  var action = jQuery(this).attr('id');
  var label = jQuery(this).text();
  var canvas = $("#canvas");

  setTimeout(function() {
    var startTime = new Date();
    switch (action) {
      case 'inversion' :
        canvas.pixastic("invert");
        break;
      case 'dilation' :
        canvas.pixastic("dilation");
        break;
      case 'erosion' :
        canvas.pixastic("erosion");
        break;
      case 'blur_3x3' :
        canvas.pixastic("linearFilter", {kernel:getKernelFromTable("#blur_3x3_kernel")});
        break;
      case 'blur_3x3_kernel_link':
        $('#blur_3x3_kernel').toggle();
        return;
      case 'gaussian_blur':
        canvas.pixastic("linearFilter", {kernel:getKernelFromTable('#gaussian_blur_kernel')});
        break;
      case 'gaussian_blur_kernel_link':
        $('#gaussian_blur_kernel').toggle();
        return;
      case 'custom_5x5' :
        canvas.pixastic("linearFilter", {kernel:getKernelFromTable("#custom_5x5_kernel")});
        break;
      case 'custom_5x5_kernel_link':
        $('#custom_5x5_kernel').toggle();
        return;
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
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, jQuery('#canvas').attr('width'), jQuery('#canvas').attr('height'));

  var currentImageData = historyArray[rel].data;
  canvas.width = currentImageData.width;
  canvas.height = currentImageData.height;
  context.putImageData(currentImageData, 0, 0);
});

$("#convert_to_png").click(function(e) {
  e.preventDefault();
  convertToPNG();
});

$.uiTableEdit($('#linear_filters table'));

document.getElementById('file_loader').addEventListener('change', handleFileSelect, false);

function createKernelTable(table, array) {
  for (var i = 0; i < array.length; i++) {
    var tr = $("<tr>");
    for (var j = 0; j < array[0].length; j++)
      $("<td>").text(array[i][j]).appendTo(tr);
    tr.appendTo(table);
  }
}

function createKernels() {
  createKernelTable($("#blur_3x3_kernel"), [
    [3, 5, 3],
    [5, 8, 5],
    [3, 5, 3]
  ]);

  createKernelTable($("#gaussian_blur_kernel"), [
    [1, 2, 3, 2, 1],
    [2, 4, 5, 4, 2],
    [3, 5, 6, 5, 3],
    [2, 4, 5, 4, 2],
    [1, 2, 3, 2, 1]
  ]);

  createKernelTable($("#custom_5x5_kernel"), [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ]);
}

$(document).ready(function () {
  createKernels();
  BrowserDetect.init();
  if (BrowserDetect.browser === "Firefox")
    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
});