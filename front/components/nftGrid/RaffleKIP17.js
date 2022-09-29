import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

// store
import { resetOtherNFT, getOtherNFTList } from '../../store/modules/otherNft';

function RaffleKIP17({ list, nftName, setRaffleNft }) {

    const dispatch = useDispatch();

    const [scrollRef, inView, entry] = useInView();

    const { account } = useSelector((state) => state.myInfo);
    const { otherNFTList_loading } = useSelector((state) => state.otherNft);

    useEffect(() => {
        if (inView && !otherNFTList_loading) {
            dispatch(getOtherNFTList({ account: account, projectName: nftName }));
        }
    }, [inView])


    // image handle
    const handleImgError = (e) => {
        //console.log(e)
    }

    return (
        <>
            {
                list.meta?.map(function (a, index) {
                    return (
                        <div key={index} className="NFTBox_min neonShine" onClick={() => setRaffleNft(list, a, index)}
                            ref={(list.meta?.length - 1 === index && list.meta?.length < list.list?.length)
                                ? scrollRef : null}>
                            <div className="NFTImageBox">
                                {
                                    a.image.startsWith('ipfs')
                                        ?
                                        <Image width={256} height={256}
                                            className="image100" src={a.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                            onError={handleImgError} alt=""
                                            loading="lazy"
                                            placeholder='blur'
                                            blurDataURL={`/image/otherProject/${nftName}.png`} />
                                        :
                                        a.image.endsWith('mp4') || a.image.endsWith('genesis')
                                            ? <video className="image100" autoPlay muted loop><source src={a.image} type='video/mp4' /></video>
                                            : <img className="image100" src={a.image} alt="" />
                                }
                            </div>
                            <span className="NFTName">
                                {a.name}
                            </span>
                        </div>
                    );
                })
            }
        </>
    )
}

export default RaffleKIP17;