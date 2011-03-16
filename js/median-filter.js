/**
 * User: ignatov
 * Date: Mar 16, 2011
 */

Pixastic.Actions.medianFilter = {
  process : function(params) {
    if (Pixastic.Client.hasCanvasImageData()) {
      var data = Pixastic.prepareData(params);
      var dataCopy = Pixastic.prepareData(params, true);
      var rectangle = params.options.rect;

      var offset;
      if (typeof params.options.offset != "undefined")
        offset = params.options.offset;
      else
        offset = 3;

      for (var u = offset; u < rectangle.height - offset; u++) {
        for (var v = offset; v < rectangle.width - offset; v++) {
          var sumR = 0;
          var sumG = 0;
          var sumB = 0;

          var r = [], g = [], b = [];

          for (var i = -offset; i <= offset; i ++) {
            for (var j = -offset; j <= offset; j ++) {
              r[i + j + 2 * offset] = dataCopy[((u + i) * rectangle.width + (v + j)) * 4];
              g[i + j + 2 * offset] = dataCopy[((u + i) * rectangle.width + (v + j)) * 4 + 1];
              b[i + j + 2 * offset] = dataCopy[((u + i) * rectangle.width + (v + j)) * 4 + 2];
            }
          }

          data[(u * rectangle.width + v) * 4] = r.median();
          data[(u * rectangle.width + v) * 4 + 1] = g.median();
          data[(u * rectangle.width + v) * 4 + 2] = b.median();
        }
      }
    }

    return true;
  },
  checkSupport: function() {
    return (Pixastic.Client.hasCanvasImageData());
  }
};