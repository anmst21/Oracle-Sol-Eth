"use client";

import { usePrivy } from "@privy-io/react-auth";

//  signIn: () => void;
//     signOut: () => void;
//     connect: () => Promise<void>;
//     reconnect: () => void;
//     isConnected: boolean;
//     isSuccess: boolean;
//     isPolling: boolean;
//     isError: boolean;
//     error: AuthClientError | undefined;
//     channelToken: string | undefined;
//     url: string | undefined;
//     appClient: AppClient | undefined;
//     data: StatusAPIResponse | undefined;
//     validSignature: boolean;

export default function Page() {
  // const { signIn, url, data, signOut, connect, isConnected, reconnect } =
  //   useSignIn({
  //     onSuccess: ({ fid }) => console.log("Your fid:", fid),
  //   });

  const { linkFarcaster, user, unlinkFarcaster } = usePrivy();

  console.log("isAuthenticated", user);

  // const { message, signature } = useSignInMessage();
  // // useEffect(() => {
  // //   reconnect();
  // // }, []);
  // console.log("isAuthenticated", {
  //   isConnected,
  //   data,
  //   url,
  //   isAuthenticated,
  //   username,
  //   fid,
  // });
  return (
    <div className="feed-page">
      {/* <span>{url}</span>
      <span>{data?.username || "Not signed in"}</span>
      <button onClick={connect}>Connect</button>
      <button
        onClick={() => {
          signIn();
          connect();
        }}
      >
        Sign in
      </button>
      {url && (
        <span>
          Scan this: <QRCode uri={url} />
        </span>
      )} */}
      {user?.farcaster?.fid != null ? (
        <button onClick={() => unlinkFarcaster(user.farcaster!.fid!)}>
          Unlink your Farcaster
        </button>
      ) : (
        <button onClick={linkFarcaster}>Link your Farcaster</button>
      )}
    </div>
  );
}
