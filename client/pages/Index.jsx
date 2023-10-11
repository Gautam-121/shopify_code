import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { useState, useCallback, useEffect } from "react";
import "./index.css";
import {
  Button,
  Card,
  Layout,
  Page,
  Form,
  Toast,
  Banner,
  Frame,
} from "@shopify/polaris";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";
import useFetch from "../hooks/useFetch";

const HomePage = () => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const [serverKey, setServerKey] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(2);
  const [active, setActive] = useState(false);
  const [bannerTitle, setErrorTitle] = useState("Segment Selection Required!");
  const [bannerMsg, setBannerMsg] = useState(
    "Please select one or more segments from the dropdown menu before clicking the send button. Segments are required to proceed.");
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [segments, setSegments] = useState([
    "segment1",
    "segment2",
    "segment3",
  ]);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [data, setData] = useState([]);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const fetchFunction = useFetch();

  useState(() => {
    setTimeout(() => {
      setIsBannerVisible(false);
    }, 5000);
  }, [isBannerVisible]);

  const fetchData = async () => {
    console.log("Fetch running")
    // Specify the endpoint
    const endpoint = '/api/getAllSegment';
    console.log("endpoint passed")
    // Make the fetch request
    const response = await fetchFunction(endpoint, {
      // Additional options if needed (e.g., method, headers, body)
      method: 'GET'
    });
    console.log('response recieved')
    // Check if the response is successful
    if (response && response.ok) {
      // Parse the JSON response
      const data = await response.json();
      console.log('Data:', data);
    } else {
      // Handle the error
      console.error('Error fetching data');
    }
  };
  
  useEffect(()=>{
    fetchData();
  },[])

  const toastMarkup = active ? (
    <Toast content="Message sent" onDismiss={toggleActive} />
  ) : null;

  const handleChange = (event) => {
    setServerKey(event.target.value);
  };
  const handleSubmit = () => {
    if (serverKey.length < 152) {
      alert("Please enter a valid Server Key");
      setPage(2);
    } else {
      setPage(2);
    }
  };
  const handleSelect = (event, newValue) => {
    setSelectedSegments(newValue);
  };
  const handleSend = async () => {
    if (selectedSegments.length < 1) {
      setErrorTitle("Segment Selection Required");
      setBannerMsg(
        "Please select one or more segments from the dropdown menu before clicking the send button. Segments are required to proceed"
      );
      setIsBannerVisible(true);
    } else if (title.length < 1) {
      setErrorTitle("Title Required");
      setBannerMsg(
        "Please enter a title for your notification before clicking the send button. The title field is mandatory to proceed"
      );
      setIsBannerVisible(true);
    } else if (message.length < 1) {
      setErrorTitle("Message Required");
      setBannerMsg(
        "Please enter a message for your notification before clicking the send button. The message field is mandatory to proceed"
      );
      setIsBannerVisible(true);
    } else {
      toggleActive();
      const filteredData = data
        .filter((item) => selectedSegments.includes(item.name))
        .map(({ name, id }) => ({ name, id }));
      try {
        const notificationMessage = {
          title: title,
          body: message,
          segments: filteredData,
        };
        axios
          .post(
            "https://various-hypnotic-possum.glitch.me/sendNotification",
            notificationMessage
          )
          .then((response) => {
            console.log(
              "Notification sent sucessfully:",
              notificationMessage,
              response.data
            );
            toggleActive();
          })
          .catch((error) => {
            console.error("Error sending notification:", error);
          });
      } catch (error) {
        console.error(
          `Error sending notification to topic "${selectedSegments}":`,
          error
        );
      }
    }
  };
  return (
    <>
      <Page title="Welcome User!">
        <Layout>
          <div style={{ width: "70%" }}>
            <Frame sidebar={true}>
              {page === 1 ? (
                <Card>
                  <h3>Please enter your server key:</h3>
                  <Form onSubmit={handleSubmit}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <TextField
                        label="Service Key"
                        value={serverKey}
                        onChange={() => handleChange(event)}
                        id="serviceKeyField"
                        size="small"
                        variant="filled"
                        multiline
                      />
                      <Button submit variant="default">
                        Submit
                      </Button>
                    </div>
                  </Form>
                </Card>
              ) : (
                <Card>
                  <div className="App">
                    {isBannerVisible && (
                      <Banner
                        title={bannerTitle}
                        onDismiss={() => {
                          setIsBannerVisible(!isBannerVisible);
                        }}
                      >
                        <p>{bannerMsg}</p>
                      </Banner>
                    )}
                    <div className="container">
                      <div className="sectionDiv" style={{ display: "flex" }}>
                        <span className="toTag">To:</span>
                        <Autocomplete
                          onChange={handleSelect}
                          options={segments}
                          getOptionLabel={(option) => option}
                          multiple
                          style={{
                            width: "80%",
                            marginLeft: "2rem",
                            marginTop: "1rem",
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              placeholder={
                                selectedSegments.length > 0
                                  ? ""
                                  : "Select Segments"
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="sectionDiv ">
                        <span className="titleTag">Title:</span>
                        <input
                          placeholder="Add a short and descriptive title"
                          type="text"
                          className="titleField"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div
                        className="sectionDiv"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span className="bodyTag">Body:</span>
                        <textarea
                          rows={9}
                          cols={65}
                          className="bodyTextarea"
                          onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                      </div>
                      <div></div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      paddingTop: "10px",
                    }}
                  >
                    <Button onClick={() => setPage(1)}>Back</Button>
                    <Button
                      id="sendBtn"
                      variant="contained"
                      onClick={handleSend}
                    >
                      Send
                    </Button>
                  </div>
                </Card>
              )}
              {toastMarkup}
            </Frame>
          </div>
        </Layout>
      </Page>
    </>
  );
};

export default HomePage;