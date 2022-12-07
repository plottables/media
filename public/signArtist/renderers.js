class Renderer
{
    constructor(w,h)
    {
        this.width  = w;
        this.height = h;
    }
    begin(){}
    reset(){}
    fill(color){}
    stroke(color){}
    push(){}
    pop(){}
    noFill(){}
    noStroke(){}
    strokeWeight(w){}
    background(color){}
    line(x1,y1,x2,y2){}
    lineV(A,B){}
    rect(x,y,w,h){}
    ellipse(x,y,w,h){}
    arc(x, y, w, h, start, stop){}
    translate(x,y){}
    scale(s){}
    save(){}
    beginShape(){}
    endShape(mode){}
    vertex(x,y){}
    beginGroup(id){}
    endGroup(){}
    beginDefineFilter(){}
    endDefineFilter(){}

    line_chalk(x1,y1,x2,y2){}
    lineV_chalk(A,B){}

    resize(w,h){}
    
    getFilenameSave(ext)
    {
        return `${Date.now()}_export.${ext}`;
    }
}

class RendererP5 extends Renderer
{
    constructor(w,h)
    {
        super(w,h);
        this.context = window;
    }

    
    noFill(){this.context.noFill()}
    noStroke(){this.context.noStroke()}
    stroke(color){this.context.stroke(color)}
    strokeWeight(w){this.context.strokeWeight(w);}
    fill(color){this.context.fill(color)}
    push(){this.context.push()}
    pop(){this.context.pop()}

    setContext(context)
    {
      this.context = context;
    }
  
    background(color)
    {
        this.context.background(color);
    }

    line(x1,y1,x2,y2)
    {
        this.context.line(x1,y1,x2,y2);
    }

    lineV(A,B)
    {
        this.context.line(A.x,A.y,B.x,B.y);
    }

    rect(x,y,w,h)
    {
        this.context.rect(x,y,w,h)
    }
    
    ellipse(x,y,w,h)
    {
        this.context.ellipse(x,y,w,h);
    }

    arc(x, y, w, h, start, stop)
    {
        this.context.arc(x, y, w, h, start, stop);
    }

    translate(x,y)
    {
        this.context.translate(x,y);
    }
  
    scale(s)
    {
      this.context.scale(s);  
    }
  

    beginShape()
    {
        this.context.beginShape();
    }
    
    endShape(mode)
    {
        this.context.endShape(mode);
    }

    vertex(x,y)
    {
        this.context.vertex(x,y);
    }

    save()
    {
        save( this.getFilenameSave("png") )
    }
}

class RendererSVG extends Renderer
{
    constructor(w,h)
    {
        super(w,h);

        this.svg    = "";
        this.svgns  = "http://www.w3.org/2000/svg";

        this.fillColor = "#FFFFFF";
        this.strokeColor = "#000000";
        this.strokeW = 1;

        this.elmtSvg    = null;
        this.elmtDraw   = null;

        this.reset();
    }

    setViewBox(w,h)
    {
        this.elmtSvg.setAttribute("viewBox", `0 0 ${w} ${h}`); ; 
    }

    setViewSize(w,h)
    {
        this.elmtSvg.setAttribute("width", w); 
        this.elmtSvg.setAttribute("height", h); 
    }


    resize(w,h)
    {
        this.width  = w;
        this.height = h;
        this.setSize(w,h);
    }

    
    setId(id)
    {
        this.elmtSvg.setAttribute("id", id); 
    }

