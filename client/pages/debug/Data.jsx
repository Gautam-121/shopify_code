import { Layout, LegacyCard, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import LandingPage from "../LandingPage";
import {useRecoilState} from 'recoil'
import { segmentsAtom } from "../../recoilStore/store";

let segs = [];
const useDataFetcher = (initialState, url, options) => {
  const [data, setData] = useState(initialState);
  const [segments, setSegments] = useRecoilState(segmentsAtom);
  const fetch = useFetch();

  const fetchData = async () => {
    setData("loading...");
    const result = await (await fetch(url, options)).json();
    console.log(result.segments);
    setData(result.segments);
    let dataFromApi = result.segments;
    segs = dataFromApi.map((ele) => ele.name);
    setSegments(segs)
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
    "/api/getSegment",
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
  console.log("data 65", segs);

  return (
    <>
      <Page>
        <LandingPage  />
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
