import {atom} from 'recoil'

export const segmentsAtom = atom({
    key:'segmentsAtom',
    default:[]
})
export const serverKeyAtom = atom({
    key:'serverKeyAtom',
    default:''
})