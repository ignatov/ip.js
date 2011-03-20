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
        offset = 1;

      for (var u = offset; u < rectangle.height - offset; u++) {
        for (var v = offset; v < rectangle.width - offset; v++) {
          var sumR = 0;
          var sumG = 0;
          var sumB = 0;

          var r = [], g = [], b = [];
          var counter = 0;

          for (var i = -offset; i <= offset; i++) {
            for (var j = -offset; j <= offset; j++) {
              r[counter] = dataCopy[((u + i) * rectangle.width + (v + j)) * 4];
              g[counter] = dataCopy[((u + i) * rectangle.width + (v + j)) * 4 + 1];
              b[counter] = dataCopy[((u + i) * rectangle.width + (v + j)) * 4 + 2];
              counter++;
            }
          }

          data[(u * rectangle.width + v) * 4] = Math.floor(r.median());
          data[(u * rectangle.width + v) * 4 + 1] = Math.floor(g.median());
          data[(u * rectangle.width + v) * 4 + 2] = Math.floor(b.median());
        }
      }
    }

    return true;
  },
  checkSupport: function() {
    return (Pixastic.Client.hasCanvasImageData());
  }
};
