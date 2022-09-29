import { NextSeo } from "next-seo";
import { useState, useEffect, useCallback } from "react";

// page components
import PrivateRoute from '../../components/util/PrivateRoute';
import CreateRaffleSmall from "../../components/raffle/createRaffle/CreateRaffleSmall";
import CreateRaffleBig from "../../components/raffle/createRaffle/CreateRaffleBig";

function CreatRaffle() {

    const [raffle_nftAddress, setRaffle_nftAddress] = useState(null);
    const [raffle_nftTokenId, setRaffle_nftTokenId] = useState(null);
    const [raffle_nftCollectionName, setRaffle_nftCollectionName] = useState(null);
    const [raffle_nftMeta, setRaffle_nftMeta] = useState(null);

    const setRaffleNft = useCallback((_address, _tokenId, _collection, _meta) => {
        setRaffle_nftAddress(_address);
        setRaffle_nftTokenId(_tokenId);
        setRaffle_nftCollectionName(_collection);
        setRaffle_nftMeta(_meta);
    }, []);

    return (
        <>
            <NextSeo
                title="ChickiFarm :: 래플 만들기"
                description="내가 가진 NFT로 래플을 직접 만들어 보세요."
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/raffle/createRaffle',
                    title: '치키농장 :: 래플 만들기',
                    description: '내가 가진 NFT로 래플을 직접 만들어 보세요.'
                }}
            />
            <div className="mainBoard raffle_mobile">
                <CreateRaffleBig setRaffleNft={setRaffleNft} />
                <CreateRaffleSmall nftAddress={raffle_nftAddress} nftTokenId={raffle_nftTokenId}
                    nftCollectionName={raffle_nftCollectionName} nftMeta={raffle_nftMeta} />
            </div>
        </>
    );
}

export default PrivateRoute(CreatRaffle);
