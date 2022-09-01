import nodeCache from "node-cache";

export const noticeCache = new nodeCache({
    stdTTL: 100
})