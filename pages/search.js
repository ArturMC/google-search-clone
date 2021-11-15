// Import Next.js tools
import Head from "next/head";
import { useRouter } from "next/router";

// Import Components
import Header from "../components/Header";
import SearchResults from "../components/SearchResults";
import Response from "../Response";

//Implement Search Page
function Search({ results }) {
  const router = useRouter();

  console.log(results);
  return (
    <div>
      <Head>
        <title>{router.query.term} - Google Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*Header*/}
      <Header />

      {/*Search Results*/}
      <SearchResults results={results} />
    </div>
  );
}

export default Search;

export async function getServerSideProps(context) {
  //Import private keys from config.js
  const API_KEY = process.env.API_KEY;
  const CONTEXT_KEY = process.env.CONTEXT_KEY;

  // Use static data in order to not exceed googles maximum daily API calls
  const useDummyData = false;
  const startIndex = context.query.start || "0";

  // Fetch the search results based off users search query
  const data = useDummyData
    ? Response
    : await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CONTEXT_KEY}&q=${context.query.term}&start=${startIndex}`
      ).then((response) => response.json());

  // Pass results to the client after the server has rendered
  return {
    props: {
      results: data,
    },
  };
}
