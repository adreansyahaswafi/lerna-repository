"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackcheck = exports.getCookie = exports.setCookie = exports.userAgentList = void 0;
const ua_parser_js_1 = require("ua-parser-js");
const axios_1 = require("axios");
const UA = new ua_parser_js_1.UAParser();
const browser = UA.getBrowser();
const cpu = UA.getCPU();
const device = UA.getDevice();
const engine = UA.getEngine();
const os = UA.getOS();
const ua = UA.getUA();
exports.userAgentList = {
    browser,
    cpu,
    device,
    engine,
    os,
    ua
};
const setCookie = (params) => {
    let expires = "";
    if (params.minutes) {
        let date = new Date();
        date.setTime(date.getTime() + (params.minutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    else {
        expires = "";
    }
    document.cookie = params.keyname + "=" + params.keyvalue + ";"
        + expires + ";path=/";
};
exports.setCookie = setCookie;
const getCookie = (params) => {
    let name = params.keyname + "=";
    let createArray = document.cookie.split(';');
    for (let index = 0; index < createArray.length; index++) {
        let c = createArray[index];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
exports.getCookie = getCookie;
const initializeTrackerWeb = () => {
    const track = (event_name = 'click_link_web', core_data, page_name, url, key) => {
        const headers = {
            Authorization: key,
            'Content-Type': 'application/json'
        };
        const isGetcookie = (0, exports.getCookie)({ keyname: "session_id" });
        const doc = document;
        const win = window;
        const isData = Object.assign(Object.assign({}, exports.userAgentList), { referrer: document.referrer, timestamps: (new Date()).getTime(), pathname: win.location.pathname, protocol: win.location.protocol.replace(":", ""), session_id: isGetcookie, utm_raw: win.location.search === "" ? "" : win.location.href, link_url: doc.activeElement.href ? doc.activeElement.href : win.location.href });
        const str = isNaN(page_name.page_name.slice(-1));
        let data = [{
                "core": {
                    page_name: `landing page-${str ? page_name.page_name.toLowerCase() : page_name.page_name.replace(/[a-z](?=\d)|\d(?=[a-z])/gi, '$& ')}`,
                    event_name,
                    "event_timestamp": isData.timestamps,
                    "page_urlpath": isData.pathname,
                    "source_medium": isData.referrer,
                    "page_urlscheme": isData.protocol
                },
                "user": {
                    "session_id": isData.session_id,
                    "user_id": ""
                },
                "application": {
                    "os_name": isData.os.name,
                    "browser_name": `${isData.browser.name} ${isData.browser.major}`,
                    "is_mobile": isData.device.type ? "true" : "false"
                },
                "marketing": {
                    "utm_raw": isData.utm_raw
                }
            }];
        if (event_name === "click_link_web") {
            delete data[0].core.page_urlpath;
            delete data[0].core.page_urlscheme;
            delete data[0].core.source_medium;
            data[0].core = Object.assign(Object.assign({}, data[0].core), { link_label: `landing page ${core_data.link_label}`, link_url: isData.link_url });
        }
        return axios_1.default.post(url, { data }, { headers });
    };
    return { track };
};
const tracker = initializeTrackerWeb();
const trackcheck = (params) => tracker.track(params.types, { link_label: params.link_label }, { page_name: params.pageName }, params.url, params.key);
exports.trackcheck = trackcheck;
