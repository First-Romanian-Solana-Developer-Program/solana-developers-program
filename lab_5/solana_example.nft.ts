import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  getKeypairFromEnvironment,
  getKeypairFromFile,
} from "@solana-developers/helpers";
// import { promises as fs } from "fs";
import { clusterApiUrl, Keypair } from "@solana/web3.js";
import * as fs from "fs";

let filePath = "./lab_5/download.jpeg";

const loadKeypair = (pathToKeypair: string) => {
  const keypairData = JSON.parse(fs.readFileSync(pathToKeypair, "utf-8"));
  return Keypair.fromSecretKey(new Uint8Array(keypairData));
};

const createNFT = async () => {
  const umi = createUmi(clusterApiUrl("devnet"))
    .use(mplTokenMetadata())
    .use(
      irysUploader({
        address: "https://devnet.irys.xyz",
      })
    );

  // load keypair from local file system
  const localKeypair = loadKeypair("./secret.json");
  console.log("Keypair secret loaded:", localKeypair.publicKey.toString());

  // convert to Umi compatible keypair
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(
    localKeypair.secretKey
  );
  console.log("Keypair UMI public loaded:", umiKeypair.publicKey.toString());

  // load the MPL metadata program plugin and assign a signer to our umi instance
  umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata());

  // Create Umi signer from the converted keypair
  const signer = createSignerFromKeypair(umi, umiKeypair);
  umi.use(signerIdentity(signer));
  console.log("Signer loaded:", signer.publicKey.toString());

  const buffer = await fs.readFileSync(filePath);
  let file = createGenericFile(buffer, "download.jpeg", {
    contentType: "image/jpeg",
  });

  const [image] = await umi.uploader.upload([file]);
  console.log("Image uploaded to:", image);

  //Upload metadata to Arweave
  const metadata = {
    name: "Solana NFT",
    symbol: "SOL",
    description: "This is my first NFT on Solana",
    image: image,
  };

  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });
  console.log("Metadata uploaded to:", metadataUri);

  //Create NFT
  // We generate a signer for the Nft
  const nftSigner = generateSigner(umi);
  console.log("NFT signer generated:", nftSigner.publicKey.toString());

  const { signature, result } = await createNft(umi, {
    mint: nftSigner,
    symbol: metadata.symbol,
    sellerFeeBasisPoints: percentAmount(5.5),
    name: metadata.name,
    uri: metadataUri,
    updateAuthority: umi.identity.publicKey,
  }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

  console.log("\npNFT Created");
  console.log("View Transaction on Solana Explorer");
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log("\n");
  console.log("View NFT on Metaplex Explorer");
  console.log(
    `https://explorer.solana.com/address/${nftSigner.publicKey}?cluster=devnet`
  );
};

createNFT();
