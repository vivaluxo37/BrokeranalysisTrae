import { isServer } from '../../util/isServer';

/**
 * You won't see these events in the network tab
 * To test event sending enable HotJar debug logs in the browser console by adding the following URL param: https://www.example.com/?hjDebug=1
 * To switch of the log you have to set the url param to 0 like https://www.example.com/?hjDebug=0
 * see API reference: https://help.hotjar.com/hc/en-us/articles/4405109971095-Events-API-Reference
 * */
export const sendHotJarEvent = (eventName: string) => {
    if (isServer() || !window.hj) {
        return;
    }

    window.hj('event', eventName);
};
