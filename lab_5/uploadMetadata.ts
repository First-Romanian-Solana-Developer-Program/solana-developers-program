import { Metaplex, toMetaplexFile } from "@metaplex-foundation/js"
import * as fs from "fs";

export async function uploadMetadata(
    metaplex: Metaplex, 
    data: any,
): Promise<string> {
    const buffer = fs.readFileSync(data.imagePath);
    const file  = toMetaplexFile(buffer, data.imagePath);
    const imgUri = await metaplex.storage().upload(file);
    
    console.log("Image uploaded to:", imgUri);

    const {uri} = await metaplex.nfts().uploadMetadata({
        name: data.name,
        symbol: data.symbol,
        description: data.description,
        image: imgUri,
    });

    console.log("Metadata uploaded to:", uri);
    return uri;
}