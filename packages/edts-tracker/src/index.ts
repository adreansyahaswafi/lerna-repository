import { UAParser } from 'ua-parser-js';
import axios from 'axios'
import { PARAMETERUSAGE, DATATYPE, DOCUMENTPROPS, WINDOWPROPS } from './types'
const UA: any = new UAParser();
const browser: any = UA.getBrowser();
const cpu: any = UA.getCPU();
const device: any = UA.getDevice();
const engine: any = UA.getEngine();
const os: any = UA.getOS();
const ua: any = UA.getUA();
export const userAgentList = {
    browser,
    cpu,
    device,
    engine,
    os,
    ua
}
export const setCookie = (params: {
    keyname: string,
    keyvalue: string,
    minutes: number
}) => {
    let expires: string = ""
    if (params.minutes) {
        let date = new Date();
        date.setTime(date.getTime() + (params.minutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    } else {
        expires = "";
    }
    document.cookie = params.keyname + "=" + params.keyvalue + ";"
        + expires + ";path=/";
}
export const getCookie = (params: { keyname: string }) => {
    let name: string = params.keyname + "=";
    let createArray: Array<string> = document.cookie.split(';');
    for (let index: number = 0; index < createArray.length; index++) {
        let c: string = createArray[index];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
const initializeTrackerWeb = () => {
    const track = (event_name = 'click_link_web', core_data, page_name, url) => {
        const headers: any = { 'Content-Type': 'application/json' }
        const isGetcookie: string = getCookie({ keyname: "session_id" });
        const doc: DOCUMENTPROPS = document;
        const win: WINDOWPROPS = window;
        const isData: DATATYPE = {
            ...userAgentList,
            referrer: document.referrer,
            timestamps: (new Date()).getTime(),
            pathname: win.location.pathname,
            protocol: win.location.protocol.replace(":", ""),
            session_id: isGetcookie,
            utm_raw: win.location.search === "" ? "" : win.location.href,
            link_url: doc.activeElement.href ? doc.activeElement.href : win.location.href
        }
        const str = isNaN(page_name.page_name.slice(-1))
        let data: Array<any> = [{
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
        }]
        if (event_name === "click_link_web") {
            delete data[0].core.page_urlpath
            delete data[0].core.page_urlscheme
            delete data[0].core.source_medium
            data[0].core = {
                ...data[0].core,
                link_label: `landing page ${core_data.link_label}`,
                link_url: isData.link_url
            }
        }
        return axios.post(url, { data }, { headers })
    }
    return { track }
}

const tracker = initializeTrackerWeb();
export const trackcheck = (params: PARAMETERUSAGE) => tracker.track(
    params.types,
    { link_label: params.link_label },
    { page_name: params.pageName },
    params.url
)