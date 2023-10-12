import { Layout, LegacyCard, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

const useDataFetcher = (initialState, url, options) => {
  const [data, setData] = useState(initialState);

  const fetch = useFetch();
  
  const fetchData = async () => {
    setData("loading...");
    const result = await (await fetch(url, options)).json();
    setData(result.text);
    console.log(result)
  };

  return [data, fetchData];
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

  const [responseSegment , fetchSegment] = useDataFetcher(
    "" , "/api/getSegment?shop=renergii.myshopify.com",
    getSegment
  )
  
  useEffect(() => {
    console.log({ responseSegment });
  }, [responseSegment]);
  const [responseData, fetchContent] = useDataFetcher("", "/api");
  const [responseDataPost, fetchContentPost] = useDataFetcher(
    "",
    "api",
    postOptions
  );

  // const [responseDataGQL, fetchContentGQL] = useDataFetcher("", "api/gql");

  // useEffect(() => {
  //   console.log({ responseDataGQL });
  // }, [responseDataGQL]);

  useEffect(() => {
    // fetchContent();
    fetchContentPost();
    // fetchContentGQL();
    fetchSegment()
  }, []);

  return (
    <>
      <Page
        title="Data Fetching"
      >
        <Layout>
          {/* <DataCard
            method="GET"
            url="/api/apps"
            data={responseData}
            onRefetch={fetchContent}
          /> */}
          {/* <DataCard
            method="POST"
            url="/api/apps"
            data={responseDataPost}
            onRefetch={fetchContentPost}
          /> */}
          {/* <DataCard
            method="GET"
            url="/api/apps/debug/gql"
            data={responseDataGQL}
            onRefetch={fetchContentGQL}
          /> */}
          <DataCard
            method="GET"
            url="/api/apps/getSegment"
            data={responseSegment}
          />
        </Layout>
      </Page>
    </>
  );
};

const DataCard = ({ method, url, data,  }) => (
  <>
    <Layout.Section>
      <LegacyCard
        sectioned
      >
        <p>
          {method} <code>{url}</code>: {data}
        </p>
      </LegacyCard>
    </Layout.Section>
  </>
);

export default GetData;