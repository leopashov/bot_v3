import { SWAP_URL, ZEROX_API_KEY, ZEROX_TEST_API_KEY } from "../config/config";
import { QuoteParams, SwapParams, SwapQuote } from "../types/types";
import qs from "qs";

export const fetcher = {
  fetch: async (url: RequestInfo, init?: RequestInit) => {
    return fetch(url, init);
  },
};

async function fetchQuote(urlParams: string, headers: any): Promise<SwapQuote> {
  console.log("fetching quote...");

  try {
    console.log(`${SWAP_URL}${urlParams}`);
    const response = await fetcher.fetch(`${SWAP_URL}${urlParams}`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch quote Status: ${response.status}, StatusText: ${response.statusText}`
      );
    }
    const data = await response.json();

    console.log("Quote successfully fetched");
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getLogQuote(
  quoteParams: QuoteParams
): Promise<SwapQuote> {
  const headers: any = {
    "0x-api-key": ZEROX_TEST_API_KEY,
  };

  return fetchQuote(qs.stringify(quoteParams), headers);
}

export async function getSwapQuote(swapParams: SwapParams): Promise<SwapQuote> {
  const headers: any = {
    "0x-api-key": ZEROX_API_KEY,
  };

  console.log("swap parameters: ", swapParams);

  return fetchQuote(qs.stringify(swapParams), headers);
}
