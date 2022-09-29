// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    const url = req.query.url;

    let res1;
    if (url.startsWith('ipfs')) {
        //res1 = await fetch(`https://ipfs.infura.io:5001/api/v0/cat?arg=${url.substring(7)}`, { method: 'POST' });
        res1 = await fetch(`https://ipfs.io/ipfs/${url.substring(7)}`);
    } else {
        res1 = await fetch(url);
    }

    const res2 = await res1.json()
    res.status(200).json(res2)
}
