import { APP_CONFIG } from "@/config/app";
import { getImageSizeErrorMessage, getImageTypeErrorMessage, getStorageUrl, isValidImageSize, isValidImageType } from "@/config/constants";
import { createAutoDriveApi } from "@autonomys/auto-drive";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  if (!process.env.AUTO_DRIVE_API_KEY)
    return NextResponse.json(
      { message: "AutoDrive API key is not set" },
      { status: 500 }
    );
  if (!APP_CONFIG.contract.address)
    return NextResponse.json(
      { message: "Contract address is not set" },
      { status: 500 }
    );


  try {
    const formData = await req.formData();
    console.log("Form Data:", formData);

    const name = formData.get("name") as string;
    const supply = parseInt(formData.get("supply") as string, 10);
    const description = formData.get("description") as string;
    const externalLink = formData.get("externalLink") as string;
    const media = formData.get("media") as File | null;
    const creator = formData.get("creator") as string;

    console.log("Received Data:", {
      name,
      supply,
      description,
      externalLink,
      media,
    });

    let mediaUrl = "";

    if (!media)
      return NextResponse.json(
        { message: "Media is required" },
        { status: 400 }
      );
    if (!isValidImageType(media.type))
      return NextResponse.json(
        { message: getImageTypeErrorMessage() },
        { status: 400 }
      );
    if (!isValidImageSize(media.size)) {
      return NextResponse.json(
        { message: getImageSizeErrorMessage() },
        { status: 400 }
      );
    }

    const arrayBuffer = await media.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use the storage network name from APP_CONFIG
    const storageNetworkName = APP_CONFIG.storage.networkName;
    let networkString: "taurus" | "mainnet";
    if (storageNetworkName === "taurus") {
      networkString = "taurus";
    } else if (storageNetworkName === "mainnet") {
      networkString = "mainnet";
    } else {
      return NextResponse.json(
        { message: `Invalid storage network: ${storageNetworkName}` },
        { status: 500 }
      );
    }

    const driveClient = createAutoDriveApi({
      apiKey: process.env.AUTO_DRIVE_API_KEY!, 
      network: networkString
    });

    const uploadedFileCid = await driveClient.uploadFile(
      {
        read: async function* () {
          yield buffer;
        },
        name: media.name,
        mimeType: media.type,
        size: buffer.length,
      },
      {}
    );

    console.log("Final Upload Response:", uploadedFileCid);

    const imageCid = uploadedFileCid?.toString() || "";
    mediaUrl = getStorageUrl(imageCid); // For response only

    const metadata = {
      description,
      external_url: externalLink,
      image: `${storageNetworkName}:${imageCid}`, // Store network:cid format
      name,
      attributes: [],
    };
    console.log("Metadata:", metadata);

    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const metadataUploadCid = await driveClient.uploadFile(
      {
        read: async function* () {
          yield metadataBuffer;
        },
        name: "metadata.json",
        mimeType: "application/json",
        size: metadataBuffer.length,
      },
      {}
    );

    const cid = metadataUploadCid?.toString() || "";

    console.log("Final Upload Response:", metadataUploadCid);

    // Now we need to mint the NFT
    const provider = new JsonRpcProvider(APP_CONFIG.evmNetwork.rpcUrl);
    const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
    const contract = new Contract(
      APP_CONFIG.contract.address,
      [
        {
          type: "function",
          name: "mint",
          inputs: [
            { name: "creator", type: "address", internalType: "address" },
            { name: "cid", type: "string", internalType: "string" },
            { name: "supply", type: "uint256", internalType: "uint256" },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ],
      wallet
    );
    const tx = await contract.mint(creator, cid, supply);

    const receipt = await tx.wait();
    console.log("Receipt:", receipt);

    return NextResponse.json(
      {
        message: "NFT created successfully",
        mediaUrl,
        txHash: tx.hash,
        cids: {
          image: uploadedFileCid?.toString(),
          metadata: metadataUploadCid?.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
