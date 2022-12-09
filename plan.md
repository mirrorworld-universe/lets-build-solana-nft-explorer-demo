# Let's Build #001 - Solana NFT Explorer Plan


- Authenticate user
- See NFTs in a wallet (search owner address, .sol domain)
- Marketplace activity with the NFT
- Search by NFT mint address
- See NFT details
  - Name
  - See NFT image
  - Symbol
  - Metadata for NFT
  - Collection information
  - Royalties
  - **If user owns NFT, they can transfer NFT to another address.**


Views
- Home page
  - Search bar (search by owner address)

# TODO
- [ ] Build NFT Page
- [ ] Create marketplace and list NFT
  - [ ] Query NFT activity

## Nice to haves
- [ ] Search by .sol domain
- [ ] Listing and Buying on the Explorer
- [x] Build NFT card component

# Todo JS SDK
- [ ] Export `SolanaNFTExtended` type from core package
```ts
export interface SolanaNFTExtendedFixed extends SolanaNFTExtended {
  auctionHouse: AuctionHouse;
  mintAddress: string;
}
export interface AuctionHouse {
  address: string;
  creator: string;
  treasuryMint: string;
  sellerFeeBasisPoints: number;
}
```
- [ ] Add `auctionHouse` to the `NFTListings` type and export from core package

Wallet addresS: 7KfTdzjfWw8G5MyYz7tfv3Y9DcnvY1FJWRhcR2zeJjA1
## API Key: mw_Nj4PVsRU0e932QisHQYa7dBrPrQOQipbLwf