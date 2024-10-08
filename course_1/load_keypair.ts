import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log("Keypair public loaded:", keypair.publicKey.toString());
console.log("Keypair secret loaded:", keypair.secretKey.toString());