// --------------------------------------
//var svgURL = "https://plottables-mainnet.s3.amazonaws.com/2000182.png";
let svgImg, bSvgLoaded=false;

// --------------------------------------
var bgColor;

// --------------------------------------
const canvasName    = "canvas-signature";
const svgName       = "svg-signature";

// --------------------------------------
var formats = new Map(), formatCurrent;
var margin = 10; // mm
var scaleToPx = 1.5;
var mmToPx = mm => { return scaleToPx*mm };

// --------------------------------------
var wCanvasSignature, hCanvasSignature, scaleZoomAreaDefault = 0.2;
var sketchSignature;

// --------------------------------------
var selectFormat, inputMargin, selectStrokeColor, sliderStrokeWeight, btnAddArea, btnRemoveArea, btnReset, btnGenerateSVG, btnDownloadSVG, sliderScaleZoomArea, btnUndo;

// --------------------------------------
var rendererP5,rendererSVG;
var imgBackground, pg;

// --------------------------------------
var strokes, strokeCurrent;

// --------------------------------------
var zoomAreas = [], zoomAreaCurrent;

// --------------------------------------
function setup()
{
  // Some colors
  bgColor = color(240);

  // define formats
  formats.set("A4", [210,297]);
  formats.set("A3", [297,420]);

  // Create canvas
  createCanvas(400, 400)
    .id(canvasName)
    .parent("canvas-signature-container");

  // Renderers
  createRenderers();

  // Install GUI
  installGUI();
  updateDocumentGUI();

  // default format
  setFormatCurrent("A4");

  // Create canvas zoom
  setupCanvasSignatureZoom();

  // Default zoom areas
  setupZoomAreas();

  // Load image
  loadPlottablesImage();
}


// --------------------------------------
function setupCanvasSignatureZoom()
{
  wCanvasSignature = width;
  hCanvasSignature = 150;

  new p5( function( sketch )
  {
    sketchSignature = sketch;

    sketch.setup = function()
    {
      let c = sketch.createCanvas(wCanvasSignature, hCanvasSignature);
      c.parent("canvas-signature-zoom-container");
      sketch.rendererP5 = new RendererP5(sketch.width,sketch.height);
      sketch.rendererP5.setContext(sketch);
    }

    sketch.draw = function()
    {
      if (zoomAreaCurrent)
      {
        sketch.background(240);
        sketch.push();
        sketch.scale(1.0/zoomAreaCurrent.scale);
        sketch.translate(-zoomAreaCurrent.pos.x,-zoomAreaCurrent.pos.y);
        sketch.image(imgBackground,0,0,width,height);
        sketch.pop();


        drawStrokeCurrent(sketch);
        drawStrokes(sketch.rendererP5);
      }
    }

    sketch.mousePressed = function()
    {
      if (zoomAreaCurrent)
      {
        if (isMouseInside(sketch))
          zoomAreaCurrent.strokeCurrent = [];
      }
    }

    sketch.mouseReleased = function()
    {
      if (zoomAreaCurrent)
      {
        if (zoomAreaCurrent.strokeCurrent)
        {
          zoomAreaCurrent.strokes.push( zoomAreaCurrent.strokeCurrent );
          zoomAreaCurrent.strokeCurrent = undefined;
          updateStrokesGUI();
        }
      }
    }

  });
}

// --------------------------------------
function draw()
{
  background(240);
  renderBackground();
  drawBackground();
  drawZoomAreas();
}

// --------------------------------------
function mouseMoved()
{
  let hasOver = false;
  if (isMouseInside(this))
  {
    for (let i=0; i<zoomAreas.length; i++)
    {
      if (zoomAreas[i].isInside(mouseX,mouseY))
      {
        hasOver = true;
        break;
      }
    }
  }
  cursor(hasOver ? MOVE : ARROW);
}

// --------------------------------------
function mousePressed()
{
  if (isMouseInside(this))
  {
    unselectZoomArea();

    // TODO : handle z-ordering if overlapping areas ?
    for (let i=0; i<zoomAreas.length; i++)
    {
      if (zoomAreas[i].mousePressed())
      {
        selectZoomArea( zoomAreas[i] );
        break;
      }
    }

    updateZoomAreaGUI();
  }

}

// --------------------------------------
function mouseReleased()
{
  if (zoomAreaCurrent)
    zoomAreaCurrent.mouseReleased();
}

// --------------------------------------
function loadPlottablesImage()
{
  svgImg = new Image();
  svgImg.onload = function()
  {
    bSvgLoaded = true;
    // console.log(`svgImg has dims (${svgImg.width},${svgImg.height})`);
  }

  svgImg.src = svgURL;
}

// --------------------------------------
function drawMargin(context)
{
  context.push();
  context.noFill();
  context.stroke(220);
  let mpx = mmToPx(margin);
  context.rect(mpx,mpx,width-2*mpx,height-2*mpx);
  context.pop();
}

