var can = document.getElementById('image');
var ctx = can.getContext('2d');

var img = new Image();
img.onload = function() {
  can.width = img.width;
  can.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);
}