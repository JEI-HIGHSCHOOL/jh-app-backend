import nodeCache from "node-cache";

export const noticeCache = new nodeCache({
    stdTTL: 100
})

export const bannerCache = new nodeCache({
    stdTTL: 100
})

export const busCache = new nodeCache()