// --------------------------------------
function drawStrokeCurrent(sketch)
{
  if (zoomAreaCurrent)
  {
    if (sketch.mouseIsPressed && isMouseInside(sketch) && zoomAreaCurrent.strokeCurrent)
    {
      zoomAreaCurrent.strokeCurrent.push([sketch.mouseX,sketch.mouseY]);
      drawStroke(zoomAreaCurrent.strokeCurrent,sketch.rendererP5);
    }
  }
}

// --------------------------------------
function drawStroke(stroke, renderer)
{
    renderer.noFill();
    renderer.beginShape();
    stroke.forEach ( v => renderer.vertex(v[0],v[1]) );
    renderer.endShape();
}

// --------------------------------------
function drawStrokes(renderer)
{
  if (zoomAreaCurrent)
    zoomAreaCurrent.drawStrokes(renderer);
}

// --------------------------------------
function renderBackground()
{
   imgBackground.background(bgColor);
  if (bSvgLoaded)
  {
    let mpx = mmToPx(margin)
    let w = width-2*mpx;
    let h = height-2*mpx;
    let wImg = w;
    let hImg = svgImg.height / svgImg.width  * wImg;
    let xImg = mpx + 0.5*(w-wImg);
    let yImg = mpx + 0.5*(h-hImg);

    imgBackground.canvas.getContext("2d").drawImage(svgImg,xImg,yImg,wImg,hImg);
    drawMargin(imgBackground);
  }
}

// --------------------------------------
function drawBackground()
{
  image(imgBackground,0,0,width,height);
}


// --------------------------------------
function drawSvgImage()
{
  if (bSvgLoaded)
  {
    let mpx = mmToPx(margin)
    let w = width-2*mpx;
    let h = height-2*mpx;
    let wImg = w;
    let hImg = svgImg.height / svgImg.width  * wImg;
    let xImg = mpx + 0.5*(w-wImg);
    let yImg = mpx + 0.5*(h-hImg);
    _id(canvasName).getContext('2d').drawImage(svgImg,xImg,yImg,wImg,hImg);
  }
}

// --------------------------------------
function drawZoomAreas()
{
  zoomAreas.forEach( za => za.draw(rendererP5) );
}



// --------------------------------------
function unselectZoomArea()
{
  zoomAreas.forEach( za => za.select(false) );
  zoomAreaCurrent = undefined;
}

// --------------------------------------
function selectZoomArea(zoomArea)
{
    zoomArea.select(true);
    zoomAreaCurrent = zoomArea;
    updateStrokesGUI();
    updateZoomAreaGUI();
}

// --------------------------------------
function addZoomArea()
{
    let dim = getZoomAreaDim()

    let newZoomArea =  new ZoomArea(10,10,dim.w,dim.h);
    newZoomArea.setScale(scaleZoomAreaDefault);
    zoomAreas.push(newZoomArea);

    unselectZoomArea();
    selectZoomArea(newZoomArea);
    updateZoomAreaGUI();
}

// --------------------------------------
function removeZoomArea()
{
    if (zoomAreaCurrent)
    {
      zoomAreas.splice(zoomAreas.indexOf(zoomAreaCurrent), 1);
      unselectZoomArea();
      updateZoomAreaGUI();
    }
}

// --------------------------------------
function resetStrokes()
{
  if (zoomAreaCurrent)
  {
    zoomAreaCurrent.resetStrokes();
    updateStrokesGUI();
  }
}



// --------------------------------------
function undoStroke()
{
  if (zoomAreaCurrent)
  {
    if (zoomAreaCurrent.strokes.length>0) zoomAreaCurrent.strokes.splice(-1);
    updateStrokesGUI();
  }
}

// --------------------------------------
function createRenderers()
{
  rendererP5 = new RendererP5(width,height);

  rendererSVG = new RendererSVG(width,height);
  rendererSVG.begin(svgName,"svg-signature-container");
}


// --------------------------------------
function _id(id)
{
  return document.getElementById(id);
}

