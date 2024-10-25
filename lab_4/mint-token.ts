import { createMint, mintTo } from "@solana/spl-token";
import "dotenv/config";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";

import { Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";

const DECIMALS = 6;
const AMOUNT = 10;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const user = getKeypairFromEnvironment("SECRET_KEY");

console.log("User account loaded:", user.publicKey.toBase58());

//My Token mint 
const tokenMint = new PublicKey("2JzpxNgmKVXRa6iwuUYc498o1j2h8FWDc2FFWyeLDxTe");
//My token account
const destTokenAccount = new PublicKey("DG4wBgUcZP1YctSPo7PaZCCGzp7xVXFwgXRiTd3objau");

const signature = await mintTo(
    connection,
    user,
    tokenMint,
    destTokenAccount,
    user,
    AMOUNT * (10**DECIMALS)
);

const link = getExplorerLink("tx", signature, "devnet");
console.log("Token minted:", link);