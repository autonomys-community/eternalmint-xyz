import { currentChain } from '@/config/chains';
import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';

const CONTRACT_ABI = [
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getCID",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getCreator",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "tokenId", type: "uint256" }
    ],
    name: "canUserDistribute",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserTokens",
    outputs: [
      { name: "ownedTokenIds", type: "uint256[]" },
      { name: "ownedBalances", type: "uint256[]" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

// 1. Define allowed contract methods
export type ContractMethod =
  | 'getCID'
  | 'getSupply'
  | 'getCreator'
  | 'canUserDistribute'
  | 'getUserTokens';

const allowedMethods: ContractMethod[] = [
  'getCID',
  'getSupply',
  'getCreator',
  'canUserDistribute',
  'getUserTokens',
];

export async function POST(request: NextRequest) {
  try {
    const { method, args } = await request.json();

    // 2. Validate user input
    if (!allowedMethods.includes(method)) {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      return NextResponse.json(
        { error: 'Contract address not configured' },
        { status: 500 }
      );
    }

    // Create public client
    const client = createPublicClient({
      chain: currentChain,
      transport: http()
    });

    let processedArgs;
    
    // Handle different argument types based on the method
    if (method === 'canUserDistribute') {
      // For canUserDistribute, first arg is address, second is tokenId (BigInt)
      processedArgs = [args[0] as `0x${string}`, BigInt(args[1])];
    } else if (method === 'getUserTokens') {
      // For getUserTokens, first arg is address
      processedArgs = [args[0] as `0x${string}`];
    } else {
      // For other methods, convert all args to BigInt (for tokenId parameters)
      processedArgs = args.map((arg: string) => BigInt(arg));
    }

    // Make the contract call
    const result = await client.readContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: method as ContractMethod,
      args: processedArgs
    });

    // Handle different result types
    if (method === 'getUserTokens') {
      // getUserTokens returns arrays with BigInt values, convert to strings
      const [ownedTokenIds, ownedBalances] = result as [bigint[], bigint[]];
      const stringTokenIds = ownedTokenIds.map(id => id.toString());
      const stringBalances = ownedBalances.map(balance => balance.toString());
      return NextResponse.json({ 
        result: [stringTokenIds, stringBalances] 
      });
    } else {
      // Convert other results to string for consistent handling
      const stringResult = String(result);
      return NextResponse.json({ result: stringResult });
    }
  } catch (error) {
    console.error('Contract call error:', error);
    return NextResponse.json(
      { error: 'Contract call failed' },
      { status: 500 }
    );
  }
} 