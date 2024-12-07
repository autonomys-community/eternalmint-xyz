import {
  createAutoDriveApi,
  uploadFile,
  UploadFileStatus,
} from "@autonomys/auto-drive";
import { NextRequest, NextResponse } from "next/server";

const urlFromCid = (cid: string) =>
  `${process.env.NEXT_PUBLIC_HOST}/api/cid/${process.env.NEXT_PUBLIC_NETWORK}/${cid}`;

export const POST = async (req: NextRequest) => {
  if (!process.env.AUTO_DRIVE_API_KEY)
    return NextResponse.json(
      { message: "AutoDrive API key is not set" },
      { status: 500 }
    );
  if (!process.env.NEXT_PUBLIC_HOST)
    return NextResponse.json({ message: "Host is not set" }, { status: 500 });
  if (!process.env.NEXT_PUBLIC_NETWORK)
    return NextResponse.json(
      { message: "Network is not set" },
      { status: 500 }
    );

  const MAX_SIZE =
    parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE || "5") * 1024 * 1024;

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const supply = parseInt(formData.get("supply") as string, 10);
    const description = formData.get("description") as string;
    const externalLink = formData.get("externalLink") as string;
    const media = formData.get("media") as File | null;

    console.log("Received Data:", {
      name,
      supply,
      description,
      externalLink,
      media,
    });

    let mediaUrl = "";
    let metadataUrl = "";

    if (!media)
      return NextResponse.json(
        { message: "Media is required" },
        { status: 400 }
      );
    if (!media.type.startsWith("image/"))
      return NextResponse.json(
        { message: "Only image files are allowed." },
        { status: 400 }
      );
    if (media.size > MAX_SIZE)
      return NextResponse.json(
        { message: "File size must be under 5 MB." },
        { status: 400 }
      );

    const arrayBuffer = await media.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const driveClient = createAutoDriveApi({
      apiKey: process.env.AUTO_DRIVE_API_KEY,
    });

    const uploadObservable = uploadFile(
      driveClient,
      {
        read: async function* () {
          yield buffer;
        },
        name: media.name,
        mimeType: media.type,
        size: buffer.length,
        path: media.name,
      },
      {}
    );

    const uploadResponse = await new Promise<UploadFileStatus>(
      (resolve, reject) => {
        uploadObservable.subscribe({
          next: (status) => {
            console.log("Upload Status:", status);
            if (status.cid) {
              resolve(status);
            }
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            reject(new Error("Upload completed without receiving a CID."));
          },
        });
      }
    );

    console.log("Final Upload Response:", uploadResponse);

    mediaUrl = urlFromCid(uploadResponse.cid?.toString() || "");

    console.log("Media URL:", mediaUrl);

    const metadata = {
      description,
      external_url: externalLink,
      image: mediaUrl,
      name,
      attributes: [],
    };
    console.log("Metadata:", metadata);

    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const metadataUploadObservable = uploadFile(
      driveClient,
      {
        read: async function* () {
          yield metadataBuffer;
        },
        name: "metadata.json",
        mimeType: "application/json",
        size: metadataBuffer.length,
        path: "metadata.json",
      },
      {}
    );

    const metadataUploadResponse = await new Promise<UploadFileStatus>(
      (resolve, reject) => {
        metadataUploadObservable.subscribe({
          next: (status) => {
            console.log("Upload Status:", status);
            if (status.cid) {
              resolve(status);
            }
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            reject(new Error("Upload completed without receiving a CID."));
          },
        });
      }
    );

    console.log("Final Upload Response:", metadataUploadResponse);

    metadataUrl = urlFromCid(metadataUploadResponse.cid?.toString() || "");

    console.log("Metadata URL:", metadataUrl);

    // Now we need to mint the NFT

    return NextResponse.json(
      { message: "NFT created successfully", mediaUrl },
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
