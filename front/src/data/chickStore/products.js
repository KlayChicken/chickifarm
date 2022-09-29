const products = [
    // type 0 - 채굴 아이템, 1 - 장식품 , 2 - 팻말 ,3 - 기타
    {
        id: 0,
        type: 0,
        name: '기름',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 2001,
        price: '150000000000000000000',
        desc: '치키즈를 충전하는 데에 이용되는 기름이다. 충전 효과는 30일 동안 지속된다.'
    },
    {
        id: 1,
        type: 0,
        name: '올리브 오일',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 2002,
        price: '4000000000000000000000',
        desc: '올리브 열매의 기름을 추출해서 만든 최고급 오일이다. 슈퍼치키즈로 변신하는 데에 필요하다.'
    },
    {
        id: 2,
        type: 1,
        name: '황금 치키즈 동상',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 2,
        price: '1000000000000000000000',
        desc: '클레이치킨 1주년을 기념하는 치키즈 황금 동상이다. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 3,
        type: 1,
        name: '잭 오 랜턴',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 1009,
        price: '400000000000000000000',
        desc: '악령으로부터 내 농장을 지켜주는 잭 오 랜턴이다. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 4,
        type: 1,
        name: '허수아비',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 1010,
        price: '500000000000000000000',
        desc: '추수의 계절인 가을에 필요한 허수아비다. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 5,
        type: 2,
        name: '행복한 농장 팻말',
        contract: '0x45712f8889d64284924a11d9c62f030b1c7af8fc',
        contract_type: 'KIP-37',
        tokenId: 5,
        price: '300000000000000000000',
        desc: '매일 행복하진 않지만, 행복한 일은 매일 있어. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 6,
        type: 2,
        name: '조용한 농장 팻말',
        contract: '0x45712f8889d64284924a11d9c62f030b1c7af8fc',
        contract_type: 'KIP-37',
        tokenId: 6,
        price: '300000000000000000000',
        desc: '쉿! 몽환의 농장. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 7,
        type: 2,
        name: '슬픈 농장 팻말',
        contract: '0x45712f8889d64284924a11d9c62f030b1c7af8fc',
        contract_type: 'KIP-37',
        tokenId: 7,
        price: '300000000000000000000',
        desc: '오늘은 좀 울어도 돼. 내일은 내일의 해가 뜰테니깐! 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 8,
        type: 1,
        name: '노란색 유채꽃',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 1001,
        price: '100000000000000000000',
        desc: 'BBQ 황금올리브를 좋아하는 노란 유채꽃이다. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 9,
        type: 1,
        name: '빨간색 장미꽃',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 1002,
        price: '100000000000000000000',
        desc: '교촌 레드 콤보를 좋아하는 빨간 장미꽃이다. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 10,
        type: 1,
        name: '분홍색 국화꽃',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 1003,
        price: '100000000000000000000',
        desc: 'BHC 뿌링클을 좋아하는 분홍색 국화꽃이다. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 11,
        type: 1,
        name: '빨간색 풍선',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 1006,
        price: '75000000000000000000',
        desc: '그 시절 놀이공원의 딸기 슬러시를 연상시키는 빨간 풍선이다. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 12,
        type: 1,
        name: '파란색 풍선',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 1007,
        price: '75000000000000000000',
        desc: '그 시절 놀이공원의 시원한 블루베리 슬러시를 연상시키는 파란 풍선이다. 농장을 꾸미는 데에 사용할 수 있다.'
    },
    {
        id: 13,
        type: 1,
        name: '초록색 풍선',
        contract: '0x4e16e2567dd332d4c44474f8b8d3130b5c311cf7',
        contract_type: 'KIP-37',
        tokenId: 1008,
        price: '75000000000000000000',
        desc: '그 시절 놀이공원의 사과 슬러시를 연상시키는 초록 풍선이다. 농장을 꾸미는 데에 사용할 수 있다.'
    }
]

export default products;