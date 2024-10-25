
import "dotenv/config";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";
import { Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";


const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const user = getKeypairFromEnvironment("SECRET_KEY");
console.log("User account loaded:", user.publicKey.toBase58());

//My token Account
const sourceTokenAccount = new PublicKey("DG4wBgUcZP1YctSPo7PaZCCGzp7xVXFwgXRiTd3objau");

//My token mint
const tokenMint = new PublicKey("2JzpxNgmKVXRa6iwuUYc498o1j2h8FWDc2FFWyeLDxTe");

//Destination public key
const destPubkey = new PublicKey("9j3uYxDQdgZxncwHrtroGPwo9qw9RhbBJpnhcbkNsafT");

//Create token account for destination token mint
const destTokenAccount  = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMint,
    destPubkey
);
console.log("Token account created:", destTokenAccount.address.toBase58());

const signature = await transfer(
    connection,
    user,
    sourceTokenAccount,
    destTokenAccount.address,
    user,
    1 * (10**6)
);

const link = getExplorerLink("tx", signature, "devnet");
console.log("Token minted:", link);
