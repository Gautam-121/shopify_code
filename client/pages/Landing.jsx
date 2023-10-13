import { Layout, Page, Card, Form, TextField, Button } from "@shopify/polaris";
import { useNavigate } from "raviger";
import React, { useState, useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate()
  const [serverKey, setServerKey] = useState("");
  const handleChange = (event) => {
    setServerKey(event.target.value);
  };
  const handleSubmit = () => {
    if (serverKey.length < 152) {
      alert("Please enter a valid Server Key");
    } else {
      localStorage.setItem("serviceKey", serverKey);
      navigate('/createnotification')
    }
  };
  useEffect(() => {
    let storedKey = localStorage.getItem("serviceKey");
    if (storedKey) {
      setServerKey(storedKey);
      navigate('/createnotification')
    }
  }, []);
  return (
    <>
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
    </>
  );
}
