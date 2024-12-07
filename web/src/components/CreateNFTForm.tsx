"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FormData {
  name: string;
  supply: number;
  description: string;
  externalLink: string;
  media: File | null;
}

export const CreateNFTForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    supply: 1,
    description: "",
    externalLink: "",
    media: null,
  });

  const [fileError, setFileError] = useState<string | null>(null);

  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === "file-too-large") {
          setFileError("File is larger than 5MB.");
        } else if (error.code === "file-invalid-type") {
          setFileError("Only image files are accepted.");
        } else {
          setFileError("File not accepted.");
        }
        return;
      }
      setFileError(null);
      setFormData({ ...formData, media: acceptedFiles[0] });
    },
    [formData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    maxSize:
      parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE || "5") * 1024 * 1024, // 5MB
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

      const data = new FormData();
      data.append("name", formData.name);
      data.append("supply", formData.supply.toString());
      data.append("description", formData.description);
      data.append("externalLink", formData.externalLink);

      if (formData.media) {
        data.append("media", formData.media);
      }

      const response = await fetch("/api/mint", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        // Handle success (e.g., show a success message or redirect)
        console.log("NFT created successfully!");
      } else {
        // Handle errors
        console.error("Failed to create NFT.");
      }
    },
    [formData]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-6 bg-gray-900 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Create NFT</h2>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <label htmlFor="name" className="block mb-2 text-white">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>

          <div>
            <label htmlFor="supply" className="block mb-2 text-white">
              Supply *
            </label>
            <input
              type="number"
              id="supply"
              name="supply"
              value={formData.supply}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>

          <div>
            <label htmlFor="externalLink" className="block mb-2 text-white">
              External Link
            </label>
            <input
              type="url"
              id="externalLink"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>
        </div>

        <div
          {...getRootProps()}
          className="flex-1 border-dashed border-2 border-gray-700 p-6 rounded-lg bg-gray-800 text-white cursor-pointer"
        >
          <input {...getInputProps()} />
          {formData.media ? (
            <div>
              <Image
                src={URL.createObjectURL(formData.media)}
                alt="Preview"
                className="w-full h-80 object-cover rounded-lg"
                width={640}
                height={256}
                unoptimized
              />
              <p className="mt-2 text-sm">{(formData.media as File).name}</p>
            </div>
          ) : isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
          )}
          {fileError && (
            <p className="mt-2 text-red-500 text-sm">{fileError}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Create
      </button>
    </form>
  );
};
