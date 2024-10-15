import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction, SystemProgram } from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";


const sender = getKeypairFromEnvironment("SECRET_KEY");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Keypair secret loaded:", sender.publicKey.toString());


const receiver = new PublicKey("BmmmbbewcbKeLLaMU1uvEasR1tz25GfwJ5XaBVCBtjoz");
const transaction = new Transaction();
const amount = 0.1;
const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver,
    lamports: LAMPORTS_PER_SOL * amount,
});


transaction.add(transferInstruction);
// const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
// console.log("Transactio confirmed: ", signature);

const createMemo  =  createMemoInstruction("Hello world");
transaction.add(createMemo);
const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
console.log("Transaction confirmed: ", signature);