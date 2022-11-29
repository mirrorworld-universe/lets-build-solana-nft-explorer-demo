import { useEffect, useMemo, useState } from "react";
import { useMirrorWorld } from "../hooks/useMirrorWorld";
import {
  Button,
  Container,
  Stack,
  chakra,
  Heading,
  Input,
  HStack,
  Alert,
  AlertIcon,
  Center,
  WrapItem,
  Wrap,
} from "@chakra-ui/react";
import type { SolanaNFTExtended } from "@mirrorworld/web3.js/dist/declarations/src/types/nft";
import { NftCard } from "../components/NftCard";

export default function Home() {
  const { user, mirrorworld, login } = useMirrorWorld();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [mintAddress, setMintAddress] = useState<string>();

  const [nftResults, setNftResults] = useState<SolanaNFTExtended[]>([]);
  const hasNFTResults = useMemo(() => nftResults.length > 0, [nftResults]);
  useEffect(() => {
    console.log("mw", mirrorworld);
  }, []);

  async function searchNFTsInWallet(address: string) {
    const results = await mirrorworld.getNFTsOwnedByAddress(address, {
      limit: 24,
      offset: 0,
    });

    setNftResults(results);

    // const results = await mirrorworld.fetchNFTsByOwnerAddresses({
    //   owners: [address],
    //   limit: 24,
    //   offset: 0,
    // });

    console.log("NFTs in address", results);
  }

  async function fetchNFTsByMintAddresses(address: string) {
    const results = await mirrorworld.fetchNFTsByMintAddresses({
      mintAddresses: [address],
      limit: 20,
      offset: 0,
    });
    console.log("mints", results);
  }

  return (
    <Container pt={"200px"} pb={10} maxW={"920px"} position="relative">
      <Button position={"absolute"} top={8} right={8} onClick={() => login()}>
        Login
      </Button>
      <Stack as="section" spacing={5} alignItems={"center"}>
        <chakra.header textAlign="center">
          <Heading as="h1">NFT Explorererer</Heading>
        </chakra.header>
        <HStack w="full" maxW={["auto", "auto", "xl"]}>
          <Input
            w={"full"}
            placeholder="Owner Address or .sol domain"
            value={walletAddress}
            onChange={(event) => setWalletAddress(event.target.value)}
          />
          <Button onClick={() => searchNFTsInWallet(walletAddress!)}>
            Search
          </Button>
        </HStack>
        {!hasNFTResults ? (
          <Center mt={20}>
            <Alert status="info" maxW={["auto", "auto", "xl"]}>
              <AlertIcon />
              Search NFTs in address to display tokens.
            </Alert>
          </Center>
        ) : (
          <Wrap>
            {nftResults.map((nft, i) => (
              <WrapItem key={i}>
                <NftCard nft={nft} />
              </WrapItem>
            ))}
          </Wrap>
        )}
        {/*<Stack as="main" w="full">*/}
        {/*  <div>*/}
        {/*    <h3>Search NFT by mint address</h3>*/}
        {/*    <input*/}
        {/*      value={mintAddress}*/}
        {/*      onChange={(event) => setMintAddress(event.target.value)}*/}
        {/*    />*/}
        {/*    <Button onClick={() => fetchNFTsByMintAddresses(mintAddress!)}>*/}
        {/*      Search by mint address!!!!*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</Stack>*/}
      </Stack>
    </Container>
  );
}
