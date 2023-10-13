import { Frame, Layout, Page, Card, Button } from '@shopify/polaris'
import { Autocomplete, TextField } from '@mui/material';
import React, {useState, useEffect, useCallback} from 'react'
import { navigate, useNavigate } from 'raviger';
export default function Notification({segments}) {
    const navigate = useNavigate()
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [page, setPage] = useState(1);
    const [active, setActive] = useState(false);
    const [bannerTitle, setErrorTitle] = useState("Segment Selection Required!");
    const [bannerMsg, setBannerMsg] = useState(
      "Please select one or more segments from the dropdown menu before clicking the send button. Segments are required to proceed."
    );
    const [isBannerVisible, setIsBannerVisible] = useState(false);
    // const [segments, setSegments] = useState([]);
    console.log("Segments",segments)
    const [selectedSegments, setSelectedSegments] = useState([]);
    const [data, setData] = useState([]);
    const toggleActive = useCallback(() => setActive((active) => !active), []);
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
    <Page 
    title='Create Notification'
    primaryAction={{content:'Settings'}}
    >
        <Layout>
            <Frame>
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
                      padding: "10px",
                    }}
                  >
                    <Button
                      id="sendBtn"
                      variant="contained"
                      onClick={handleSend}
                    >
                      Send
                    </Button>
                  </div>
                </Card>
            </Frame>
        </Layout>
    </Page>
    </>
  )
}
