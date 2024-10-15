import "dotenv/config";
import { Connection, LAMPORTS_PER_SOL,  PublicKey, clusterApiUrl } from "@solana/web3.js";
import { airdropIfRequired } from "@solana-developers/helpers";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
console.log("Connection to cluster established:", connection.rpcEndpoint);

const publicKey = new PublicKey("FzM1Mj7Dnmd64XzNrkYe8oi9BrC2NULvrp7BG8KjMoNx");

const balanceInLamports = await connection.getBalance(publicKey);
console.log("Balance:", balanceInLamports);

console.log("Airdropping...");
await airdropIfRequired(connection, publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

const balanceInLamportsAfterAirdrop = await connection.getBalance(publicKey);
console.log("Balance after airdrop:", balanceInLamportsAfterAirdrop);