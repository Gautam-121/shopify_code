import React, { useEffect, useState } from "react";
import "./CreateNotification.css";
import { Autocomplete, TextField, Button } from "@mui/material";
import { Frame, Page, Text } from "@shopify/polaris";
import "../public/notify.png";
import { useRecoilValue, useRecoilState } from "recoil";
import { segmentsAtom } from "../recoilStore/store";
import useFetch from "../hooks/useFetch";
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "raviger";

export default function CreateNotification() {
  let newMessage = null
  const navigate = useNavigate()
  const [notificationMessage, setNotificationMessage] = useState({
    title:"",
    message:'',
    segments:[],
  })
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const segment = useRecoilValue(segmentsAtom);
  const [segments, setSegments] = useState([
    "segment1",
    "segment2",
    "segment3",
  ]);
  let segs =[]
  const [selectedSegments, setSelectedSegments] = useState([]);
  const handleSelect = (event, newValue) => {
    setSelectedSegments(newValue);
  };
  
    const getSegment = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    };

  const postOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ notificationMessage: notificationMessage }),
  };
  const useDataFetcher = (initialState, url, options) => {
    const [data, setData] = useState(initialState);
    const fetch = useFetch();

    const fetchData = async () => {
      setData("loading...");
      console.log(notificationMessage)
      const result = await (await fetch(url, options)).json();
      console.log(result);
      let dataFromApi = result.segments;
    segs = dataFromApi.map((ele) => ele.name);
    console.log(segs)
    setSegments(segs)
    };

    return [data, fetchData];
  };

  const [notificationMessagePost, fetchNotificactionMessagePost] =
    useDataFetcher("", "/api/sendNotificatication", postOptions);
    const [responseSegment, fetchSegment] = useDataFetcher(
      "",
      "/api/getSegment",
      getSegment
    );
    const handleSend = ()=>{
      setNotificationMessage({
        title:title,
        body:message,
        segments:selectedSegments,
      })
       newMessage = {
        title: title,
       body: message,
       segments: selectedSegments,
      }  
      console.log("new message",newMessage)
    setNotificationMessage(newMessage)
    // fetchNotificactionMessagePost()
    }
    useEffect(()=>{
      fetchSegment();
    },[])
    useEffect(() => {
     
      if (notificationMessage.title && notificationMessage.body && notificationMessage.segments.length > 0) {
        fetchNotificactionMessagePost();
      }
    }, [notificationMessage]);

  return (
    <Page>
      <Frame>
      <Button id='settingsBtn'   variant="contained" onClick={()=>navigate('/settings')} > <SettingsIcon/></Button>
        <div className="container">
          <div className="head">
            <Text variant="headingXl" id="Heading">
              {" "}
              <img className="notifyPic" src="/notify.png"></img>
              Notifications
            </Text>
            <Text variant="headingMd" id="subHeading">
              Enter below details to send personalized notifications.
            </Text>
          </div>
          <div className="body">
            <Autocomplete
              onChange={handleSelect}
              options={segments}
              getOptionLabel={(option) => option}
              multiple
              style={{ width: "80%" }}
              renderInput={(params) => (
                <>
                  <label className="toTag">To</label>
                  <TextField
                    {...params}
                    size="small"
                    id="segmentsField"
                    variant="filled"
                    style={{ backgroundColor: "white" }}
                    placeholder={
                      selectedSegments.length > 0 ? "" : "Select Segments"
                    }
                  />
                </>
              )}
            />

            <div className="titleSection">
              <label htmlFor="">Title</label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Please click here to add a short and descriptive title"
              />
            </div>
            <div className="titleSection">
              <label htmlFor="">Body</label>
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="Please click here to add some body text"
              />
            </div>
            <div className="bottomSection">
              <Button id="sendBtn" variant="contained" onClick={handleSend}>
                Send
              </Button>

            </div>
          </div>
        </div>
      </Frame>
    </Page>
  );
}
