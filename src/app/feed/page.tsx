"use client";

import { fetchFeedEnriched } from "@/actions/fetch-feed-enriched";
import { useFeed } from "@/context/FeedProvider";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";

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
  const {
    loadFeaturedFeed,
    featuredFeed,
    cursor,
    metaByKey,
    isLoadingFeaturedFeed,
    isLoadingMoreFeaturedFeed,
  } = useFeed();

  useEffect(() => {
    if (!featuredFeed) loadFeaturedFeed();
  }, [featuredFeed]);

  console.log({ metaByKey, featuredFeed });

  // const { signIn, url, data, signOut, connect, isConnected, reconnect } =
  //   useSignIn({
  //     onSuccess: ({ fid }) => console.log("Your fid:", fid),
  //   });

  // const { linkFarcaster, user, unlinkFarcaster } = usePrivy();

  // console.log("isAuthenticated", user);

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

  // const feed = await fetchFeedEnriched();
  return (
    <div className="feed-page">
      {/* {user?.farcaster?.fid != null ? (
        <button onClick={() => unlinkFarcaster(user.farcaster!.fid!)}>
          Unlink your Farcaster
        </button>
      ) : (
        <button onClick={linkFarcaster}>Link your Farcaster</button>
      )} */}
    </div>
  );
}
