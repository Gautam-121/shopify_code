import React, { useEffect, useState } from 'react'
import styles from './SettingsPage.module.css'
import { Page, Text } from '@shopify/polaris'
import { Button } from '@mui/material'
import { serverKeyAtom } from '../recoilStore/store';
import {useRecoilState} from 'recoil'
import { useNavigate } from 'raviger';
import useFetch from '../hooks/useFetch';

export default function SettingsPage() {
    const navigate = useNavigate()
    const [isEditVisible, setIsEditVisible] = useState(true);
    const [isTextareaEnabled, setIsTextareaEnabled] = useState(false);
    const [serverKey,setServerKey] = useRecoilState(serverKeyAtom)
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)
    const [input, setInput] = useState(serverKey)

    const postOptions = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ serverKey: serverKey }),
      };
      const useDataFetcher = (initialState, url, options) => {
        const [data, setData] = useState(initialState);
        const fetch = useFetch();
      
        const fetchData = async () => {
          setData("loading...");
          const result = await (await fetch(url, options)).json();
          console.log(result)
        };
        return [data, fetchData];
      };
    
        const [serverKeyPost, fetchServerKeyPost] = useDataFetcher(
          "",
          "/api/updateServerKey",
          postOptions
        );

    const handleEdit = ()=>{
        setIsEditVisible(false)
        setIsTextareaEnabled(true)
    }
    const handleSave = ()=>{
        setIsEditVisible(true)
        setIsTextareaEnabled(false)
        setServerKey(input)
        fetchServerKeyPost()
    }

useEffect(()=>{
    if(input.length===152){
        setIsSaveDisabled(false)
     }
     else{
        setIsSaveDisabled(true)

     }
},[input])
  return (
    <div>
        <Page 
        backAction={{content:'back', onAction:()=>navigate("/createnotification")}}
        title='Settings'
        >
            <div className={styles.container}>
               <div  className={styles.heading}>
               <Text as='h1' variant='headingXl'>Firebase Server Key</Text>
               <Text variant="headingMd" as="h6">Update your Firebase Service Key</Text>
               </div>
               <div className={styles.body}>
               <textarea className={styles.serviceKeyField} 
                rows={5}
                maxLength={152}
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                disabled={!isTextareaEnabled}/>
              {isSaveDisabled && <span className={styles.errorMessage}>Please enter a valid Server Key</span>}
                {isEditVisible? 
                <Button id={styles.editBtn} variant='contained' onClick={handleEdit}>Edit</Button>:
                 <Button id={styles.saveBtn} disabled={isSaveDisabled} variant='contained' onClick={handleSave}>Save</Button>
                }
               </div>
            </div>
        </Page>
    </div>
  )
}
