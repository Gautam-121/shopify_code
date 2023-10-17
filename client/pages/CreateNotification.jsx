import React, { useEffect, useState, useCallback } from "react";
import "./CreateNotification.css";
import { Autocomplete, TextField, Button } from "@mui/material";
import { Frame, Page, Text, Toast } from "@shopify/polaris";
import "../public/notify.png";
import useFetch from "../hooks/useFetch";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "raviger";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import CloseIcon from "@mui/icons-material/Close";

export default function CreateNotification() {
  const navigate = useNavigate();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [segStyle, setSegStyle] = useState({});
  const [titleStyle, setTitleStyle] = useState({});
  const [messageStyle, setMessageStyle] = useState({});
  const [alertMessage, setAlertMessage] = useState({});
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [segments, setSegments] = useState([]);
  let segs = [];
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState({
    title: "",
    message: "",
    segments: [],
  });


  const handleSelect = (event, newValue) => {
    //Automcomplete function to display selected segments as tags
    setSelectedSegments(newValue);
  };

  //Code to display toast with success message
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="Notification Sent!" onDismiss={toggleActive} />
  ) : null;

  //useDataFetcher hook to make API calls
  const useDataFetcher = (initialState, url, options) => {
    const [data, setData] = useState(initialState);
    const fetch = useFetch();
    const fetchData = async () => {
      setData(['Loading...'])
      const result = await (await fetch(url, options)).json();
      if ("segments" in result) {
        let dataFromApi = result.segments;
        segs = dataFromApi.map((ele) => ele.name);
        setSegments(segs);
      }
      if ("message" in result) {
        setData(result.message);
      }
    };
    return [data, fetchData];
  };

  //Code for getSegments API call
  const getSegment = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  };
//Code for postNotificationMessage API call
  const postOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ notificationMessage: notificationMessage }),
  };

  //response received from the useDataFetcher hook when sendNotification API is called
  const [notificationMessagePost, fetchNotificactionMessagePost] =
    useDataFetcher("", "/api/sendNotificatication", postOptions);

  //response received from the useDataFetcher hook when getSegments API is called
  const [responseSegment, fetchSegment] = useDataFetcher(
    "",
    "/api/getSegment",
    getSegment
  );

  useEffect(() => {
    //useEffect to fetch segments when the pages renders for the first time
    fetchSegment();
  }, []);
  useEffect(() => {
    //useEffect to check the response of the post request and display success toast, empty the input fields
    if (notificationMessagePost === "Notification Send Successfylly"){
      toggleActive();
      setTitle("");
      setMessage("");
      setSelectedSegments([]);
    }
  }, [notificationMessagePost]);
  const handleSend = () => {
    //form validations to make sure that all the details have been entered
    if (selectedSegments.length < 1) {
      setAlertMessage("Please select atleast one segment");
      setIsAlertVisible(true);
      setSegStyle({ border: "1px solid red" });
      return;
    } else if (title.length < 1) {
      setAlertMessage("Please enter a proper title for the notification");
      setIsAlertVisible(true);
      setTitleStyle({ border: "1px solid red" });
      return;
    }
    if (message.length < 1) {
      setAlertMessage("Please enter a proper message for the notification");
      setIsAlertVisible(true);
      setMessageStyle({ border: "1px solid red" });
    } else {
      //Code that would be executed if there are no errors in the input
      setNotificationMessage({
        title: title,
        body: message,
        segments: selectedSegments,
      });
      setSegStyle({});
      setTitleStyle({});
      setMessageStyle({});
    }
  };
  useEffect(() => {
    //useEffect to make POST request only when all the fields are available
    if (
      notificationMessage.title &&
      notificationMessage.body &&
      notificationMessage.segments.length > 0
    ) {
      fetchNotificactionMessagePost();
    }
  }, [notificationMessage]);

  return (
    <Page>
      <Frame>
        <Button
          id="settingsBtn"
          variant="contained"
          onClick={() => navigate("/settings")}
        >
          {" "}
          <SettingsIcon />
        </Button>
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
            {isAlertVisible && (
              <div className="alert">
                <Text id="alertTitle">
                  <strong>
                    <ReportGmailerrorredIcon fontSize="small" />
                    Empty Fields
                  </strong>
                  <CloseIcon
                    onClick={() => setIsAlertVisible(false)}
                    style={{ cursor: "pointer" }}
                    fontSize="small"
                  />
                </Text>
                <Text>{alertMessage} </Text>
              </div>
            )}
            <Autocomplete
            id='auto'
              onChange={handleSelect}
              options={segments}
              getOptionLabel={(option) => option}
              multiple
              value={selectedSegments}
              style={{ width: "90%", marginTop: "-20px", outline:'none' }}
              renderInput={(params) => (
                <>
                  <label className="toTag">To*</label>
                  <TextField
                    {...params}
                    value={""}
                    size="small"
                    id="segmentsField"
                    variant="filled"
                    style={segStyle}
                    placeholder={
                      selectedSegments.length > 0 ? "" : "Select Segments"
                    }
                  />
                </>
              )}
            />

            <div className="titleSection" style={titleStyle}>
              <label htmlFor="">Title*</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Please click here to add a short and descriptive title"
              />
            </div>
            <div className="titleSection" style={messageStyle}>
              <label htmlFor="">Body*</label>
              <textarea
                value={message}
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
        {toastMarkup}
      </Frame>
    </Page>
  );
}
