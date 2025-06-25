// Application Configuration
// This file contains all non-sensitive configuration that can be safely committed to version control.
// Sensitive values (API keys, private keys) should remain in environment variables.

export type Environment = 'development' | 'staging' | 'production';
export type NetworkName = 'taurus' | 'mainnet';
export type StorageNetworkName = 'taurus' | 'mainnet';

// Determine environment
const getEnvironment = (): Environment => {
  // Use explicit environment variable if set
  const explicitEnv = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
  if (explicitEnv && ['development', 'staging', 'production'].includes(explicitEnv)) {
    return explicitEnv;
  }

  // Fall back to NODE_ENV for development
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }

  // Default to staging for production builds (Vercel deployments)
  // Set NEXT_PUBLIC_ENVIRONMENT=production explicitly for production deployments
  return 'staging';
};

export const ENV = getEnvironment();

// Auto-detect host URL
const getHostUrl = (): string => {
  // If explicitly set, use that (only override we keep for host)
  if (process.env.NEXT_PUBLIC_HOST) {
    return process.env.NEXT_PUBLIC_HOST;
  }

  // Auto-detect based on environment
  if (ENV === 'development') {
    return 'http://localhost:3006';
  }

  // For production/staging, try to auto-detect from Vercel environment
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }

  // Server-side: use Vercel environment variables or fallback
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  // Fallback to known production URL
  return 'https://eternalmint-pro.vercel.app';
};

// EVM Network configurations (blockchain infrastructure only)
export const EVM_NETWORKS = {
  taurus: {
    name: 'Autonomys Taurus Auto EVM',
    chainId: 490000,
    rpcUrl: 'https://auto-evm.taurus.autonomys.xyz/ws',
    blockExplorer: 'https://explorer.auto-evm.taurus.autonomys.xyz',
    currency: {
      name: 'tAI3',
      symbol: 'tAI3',
      decimals: 18,
    },
    testnet: true,
  },
  mainnet: {
    name: 'Autonomys Mainnet Auto EVM',
    chainId: 490001, // Placeholder - update when mainnet is available
    rpcUrl: 'https://auto-evm.mainnet.autonomys.xyz/ws', // Placeholder
    blockExplorer: 'https://explorer.auto-evm.mainnet.autonomys.xyz', // Placeholder
    currency: {
      name: 'AI3',
      symbol: 'AI3',
      decimals: 18,
    },
    testnet: false,
  },
} as const;

// Storage Network configurations (file storage infrastructure only)
export const STORAGE_NETWORKS = {
  taurus: {
    name: 'Autonomys Taurus Auto Drive',
    apiUrl: 'https://demo.auto-drive.autonomys.xyz/api/objects',
    testnet: true,
  },
  mainnet: {
    name: 'Autonomys Mainnet Auto Drive',
    apiUrl: 'https://mainnet.auto-drive.autonomys.xyz/api/objects',
    testnet: false,
  },
} as const;

// Contract deployment configurations (deployment-specific)
export const CONTRACT_DEPLOYMENTS = {
  development: {
    evmNetwork: 'taurus' as NetworkName,
    storageNetwork: 'taurus' as StorageNetworkName,
    contractAddress: '0x09e8798DAb58C211183c42325Ad7CCd935C11f7D',
    subgraphUrl: 'https://api.studio.thegraph.com/query/114204/eternalmint-dev/v0.0.16',
    version: '1.0.0',
    deployedAt: '2024-01-01', // Update with actual deployment date
  },
  staging: {
    evmNetwork: 'taurus' as NetworkName,
    storageNetwork: 'taurus' as StorageNetworkName,
    contractAddress: '0x09e8798DAb58C211183c42325Ad7CCd935C11f7D',
    subgraphUrl: 'https://api.studio.thegraph.com/query/114204/eternalmint-dev/v0.0.16',
    version: '1.0.0',
    deployedAt: '2024-01-01', // Update with actual deployment date
  },
  production: {
    evmNetwork: 'taurus' as NetworkName, // Will change to 'mainnet' when ready
    storageNetwork: 'mainnet' as StorageNetworkName, // Could use mainnet storage even with taurus EVM
    contractAddress: '0x09e8798DAb58C211183c42325Ad7CCd935C11f7D', // Will be different for production
    subgraphUrl: 'https://api.studio.thegraph.com/query/114204/eternalmint-prod/v1.0.0', // Different subgraph for production
    version: '1.0.0',
    deployedAt: '2024-01-01', // Update with actual deployment date
  },
} as const;

