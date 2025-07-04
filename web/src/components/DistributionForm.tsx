"use client";


import { currentChain } from "@/config/chains";
import { useDistribution } from "@/hooks/useDistribution";
import { useEffect, useState } from "react";
import CSVUploader from "./CSVUploader";
import DistributionPreview from "./DistributionPreview";
import NFTSelector from "./NFTSelector";

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

export default function DistributionForm() {
  const [step, setStep] = useState<'select' | 'upload' | 'preview' | 'executing' | 'success'>('select');
  const [selectedNFT, setSelectedNFT] = useState<SelectedNFT | null>(null);
  const [distributionData, setDistributionData] = useState<DistributionData | null>(null);
  const [distributionMode, setDistributionMode] = useState<'single-nft' | 'custom'>('single-nft');
  
  const { 
    distributeToMany, 
    batchTransfer, 
    isLoading, 
    error, 
    txHash,
    isSuccess,
    resetState
  } = useDistribution();

  // Handle success state
  useEffect(() => {
    if (isSuccess && step === 'executing') {
      setStep('success');
    }
  }, [isSuccess, step]);

  const handleNFTSelected = (nft: SelectedNFT) => {
    setSelectedNFT(nft);
    setStep('upload');
  };

  const handleCSVUploaded = (data: DistributionData) => {
    setDistributionData(data);
    setStep('preview');
  };

  const handleDistribute = async () => {
    if (!selectedNFT || !distributionData) return;
    
    setStep('executing');
    
    try {
      if (distributionMode === 'single-nft') {
        // Use distributeToMany for same NFT to multiple recipients
        const amounts = distributionData.recipients.map(() => "1"); // 1 NFT per recipient
        await distributeToMany(selectedNFT.tokenId, distributionData.recipients, amounts);
      } else {
        // Use batchTransfer for custom distributions
        await batchTransfer(distributionData.recipients, distributionData.tokenIds, distributionData.amounts);
      }
      
      // The success step will be set by the useEffect when isSuccess becomes true
    } catch (error) {
      console.error('Distribution failed:', error);
      setStep('preview'); // Go back to preview on error
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'upload':
        setStep('select');
        setSelectedNFT(null);
        break;
      case 'preview':
        setStep('upload');
        setDistributionData(null);
        break;
      case 'executing':
        setStep('preview');
        break;
      case 'success':
        setStep('preview');
        break;
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedNFT(null);
    setDistributionData(null);
    resetState();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step === 'select' ? 'bg-blue-500 text-white' : 
            ['upload', 'preview', 'executing', 'success'].includes(step) ? 'bg-green-500 text-white' : 
            'bg-gray-600 text-gray-300'
          }`}>
            1
          </div>
          <div className="h-px w-12 bg-gray-600"></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step === 'upload' ? 'bg-blue-500 text-white' : 
            ['preview', 'executing', 'success'].includes(step) ? 'bg-green-500 text-white' : 
            'bg-gray-600 text-gray-300'
          }`}>
            2
          </div>
          <div className="h-px w-12 bg-gray-600"></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step === 'preview' ? 'bg-blue-500 text-white' : 
            ['executing', 'success'].includes(step) ? 'bg-green-500 text-white' : 
            'bg-gray-600 text-gray-300'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-16 text-sm">
          <span className={step === 'select' ? 'text-blue-400 font-semibold' : 'text-gray-400'}>
            Select NFT
          </span>
          <span className={step === 'upload' ? 'text-blue-400 font-semibold' : 'text-gray-400'}>
            Upload Recipients
          </span>
          <span className={['preview', 'executing', 'success'].includes(step) ? 'text-blue-400 font-semibold' : 'text-gray-400'}>
            Review & Distribute
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-200 text-sm">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Step Content */}
      {step === 'select' && (
        <NFTSelector 
          onNFTSelected={handleNFTSelected}
          distributionMode={distributionMode}
          onDistributionModeChange={setDistributionMode}
        />
      )}

      {step === 'upload' && (
        <CSVUploader 
          onCSVUploaded={handleCSVUploaded}
          selectedNFT={selectedNFT}
          distributionMode={distributionMode}
        />
      )}

      {step === 'preview' && (
        <DistributionPreview 
          selectedNFT={selectedNFT}
          distributionData={distributionData}
          distributionMode={distributionMode}
          onDistribute={handleDistribute}
          isLoading={isLoading}
        />
      )}

      {step === 'executing' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Processing Distribution...</h3>
          <p className="text-gray-300">
            Please wait while your NFTs are being distributed. This may take a few moments.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Do not close this window or refresh the page.
          </p>
          {txHash && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-blue-200 text-sm">
                Transaction submitted! Waiting for confirmation...
                <a 
                  href={`${currentChain.blockExplorers?.default.url}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline hover:text-blue-100"
                >
                  View transaction
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-12">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-white mb-2">Distribution Successful!</h3>
          <p className="text-gray-300 mb-4">
            Your NFTs have been successfully distributed to all recipients.
          </p>
          {txHash && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-200 text-sm">
                <strong>Transaction confirmed!</strong>
                <a 
                  href={`${currentChain.blockExplorers?.default.url}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline hover:text-green-100"
                >
                  View transaction
                </a>
              </p>
            </div>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
          >
            Start New Distribution
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      {step !== 'select' && step !== 'executing' && step !== 'success' && (
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
} 