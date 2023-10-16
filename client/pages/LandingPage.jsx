import { Button } from "@mui/material";
import { Card, Page, Text, Form} from "@shopify/polaris";
import React, { useState } from "react";
import styles from "./LandingPage.module.css";
import { useNavigate } from "raviger";
// import '../public/userImg.png'
import {useRecoilState} from 'recoil'
import { segmentsAtom } from "../recoilStore/store";
import axios from "axios";
import useFetch from "../hooks/useFetch";

export default function LandingPage() {
  // console.log("segments in props", segments)
  // const [segment, setSegment] = useRecoilState(segmentsAtom)
    const navigate = useNavigate()
  const [serverKey, setServerKey] = useState("");
  const [isServerKeyValid, setIsServerKeyValid] = useState(false);
  const handleInput = (event) => {
    const input = event.target.value;
    setServerKey(input);
    if (input.length === 152) {
      console.log(input, input.length);
      setIsServerKeyValid(true);
    } else {
      setIsServerKeyValid(false);
    }
  };
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
    const [segments, setSegments] = useRecoilState(segmentsAtom);
    const fetch = useFetch();
  
    const fetchData = async () => {
      setData("loading...");
      const result = await (await fetch(url, options)).json();
      console.log(result)
    };
  
    return [data, fetchData, segments];
  };

    const [serverKeyPost, fetchServerKeyPost] = useDataFetcher(
      "",
      "/api/updateServerKey",
      postOptions
    );
  const handleSubmit = () => {
    if (serverKey.length < 152) {
      alert("Invalid Server Key");
    } else {
        // setSegment(segments)
        // console.log(segment)
  // axios.post('https://0c12-106-51-37-219.ngrok-free.app/api/updateServerKey',serverKey)
  // .then((response)=>{
  //   console.log("Request success")
  //   console.log(response.data)
  // })
  // .catch((error)=>{
  //   console.log("request denied")
  //   console.log(error)
  // })
  fetchServerKeyPost()
  navigate('/createnotification')
     }
  };
  
  return (
    <>
      <Page>
        <div className={styles.container}>
          <div className={styles.topHalf}>
            {/* <img
              src="../public/userImg.png"
              alt="userIcon"
              className={styles.userImg}
            /> */}
            <Text id={styles.greeting} as="h1" variant="headingMd">
              Hi, Welcome!
            </Text>
          </div>
          <div className={styles.bottomHalf}>
            <Text id={styles.heading} variant="headingMd">
              Please enter your server key
            </Text>
      
         <input
              onChange={handleInput}
              type="text"
              maxLength="152"
              className={styles.serverKeyInput}
              placeholder=" Enter Sever Key"
              size="small"
            ></input>
            <Button
              disabled={!isServerKeyValid}
              id={styles.submitBtn}
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
    
          </div>
        </div>
      </Page>
    </>
  );
}
