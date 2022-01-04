export declare type DOCUMENTPROPS = {
    activeElement: any;
};
export declare type WINDOWPROPS = {
    location: {
        search: string;
        pathname: string;
        protocol: string;
        href: string;
    };
};
export declare type DATATYPE = {
    browser: any;
    cpu: any;
    device: any;
    engine: any;
    os: any;
    ua: any;
    referrer: string;
    timestamps: any;
    pathname: string;
    protocol: string;
    session_id: string;
    utm_raw: string;
    link_url: string;
};
export interface PARAMETERUSAGE {
    types: string;
    link_label: string;
    pageName: string;
    url: string;
}
