// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
  const { peerId } = req.query;
  res.send(`
<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
<title></title>
<style>
#video, #app {
        display: none
     }

.video-container {
position: absolute;
z-index: 9;
background-color: #f1f1f1;
border: 1px solid #d3d3d3;
text-align: center;
}

.video-container-header {
padding: 10px;
cursor: move;
z-index: 10;
background-color: #2196F3;
color: #fff;
}

        #menu {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;
            background: #F9F8F2;
            font-family: 'Inter', 'sans-serif';
            font-weight: 700;
        }

        .menu__btn {
            width: auto;
            border: 2px solid #5A4E4E;
            background: #FFF;
            border-radius: 100px;
            padding: 16px 40px;
            color: #5A4E4E;
            cursor: pointer;
            transition: 0.2s ease-in;
        }

        .menu__btn:hover {
            background: #5A4E4E;
            color: #FFF;
        }

        .margin-16 {
            margin-bottom: 16px;
        }

        /* FONT STYLES */

        .heading-2 {
            font-size: 16px;
        }

        /* BLOCK VIDEO */
        #video, #sign {
            display: none
        }

        .video-container {
            position: absolute;
            right: 24px;
            top: 24px;
            z-index: 999;
            background-color: #f1f1f1;
            border: 1px solid #d3d3d3;
            text-align: center;
            border-radius: 20px;
            overflow: hidden;
        }

        .video-container-header {
            cursor: move;
            z-index: 10;
            color: #fff;
            background: none;
        }

        video {
            max-width: 200px;
            display: block;
        }
    </style>

</head>

<body>

<div id="menu">
        <p class="heading-2 margin-16">Click "Connect" to start the meeting</p>
    <button id="connect-button" class="menu__btn" onclick="connect()">Connect</button>
    </div>

<div id="video">
<!-- <div class="video-container" id="video-container-local">
<div class="video-container-header">local</div>
<video id="local-video"></video>
</div> -->
<div class="video-container" id="video-container-remote">
<div class="video-container-header"></div>
<video id="remote-video"></video>
</div>
</div>

<div id='app'></div>
<script type="text/javascript" src="/saxi/plot.js"></script>

<script>

// Make the DIV element draggable:
    // dragElement(document.getElementById("video-container-local"));
     dragElement(document.getElementById("video-container-remote"));

const peer = new Peer({host: "plottables-peerjs-server.herokuapp.com", secure: true});

peer.on("open", function (id) {
        console.log(\`collector peerId: \${id}\`);
});

peer.on("error", (err) => {
         console.log(\`error: \${err}\`);
        });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = "${peerId}";

console.log("outside function: " + id);

async function connect() {
console.log("inside function: " + id);

        const conn = peer.connect(id);

        conn.on("open", function() {
        conn.on("data", function(data) {
        
                console.log(data);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', data);
            xhr.addEventListener('load', function(ev) {
                var xml = ev.target.response;
                var dom = new DOMParser();
                var svg = dom.parseFromString(xml, 'image/svg+xml');
                document.body.appendChild(svg.rootElement);
            });
            xhr.send(null);
        });
      });

        callUser(id);

        hideMenu();
        showVideo();
        showSaxi();
      }

      async function callUser(peerId) {

        // grab the camera and mic
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        // play the camera preview
        // document.getElementById("local-video").srcObject = stream;
        // document.getElementById("local-video").play();

        // make the call
        const call = peer.call(peerId, stream);

        call.on("stream", (stream) => {
        document.getElementById("remote-video").srcObject = stream;
        document.getElementById("remote-video").play();
        });

        call.on("open", (id) => {
        console.log("call open!");
        });

        call.on("data", (stream) => {
        document.querySelector("#remote-video").srcObject = stream;
        });

        call.on("error", (err) => {
        console.log(err);
        });

    }
    


    function hideMenu() {
document.getElementById("menu").style.display = "none";
    }

      function showVideo() {
        document.getElementById("video").style.display = "block";
      }

      function showSaxi() {
        document.getElementById("app").style.display = "block";
      }

     function dragElement(elmnt) {

       var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }

      }


</script>

<script>
const observer = new MutationObserver((mutationList, observer) => {
        mutationList.forEach((mutation) => {
          mutation.addedNodes.forEach(addedNode => {
            if (addedNode.tagName === "svg") {
              addedNode.setAttribute("xmlns", "http://www.w3.org/2000/svg");
              let svgData = addedNode.outerHTML;
              let preface = '<?xml version="1.0" standalone="no"?>\\r\\n';
              let svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
              const event = new DragEvent('drop', { preventDefault: function () {} });
              Object.defineProperty(event.constructor.prototype, 'dataTransfer', { value: { items: [ {getAsFile: function () { return svgBlob; } } ] } });
              document.body.dispatchEvent(event);
              // addedNode.remove();
            }
          });
        });
      });
      observer.observe(document.body, {childList: true, attributes: false, subtree: false});
    </script>

</body>

</html>
    `);
}
