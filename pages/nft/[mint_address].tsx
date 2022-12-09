import { chakra, Button, Text, Alert } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useMirrorWorld } from "../../hooks/useMirrorWorld";
import type { SolanaNFTExtended } from "@mirrorworld/web3.js/dist/declarations/src/types/nft";

export default function NftPage() {
  const router = useRouter();
  const mintAddress = useMemo(
    () => router.query?.mint_address,
    [router.query]
  ) as string;
  const { user, mirrorworld } = useMirrorWorld();
  const [nftDetails, setNftDetails] = useState<SolanaNFTExtended>();
  const [isInvalidMintAddress, setIsInvalidMintAddress] =
    useState<boolean>(false);

  /**
   * Will fetch an NFT by it's mint address. It returns metadata for the corresponding NFT
   * @param address
   */
  async function fetchNFTByMintAddresses(address: string) {
    try {
      const [nftDetailsResult] = await mirrorworld.fetchNFTsByMintAddresses({
        mintAddresses: [address],
        limit: 20,
        offset: 0,
      });
      console.debug(
        "fetched nft at " + address + ". returned:: " + nftDetailsResult
      );
      if (nftDetailsResult) setNftDetails(nftDetailsResult);
      else {
        setIsInvalidMintAddress(true);
      }
      return nftDetailsResult;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Will automatically fetch NFT Data
   */
  useEffect(() => {
    if (mintAddress) fetchNFTByMintAddresses(mintAddress).then();
  }, [mintAddress]);

  return (
    <chakra.div>
      <chakra.h1>NFT Page</chakra.h1>
      {nftDetails ? (
        <>
          <chakra.pre>{JSON.stringify(nftDetails, null, 2)}</chakra.pre>
        </>
      ) : isInvalidMintAddress ? (
        <Alert>Invalid mint address.</Alert>
      ) : null}
    </chakra.div>
  );
}
