import {
  Layout,
  LegacyCard,
  Page,
} from "@shopify/polaris";
import { navigate } from "raviger";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Notification from "../Notification";

let segs = []
const useDataFetcher = (initialState, url, options) => {
  const [data, setData] = useState(initialState);
  const [segments, setSegments] = useState([])
  const fetch = useFetch();
 
  const fetchData = async () => {
    setData("loading...");
    const result = await (await fetch(url, options)).json();
    setData(result.text);
    console.log(result.segments);
    setSegments(result.segments)
    let dataFromApi = result.segments
    segs=dataFromApi.map((ele)=>ele.name)
  };

  return [data, fetchData, segments];
};

const GetData = () => {
  const postOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ text: "Body of POST request" }),
  };

  const getSegment = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  };

  const [responseSegment, fetchSegment] = useDataFetcher(
    "",
    "/api/getSegment?shop=renergii.myshopify.com",
    getSegment
  );
  const [responseDataPost, fetchContentPost] = useDataFetcher(
    "",
    "api",
    postOptions
  );


  useEffect(() => {
    fetchContentPost();
    fetchSegment();
  }, []);
  console.log("data 65",segs)
 
 
  return (
    <>
      <Page>
        <Layout>
          <Notification segments={segs} />
        </Layout>
      </Page>
    </>
  );
};

const DataCard = ({ method, url, data }) => (
  <>
    <Layout.Section>
      <LegacyCard sectioned>
        <p>
          {method} <code>{url}</code>: {data}
        </p>
      </LegacyCard>
    </Layout.Section>
  </>
);

export default GetData;
