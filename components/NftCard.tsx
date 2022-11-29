import type { SolanaNFTExtended } from "@mirrorworld/web3.js/dist/declarations/src/types/nft";
import {
  Box,
  Image,
  Stack,
  Heading,
  Text,
  AspectRatio,
  Button,
  Tooltip,
  Link,
  IconButton,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineContentCopy } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import copy from "copy-to-clipboard";

export interface NftCardProps {
  nft: SolanaNFTExtended;
}

export function NftCard(props: NftCardProps) {
  const toast = useToast();
  return (
    <Box
      maxW="200px"
      borderWidth={"1px"}
      borderColor={"whiteAlpha.300"}
      rounded={"lg"}
      overflow={"hidden"}
    >
      <AspectRatio ratio={1}>
        <Image src={props.nft.image} alt={props.nft.name} />
      </AspectRatio>
      <Stack px={3} py={2} maxW="inherit">
        <Heading as="h3" fontSize="sm" noOfLines={1}>
          {props.nft.name}
        </Heading>
        <Text fontSize="sm" noOfLines={2} color={"whiteAlpha.600"}>
          {props.nft.description}
        </Text>
        <Button variant="outline">View</Button>
        <HStack>
          {/*@ts-ignore*/}
          <Tooltip label={props.nft.mintAddress}>
            <IconButton
              onClick={() => {
                // @ts-ignore
                copy(props.nft.mintAddress);
                toast({
                  status: "success",
                  size: "sm",
                  // @ts-ignore
                  description: `Copied mint address: ${props.nft.mintAddress}`,
                });
              }}
              size={"sm"}
              rounded={"full"}
              aria-label={"Copy mint address"}
              icon={<MdOutlineContentCopy />}
            />
          </Tooltip>

          <Tooltip label={"View in explorer"}>
            <Link
              isExternal
              // @ts-ignore
              href={`https://explorer.solana.com/address/${props.nft.mintAddress}?cluster=devnet`}
            >
              <IconButton
                size={"sm"}
                rounded={"full"}
                aria-label={"Open in explorer"}
                icon={<FiExternalLink />}
              />
            </Link>
          </Tooltip>
        </HStack>
      </Stack>
    </Box>
  );
}
