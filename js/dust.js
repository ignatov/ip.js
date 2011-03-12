/**
 * User: ignatov
 * Date: 12.03.11
 */

Pixastic.Actions.dust = {
  process: function(params) {
    var max = 255;
    var probability = 0;
    var min = 0;
    var mono = false;

    if (typeof params.options.probability != "undefined")
      probability = parseFloat(params.options.probability) || 0;
    if (typeof params.options.min != "undefined")
      min = parseFloat(params.options.min) || 0;
    if (typeof params.options.mono != "undefined")
      mono = !!(params.options.mono && params.options.mono != "false");

    min = Math.max(0, Math.min(255, min));
    probability = Math.max(0, Math.min(1, probability));

    if (Pixastic.Client.hasCanvasImageData()) {
      var data = Pixastic.prepareData(params);
      var rectangle = params.options.rect;
      var w = rectangle.width;
      var h = rectangle.height;
      var random = Math.random;
      var floor = Math.floor;
      var r, g, b;
      var amountOfPoints = floor(probability * random() * w * h);

      for (var i = 0; i < amountOfPoints; i++) {
        var x = floor(random() * w + 1);
        var y = floor(random() * h + 1);

        var offset = (y - 1) * w * 4 + (x - 1) * 4;

        if (mono) {
          var pixelNoise = floor(random() * max + min);
          r = pixelNoise;
          g = pixelNoise;
          b = pixelNoise;
        } else {
          r = floor(random() * max + min);
          g = floor(random() * max + min);
          b = floor(random() * max + min);
        }

        if (r < 0) r = 0;
        if (g < 0) g = 0;
        if (b < 0) b = 0;
        if (r > 255) r = 255;
        if (g > 255) g = 255;
        if (b > 255) b = 255;

        data[offset] = r;
        data[offset + 1] = g;
        data[offset + 2] = b;
      }
      return true;
    }
  },
  checkSupport: function() {
    return Pixastic.Client.hasCanvasImageData();
  }
};