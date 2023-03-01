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
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter()
  /**
   * The useMirrorWorld hook handles user authentication and provides an instance
   * of the `mirrorworld` SDK when it is initialized correctly.
   */
  const { user, mirrorworld, login } = useMirrorWorld();
  const [walletAddress, setWalletAddress] = useState<string>();
  // const [mintAddress, setMintAddress] = useState<string>();
  
  const [searchAddress, setSearchAddress] = useState<string>();

  useEffect(() => {
    if (searchAddress) {
      router.replace({
        query: {
          address: searchAddress
        }
      })
    }
  }, [searchAddress, router])

  useEffect(() => {
    if (router.query.address) {
      setWalletAddress(router.query.address as string)
      searchNFTsInWallet(router.query.address as string)
    }
  }, [router.query])

  const [nftResults, setNftResults] = useState<SolanaNFTExtended[]>([]);
  const hasNFTResults = useMemo(() => nftResults.length > 0, [nftResults]);

  /**
   * Fetch NFTs in a wallet address
   * @param address
   */
  async function searchNFTsInWallet(address: string) {
    const results = await mirrorworld.fetchNFTsByOwnerAddresses({
      owners: [address],
      limit: 30,
      offset: 0,
    });

    setNftResults(results);
    console.log("NFTs in address", results);
  }

  /**
   * Will fetch an NFT by it's mint address. It returns metadata for the corresponding NFT
   * @param address
   */
  async function fetchNFTsByMintAddresses(address: string) {
    const results = await mirrorworld.fetchNFTsByMintAddresses({
      mintAddresses: [address],
      limit: 20,
      offset: 0,
    });
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
          <Button onClick={() => setSearchAddress(walletAddress!)}>
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
          <Wrap spacing={4}>
            {nftResults.map((nft, i) => (
              <WrapItem key={i}>
                <NftCard nft={nft} />
              </WrapItem>
            ))}
          </Wrap>
        )}
      </Stack>
    </Container>
  );
}