// Environment-specific configurations
export const ENVIRONMENT_CONFIG = {
  development: {
    debug: true,
    maxImageSizeMB: 10, // More generous for development
  },
  staging: {
    debug: true,
    maxImageSizeMB: 5,
  },
  production: {
    debug: false,
    maxImageSizeMB: 5,
  },
} as const;

// Current configuration (automatically selected based on environment)
const envConfig = ENVIRONMENT_CONFIG[ENV];
const contractDeployment = CONTRACT_DEPLOYMENTS[ENV];
export const CURRENT_EVM_NETWORK = EVM_NETWORKS[contractDeployment.evmNetwork];
export const CURRENT_STORAGE_NETWORK = STORAGE_NETWORKS[contractDeployment.storageNetwork];

// Application configuration
export const APP_CONFIG = {
  // Basic app info
  name: 'EternalMint Pro',
  description: 'Mint Once, Own Forever: Fully Decentralized, Eternally Accessible NFTs.',
  version: '1.0.0',
  
  // Current environment settings
  environment: ENV,
  host: getHostUrl(),
  debug: envConfig.debug,
  
  // EVM Network settings (blockchain infrastructure)
  evmNetwork: {
    name: CURRENT_EVM_NETWORK.name,
    chainId: CURRENT_EVM_NETWORK.chainId,
    rpcUrl: CURRENT_EVM_NETWORK.rpcUrl,
    blockExplorer: CURRENT_EVM_NETWORK.blockExplorer,
    currency: CURRENT_EVM_NETWORK.currency,
    testnet: CURRENT_EVM_NETWORK.testnet,
  },
  
  // Storage Network settings (file storage infrastructure)
  storageNetwork: {
    name: CURRENT_STORAGE_NETWORK.name,
    apiUrl: CURRENT_STORAGE_NETWORK.apiUrl,
    testnet: CURRENT_STORAGE_NETWORK.testnet,
  },
  
  // Contract deployment settings (deployment-specific)
  contract: {
    address: contractDeployment.contractAddress,
    subgraphUrl: contractDeployment.subgraphUrl,
    version: contractDeployment.version,
    deployedAt: contractDeployment.deployedAt,
    // Smart contract operational settings
    gasLimits: {
      mint: 500000,
      distribute: 2500000,
      transfer: 100000,
      roleCheck: 50000,
    },
    batchSizes: {
      distribution: 100,
      roleChecks: 50,
    },
    roles: {
      minter: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
      admin: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
  },
  
  // Storage settings
  storage: {
    networkName: contractDeployment.storageNetwork,
    maxImageSizeMB: envConfig.maxImageSizeMB,
    supportedImageTypes: [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp'
    ] as const,
  },
  
  // UI settings
  ui: {
    itemsPerPage: 12,
    toastDuration: 5000,
    maxRetries: 3,
  },
  
  // Social/SEO settings
  social: {
    twitter: '@eternalmint_xyz',
    creator: '@marcaureleb',
  },
  
  // External service settings (client-safe values only)
  services: {
    walletConnect: {
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
    },
    analytics: {
      googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    },
  },
} as const;

// Helper functions
export const getStorageApiUrl = (storageNetworkName: StorageNetworkName = APP_CONFIG.storage.networkName): string => {
  return STORAGE_NETWORKS[storageNetworkName].apiUrl;
};

export const isValidImageSize = (sizeInBytes: number): boolean => {
  const maxSizeBytes = APP_CONFIG.storage.maxImageSizeMB * 1024 * 1024;
  return sizeInBytes <= maxSizeBytes;
};

export const isValidImageType = (mimeType: string): boolean => {
  return APP_CONFIG.storage.supportedImageTypes.includes(mimeType as typeof APP_CONFIG.storage.supportedImageTypes[number]);
};

export const getImageSizeErrorMessage = (): string => {
  return `File is larger than ${APP_CONFIG.storage.maxImageSizeMB}MB.`;
};

export const getImageTypeErrorMessage = (): string => {
  const supportedTypes = APP_CONFIG.storage.supportedImageTypes
    .map(type => type.split('/')[1].toUpperCase())
    .join(', ');
  return `Only ${supportedTypes} files are accepted.`;
};

// Development helpers
export const isDevelopment = ENV === 'development';
export const isStaging = ENV === 'staging';
export const isProduction = ENV === 'production';

// Export current networks for easy access
export const CURRENT_CHAIN = CURRENT_EVM_NETWORK;

// Export current contract deployment for easy access
export const CURRENT_CONTRACT = contractDeployment; 