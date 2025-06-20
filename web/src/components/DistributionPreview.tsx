"use client";

import Image from "next/image";
import { useState } from "react";

interface DistributionData {
  recipients: string[];
  tokenIds: string[];
  amounts: string[];
}

interface SelectedNFT {
  tokenId: string;
  cid: string;
  supply: number;
  balance: number;
  amountToDistribute: number;
  imageUrl?: string;
}

interface DistributionPreviewProps {
  selectedNFT: SelectedNFT | null;
  distributionData: DistributionData | null;
  distributionMode: 'single-nft' | 'custom';
  onDistribute: () => void;
  isLoading: boolean;
}

export default function DistributionPreview({
  selectedNFT,
  distributionData,
  distributionMode,
  onDistribute,
  isLoading
}: DistributionPreviewProps) {
  const [showAllRecipients, setShowAllRecipients] = useState(false);

  if (!selectedNFT || !distributionData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300">No distribution data available</p>
      </div>
    );
  }

  const totalRecipients = distributionData.recipients.length;
  const totalNFTs = distributionData.amounts.reduce((sum, amount) => sum + parseInt(amount), 0);
  const maxBatchSize = 100;
  const batchesNeeded = Math.ceil(totalRecipients / maxBatchSize);

  const estimatedGasPerBatch = 2500000; // Rough estimate
  const totalEstimatedGas = estimatedGasPerBatch * batchesNeeded;

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-6">Review Distribution</h3>

      {/* Distribution Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-200">{totalRecipients}</div>
          <div className="text-blue-100 text-sm">Recipients</div>
        </div>
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-200">{totalNFTs}</div>
          <div className="text-green-100 text-sm">Total NFTs</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-200">{batchesNeeded}</div>
          <div className="text-purple-100 text-sm">Batches Needed</div>
        </div>
        <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-200">~{(totalEstimatedGas / 1000000).toFixed(1)}M</div>
          <div className="text-orange-100 text-sm">Est. Gas</div>
        </div>
      </div>

      {/* NFT Details */}
      {distributionMode === 'single-nft' && (
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">NFT Being Distributed</h4>
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={selectedNFT.imageUrl || '/images/image-example.png'}
                alt="NFT"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/image-example.png';
                }}
              />
            </div>
            <div className="text-white">
              <p className="font-semibold mb-1">Token ID: {selectedNFT.tokenId.slice(0, 16)}...</p>
              <p className="text-sm text-gray-300 mb-1">Amount per recipient: {selectedNFT.amountToDistribute}</p>
              <p className="text-sm text-gray-300 mb-1">Your current balance: {selectedNFT.balance}</p>
              <p className="text-sm text-gray-300">Remaining after distribution: {selectedNFT.balance - totalNFTs}</p>
            </div>
          </div>
        </div>
      )}

      {/* Batch Information */}
      {batchesNeeded > 1 && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-yellow-200 mb-2">⚠️ Multiple Batches Required</h4>
          <div className="text-yellow-100 text-sm space-y-1">
            <p>This distribution will be processed in {batchesNeeded} separate transactions due to the 100-recipient batch limit.</p>
            <p>Each batch will require a separate transaction and gas fee.</p>
            <p>The process will be automatic, but please don&apos;t close this window until all batches are complete.</p>
          </div>
        </div>
      )}

      {/* Recipients List */}
      <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">Recipients ({totalRecipients})</h4>
          {totalRecipients > 5 && (
            <button
              onClick={() => setShowAllRecipients(!showAllRecipients)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {showAllRecipients ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {(showAllRecipients ? distributionData.recipients : distributionData.recipients.slice(0, 5))
            .map((recipient, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-700/50 rounded">
                <div className="text-white font-mono text-sm">
                  {recipient.slice(0, 6)}...{recipient.slice(-4)}
                </div>
                <div className="text-gray-300 text-sm">
                  {distributionData.amounts[index]} NFT{parseInt(distributionData.amounts[index]) > 1 ? 's' : ''}
                </div>
              </div>
            ))}
          
          {!showAllRecipients && totalRecipients > 5 && (
            <div className="text-center py-2 text-gray-400 text-sm">
              ... and {totalRecipients - 5} more recipients
            </div>
          )}
        </div>
      </div>

      {/* Gas Estimation */}
      <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">Gas Estimation</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-300 mb-1">Gas per batch:</p>
            <p className="text-white font-semibold">~{(estimatedGasPerBatch / 1000000).toFixed(1)}M gas</p>
          </div>
          <div>
            <p className="text-gray-300 mb-1">Total batches:</p>
            <p className="text-white font-semibold">{batchesNeeded}</p>
          </div>
          <div>
            <p className="text-gray-300 mb-1">Total estimated gas:</p>
            <p className="text-white font-semibold">~{(totalEstimatedGas / 1000000).toFixed(1)}M gas</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          * Gas estimates are approximate. Actual costs may vary based on network conditions.
        </p>
      </div>

      {/* Confirmation */}
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-red-200 mb-2">⚠️ Important Notice</h4>
        <div className="text-red-100 text-sm space-y-1">
          <p>• This action cannot be undone once started</p>
          <p>• Make sure all recipient addresses are correct</p>
          <p>• Ensure you have sufficient gas for all batches</p>
          <p>• Don&apos;t close this window during distribution</p>
        </div>
      </div>

      {/* Execute Distribution */}
      <div className="text-center">
        <button
          onClick={onDistribute}
          disabled={isLoading}
          className={`px-8 py-4 rounded-lg font-bold text-lg transition-colors ${
            isLoading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `🚀 Execute Distribution (${totalRecipients} recipients)`
          )}
        </button>
      </div>
    </div>
  );
} 