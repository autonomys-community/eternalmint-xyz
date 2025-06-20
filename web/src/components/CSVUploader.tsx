"use client";

import { useRef, useState } from "react";
import { isAddress } from "viem";

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
}

interface CSVUploaderProps {
  onCSVUploaded: (data: DistributionData) => void;
  selectedNFT: SelectedNFT | null;
  distributionMode: 'single-nft' | 'custom';
}

export default function CSVUploader({ onCSVUploaded, selectedNFT, distributionMode }: CSVUploaderProps) {
  const [csvData, setCsvData] = useState<string>("");
  const [parsedData, setParsedData] = useState<DistributionData | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvData(content);
      parseCSV(content);
    };
    reader.readAsText(file);
  };

  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    const errors: string[] = [];
    const recipients: string[] = [];
    const tokenIds: string[] = [];
    const amounts: string[] = [];

    if (lines.length === 0) {
      setErrors(['CSV file is empty']);
      setIsValid(false);
      return;
    }

    // Skip header row if it exists
    const startIndex = lines[0].toLowerCase().includes('address') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(',').map(col => col.trim());
      
      if (distributionMode === 'single-nft') {
        // Single NFT mode: only need recipient address
        if (columns.length < 1) {
          errors.push(`Line ${i + 1}: Missing recipient address`);
          continue;
        }

        const address = columns[0];
        if (!isAddress(address)) {
          errors.push(`Line ${i + 1}: Invalid address format: ${address}`);
          continue;
        }

        recipients.push(address);
        tokenIds.push(selectedNFT!.tokenId);
        amounts.push(selectedNFT!.amountToDistribute.toString());
      } else {
        // Custom mode: need address, tokenId, amount
        if (columns.length < 3) {
          errors.push(`Line ${i + 1}: Missing data. Expected: address,tokenId,amount`);
          continue;
        }

        const [address, tokenId, amount] = columns;
        
        if (!isAddress(address)) {
          errors.push(`Line ${i + 1}: Invalid address format: ${address}`);
          continue;
        }

        if (!tokenId || tokenId === '') {
          errors.push(`Line ${i + 1}: Missing token ID`);
          continue;
        }

        const amountNum = parseInt(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
          errors.push(`Line ${i + 1}: Invalid amount: ${amount}`);
          continue;
        }

        recipients.push(address);
        tokenIds.push(tokenId);
        amounts.push(amount);
      }
    }

    // Additional validations
    if (recipients.length === 0) {
      errors.push('No valid recipients found');
    }

    if (recipients.length > 100) {
      errors.push(`Too many recipients (${recipients.length}). Maximum is 100 per batch.`);
    }

    // Check for duplicate addresses
    const uniqueRecipients = new Set(recipients);
    if (uniqueRecipients.size !== recipients.length) {
      errors.push('Duplicate recipient addresses found');
    }

    // For single NFT mode, check if we have enough balance
    if (distributionMode === 'single-nft' && selectedNFT) {
      const totalNeeded = recipients.length * selectedNFT.amountToDistribute;
      if (totalNeeded > selectedNFT.balance) {
        errors.push(`Insufficient balance. Need ${totalNeeded}, have ${selectedNFT.balance}`);
      }
    }

    setErrors(errors);
    
    if (errors.length === 0) {
      const data: DistributionData = { recipients, tokenIds, amounts };
      setParsedData(data);
      setIsValid(true);
    } else {
      setParsedData(null);
      setIsValid(false);
    }
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setCsvData(content);
    if (content.trim()) {
      parseCSV(content);
    } else {
      setParsedData(null);
      setErrors([]);
      setIsValid(false);
    }
  };

  const handleContinue = () => {
    if (parsedData && isValid) {
      onCSVUploaded(parsedData);
    }
  };

  const generateSampleCSV = () => {
    if (distributionMode === 'single-nft') {
      return `address
0x1234567890123456789012345678901234567890
0x2345678901234567890123456789012345678901
0x3456789012345678901234567890123456789012`;
    } else {
      return `address,tokenId,amount
0x1234567890123456789012345678901234567890,123456789,1
0x2345678901234567890123456789012345678901,987654321,2
0x3456789012345678901234567890123456789012,456789123,1`;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Upload Recipients</h3>
        <p className="text-gray-300 text-sm mb-4">
          {distributionMode === 'single-nft' 
            ? `Upload a CSV file with recipient addresses. Each recipient will receive ${selectedNFT?.amountToDistribute} copy of the selected NFT.`
            : 'Upload a CSV file with recipient addresses, token IDs, and amounts for custom distribution.'
          }
        </p>
      </div>

      {/* CSV Format Info */}
      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-200 mb-2">CSV Format Required:</h4>
        {distributionMode === 'single-nft' ? (
          <div>
            <p className="text-blue-100 text-sm mb-2">
              <strong>Single NFT Mode:</strong> One address per line
            </p>
            <code className="block bg-blue-900/50 p-2 rounded text-xs text-blue-100">
              address<br/>
              0x1234...7890<br/>
              0x2345...8901
            </code>
          </div>
        ) : (
          <div>
            <p className="text-blue-100 text-sm mb-2">
              <strong>Custom Mode:</strong> address,tokenId,amount
            </p>
            <code className="block bg-blue-900/50 p-2 rounded text-xs text-blue-100">
              address,tokenId,amount<br/>
              0x1234...7890,123456789,1<br/>
              0x2345...8901,987654321,2
            </code>
          </div>
        )}
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Upload CSV File
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
        />
      </div>

      {/* Manual Entry */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Or paste CSV data manually
        </label>
        <textarea
          value={csvData}
          onChange={handleTextareaChange}
          placeholder={generateSampleCSV()}
          rows={8}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <h4 className="font-semibold text-red-200 mb-2">Validation Errors:</h4>
          <ul className="text-red-100 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Preview */}
      {isValid && parsedData && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
          <h4 className="font-semibold text-green-200 mb-2">✅ Valid CSV Data</h4>
          <div className="text-green-100 text-sm space-y-1">
            <p>• {parsedData.recipients.length} recipients found</p>
            {distributionMode === 'single-nft' ? (
              <p>• Each recipient will receive {selectedNFT?.amountToDistribute} NFT(s)</p>
            ) : (
              <p>• Custom amounts specified for each recipient</p>
            )}
            <p>• Maximum batch size: 100 recipients</p>
          </div>
        </div>
      )}

      {/* Sample Download */}
      <div className="mb-6">
        <button
          onClick={() => {
            const sample = generateSampleCSV();
            const blob = new Blob([sample], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sample-${distributionMode}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="text-blue-400 hover:text-blue-300 text-sm underline"
        >
          📥 Download sample CSV template
        </button>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Preview
        </button>
      </div>
    </div>
  );
} 