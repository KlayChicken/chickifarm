import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// data
import chickizMeta from '../../src/data/chickiz/chickizMeta.json'
import metaIndex from '../../src/data/chickiz/metaIndex.json'

const shuffle = (_arr) => {
    for (let i = _arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
    }
}

const initialChickizList = () => {
    const arr = [];
    for (let i = 0; i < 4000; i++) {
        arr.push(i)
    }
    shuffle(arr)
    return arr
}

const initialState = {
    chickizList: initialChickizList(),
    myChickizList: [],
    chickizList_super: [],
    myChickizList_super: [],
    /*
        @format of filter
        [
            { type: 2, trait: [1, 2, 7, 9] },
            { type: 3, trait: [1, 5, 7, 9] },
        ];
    */
    filter: [],
    sortWay: 0,
    filter_myChickiz: false,
    filter_superChickiz: false,
};

// 두 배열 겹친 부분만 뽑기
const interArray = (arr1, arr2) => {
    return arr1.filter(x => arr2.includes(x));
}

// rank 번호 받아서 배열 반환
const findByRank_fromMeta = (_rank) => {
    const _id = chickizMeta.filter(a => a.rank === _rank)[0]?.id;
    return _id
}

const findByFilter_fromMeta = (_pastFilter, _filterAdded, _sortWay) => {
    const past = [..._pastFilter]
    if (_filterAdded.type === '' && _filterAdded.trait === '') {
        // 새로 추가없으면 그냥 필터대로
    } else {
        // 새로 더하는 필터가 이미 필터에 존재하는지 여부 체크
        const _index = past.findIndex(a => a.type === _filterAdded.type);

        if (_index === -1) { // 없으면
            past.push({
                type: _filterAdded.type,
                trait: [_filterAdded.trait]
            })
        } else { // 있으면
            const _traitArray = [...past[_index].trait]
            const _traitIndex = _traitArray.findIndex(a => a === _filterAdded.trait)

            if (_traitIndex === -1) {
                _traitArray.push(_filterAdded.trait)
            } else {
                _traitArray.splice(_traitIndex, 1)
            }

            past.splice(_index, 1, { type: _filterAdded.type, trait: _traitArray })
        }

    }

    // filter 완료

    // chickizList

    const _newChickiz = chickizMeta.filter(a => {
        const boolArray = []
        for (let i = 0; i < past.length; i++) {
            // trait 비어있으면 뛰어넘자
            if (past[i].trait.length === 0) continue
            // cp의 경우는 따로 계산
            if (past[i].type === 0) {
                boolArray.push(past[i].trait.some(b => b === a.cp))
            } else {
                // 나머지 경우는 1을 빼서 한 칸씩 앞으로 땡겨야 함.
                boolArray.push(past[i].trait.some(b => b === a.meta[past[i].type - 1]))
            }
        }

        return (boolArray.findIndex(a => !a) === -1 ? true : false);
    })

    // sortWay

    if (_sortWay === 0) {
        shuffle(_newChickiz)
    } else if (_sortWay === 2) {
        _newChickiz.sort((a, b) => a.rank - b.rank)
    } else if (_sortWay === 3) {
        _newChickiz.sort((a, b) => b.rank - a.rank)
    }

    // chickiz 번호만 뽑기
    const newChickiz = _newChickiz.map(a => a.id)

    return { newChickiz: newChickiz, newFilter: past }
}

const raritySlice = createSlice({
    name: 'rarity',
    initialState,
    reducers: {
        resetRarityList(state, action) {
            state.chickizList = initialChickizList();
            state.myChickizList = action.payload.myList;
            state.chickizList_super = action.payload.superList;
            state.myChickizList_super = interArray(action.payload.myList, action.payload.superList);
            state.filter = [];
            state.sortWay = 0;
        },
        findById(state, action) {
            // 정수, 0~4000 사이
            if (action.payload.id % 1 === 0 && 0 <= action.payload.id && action.payload.id < 4000) {
                state.chickizList = [action.payload.id];

                const myBool = action.payload.myList.includes(action.payload.id);
                const superBool = action.payload.superList.includes(action.payload.id);

                if (myBool) {
                    state.myChickizList = [action.payload.id];
                } else {
                    state.myChickizList = [];
                }
                if (superBool) {
                    state.chickizList_super = [action.payload.id];
                } else {
                    state.chickizList_super = [];
                }
                if (myBool && superBool) {
                    state.myChickizList_super = [action.payload.id];
                } else {
                    state.myChickizList_super = [];
                }
            } else {
                state.chickizList = [];
                state.myChickizList = [];
                state.chickizList_super = [];
                state.myChickizList_super = [];
            }
        },
        findByRank(state, action) {
            const chickizId = findByRank_fromMeta(action.payload.rank);
            if (chickizId !== undefined) {
                state.chickizList = [chickizId]

                const myBool = action.payload.myList.includes(chickizId);
                const superBool = action.payload.superList.includes(chickizId);


                if (myBool) {
                    state.myChickizList = [chickizId];
                } else {
                    state.myChickizList = [];
                }
                if (superBool) {
                    state.chickizList_super = [chickizId];
                } else {
                    state.chickizList_super = [];
                }
                if (myBool && superBool) {
                    state.myChickizList_super = [chickizId];
                } else {
                    state.myChickizList_super = [];
                }
            } else {
                state.chickizList = [];
                state.myChickizList = [];
                state.chickizList_super = [];
                state.myChickizList_super = [];
            }
        },
        findByFilter(state, action) {
            const { type, trait, sortWay, myList, superList } = action.payload;
            const { newChickiz, newFilter } = findByFilter_fromMeta(state.filter, { type: type, trait: trait }, sortWay)
            state.chickizList = newChickiz;
            state.myChickizList = interArray(newChickiz, myList);
            state.chickizList_super = interArray(newChickiz, superList)
            state.myChickizList_super = interArray(interArray(newChickiz, superList), myList)
            state.filter = newFilter;
        },
        changeMyChickizFilter(state, action) {
            state.filter_myChickiz = !state.filter_myChickiz;
        },
        changeSuperChickizFilter(state, action) {
            state.filter_superChickiz = !state.filter_superChickiz;
        }
    },
});

export const { resetRarityList, findById, findByRank, findByFilter, changeMyChickizFilter, changeSuperChickizFilter } = raritySlice.actions;
export default raritySlice.reducer;