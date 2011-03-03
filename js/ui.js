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
            '<li><a href="#" class="history" rel="' + i + '">' + historyArray[i].label + '</a></li>'
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

  var imgd = null;
  try {
    try {
      imgd = context.getImageData(0, 0, canvas.width, canvas.height);
    } catch(e) {
      netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
      imgd = context.getImageData(0, 0, canvas.width, canvas.height);
    }
  } catch(e) {
    throw new Error("Unable to access image data: " + e);
  }

  return imgd;
}

function getKernelFromInputTable(selector) {
  var s = selector + ' tr';
  var kernel = [];
  $(s).each(function(i, tr) {
    var row = [];
    $('td label input', tr).each(function(i, td) {
      row.push(parseInt($(td).val() || 0));
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
      case 'add_3x3_filter_dialog':
        return;
      case 'add_5x5_filter_dialog':
        return;
      case 'clear_all':
        deleteCustomFilters();
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

document.getElementById('file_loader').addEventListener('change', handleFileSelect, false);

function createKernelTable(table, array) {
  for (var i = 0; i < array.length; i++) {
    var tr = $("<tr>");
    for (var j = 0; j < array[0].length; j++)
      $("<td>").text(array[i][j]).appendTo(tr);
    tr.appendTo(table);
  }
}

function createInputKernelTable(table, dim) {
  for (var i = 0; i < dim; i++) {
    var tr = $("<tr>");
    for (var j = 0; j < dim; j++)
      $('<td><label><input type="text" size="2" value="1"/></label></td>').appendTo(tr);
    tr.appendTo(table);
  }
}

function deleteCustomFilters() {
  for (var i = 0; i <= localStorage.length - 1; i++)
    $('#li_' + localStorage.key(i)).remove();
  localStorage.clear();
}

function deleteFilter(id) {
  $('#li_' + id).remove();
  localStorage.removeItem(id);
}

function createKernels() {
  saveFilterToLocalStorage(new Filter("Gaussian blur 5x5", [
    [1, 2, 3, 2, 1],
    [2, 4, 5, 4, 2],
    [3, 5, 6, 5, 3],
    [2, 4, 5, 4, 2],
    [1, 2, 3, 2, 1]
  ]));
  saveFilterToLocalStorage(new Filter("Blur 3x3", [
    [3, 5, 3],
    [5, 8, 5],
    [3, 5, 3]
  ]));
}

function saveKernel(nameSelector, kernelTableSelector) {
  var filter = new Filter(
          $(nameSelector).val(),
          getKernelFromInputTable(kernelTableSelector));

  if (saveFilterToLocalStorage(filter))
    addFilterToList($('#linear_filters_list'), filter);
}

function addFilterToList(list, filter) {
  list.append(
          '<li id="li_' + filter.id + '">' +
                  '<a href="#" id="\'' + filter.id + '\'" onclick="applyFilter(\'' + filter.id + '\')">' + filter.name + '</a>' +
                  ' ' +
                  '(<a href="#" id="' + filter.id + '_kernel_link">kernel</a>)' +
                  ' ' +
                  '<a href="#" onclick="deleteFilter(\'' + filter.id + '\')">delete</a>' +
                  '<table id="' + filter.id + '_kernel" class="hidden"></table>' +
                  '</li>'
          );

  createKernelTable($("#" + filter.id + "_kernel"), filter.kernel);

  $("#" + filter.id + "_kernel_link").live('click', function(e) {
    e.preventDefault();
    $("#" + filter.id + "_kernel").toggle();
  });
}

//noinspection JSUnusedGlobalSymbols
function applyFilter(id) {
  var filter = JSON.parse(localStorage.getItem(id));
  var canvas = $("#canvas");
  setTimeout(function() {
    canvas.pixastic("linearFilter", {kernel:filter.kernel});
    cleanResult();
    addHistory(getCurrentImageData(), filter.name, 0);
  }, 10);
}

function displayFiltersFromStorage() {
  for (var i = 0; i <= localStorage.length - 1; i++) {
    var filter = JSON.parse(localStorage.getItem(localStorage.key(i)));
    addFilterToList($('#linear_filters_list'), filter);
  }
}

function addDialogEvent() {
  createInputKernelTable($("#3x3_filter_kernel"), 3);
  createInputKernelTable($("#5x5_filter_kernel"), 5);

  $('#add_3x3_filter_dialog').simpleDialog({
    opacity: 0.3,
    duration: 100,
    title: 'Add 3x3 linear filter'
  });

  $('#add_5x5_filter_dialog').simpleDialog({
    opacity: 0.3,
    duration: 100,
    title: 'Add 5x5 linear filter'
  });
}

$(document).ready(function () {
  createKernels();
  addDialogEvent();
  displayFiltersFromStorage();
});