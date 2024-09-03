import React, { FC, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, Idl, setProvider, workspace } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from './idl.json';
import axios from 'axios';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from '@solana/spl-token';
import { Buffer } from 'buffer';
import { findMasterEditionPda, findMetadataPda, MPL_TOKEN_METADATA_PROGRAM_ID, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { publicKey } from '@metaplex-foundation/umi';


const programID = new PublicKey('3SP9gfyt5MeBJUSvxiP85Z9neccFb131nk3A2oEfFVKS');

const MintNFT: FC = () => {
  // const { connection } = useConnection();
  // const wallet = useAnchorWallet();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');

  const provider = AnchorProvider.env();
	setProvider(provider);
  const signer = provider;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value);
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      });
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signer || !file || !name || !symbol) {
      console.error('Wallet not connected, no file selected, or name/symbol not provided');
      return;
    }

    try {
      const uri = await uploadToIPFS(file);

      const program = new Program(idl as unknown as Idl, programID, provider);

      const mintKeypair = web3.Keypair.generate();

      const umi = createUmi("https://api.devnet.solana.com")
      .use(walletAdapterIdentity(signer))
      .use(mplTokenMetadata());

      let metadataAccount = findMetadataPda(umi, {
        mint: publicKey(mintKeypair.publicKey),
      })[0];

      let masterEditionAccount = findMasterEditionPda(umi, {
        mint: publicKey(mintKeypair.publicKey),
      })[0];

	const associatedTokenAccount = await getAssociatedTokenAddress(
		mintKeypair.publicKey,
		signer.publicKey
	);

		const tx = await program.methods
			.initNft(name, symbol, uri)
			.accounts({
				signer: provider.publicKey,
				mint: mintKeypair.publicKey,
				associatedTokenAccount,
				metadataAccount,
				masterEditionAccount,
				tokenProgram: TOKEN_PROGRAM_ID,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
				tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
				systemProgram: web3.SystemProgram.programId,
				rent: web3.SYSVAR_RENT_PUBKEY,
			})
			.signers([mintKeypair])
			.rpc();


      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">Mint Your NFT</h1>
        <form onSubmit={handleMint} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Symbol"
            value={symbol}
            onChange={handleSymbolChange}
            className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Mint NFT
          </button>
        </form>
      </div>
    </div>
  );
};

export default MintNFT;