    begin(id, parent)
    {
        // TODO : target a specific element ? 
        this.elmtSvg = document.createElementNS(this.svgns, "svg");
        this.setId(id);
        if (parent !== undefined)
            document.getElementById(parent).appendChild(this.elmtSvg);
        else
            document.body.appendChild(this.elmtSvg);

//        this.setViewBox(this.width, this.height);

        this.elemtDraws.set("svg", this.elmtSvg);
        this.elmtDraw = this.elmtSvg;

        this.elmtDefs = document.createElementNS(this.svgns, "defs");
        this.elmtSvg.appendChild(this.elmtDefs);

        this.elemtDrawsStack.push( this.elmtSvg );
        

        // TEMP
/*        let elmtFilter = document.createElementNS(this.svgns, "filter")
        elmtFilter.setAttribute("id", "pencil");
        elmtFilter.setAttribute("filterUnits", "userSpaceOnUse");

        let elmtTurbulence = document.createElementNS(this.svgns, "feTurbulence")
        elmtTurbulence.setAttribute("baseFrequency", "0.3");
        elmtTurbulence.setAttribute("numOctaves", "1");
        elmtTurbulence.setAttribute("result", "noise");
//        elmtTurbulence.setAttribute("type", "fractalNoise");
        elmtFilter.appendChild(elmtTurbulence);
        
        let elmtDisplacementMap = document.createElementNS(this.svgns, "feDisplacementMap")
        elmtDisplacementMap.setAttribute("in", "SourceGraphic")
        elmtDisplacementMap.setAttribute("in2", "noise")
        elmtDisplacementMap.setAttribute("scale", 10.0);
        elmtFilter.appendChild(elmtDisplacementMap);

        this.elmtDefs.appendChild(elmtFilter);
*/

    }

    isInGroup()
    {
        return this.elemtDrawsStack.length > 1;   
    }

    beginGroup(id)
    {
        let g;
        if (this.elemtDraws.has(id))
        {
            g = this.elemtDraws.get(id);
        }
        else
        {
            g = document.createElementNS(this.svgns, "g");   
            g.setAttribute("id", id);
            g.setAttribute("stroke", this.strokeColor);
            g.setAttribute("stroke-width", this.strokeW);
            this.elmtDraw.append(g);
            this.elemtDraws.set(id,g);
            this.elmtDraw = g;
            // console.log(`>> creating group ${id}`);
        }

        this.elemtDrawsStack.push(g);
        this.elmtDraw = g;
    }

    endGroup()
    {
        this.elemtDrawsStack.pop();
        if (this.elemtDrawsStack.length>0)
            this.elmtDraw = this.elemtDrawsStack[this.elemtDrawsStack.length-1];
    }
    
    reset()
    {
        this.tx = this.ty = 0;        
        this.elemtDraws = new Map();
        this.elemtDrawsStack = [];

        this.elemtDraws.set("svg", this.elmtSvg);
        this.elmtDraw = this.elmtSvg;
    }


    fill(color)
    {
        this.fillColor = color;
    }

    noFill()
    {
        this.fill("none")
    }

    stroke(color)
    {
        this.strokeColor = color;
    }

    noStroke()
    {
        this.stroke("none");
    }

    strokeWeight(w)
    {
        this.strokeW = w;
    }

    background(color)
    {
        this.removeAllSvgNodes();     
        this.elmtSvg.append(this.elmtDefs);

        let strokeColor_    = this.strokeColor;
        let fillColor_      = this.fillColor;

        this.noStroke();
        this.fill(color);
        this.drawElmt( this.getRect(0,0,this.width,this.height, "background") );

        this.stroke(strokeColor_);
        this.fill(fillColor_);
    }

    line(x1,y1,x2,y2)
    {
        let line = this.getLine(x1,y1,x2,y2);
//        line.setAttribute("filter", "url(#pencil)");
        this.drawElmt( line );
    }

    lineV(A,B)
    {
        this.line(A.x,A.y,B.x,B.y);
    }

    rect(x,y,w,h)
    {
        this.drawElmt( this.getRect(x,y,w,h) );
    }

    ellipse(x,y,w,h)
    {
        this.drawElmt( this.getEllipse(x,y,w,h) );
    }

    arc(x, y, w, h, start, stop)
    {
        this.drawElmt( this.getArc(x, y, w, h, start, stop) );
    }

    translate(x,y)
    {
        this.tx += x;
        this.ty += y;
    }

    beginShape()
    {
        this.shapeVertices = [];
    }
    
    endShape(mode)
    {
        this.drawElmt( this.getPolyline(this.shapeVertices,mode));
    }

    vertex(x,y)
    {
        this.shapeVertices.push( {x:x, y:y} );
    }


