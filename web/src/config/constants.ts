// Static application constants (values that don't change between environments)

// File upload settings (size limit now configured via NEXT_PUBLIC_MAX_IMAGE_SIZE_MB env var)

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png", 
  "image/gif",
  "image/webp"
] as const;

// Smart contract constants
export const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6" as const;
export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

// UI constants
export const ITEMS_PER_PAGE = 12;
export const TOAST_DURATION = 5000;
export const MAX_RETRIES = 3;

// Gas limits for different operations
export const GAS_LIMITS = {
  mint: 500000,
  distribute: 2500000,
  transfer: 100000,
  roleCheck: 50000,
} as const;

// Batch processing limits
export const BATCH_SIZES = {
  distribution: 100,
  roleChecks: 50,
} as const;

// Storage network configuration
const STORAGE_NETWORK_URLS = {
  taurus: "https://demo.auto-drive.autonomys.xyz/api/objects",
  mainnet: "https://mainnet.auto-drive.autonomys.xyz/api/objects"
} as const;

// Helper functions
export const getStorageNetwork = () => {
  return process.env.NEXT_PUBLIC_STORAGE_NETWORK || "taurus";
};

// Parse network:cid format
export const parseImageString = (imageString: string): { network: string; cid: string } | null => {
  if (!imageString || !imageString.includes(':')) {
    return null;
  }
  
  const [network, cid] = imageString.split(':', 2);
  if (!network || !cid) {
    return null;
  }
  
  return { network, cid };
};

// Construct API URL from network:cid format
export const getStorageApiUrl = (imageString: string): string => {
  const parsed = parseImageString(imageString);
  if (!parsed) {
    return "";
  }
  
  return `/api/cid/${parsed.network}/${parsed.cid}`;
};

// Construct metadata API URL from plain CID using current storage network
export const getMetadataApiUrl = (cid: string): string => {
  const storageNetwork = getStorageNetwork();
  return `/api/cid/${storageNetwork}/${cid}`;
};

export const getStorageUrl = (cid: string) => {
  const storageNetwork = process.env.NEXT_PUBLIC_STORAGE_NETWORK as keyof typeof STORAGE_NETWORK_URLS;
  const baseUrl = STORAGE_NETWORK_URLS[storageNetwork];
  
  if (!baseUrl) {
    console.error(`Invalid storage network: ${storageNetwork}`);
    return "";
  }
  
  return `${baseUrl}/${cid}`;
};

export const isValidImageSize = (sizeInBytes: number) => {
  const maxSizeMB = parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB || "5");
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return sizeInBytes <= maxSizeBytes;
};

export const isValidImageType = (mimeType: string) => {
  return SUPPORTED_IMAGE_TYPES.includes(mimeType as (typeof SUPPORTED_IMAGE_TYPES)[number]);
};

// Centralized error messages
export const getImageSizeErrorMessage = () => {
  const maxSizeMB = process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB || "5";
  return `File is larger than ${maxSizeMB}MB.`;
};

export const getImageTypeErrorMessage = () => {
  const supportedTypes = SUPPORTED_IMAGE_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ');
  return `Only ${supportedTypes} files are accepted.`;
}; 