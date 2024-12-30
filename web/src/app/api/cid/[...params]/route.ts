import { gql, GraphQLClient } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { Zlib } from "zlibjs/bin/zlib_and_gzip.min.js";

const detectFileType = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const bytes = [...new Uint8Array(arrayBuffer.slice(0, 4))]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  // File type magic numbers and corresponding types
  const magicNumbers = {
    "89504E47": "image/png",
    FFD8FFE0: "image/jpeg", // JPEG start of image marker
    FFD8FFE1: "image/jpeg", // JPEG EXIF
    FFD8FFE2: "image/jpeg", // JPEG EXIF
    FFD8FFE3: "image/jpeg", // JPEG EXIF
    FFD8FFE8: "image/jpeg", // JPEG SPIFF
    FFD8FFDB: "image/jpeg", // JPEG quantization table marker
    FFD8FFEE: "image/jpeg", // JPEG comment marker
    "47494638": "image/gif",
    "3C3F786D": "image/svg+xml", // SVG XML declaration <?xml
    "3C737667": "image/svg+xml", // SVG starting with <svg
    "424D": "image/bmp", // Bitmap image
    "49492A00": "image/tiff", // TIFF image
    "4D4D002A": "image/tiff", // TIFF image
    "00000100": "image/x-icon", // ICO file
  };

  // Check the magic number against known file types
  for (const [signature, type] of Object.entries(magicNumbers)) {
    if (bytes.startsWith(signature)) {
      return type;
    }
  }

  return "unknown"; // File type not recognized
};

export const GET = async (req: NextRequest) => {
  try {
    const pathname = req.nextUrl.pathname;
    console.log("pathname", pathname);
    const network = pathname.split("/").slice(3)[0];
    const cid = pathname.split("/").slice(4)[0];

    const endpoint = `https://subql.green.${network}.subspace.network/v1/graphql`;

    // Step 2: Create a GraphQL client
    const client = new GraphQLClient(endpoint);

    // Step 3: Write your query
    const query = gql`
      query GetCID($cid: String!) {
        files_files(where: { id: { _eq: $cid } }) {
          chunk {
            data
            uploadOptions: upload_options
          }
          file_cids {
            chunk {
              data
            }
          }
        }
      }
    `;

    // Step 4: Define variables (if needed)
    const variables = { cid };

    // Step 5: Send the query and handle the response
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await client.request(query, variables);
      console.log(data);

      if (data.files_files.length === 0) {
        return NextResponse.json(
          { success: false, message: "CID not found" },
          { status: 404 }
        );
      }
      let rawData: string = "";
      let dataArrayBuffer: ArrayBuffer = new ArrayBuffer(0);
      let depth = 0;
      if (data.files_files.length > 0) {
        if (data.files_files[0].file_cids.length === 0) {
          console.log("no file cids");
          rawData = data.files_files[0].chunk.data;
          dataArrayBuffer = Object.values(
            JSON.parse(rawData)
          ) as unknown as ArrayBuffer;
        } else {
          console.log("has file cids");
          depth = data.files_files[0].file_cids.length;
          let index = 0;
          while (depth > index) {
            const _data = data.files_files[0].file_cids[index].chunk.data;
            const newData = Object.values(
              JSON.parse(_data)
            ) as unknown as ArrayBuffer;
            dataArrayBuffer = new Uint8Array([
              ...new Uint8Array(dataArrayBuffer),
              ...new Uint8Array(newData),
            ]);
            rawData = _data;
            index++;
          }
        }
      }

      try {
        const uploadOptions = data.files_files[0].chunk.uploadOptions
          ? JSON.parse(data.files_files[0].chunk.uploadOptions)
          : null;
        if (uploadOptions && uploadOptions.compression?.algorithm === "ZLIB") {
          const inflate = new Zlib.Inflate(new Uint8Array(dataArrayBuffer), {
            index: 0,
            bufferSize: 1024,
            bufferType: Zlib.Inflate.BufferType.BLOCK,
            resize: true,
            verify: true,
          });
          dataArrayBuffer = inflate.decompress();
        }
      } catch (error) {
        console.error("Error decompressing data:", error);
      }

      console.log("rawData", rawData.slice(0, 12));
      console.log("rawData", rawData.slice(-12));

      if (!rawData) {
        return NextResponse.json(
          { success: false, message: "CID found but no valid file data" },
          { status: 404 }
        );
      }

      // const data1 = JSON.parse(rawData)
      // console.log('data1', data1)

      // const data2 = Object.values(data1) as unknown as ArrayBuffer
      console.log("dataArrayBuffer", dataArrayBuffer);
      const fileType = await detectFileType(dataArrayBuffer);
      console.log("fileType", fileType);

      // Convert byte array to string
      const jsonStringFromData2 =
        Buffer.from(dataArrayBuffer).toString("utf-8");

      // Attempt to parse the string as JSON
      try {
        const parsedJsonFromData2 = JSON.parse(jsonStringFromData2);
        return NextResponse.json(parsedJsonFromData2);
      } catch (jsonError) {
        try {
          if (fileType === "image/svg+xml") {
            return new NextResponse(jsonStringFromData2, {
              status: 200,
              headers: {
                "Content-Type": fileType,
              },
            });
          } else if (fileType === "application/pdf") {
            return new NextResponse(
              new Blob([dataArrayBuffer], { type: fileType }),
              {
                status: 200,
                headers: {
                  "Content-Type": fileType,
                },
              }
            );
          }
          console.log("here", dataArrayBuffer);
          return new NextResponse(dataArrayBuffer, {
            status: 200,
            headers: {
              "Content-Type": fileType,
            },
          });
        } catch {
          console.error("Failed to parse JSON from data2:", jsonError);
          return NextResponse.json(
            {
              success: false,
              message: "CID found but no valid file data or not supported",
            },
            { status: 404 }
          );
        }
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "CID not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error processing cid:", error);
    return NextResponse.json(
      { error: "Failed to process cid" },
      { status: 500 }
    );
  }
};
