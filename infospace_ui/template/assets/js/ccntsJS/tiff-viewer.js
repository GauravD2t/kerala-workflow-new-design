/*
 Tiff Viewer/Printer utilities
 Requires: UTIF.js (global UTIF)

 Usage examples:
   // Render a TIFF by URL into a container
   TiffViewer.load({ url: '/path/to/file.tif', container: '#tiffContainer' });

   // Print whatever is rendered inside the container
   TiffViewer.print('#tiffContainer');

   // Render from an ArrayBuffer (e.g., after XHR/fetch)
   TiffViewer.renderArrayBuffer({ buffer: arrayBuffer, container: document.getElementById('tiffContainer') });
*/
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  function ensureContainer(elementOrSelector) {
    if (!elementOrSelector) throw new Error('container is required');
    if (typeof elementOrSelector === 'string') {
      var el = document.querySelector(elementOrSelector);
      if (!el) throw new Error('container not found: ' + elementOrSelector);
      return el;
    }
    return elementOrSelector;
  }

  function clearContainer(container) {
    while (container.firstChild) container.removeChild(container.firstChild);
  }

  function renderIfdToCanvas(ifd) {
    // UTIF.toRGBA8 returns a flat RGBA array
    var rgba = UTIF.toRGBA8(ifd);
    var w = ifd.width || ifd.t256 || ifd.ImageWidth;
    var h = ifd.height || ifd.t257 || ifd.ImageLength;
    if (!w || !h) throw new Error('Invalid TIFF: missing width/height');
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(w, h);
    // rgba is Uint8Array length = w*h*4
    if (imageData.data.set) {
      imageData.data.set(rgba);
    } else {
      // older browsers
      for (var i = 0; i < rgba.length; i++) imageData.data[i] = rgba[i];
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  function renderArrayBuffer(opts) {
    if (!window.UTIF) throw new Error('UTIF.js not found. Include UTIF.min.js before this script.');
    var container = ensureContainer(opts.container);
    var buffer = opts.buffer;
    if (!buffer) throw new Error('buffer is required');

    // Decode TIFF
    var ifds = UTIF.decode(buffer);
    if (!ifds || ifds.length === 0) throw new Error('No IFDs found in TIFF');

    clearContainer(container);

    // Some TIFFs need a parent array of all IFDs for decodeImage
    for (var i = 0; i < ifds.length; i++) {
      UTIF.decodeImage(buffer, ifds[i]);
      var canvas = renderIfdToCanvas(ifds[i]);
      canvas.style.maxWidth = '100%';
      canvas.style.height = 'auto';
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto 12px auto';
      canvas.setAttribute('data-page-index', String(i));
      container.appendChild(canvas);
    }

    return { pages: ifds.length };
  }

  function load(opts) {
    if (!opts || !opts.url) throw new Error('url is required');
    var container = ensureContainer(opts.container);
    var url = opts.url;

    // Fetch as ArrayBuffer
    return (opts.fetchImpl || fetch)(url, { credentials: opts.credentials || 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to fetch TIFF: ' + res.status + ' ' + res.statusText);
        return res.arrayBuffer();
      })
      .then(function (ab) { return renderArrayBuffer({ buffer: ab, container: container }); });
  }

  function print(containerOrSelector) {
    var container = ensureContainer(containerOrSelector);
    var canvases = Array.prototype.slice.call(container.querySelectorAll('canvas'));
    if (canvases.length === 0) throw new Error('Nothing to print: no canvases found. Call TiffViewer.load/renderArrayBuffer first.');

    var win = window.open('', '_blank');
    if (!win) throw new Error('Popup blocked: unable to open print window');

    // Build printable HTML with embedded PNGs generated from canvases
    var doc = win.document;
    doc.open();
    doc.write('<!DOCTYPE html><html><head><meta charset="utf-8">');
    doc.write('<title>Print TIFF</title>');
    doc.write('<style>html,body{margin:0;padding:0;} .page{page-break-after:always;display:block;text-align:center;} img{max-width:100%;height:auto;}</style>');
    doc.write('</head><body>');

    canvases.forEach(function (cv, idx) {
      var dataUrl = cv.toDataURL('image/png');
      doc.write('<div class="page"><img alt="page ' + (idx + 1) + '" src="' + dataUrl + '"/></div>');
    });

    doc.write('<script>window.onload=function(){setTimeout(function(){window.focus();window.print();}, 200);};</script>');
    doc.write('</body></html>');
    doc.close();
    // Auto-close after print in some browsers (optional)
    win.addEventListener('afterprint', function(){ try{ win.close(); }catch(e){} });
  }

  window.TiffViewer = {
    load: load,
    renderArrayBuffer: renderArrayBuffer,
    print: print
  };
})();
