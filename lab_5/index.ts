import { Connection } from "@solana/web3.js";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";
import { irysStorage, keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { uploadMetadata } from "./uploadMetadata";
import { createNft } from "./createNft";
import "dotenv/config";

const nftData = {
    name: "SDP Andu NFT",
    symbol: "SDP",
    description: "This is my first NFT",
    imagePath: "./lab_5/download.jpeg",
};


async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const keypair = getKeypairFromEnvironment("SECRET_KEY");
    console.log("Connection done and keypair is loaded: " + keypair.publicKey.toBase58());

    const metaplex = Metaplex.make(connection)
            .use(keypairIdentity(keypair))
            .use(
                irysStorage({
                    address: "https://devnet.bundlr.network", 
                    providerUrl: "https://devnet.solana.com", 
                    timeout:60000
                })
            )
    
    
    const uri = await uploadMetadata(metaplex, nftData);
    console.log("Upload metadata: " + uri);

    const nft  = await createNft(metaplex, uri, nftData);
    const link = getExplorerLink("address", nft.address.toBase58(), "devnet");
    console.log("View transaction on Solana Explorer: " + link);
}



main().then(() => {
    console.log("Done! Your nft is created!");
});