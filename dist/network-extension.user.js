// ==UserScript==
// @name         network-extension
// @namespace    https://github.com/lisonge
// @version      1.0.0
// @author       lisonge
// @description  network-extension
// @icon         https://vitejs.dev/logo.svg
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var delay = async (n = 0) => new Promise((res) => {
    setTimeout(res, n);
  });
  var parseHeaders = (rawHeaders = "") => {
    const headers = new Headers();
    const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split("\r").map(function(header) {
      return header.startsWith(`
`) ? header.substring(1) : header;
    }).forEach(function(line) {
      var _a;
      let parts = line.split(":");
      let key = (_a = parts.shift()) == null ? void 0 : _a.trim();
      if (key) {
        let value = parts.join(":").trim();
        headers.append(key, value);
      }
    });
    return headers;
  };
  var fixUrl = (url = "") => {
    try {
      return url === "" && location.href ? location.href : url;
    } catch {
      return url;
    }
  };
  var GM_fetch = async (input, init = {}) => {
    var _a;
    const request = new Request(input, init);
    if ((_a = request.signal) == null ? void 0 : _a.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    const data = await request.text();
    let binary = true;
    const headers = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    new Headers(init.headers).forEach((value, key) => {
      headers[key] = value;
    });
    return new Promise((resolve, reject) => {
      var _a2;
      const handle = _GM_xmlhttpRequest({
        method: request.method.toUpperCase(),
        url: fixUrl(request.url),
        headers,
        data,
        binary,
        responseType: "blob",
        async onload(e) {
          await delay();
          const resp = new Response(e.response ?? e.responseText, {
            status: e.status,
            statusText: e.statusText,
            headers: parseHeaders(e.responseHeaders)
          });
          Object.defineProperty(resp, "url", { value: e.finalUrl });
          resolve(resp);
        },
        async onerror() {
          await delay();
          reject(new TypeError("Network request failed"));
        },
        async ontimeout() {
          await delay();
          reject(new TypeError("Network request failed"));
        },
        async onabort() {
          await delay();
          reject(new DOMException("Aborted", "AbortError"));
        },
        async onreadystatechange(response) {
          var _a3;
          if (response.readyState === 4) {
            (_a3 = request.signal) == null ? void 0 : _a3.removeEventListener("abort", abortXhr);
          }
        }
      });
      function abortXhr() {
        handle.abort();
      }
      (_a2 = request.signal) == null ? void 0 : _a2.addEventListener("abort", abortXhr);
    });
  };
  const GmNetworkExtension = {
    GM_xmlhttpRequest: _GM_xmlhttpRequest,
    GM_fetch
  };
  Object.assign(_unsafeWindow, { GmNetworkExtension });

})();