// --------------------------------------
function installGUI()
{
  selectFormat = _id("select-format");
  selectFormat.addEventListener("change", e => {
    setFormatCurrent(selectFormat.value);
  });

  inputMargin = _id("input-margin");
  inputMargin.addEventListener("change", e=>
  {
    margin = parseInt( inputMargin.value );
  })

  selectStrokeColor = _id("select-stroke-color");
  if (selectStrokeColor)
    selectStrokeColor.addEventListener("change", e =>
  {
    zoomAreas.forEach ( za => { za.strokeColor = selectStrokeColor.value; } )
    sketchSignature.rendererP5.stroke( selectStrokeColor.value );
  });

  btnAddArea    = _id("btn-add-area");
  if (btnAddArea)
    btnAddArea.addEventListener("click", addZoomArea);
  btnRemoveArea = _id("btn-remove-area");
  if (btnRemoveArea)
  {
    btnRemoveArea.disabled = true;
    btnRemoveArea.addEventListener("click", removeZoomArea);
  }

  sliderScaleZoomArea = _id("sliderscaleZoomArea");
  sliderScaleZoomArea.value = scaleZoomAreaDefault;
  sliderScaleZoomArea.addEventListener("change", e=>
  {
    let s = sliderScaleZoomArea.value;
    if (zoomAreaCurrent.scale != s)
    {
      zoomAreaCurrent.resetStrokes();
      zoomAreaCurrent.setScale(s);
      resizeSignatureZoomAreaCurrent(s);
    }
  });

  btnReset = _id("btn-reset");
  btnReset.addEventListener("click", resetStrokes);

  btnUndo = _id("btn-undo");
  btnUndo.disabled = true;
  btnUndo.addEventListener("click", undoStroke);


  btnGenerateSVG  = _id("btn-generate-svg");
  btnGenerateSVG.addEventListener("click", e=>
  {
    generateSVG()
    btnGenerateSVG.style.display = "none";
    _id("send-svg").style.display = "block";
  });

  btnDownloadSVG = _id("btn-download-svg");
  btnDownloadSVG.addEventListener("click", e=>
  {
    generateSVG();
    rendererSVG.save();
  });

}

// --------------------------------------
function generateSVG()
{
    rendererSVG.reset();
    rendererSVG.removeAllSvgNodes();
    rendererSVG.noFill();

    // TODO : would be better to call drawStrokes
    // with proper transformation set for rendererSVG
    zoomAreas.forEach( zoomArea =>
    {
      let s = zoomArea.scale;
      let p = zoomArea.pos;
      zoomArea.strokes.forEach( stroke =>
      {
        rendererSVG.beginShape();
        stroke.forEach ( v => rendererSVG.vertex(p.x+v[0]*s,p.y+v[1]*s) );
        rendererSVG.endShape();
      });
    })


    // FIX : for saxi
    let saxiBounds = document.createElementNS(rendererSVG.svgns, 'path');
    let w = rendererSVG.elmtSvg.getAttribute("width");
    let h = rendererSVG.elmtSvg.getAttribute("height");
    saxiBounds.setAttribute('d', `M 0 0 M ${w} ${h}`);
    rendererSVG.elmtSvg.appendChild(saxiBounds);

}

// --------------------------------------
function updateStrokesGUI()
{
  if (zoomAreaCurrent)
    btnUndo.disabled = zoomAreaCurrent.strokes.length == 0;
}

// --------------------------------------
function updateZoomAreaGUI()
{
  if (zoomAreaCurrent)
    sliderScaleZoomArea.value     = zoomAreaCurrent.scale;
  if (btnRemoveArea)
    btnRemoveArea.disabled          = zoomAreaCurrent ? false : true;
  sliderScaleZoomArea.disabled    = zoomAreaCurrent ? false : true;
}

// --------------------------------------
function updateDocumentGUI()
{
  inputMargin.value = margin;
}

// --------------------------------------
function setFormatCurrent(which)
{
  if (which && which != formatCurrent)
  {
    formatCurrent = which;

    let f = formats.get(which);
    let w = mmToPx(f[0]);
    let h = mmToPx(f[1]);

    // Resize canvas
    resizeCanvas(w,h);

    // Background image
    imgBackground = createGraphics(w,h);

    // Resize svg
    rendererSVG.setViewSize(w,h);
    rendererSVG.setViewBox(w,h);

  }
}

// --------------------------------------
function getZoomAreaDim(s)
{
  let wZoomArea = wCanvasSignature * (s || scaleZoomAreaDefault);
  return {
    w : wZoomArea,
    h : hCanvasSignature/wCanvasSignature * wZoomArea
  }
}

// --------------------------------------
function setupZoomAreas()
{
    let dim = getZoomAreaDim(scaleZoomAreaDefault);

    let wZoomArea = dim.w;
    let hZoomArea = dim.h;
    let newZoomArea =  new ZoomArea(10,10,wZoomArea,hZoomArea);
    zoomAreas.push(newZoomArea);

    zoomAreas.forEach( za => za.setScale(scaleZoomAreaDefault) );

    // Current
    selectZoomArea(newZoomArea);
}

// --------------------------------------
function resizeSignatureZoomAreaCurrent(s)
{
  if (zoomAreaCurrent)
  {
    let wZoomArea = wCanvasSignature * s;
    let hZoomArea = hCanvasSignature/wCanvasSignature * wZoomArea; // ratio-wise

    zoomAreaCurrent.dim.set(wZoomArea,hZoomArea);
  }
}

// --------------------------------------
function isMouseInside(context)
{
  return (context.mouseX>=0 && context.mouseX<=context.width && context.mouseY>=0 && context.mouseY<=context.height)
}


