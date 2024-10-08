import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log("Keypair public generated:", keypair.publicKey.toString());
console.log("Keypair secret generated:", keypair.secretKey.toString());