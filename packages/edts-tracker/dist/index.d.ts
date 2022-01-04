import { PARAMETERUSAGE } from './types';
export declare const userAgentList: {
    browser: any;
    cpu: any;
    device: any;
    engine: any;
    os: any;
    ua: any;
};
export declare const setCookie: (params: {
    keyname: string;
    keyvalue: string;
    minutes: number;
}) => void;
export declare const getCookie: (params: {
    keyname: string;
}) => string;
export declare const trackcheck: (params: PARAMETERUSAGE) => Promise<import("axios").AxiosResponse<any, any>>;
