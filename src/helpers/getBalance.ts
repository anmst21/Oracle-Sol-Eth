import { Address, createPublicClient, http } from "viem";
import { erc20Abi } from "viem";
import { chainSwitch, rpcSwitch } from "./rpc-switch";

export async function getTokenBalance(
  tokenAddress: Address,
  userAddress: Address,
  chain: string
) {
  const client = createPublicClient({
    chain: chainSwitch(chain),
    transport: http(rpcSwitch(chain)),
  });

  const balance = await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress],
  });
  return balance;
}

export async function getNativeBalance(
  tokenAddress: Address,
  userAddress: Address,
  chain: string
) {
  const client = createPublicClient({
    chain: chainSwitch(chain),
    transport: http(rpcSwitch(chain)),
  });
  // console.log(tokenAddress);
  const balance = await client.getBalance({ address: userAddress });
  // Format balance by converting from wei using your preferred method
  return balance;
}
