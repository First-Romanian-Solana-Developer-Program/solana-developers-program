
import "dotenv/config";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";

import { Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";


const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const user = getKeypairFromEnvironment("SECRET_KEY");

console.log("User account loaded:", user.publicKey.toBase58());

//Token mint of the user
const tokenMint = new PublicKey("2JzpxNgmKVXRa6iwuUYc498o1j2h8FWDc2FFWyeLDxTe");

//
const destPubkey = new PublicKey("8RGSTN6on6hVvsAYyqoZEvh8Kpi4nycKVNkvWEwiUbxk");

//Create token account for my token mint
const destTokenAccount  = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMint,
    user.publicKey
);

console.log("Token account created:", destTokenAccount.address.toBase58());