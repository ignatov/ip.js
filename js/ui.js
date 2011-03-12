/**
 * User: ignatov
 * Date: Feb 13, 2011
 */

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
      case 'add_3x3_filter_dialog':
        return;
      case 'add_5x5_filter_dialog':
        return;
      case 'clear_all':
        ip.deleteAllFilters();
        return;
    }
    var endTime = new Date();
    ip.cleanResult();
    var duration = endTime.getTime() - startTime.getTime();
    ip.addHistory(ip.getCurrentImageData(), label, duration);
  }, 10);
});

jQuery('#history a').live('click', function(e) {
  e.preventDefault();
  var rel = parseInt(jQuery(this).attr('rel'));
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  var currentImageData = ip.getHistoryEntry(rel).data;
  canvas.width = currentImageData.width;
  canvas.height = currentImageData.height;
  context.putImageData(currentImageData, 0, 0);

  ip.updateHistory(rel);
});

$("#convert_to_png").click(function(e) {
  e.preventDefault();
  ip.convertToPNG();
});

document.getElementById('file_loader').addEventListener('change', ip.handleFileSelect, false);

$(document).ready(function () {
  ip.init();
});