import { Metaplex } from "@metaplex-foundation/js";
import { getExplorerLink } from "@solana-developers/helpers";


export async function createNft(
    metaplex: Metaplex,
    uri: string,
    nftData: any,
) {

    console.log("Creating NFT...");
    const {nft} = await metaplex.nfts().create({
        uri: uri,
        name: nftData.name,
        sellerFeeBasisPoints: 500,
        symbol: nftData.symbol,
    }, {commitment: "finalized"});

    const link = getExplorerLink("address", nft.address.toBase58(), "devnet");
    console.log("Token min wich represent the NFT", link);

    return nft;
}