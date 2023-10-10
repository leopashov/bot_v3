import { TransactionReceipt, Wallet, ethers } from "ethers";
import { SwapQuote, Trade } from "../types/types";

export async function signAndSendSwap(
  swapQuote: SwapQuote,
  signer: Wallet
): Promise<ethers.TransactionReceipt | null> {
  // sign and broadcast swap
  try {
    console.log("signing and sending swap");
    const swapTx = await signer.sendTransaction({
      gasLimit: swapQuote.gas,
      gasPrice: swapQuote.gasPrice,
      to: swapQuote.to,
      data: swapQuote.data,
      value: swapQuote.value,
      chainId: swapQuote.chainId,
    });
    const txReceipt = await swapTx.wait();
    return txReceipt;
  } catch (error) {
    console.error("Error in signing and sending swap:", error);
    throw new Error("Failed to sign and send the swap.");
  }
}
