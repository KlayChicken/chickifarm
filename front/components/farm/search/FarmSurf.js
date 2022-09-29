import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'
import Image from 'next/image'

// store
import { getRndFarmList } from '../../../store/modules/farm/farmSearch';

// css
import classnames from 'classnames';
import FarmCSS from '../../../styles/farm.module.css';
import MyInfoCSS from '../../../styles/myinfo.module.css';

function FarmSurf() {
    const dispatch = useDispatch();
    const { rndArray } = useSelector((state) => state.farmSearch)

    useEffect(() => {
        dispatch(getRndFarmList())
    }, [])

    return (
        <div className={FarmCSS.farmFindPreviewBox}>
            <span className={FarmCSS.farmFindPreviewHeader}>
                농장 파도타기
            </span>
            <div className={FarmCSS.farmFindPreviewImageBox}>
                {
                    rndArray.map((a, index) => {
                        return (
                            <Link href={`/farm/${a.address}`} key={index}>
                                <a>
                                    <div key={index} className="NFTBox neonShine">
                                        <div className="NFTImageBox">
                                            <Image width={256} height={256} priority={true} className="image100" src={"https://api.klaychicken.com/v2small/" + a.repChickiz + ".png"} alt="" />
                                        </div>
                                        <span className="NFTName_rnd">
                                            {a.name}
                                        </span>
                                    </div>
                                </a>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FarmSurf;