    getLine(x1,y1,x2,y2)
    {
        let line = document.createElementNS(this.svgns, "line");   
        line.setAttribute("x1",x1);  
        line.setAttribute("y1",y1);  
        line.setAttribute("x2",x2);  
        line.setAttribute("y2",y2);
        if (this.isInGroup() == false)
        {
            line.setAttribute("stroke", this.strokeColor);
            line.setAttribute("stroke-width", this.strokeW);
        }
      return line;
    }    

    
    getPolyline(vertices, mode)
    {
        let type = "polyline";
        if (mode == CLOSE)
            type = "polygon";

        let polyline = document.createElementNS(this.svgns, type);   
        polyline.setAttribute("stroke", this.strokeColor);
        polyline.setAttribute("stroke-width", this.strokeW);
        polyline.setAttribute("fill", "none");
        let strPoints = ""
        let first = true;
        vertices.forEach( v => {strPoints += `${first ? "" : " "}${v.x},${v.y}`; first=false});
        polyline.setAttribute("points", strPoints);
        return polyline;
    }

    getRect(x,y,w,h,id)
    {
        let rect = document.createElementNS(this.svgns, "rect");   
        rect.setAttribute("x",x);  
        rect.setAttribute("y",y);  
        rect.setAttribute("width",w);  
        rect.setAttribute("height",h);
        if (id !== undefined)
            rect.setAttribute("id",id);
        this.setDrawAttributes(rect);
        return rect;
    }

    getEllipse(x,y,w,h)
    {
        let ellipse = document.createElementNS(this.svgns, "ellipse");   
        ellipse.setAttribute("cx",x);  
        ellipse.setAttribute("cy",y);  
        ellipse.setAttribute("rx",0.5*w);  
        ellipse.setAttribute("ry",0.5*h);
        this.setDrawAttributes(ellipse);
        return ellipse;
    }

    getArc(x, y, w, h, start, stop)
    {
        let arc = f_svg_ellipse_arc([this.tx+x,this.ty+y],[w/2,h/2],[start,stop-start],0);
        this.setDrawAttributes(arc);
        return arc;
    }

    setDrawAttributes(svgElmt)
    {
        svgElmt.setAttribute("fill", this.fillColor);
        svgElmt.setAttribute("stroke", this.strokeColor);
        svgElmt.setAttribute("stroke-width", this.strokeW);
    }


    drawElmt(svgElmt)
    {
        this.elmtDraw.appendChild(svgElmt);
    }

    removeAllSvgNodes() 
    {
        while (this.elmtSvg.firstChild)
            this.elmtSvg.removeChild(this.elmtSvg.firstChild);
    }

    save()
    {
        this.saveSvg( this.elmtSvg, this.getFilenameSave("svg") );
    }

    saveSvg(svgEl, name) 
    {

        svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        var svgData = svgEl.outerHTML;
        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    }

}


/* [
Copyright © 2020 Xah Lee

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

URL: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
Version 2019-06-19

] */

const cos = Math.cos;
const sin = Math.sin;
//const π = Math.PI;

const f_matrix_times = (( [[a,b], [c,d]], [x,y]) => [ a * x + b * y, c * x + d * y]);
const f_rotate_matrix = (x => [[cos(x),-sin(x)], [sin(x), cos(x)]]);
const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);

const f_svg_ellipse_arc = (([cx,cy],[rx,ry], [t1, Δ], φ ) => {
/* [
returns a SVG path element that represent a ellipse.
cx,cy → center of ellipse
rx,ry → major minor radius
t1 → start angle, in radian.
Δ → angle to sweep, in radian. positive.
φ → rotation on the whole, in radian
URL: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
Version 2019-06-19
 ] */
Δ = Δ % (2*Math.PI);
const rotMatrix = f_rotate_matrix (φ);
const [sX, sY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1), ry * sin(t1)] ), [cx,cy] ) );
const [eX, eY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1+Δ), ry * sin(t1+Δ)] ), [cx,cy] ) );
const fA = ( (  Δ > Math.PI ) ? 1 : 0 );
const fS = ( (  Δ > 0 ) ? 1 : 0 );
const path_2wk2r = document.createElementNS("http://www.w3.org/2000/svg", "path");
path_2wk2r.setAttribute("d", "M " + sX + " " + sY + " A " + [ rx , ry , φ / (2*Math.PI) *360, fA, fS, eX, eY ].join(" "));
return path_2wk2r;
});


