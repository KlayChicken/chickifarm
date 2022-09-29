import Image from 'next/image';

// images
import itemNotFound from "../../src/image/utils/itemNotFound.png";
import searchIcon from '../../src/image/utils/find_lightgray.png';

function NoNFT({ url }) {
    return (
        <div className="noNFTBox">
            <div className="noNFT" onClick={() => window.open(`${url}`)}>
                <Image className="image100" src={itemNotFound} alt="" />
                <div className="noNFTDescBox">
                    <div className="noNFTDescIcon">
                        <Image className="image100" src={searchIcon} alt="" />
                    </div>
                    <span className="noNFTDesc">
                        오픈씨에서 구경하기
                    </span>
                </div>
            </div>
        </div>
    )
}

export default NoNFT;