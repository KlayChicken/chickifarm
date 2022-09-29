import { NextSeo } from "next-seo";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/router';

// page components
import ChickStoreBig from "../../components/chickStore/ChickStoreBig";
import ChickStoreSmall from "../../components/chickStore/ChickStoreSmall";

function ChickStore() {
    const [selectedItemId, setSelectedItemId] = useState(null);

    return (
        <>
            <NextSeo
                title='ChickiFarm :: 상점'
                description='치키농장의 모든 아이템은 이곳에! 필요한 아이템을 구매해 보세요.'
                openGraph={{
                    type: 'website',
                    url: 'https://chickifarm.com/chickStore',
                    title: '치키농장 :: 상점',
                    description: '치키농장의 모든 아이템은 이곳에! 필요한 아이템을 구매해 보세요.'
                }}
            />
            <div className="mainBoard chickStore_mobile">
                <ChickStoreBig setSelectedItemId={setSelectedItemId} />
                <ChickStoreSmall setSelectedItemId={setSelectedItemId} selectedItemId={selectedItemId} />
            </div>
        </>
    );
}

export default ChickStore;
