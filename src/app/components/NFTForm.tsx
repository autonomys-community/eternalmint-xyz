import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from 'next/image';

export default function NFTForm() {
  const [formData, setFormData] = useState({
    name: "",
    supply: 1,
    description: "",
    externalLink: "",
    media: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = (acceptedFiles: any[]) => {
    setFormData({ ...formData, media: acceptedFiles[0] });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Add your form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <label htmlFor="name" className="block mb-2 text-white">Name *</label>
            <input
              type="text"
              id="nft_name"
              name="nft_name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>

          <div>
            <label htmlFor="supply" className="block mb-2 text-white">Supply *</label>
            <input
              type="number"
              id="nft_supply"
              name="nft_supply"
              value={formData.supply}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-white">Description</label>
            <textarea
              id="nft_description"
              name="nft_description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>

          <div>
            <label htmlFor="externalLink" className="block mb-2 text-white">External Link</label>
            <input
              type="url"
              id="nft_external_link"
              name="nft_external_link"
              value={formData.externalLink}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>
        </div>

        <div {...getRootProps()} className="flex-1 border-dashed border-2 border-gray-700 p-6 rounded-lg bg-gray-800 text-white cursor-pointer">
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
            <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
          )}
        </div>
      </div>

      <button type="submit" className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Create
      </button>
    </form>
  );
}
