import dynamic from 'next/dynamic'

let klipsdk_next;

if (typeof window !== "undefined") {
    const klip = require('klip-sdk');
    klipsdk_next = klip;
} else {
    //caver = dynamic(() => new Caver_js(window.klaytn), { ssr: false })
}

export default klipsdk_next;