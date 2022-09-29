import Image from 'next/image';

// css
import classnames from 'classnames';
import MyInfoCSS from '../../styles/myinfo.module.css';

function KIP37({ nft, nftName, url, openDetails }) {
    return (
        <>
            {
                nft?.map(function (a, index) {
                    return (
                        <div key={index} className="NFTBox neonShine" onClick={() => openDetails([nftName, a.tokenId])}>
                            <div className="NFTImageBox">
                                {
                                    nftName !== "sign"
                                        ?
                                        <Image width={512} height={512} priority={true} className="image100" src={url + a.tokenId + ".png"} alt="" />
                                        :
                                        <Image width={300} height={130} priority={true} className="image100" src={url + a.tokenId + ".png"} alt="" />
                                }
                            </div>
                            <span className="NFTName">
                                {a.name}
                            </span>
                            <span className="NFTQuan">
                                X {a.quan}
                            </span>
                        </div>
                    );
                })
            }
        </>
    )
}

export default KIP37;