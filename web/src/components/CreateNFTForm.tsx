"use client";

import { APP_CONFIG } from "@/config/app";
import { getImageSizeErrorMessage, getImageTypeErrorMessage, getStorageUrl, isValidImageSize, isValidImageType, SUPPORTED_IMAGE_TYPES } from "@/config/constants";
import { useHasMinterRole } from "@/hooks/useHasMinterRole";
import { sendGAEvent } from "@next/third-parties/google";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAccount } from "wagmi";

interface FormData {
  name: string;
  supply: number;
  description: string;
  externalLink: string;
  media: File | null;
  creator: string;
}

type NftDetails = {
  txHash: string;
  cids: {
    image: string;
    metadata: string;
  };
};

export const CreateNFTForm: React.FC = () => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { hasMinterRole, isLoading } = useHasMinterRole();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    supply: 1,
    description: "",
    externalLink: "",
    media: null,
    creator: address || "",
  });

  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nftDetails, setNftDetails] = useState<NftDetails | null>(null);

  // Check if uploaded file is an animated GIF
  const isAnimatedGif = formData.media?.type === 'image/gif';

  useEffect(
    () => setFormData((prevData) => ({ ...prevData, creator: address || "" })),
    [address]
  );

  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        setFileError(error.message || "File not accepted.");
        return;
      }
      setFileError(null);
      setFormData({ ...formData, media: acceptedFiles[0] });
      sendGAEvent("event", "mint_image_selected", {
        value: (acceptedFiles[0] as File).name,
      });
    },
    [formData]
  );

  // Convert SUPPORTED_IMAGE_TYPES array to useDropzone accept format
  const acceptedFileTypes = SUPPORTED_IMAGE_TYPES.reduce((acc, type) => {
    acc[type] = [];
    return acc;
  }, {} as Record<string, string[]>);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: APP_CONFIG.storage.maxImageSizeMB * 1024 * 1024,
    validator: (file) => {
      // Use our centralized validation functions
      if (!isValidImageType(file.type)) {
        return {
          code: "file-invalid-type",
          message: getImageTypeErrorMessage()
        };
      }
      if (!isValidImageSize(file.size)) {
        return {
          code: "file-too-large",
          message: getImageSizeErrorMessage()
        };
      }
      return null; // File is valid
    }
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Prevent submission if user doesn't have minter role
      if (!hasMinterRole) {
        return;
      }
      
      sendGAEvent("event", "mint_started", { value: formData.name });
      setIsSubmitting(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("supply", formData.supply.toString());
      data.append("description", formData.description);
      data.append("externalLink", formData.externalLink);
      data.append("creator", formData.creator);

      if (formData.media) data.append("media", formData.media);

      try {
        const response = await fetch("/api/mint", {
          method: "POST",
          body: data,
        });
        const result = await response.json();
        if (response.ok) {
          setNftDetails(result);
          sendGAEvent("event", "minted", { value: result.txHash });
        } else console.error("Failed to create NFT.");
      } catch (error) {
        console.error("Error during NFT creation:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, hasMinterRole]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 px-10 py-6 rounded-xl shadow-lg border border-white/15 backdrop-filter backdrop-blur-md"
    >
      <h2 className="text-2xl font-bold text-white">Create New NFT</h2>
      <h4 className="text-white mb-4">
        Mint Once, Own Forever: Fully Decentralized, Eternally Accessible NFTs.
      </h4>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex gap-4">
            <div className="w-4/5">
              <label htmlFor="name" className="block mb-2 text-white">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                disabled={isSubmitting || !hasMinterRole}
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-white/15 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="w-1/5">
              <label htmlFor="supply" className="block mb-2 text-white">
                Supply *
              </label>
              <input
                type="number"
                id="supply"
                name="supply"
                disabled={isSubmitting || !hasMinterRole}
                value={formData.supply}
                onChange={handleChange}
                required
                className="w-full p-3 border border-white/15 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label htmlFor="externalLink" className="block mb-2 text-white">
              External Link
            </label>
            <input
              type="url"
              id="externalLink"
              name="externalLink"
              disabled={isSubmitting || !hasMinterRole}
              value={formData.externalLink}
              onChange={handleChange}
              className="w-full p-3 border border-white/15 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              disabled={isSubmitting || !hasMinterRole}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-white/15 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <div
              {...getRootProps()}
              className={`flex-1 p-3 rounded-lg text-white bg-white/10 border-2 border-dashed border-transparent overflow-hidden
                [border-image-slice:1] [border-image-width:1] mt-2
                [border-image-source:linear-gradient(to_right,#1E58FC,#D914E4,#F10419)]
                ${hasMinterRole ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            >
              <input {...getInputProps()} disabled={isSubmitting || !hasMinterRole} />
              {formData.media ? (
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(formData.media)}
                    alt="Preview"
                    className="w-full h-80 max-h-[160px] object-cover rounded-lg"
                    width={640}
                    height={256}
                    unoptimized={isAnimatedGif} // Don't optimize GIFs to preserve animation
                  />
                  {isAnimatedGif && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      ANIMATED GIF
                    </div>
                  )}
                  <p className="mt-1 p-0 text-sm">
                    {(formData.media as File).name}
                    {isAnimatedGif && " • Animated GIF"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="/images/icons/download.svg"
                    alt="Drop Image"
                    className="w-16 h-16 object-cover rounded-lg"
                    width={16}
                    height={16}
                    unoptimized
                  />
                  <h3 className="text-white text-xl font-bold">Upload Image</h3>
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <div className="text-center text-white">
                      <p>
                        Drag &apos;n&apos; Drop A File Here, Or Click To Select A
                        File
                      </p>
                      <p className="text-sm text-gray-300 mt-2">
                        Supports JPG, PNG, GIF (including animated), and WebP
                      </p>
                    </div>
                  )}
                </div>
              )}
              {fileError && (
                <p className="mt-2 text-red-500 text-sm">{fileError}</p>
              )}
            </div>
          </div>

          {!address ? (
            <button
              type="button"
              onClick={openConnectModal}
              className="px-3 py-2 font-manrope font-extrabold bg-gradient-to-r from-[#1E58FC] via-[#D914E4] to-[#F10419] text-white rounded-sm hover:bg-green-700 transition"
            >
              Connect Wallet
            </button>
          ) : isLoading ? (
            <button
              type="button"
              disabled
              className="px-3 py-2 font-manrope font-extrabold bg-gray-600 text-gray-300 rounded-sm cursor-not-allowed"
            >
              Checking permissions...
            </button>
          ) : !hasMinterRole ? (
            <div className="relative group">
              <button
                type="button"
                disabled
                className="px-3 py-2 font-manrope font-extrabold bg-gray-600 text-gray-300 rounded-sm cursor-not-allowed w-full"
              >
                Create (MINTER Role Required)
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                You need MINTER_ROLE permissions to create NFTs
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-3 py-2 font-manrope font-extrabold bg-gradient-to-r from-[#1E58FC] via-[#D914E4] to-[#F10419] text-white rounded-sm hover:bg-green-700 transition ${
                isSubmitting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Minting NFT in progress..." : "Create"}
            </button>
          )}
        </div>

        <div
          {...getRootProps()}
          className="flex-1 w-full border border-white/15 rounded-lg bg-white/10 flex items-center justify-center relative"
        >
          <Image
            src={
              formData.media
                ? URL.createObjectURL(formData.media)
                : "/images/image-example.png"
            }
            alt={formData.media ? (formData.media as File).name : "Preview"}
            className="h-full max-h-[520px] max-w-[450px] w-full object-cover rounded-lg"
            width={640}
            height={256}
            unoptimized={formData.media ? isAnimatedGif : true} // Don't optimize GIFs to preserve animation
          />
          {formData.media && isAnimatedGif && (
            <div className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded">
              ANIMATED GIF
            </div>
          )}
        </div>
      </div>

      {nftDetails && (
        <>
          <p className="mt-4 text-green-500 text-sm">
            NFT minted successfully! Transaction Hash: {nftDetails?.txHash}{" "}
            <Link
              href={`https://blockscout.taurus.autonomys.xyz/tx/${nftDetails?.txHash}`}
              className="text-blue-500 hover:underline"
              target="_blank"
            >
              View Transaction
            </Link>
          </p>
          <p className="mt-4 text-green-500 text-sm">
            Image CID: {nftDetails?.cids?.image}{" "}
            <Link
                              href={getStorageUrl(nftDetails?.cids?.image || "")}
              className="text-blue-500 hover:underline"
              target="_blank"
            >
              View Image
            </Link>
          </p>
          <p className="mt-4 text-green-500 text-sm">
            Metadata CID: {nftDetails?.cids?.metadata}{" "}
            <Link
                              href={getStorageUrl(nftDetails?.cids?.metadata || "")}
              className="text-blue-500 hover:underline"
              target="_blank"
            >
              View Metadata
            </Link>
          </p>
        </>
      )}
    </form>
  );
};
