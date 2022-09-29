import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

// page components
import useInput from '../../hooks/useInput';

// css
import classNames from "classnames";
import StoreCSS from '../../styles/chickStore.module.css'
import RaffleCSS from '../../styles/raffle.module.css'

// Image
import findImage from '../../src/image/utils/find_gray.png';
import chickToken from '../../src/image/chick/chick.png';
import itemNotFound from '../../src/image/utils/itemNotFound.png';
import questionIcon_white from '../../src/image/utils/question_white.png'

// data
import products from '../../src/data/chickStore/products';

// chain
import caver from '../chain/CaverChrome';

function ChickStoreBig({ setSelectedItemId }) {

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filter_type, setFilter_type] = useState(null);
    const [filter_word, onChangeFilter_word] = useInput('');

    useEffect(() => {
        let _result;
        let __result;
        let _products = [...products]

        if (filter_type !== null) {
            _result = _products.filter((x) => x.type === filter_type);
        } else {
            _result = _products
        }

        if (filter_word !== '') {
            __result = _result.filter((x) => x.name.includes(filter_word))
        } else {
            __result = _result;
        }

        setFilteredProducts(__result)
    }, [filter_type, filter_word])

    return (
        <>
            <div className="subBoard_big">
                <div className="pageHeaderBox">
                    <div className="pageTitleBox">
                        <Link href="/">
                            <span className="pageTitle">
                                HOME
                            </span>
                        </Link>
                        <span className="pageTitleArrow">
                            &gt;
                        </span>
                        <span className="pageTitle">
                            상점
                        </span>
                    </div>
                    <div className="pageUtilBox">
                        <div id="balloon_light" balloon="상점 가이드 보기" className="pageUtilIconBox" onClick={() => window.open('https://klayproject.notion.site/92bbab7c392a436092bf5a4a347bfe42')}>
                            <Image className="pageUtilIcon" src={questionIcon_white} alt="" />
                        </div>
                    </div>
                </div>
                <div className="pageContentBox">
                    <div className={StoreCSS.storeBig_Whole}>
                        <div className={StoreCSS.storeBig_Left}>
                            <div className={StoreCSS.storeBig_searchBox}>
                                <div className={StoreCSS.storeBig_searchInput}>
                                    <div className={RaffleCSS.raffleFindIcon}>
                                        <Image className="image100" src={findImage} alt="" />
                                    </div>
                                    <input className={RaffleCSS.raffleFindInput} placeholder="상품 이름 검색"
                                        onChange={onChangeFilter_word}
                                        value={filter_word}>
                                    </input>
                                </div>
                                <button className={classNames(StoreCSS.storeBig_searchButton, 'greenButton')}>검색</button>
                            </div>
                            <div className={StoreCSS.storeBig_listBox}>
                                <div className={StoreCSS.storeBig_listEach} onClick={() => setFilter_type(null)}>
                                    <div className={filter_type === null ? StoreCSS.storeBig_listNemo_selected : StoreCSS.storeBig_listNemo} />
                                    전체 보기
                                </div>
                                <div className={StoreCSS.storeBig_listEach} onClick={() => setFilter_type(0)}>
                                    <div className={filter_type === 0 ? StoreCSS.storeBig_listNemo_selected : StoreCSS.storeBig_listNemo} />
                                    채굴 아이템
                                </div>
                                <div className={StoreCSS.storeBig_listEach} onClick={() => setFilter_type(1)}>
                                    <div className={filter_type === 1 ? StoreCSS.storeBig_listNemo_selected : StoreCSS.storeBig_listNemo} />
                                    장식품
                                </div>
                                <div className={StoreCSS.storeBig_listEach} onClick={() => setFilter_type(2)}>
                                    <div className={filter_type === 2 ? StoreCSS.storeBig_listNemo_selected : StoreCSS.storeBig_listNemo} />
                                    팻말
                                </div>
                                <div className={StoreCSS.storeBig_listEach} onClick={() => setFilter_type(3)}>
                                    <div className={filter_type === 3 ? StoreCSS.storeBig_listNemo_selected : StoreCSS.storeBig_listNemo} />
                                    기타
                                </div>
                            </div>
                        </div>
                        <div className={StoreCSS.storeBig_Right}>
                            {
                                filteredProducts.length < 1
                                    ?
                                    <div className={StoreCSS.storeBig_noItem}>
                                        <div className="noNFTBox">
                                            <div className="noNFT">
                                                <Image className="image100" src={itemNotFound} alt="" />
                                                <div className="noNFTDescBox">
                                                    <span className="noNFTDesc">
                                                        검색 결과가 없습니다.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className={StoreCSS.storeBig_ProductBox}>
                                        {
                                            filteredProducts?.map((x) => {
                                                return (
                                                    <div className={StoreCSS.storeBig_ProductEach} key={x.id} onClick={() => setSelectedItemId(x.id)}>
                                                        <div className={StoreCSS.storeBig_ProductImage}>
                                                            <img className='maxImage100' src={`/image/chickStore/${x.id}.png`} />
                                                        </div>
                                                        <div className={StoreCSS.storeBig_ProductDesc}>
                                                            <span className={StoreCSS.storeBig_ProductName}>
                                                                {x.name}
                                                            </span>
                                                            <div className={StoreCSS.storeBig_ProductPrice}>
                                                                <div className={StoreCSS.storeBig_chick}>
                                                                    <Image className='image100' src={chickToken} />
                                                                </div>
                                                                {caver.utils.convertFromPeb(x.price, 'KLAY')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default ChickStoreBig;