// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import parseHtml from "../../utils/parseHtml";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
  const { url } = req.query;

  res.send(`
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
    <script src="/signArtist/renderers.js"></script>
    <script src="/signArtist/zoomArea.js"></script>
    <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <link href="/signArtist/style.css" rel="stylesheet">
    <title></title>

</head>

<body>
    <div class="main">
        <div class="btn__about">
            <button class="btn btn--secondary js-about-overlay-btn">About</button>
        </div>
        <div class="section__about js-about-overlay">
            <button class="btn__close js-about-overlay-btn-close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6777 2.36396L12.2635 0.949747L7.31372 5.89949L2.36397 0.949747L0.94976 2.36396L5.89951 7.31371L0.94976 12.2635L2.36397 13.6777L7.31372 8.72792L12.2635 13.6777L13.6777 12.2635L8.72793 7.31371L13.6777 2.36396Z" fill="black"/>
                </svg>
            </button>
            <div class="section__about__content">
                <div class="section__about__content__chapter">
                    <h2 class="heading-2 margin-8">Title</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nisl ante, interdum id lorem a, pharetra pharetra tellus. Aenean leo neque, maximus ac posuere vitae, laoreet vel sem. Donec ut quam at elit consectetur tempor. Quisque lacinia consectetur tristique. Pellentesque non sapien tristique, pellentesque enim eget, gravida risus. Quisque non egestas magna, ut blandit nunc. Suspendisse porta cursus purus, elementum gravida dui suscipit sit amet. Suspendisse potenti. Quisque euismod ornare porta. Nullam ut mi ligula. In eget volutpat mauris. Etiam mattis sapien vel tortor varius, sit amet dignissim tortor varius. Curabitur ut fermentum sapien. Etiam efficitur, mi nec commodo rhoncus, velit tellus viverra sem, eget sodales erat lorem vel dui. Praesent viverra blandit massa, in posuere turpis porttitor eu.</p>
                </div>
            </div>
        </div>
        <div id="menu">
            <h2 class="heading-2 margin-16">Share this link to the collector and wait</h2>
            <a id="link">link</a>
        </div>

        <div id="sign">
            <div class="sign__container">
                <script src="/signArtist/sketch.js"></script>
                <div class="menu__settings js-menu-overlay">
                    <button class="btn__close js-menu-overlay-btn-close">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6777 2.36396L12.2635 0.949747L7.31372 5.89949L2.36397 0.949747L0.94976 2.36396L5.89951 7.31371L0.94976 12.2635L2.36397 13.6777L7.31372 8.72792L12.2635 13.6777L13.6777 12.2635L8.72793 7.31371L13.6777 2.36396Z" fill="black"/>
                        </svg>
                    </button>
                    <div class="menu__settings__inner">
                        <div class="menu__settings__item">
                            <label for="sizepaper">Paper size</label>
                            <div class="select-container">
                                <select id="select-format" class="field__item" name="sizepaper">
                                    <option value="A4">A4</option>
                                    <option value="A3">A3</option>
                                </select>
                            </div>
                        </div>
                        <div class="menu__settings__item menu__settings__item--half">
                            <label for="pwidth">Paper width (mm)</label>
                            <input id="input-pwidth" class="field__item" name="pwidth"></input>
                        </div>
                        <div class="menu__settings__item menu__settings__item--half">
                            <label for="pheight">Paper height (mm)</label>
                            <input id="input-pheight" class="field__item" name="pheight"></input>
                        </div>
                        <div class="menu__settings__item">
                            <label for="margins">Margins (mm)</label>
                            <input id="input-margin" class="field__item" name="margins"></input>
                        </div>
                        <div class="menu__settings__item">
                            <label for="penwidth">Pen width (mm)</label>
                            <input id="input-penwidth" class="field__item" name="penwidth"></input>
                        </div>
                    </div>
                </div>
                <div class="sign__right">
                    <div class="sign__right__inner">
                        <div id="gui" class="sign__right__wrapper">
                            <div class="sign__right__top">
                                <button class="btn menu__settings__button js-menu-overlay-btn">Settings</button>
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
                            </div>
                            <div class="sign__right__center">
                                <div class="input__zoom">
                                    <label for="zoom" class="margin-8">Zoom on canvas</label>
                                    <input id="sliderscaleZoomArea" type="range" name="zoom" min="0.1" max="1" value="0.2" step="0.1">
                                </div>
                                <div id="canvas-signature-zoom-container"></div>
                                <div class="sign__right__center__bottom">
                                    <p class="caption">Draw your signature here</p>
                                    <button id="btn-undo" class="btn btn--secondary">Undo</button>
                                </div>

                            </div>
                            <div class="sign__right__bottom">
                                <div class="sign__right__buttons__top">
                                    <button id="btn-reset" class="btn btn--primary btn--full">Reset SVG</button>
                                    <button id="btn-download-svg" class="btn btn--primary btn--full">Download SVG</button>
                                </div>
                                <div class="sign__right__buttons__bottom">
                                    <button id="btn-generate-svg" class="btn btn--primary btn--full">Generate SVG</button>
                                    <button id="send-svg" style="display:none;" onclick="sendSVG()" class="btn btn--primary btn--full">Send SVG</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sign__left">
                    <div id="canvas-svg" class="sign__left__wrapper">
                            <div id="canvas-signature-container" class="sign__left__canvas"></div>
                    </div>
                    <div class="column" style="display:none;" id="svg-signature-container"></div>
                </div>
            </div>
        </div>
    </div>

    <script>

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const svgURL = '${decodeURI(url as string)}';

        console.log(\`svg url is \${svgURL}\`);

        let currConn, currCall;

        // Make the DIV element draggable:
        // dragElement(document.getElementById("video-container-local"));
        dragElement(document.getElementById("video-container-remote"));

        ///This is for the front end interactions////////
        menuOverlay(document.querySelector(".js-menu-overlay"));
        aboutOverlay(document.querySelector(".js-about-overlay"));
        inputRangeStyle();

        const peer = new Peer({host: "plottables-peerjs-server.herokuapp.com", secure: true});

        peer.on("open", function (id) {
            document.getElementById("link").href = \`/api/signCollector?peerId=\${id}\`;
            document.getElementById("link").text = \`/api/signCollector?peerId=\${id}\`;
        });

        peer.on("connection", (conn) => {
            if (confirm(\`Accept connection from \${conn.peer}?\`)) {
                conn.on("open", function() {
                    console.log("todo: setup connection");
                    // setupConnection(conn);
                });
                currConn = conn;
            } else {
                conn.close();
            }
        });

        peer.on("call", (call) => {
            currCall = call;
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    // play the local preview
                    // document.querySelector("#local-video").srcObject = stream;
                    // document.querySelector("#local-video").play();
                    // answer the call
                    call.answer(stream);
                    // when we receive the remote stream, play it
                    call.on("stream", (remoteStream) => {
                        document.getElementById("remote-video").srcObject = remoteStream;
                        document.getElementById("remote-video").play();
                    });
                })
                .catch((err) => {
                    console.log("Failed to get local stream:", err);
                });
            hideMenu();
            showVideo();
            showSign();
        });

        // hideMenu();
        // showVideo();
        // showSign();

        function sendSVG() {

            //get svg element.
            var svg = document.getElementById("svg-signature");

            //get svg source.
            var serializer = new XMLSerializer();
            var source = serializer.serializeToString(svg);

            //add name spaces.
            if(!source.match(/^<svg[^>]+xmlns="http\\:\\/\\/www\\.w3\\.org\\/2000\\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!source.match(/^<svg[^>]+"http\\:\\/\\/www\\.w3\\.org\\/1999\\/xlink"/)){
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            //add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\\r\\n' + source;

            //convert svg source to URI data scheme.
            var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
            
            const file = url;
            const blob = new Blob(event.target.files, { type: file.type });
            currConn.send(url);
        }

        function hideMenu() {
            document.getElementById("menu").style.display = "none";
        }

        function showVideo() {
            document.getElementById("video").style.display = "block";
        }

        function showSign() {
            document.getElementById("sign").style.display = "block";
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


        /// FRONT-END INTERACTIONS ////

        function menuOverlay(el) {
            const menuOverlayBtn = document.querySelector('.js-menu-overlay-btn')
            const menuOverlayBtnClose = document.querySelector('.js-menu-overlay-btn-close')

            menuOverlayBtn.addEventListener("click", ()=> {
                el.classList.add("is-active")
            })

            menuOverlayBtnClose.addEventListener("click", ()=> {
                el.classList.remove("is-active")
            })
        }

        function aboutOverlay(el) {
            const aboutOverlayBtn = document.querySelector('.js-about-overlay-btn')
            const aboutOverlayBtnClose = document.querySelector('.js-about-overlay-btn-close')

            aboutOverlayBtn.addEventListener("click", ()=> {
                el.classList.add("is-active")
            })

            aboutOverlayBtnClose.addEventListener("click", ()=> {
                el.classList.remove("is-active")
            })
        }

        function inputRangeStyle() {
            const rangeInputs = document.querySelectorAll('input[type="range"]')
            const numberInput = document.querySelector('input[type="number"]')

            function handleInputChange(e) {
              let target = e.target
              if (e.target.type !== 'range') {
                target = document.getElementById('range')
              }
              const min = target.min
              const max = target.max
              const val = target.value

              target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
            }

            rangeInputs.forEach(input => {
              input.addEventListener('input', handleInputChange)
            })
        }

    </script>

</body>

</html>
    `);
}
