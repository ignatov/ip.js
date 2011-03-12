/**
 * User: ignatov
 * Date: 12.03.11
 */

Pixastic.Actions.whiteNoise = {
  process: function(params) {
    var probability = 0;
    var amount = 0;
    var mono = false;

    if (typeof params.options.probability != "undefined")
      probability = parseFloat(params.options.probability) || 0;
    if (typeof params.options.amount != "undefined")
      amount = parseFloat(params.options.amount) || 0;
    if (typeof params.options.mono != "undefined")
      mono = !!(params.options.mono && params.options.mono != "false");

    amount = Math.max(0, Math.min(255, amount));
    probability = Math.max(0, Math.min(1, probability));

    var noise2 = amount / 2;

    if (Pixastic.Client.hasCanvasImageData()) {
      var data = Pixastic.prepareData(params);
      var rectangle = params.options.rect;
      var w = rectangle.width;
      var h = rectangle.height;
      var w4 = w * 4;
      var random = Math.random;
      var floor = Math.floor;
      var r, g, b;
      var amountOfPoints = floor(probability * random() * w * h);

      for (var i = 0; i < amountOfPoints; i++) {
        var x = floor(random() * w + 1);
        var y = floor(random() * h + 1);

        var offset = (y - 1) * w4 + (x - 1) * 4;

        if (mono) {
          var pixelNoise = floor(random() * amount - noise2);
          r = data[offset] + pixelNoise;
          g = data[offset + 1] + pixelNoise;
          b = data[offset + 2] + pixelNoise;
        } else {
          r = data[offset] + floor(random() * amount - noise2);
          g = data[offset + 1] + floor(random() * amount - noise2);
          b = data[offset + 2] + floor(random() * amount - noise2);
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