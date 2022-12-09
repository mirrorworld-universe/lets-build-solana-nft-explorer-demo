import {
  chakra,
  Container,
  Stack,
  Wrap,
  WrapItem,
  Alert,
  Text,
  AlertIcon,
  AlertDescription,
  Heading,
  HStack,
  Code,
  IconButton,
  Grid,
  GridItem,
  useToast,
  Image,
  AspectRatio,
  Link,
  Button,
  CircularProgress,
  CircularProgressLabel,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useMirrorWorld } from "../../hooks/useMirrorWorld";
import type { SolanaNFTExtended } from "@mirrorworld/web3.js/dist/declarations/src/types/nft";
import { AiOutlineCopy } from "react-icons/ai";
import { BsGlobe } from "react-icons/bs";

export interface SolanaNFTExtendedPolyfill extends SolanaNFTExtended {
  auctionHouse: AuctionHouse;
  mintAddress: string;
}
export interface AuctionHouse {
  address: string;
  creator: string;
  treasuryMint: string;
  sellerFeeBasisPoints: number;
}

export default function NftPage() {
  const toast = useToast();
  const router = useRouter();
  const mintAddress = useMemo(
    () => router.query?.mint_address,
    [router.query]
  ) as string;
  const { user, mirrorworld } = useMirrorWorld();
  const [nftDetails, setNftDetails] = useState<SolanaNFTExtendedPolyfill>();
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
      // @ts-expect-error Will fix in next SDK release
      if (nftDetailsResult) setNftDetails(nftDetailsResult);
      else {
        setIsInvalidMintAddress(true);
      }
      return nftDetailsResult;
    } catch (e) {
      console.error(e);
    }
  }

  async function copyToClipboard(content: string) {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(content);
      toast({
        description: "Copied!",
        position: "top",
        status: "success",
        variant: "subtle",
        duration: 1000,
      });
    }
  }

  /**
   * Will automatically fetch NFT Data
   */
  useEffect(() => {
    if (mintAddress) fetchNFTByMintAddresses(mintAddress).then();
  }, [mintAddress]);

  return (
    <Container maxW={"container.xl"} paddingY={32}>
      {nftDetails ? (
        <Stack spacing={8}>
          <Heading as="h1" fontSize={["4xl", "4xl", "6xl"]}>
            {nftDetails.name}
          </Heading>
          <HStack
            bg={"whiteAlpha.50"}
            rounded={"full"}
            p={2}
            alignSelf="flex-start"
          >
            <Code
              px={2}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              h={8}
              rounded={"full"}
              bg={"whiteAlpha.100"}
            >
              {mintAddress}
            </Code>
            <IconButton
              aria-label={"Copy address"}
              icon={<AiOutlineCopy />}
              size={"sm"}
              rounded={"full"}
              onClick={() => copyToClipboard(mintAddress)}
            />
          </HStack>

          <Grid templateColumns={["1fr", "1fr", "2fr 3fr"]} gap={8}>
            <GridItem>
              <Stack spacing={5}>
                <chakra.div overflow="hidden" rounded={"2xl"}>
                  <AspectRatio ratio={1}>
                    <Image src={nftDetails.image} alt={nftDetails.name} />
                  </AspectRatio>
                </chakra.div>
                <Heading size={"lg"}>Attributes</Heading>
              </Stack>
            </GridItem>
            <GridItem h={"800px"}>
              <Stack spacing={5}>
                <Text>{nftDetails.description}</Text>
                {nftDetails.externalUrl ? (
                  <Link
                    isExternal
                    href={nftDetails.externalUrl}
                    _hover={{ textDecoration: "none" }}
                  >
                    <Button variant="ghost" leftIcon={<BsGlobe />}>
                      View website
                    </Button>
                  </Link>
                ) : null}
                <HStack>
                  <Text>Royalties</Text>
                  <CircularProgress
                    value={nftDetails.sellerFeeBasisPoints / 100}
                    color="green.400"
                  >
                    <CircularProgressLabel fontSize={"2xs"}>
                      {nftDetails.sellerFeeBasisPoints / 100}%
                    </CircularProgressLabel>
                  </CircularProgress>
                </HStack>
                <Stack spacing={4}>
                  <Heading size={"lg"}>Attributes</Heading>
                  {/* Different layout below for attributes: */}
                  {/*<Wrap>*/}
                  {/*  {nftDetails.attributes.map((attr, i) => (*/}
                  {/*    <WrapItem key={i} border="1px solid" px={4} py={3}>*/}
                  {/*      <Stack spacing={1}>*/}
                  {/*        <Text fontWeight="bold" fontSize="lg">*/}
                  {/*          {attr.trait_type}*/}
                  {/*        </Text>*/}
                  {/*        <Text>{attr.value}</Text>*/}
                  {/*      </Stack>*/}
                  {/*    </WrapItem>*/}
                  {/*  ))}*/}
                  {/*</Wrap>*/}
                  <SimpleGrid minChildWidth={"200px"} spacing={3}>
                    {nftDetails.attributes.map((attr, i) => (
                      <Stack
                        key={i}
                        spacing={1}
                        border="1px solid"
                        px={4}
                        py={3}
                      >
                        <Text fontWeight="bold" fontSize="lg">
                          {attr.trait_type}
                        </Text>
                        <Text>{attr.value}</Text>
                      </Stack>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Stack>
            </GridItem>
          </Grid>
        </Stack>
      ) : isInvalidMintAddress ? (
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertDescription>
            Invalid mint address. Please make sure the mint address is correct
          </AlertDescription>
        </Alert>
      ) : null}
    </Container>
  );
}
