import { parse } from "node-html-parser";

export default async function parseHtml(
  type: string,
  contractAddress: string,
  tokenId: string,
  uri: string
): Promise<string> {
  const htmlResponse = await fetch(
    `${decodeURI(uri)}/${contractAddress.toString().toLowerCase()}/${tokenId}`
  );
  let html = await htmlResponse.text();

  let root = parse(html);

  let tokenData = root
    .getElementsByTagName("script")
    .filter((n) => n.text.startsWith("let tokenData ="))
    .pop()
    ?.childNodes.pop();
  tokenData?.parentNode.set_content(
    tokenData.rawText.replace(
      "let tokenData = {",
      'let tokenData ={"plot":true,'
    )
  );

  let body = root.querySelector("body");
  if (!body) body = root.appendChild(parse(`<body></body>`));

  if (type == "svg") {
    body.insertAdjacentHTML(
      "afterbegin",
      `<script>const observer=new MutationObserver(e=>{e.forEach(e=>{e.addedNodes.forEach(e=>{if("svg"===e.tagName){e.setAttribute("xmlns","http://www.w3.org/2000/svg");let t=e.outerHTML,o=new Blob([t],{type:"plain/text"}),r=document.createElement("a"),d=URL.createObjectURL(o);r.href=d,r.download="${contractAddress}-${tokenId}.svg",document.body.appendChild(r),r.click(),setTimeout(function(){document.body.removeChild(r),window.URL.revokeObjectURL(d)},0)}})})});observer.observe(document.body,{childList:!0,attributes:!1,subtree:!1});</script>`
    );
  } else if (type == "plot") {
    body.insertAdjacentHTML(
      "afterbegin",
      `<div id='app'></div><script type="text/javascript" src="/saxi/plot.js"></script><script>const observer=new MutationObserver(e=>{e.forEach(e=>{e.addedNodes.forEach(e=>{if("svg"===e.tagName){e.setAttribute("xmlns","http://www.w3.org/2000/svg");let t=e.outerHTML,r='<?xml version="1.0" standalone="no"?>\\r\\n',o=new Blob([r,t],{type:"image/svg+xml;charset=utf-8"}),s=new DragEvent("drop",{preventDefault:function(){}});Object.defineProperty(s.constructor.prototype,"dataTransfer",{value:{items:[{getAsFile:function(){return o}}]}}),document.body.dispatchEvent(s),e.remove()}})})});observer.observe(document.body,{childList:!0,attributes:!1,subtree:!1});</script>`
    );
  } else {
    return "error";
  }

  return root.toString();
}
