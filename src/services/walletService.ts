import { ethers } from "ethers";
import { INFURA_API_KEY, PRIVATE_KEY, RPC_URL } from "../config/config";

export async function getProvider(): Promise<ethers.JsonRpcProvider> {
  try {
    const provider = new ethers.JsonRpcProvider(`${RPC_URL}${INFURA_API_KEY}`);

    return provider;
  } catch (error) {
    throw new Error("Failed to connect to the provider");
  }
}

export async function getSignerFromPK(
  provider: ethers.Provider,
  privateKey: string
): Promise<ethers.Wallet> {
  if (!provider) {
    throw new Error("Provider is not initialized");
  }
  const acc1 = new ethers.Wallet(privateKey, provider);

  if (!acc1.address) {
    throw new Error("Failed to initialize signer with given private key");
  }

  console.log("account 1 address: ", acc1.address);
  return acc1;
}
