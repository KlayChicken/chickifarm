import Image from 'next/image';

// css
import classnames from 'classnames';
import MyInfoCSS from '../../styles/myinfo.module.css';

function KIP17({ nft, nftName, url, openDetails }) {
    return (
        <>
            {
                nft?.map(function (a, index) {
                    return (
                        <div key={index} className="NFTBox neonShine" onClick={() => openDetails([nftName, a])}>
                            <div className="NFTImageBox">
                                <Image width={256} height={256}
                                    loading="lazy"
                                    placeholder='blur'
                                    blurDataURL={`/image/otherProject/Chickiz.png`}
                                    className="image100" src={url + a + ".png"} alt="" />
                            </div>
                            <span className="NFTName">
                                #{a}
                            </span>
                        </div>
                    );
                })
            }
        </>
    )
}

export default KIP17;