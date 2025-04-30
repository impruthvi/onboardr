import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    Signer,
    TransactionConfirmationStatus,
} from '@solana/web3.js';
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
} from '@solana/spl-token';

// Define wallet interface for use with browser wallets
interface Wallet {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

// Type definitions for response objects
interface AirdropResponse {
    success: boolean;
    signature?: string;
    amount?: number;
    error?: string;
}

interface TransactionResponse {
    success: boolean;
    signature?: string;
    amount?: number;
    error?: string;
}

interface TokenResponse {
    success: boolean;
    tokenMint?: string;
    tokenAccount?: string;
    name?: string;
    symbol?: string;
    decimals?: number;
    initialSupply?: number;
    error?: string;
}

interface TransactionHistoryItem {
    signature: string;
    blockTime: number | null;
    slot: number;
    confirmationStatus: TransactionConfirmationStatus | null;
    memo: string;
    amount: number;
}

/**
 * Request an airdrop of SOL to a wallet address
 * @param {string} walletAddress - The public key of the wallet
 * @param {number} amount - Amount of SOL to request (default: 2)
 * @returns {Promise<AirdropResponse>} - Transaction details
 */
export async function requestAirdrop(walletAddress: string, amount: number = 2): Promise<AirdropResponse> {
    try {
        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
        const publicKey = new PublicKey(walletAddress);

        const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
        await connection.confirmTransaction(signature);

        return {
            success: true,
            signature,
            amount
        };
    } catch (error) {
        console.error('Error requesting airdrop:', error);
        return {
            success: false,
            error: (error as Error).message
        };
    }
}

/**
 * Get the SOL balance of a wallet
 * @param {string} walletAddress - The public key of the wallet
 * @returns {Promise<number>} - Balance in SOL
 */
export async function getWalletBalance(walletAddress: string): Promise<number> {
    try {
        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
        const publicKey = new PublicKey(walletAddress);

        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (error) {
        console.error('Error getting balance:', error);
        return 0;
    }
}

/**
 * Send SOL from one wallet to another
 * @param {Wallet} wallet - The wallet object with signTransaction method
 * @param {string} toAddress - Recipient wallet address
 * @param {number} amount - Amount of SOL to send
 * @returns {Promise<TransactionResponse>} - Transaction details
 */
export async function sendTransaction(wallet: Wallet, toAddress: string, amount: number): Promise<TransactionResponse> {
    try {
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error('Wallet not connected');
        }

        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
        const recipient = new PublicKey(toAddress);

        // Create a transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: recipient,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );

        // Get the latest blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;

        // Sign the transaction
        const signedTransaction = await wallet.signTransaction(transaction);

        // Send the transaction
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction(signature);

        return {
            success: true,
            signature,
            amount
        };
    } catch (error) {
        console.error('Error sending transaction:', error);
        return {
            success: false,
            error: (error as Error).message
        };
    }
}

/**
 * Create a new token using SPL Token Extensions
 * @param {Wallet} wallet - The wallet object with signTransaction method
 * @param {string} name - Token name
 * @param {string} symbol - Token symbol
 * @param {number} decimals - Number of decimals for the token
 * @param {number} initialSupply - Initial supply of tokens to mint
 * @returns {Promise<TokenResponse>} - Token details
 */
export async function createToken(
    wallet: Wallet,
    name: string,
    symbol: string,
    decimals: number = 9,
    initialSupply: number
): Promise<TokenResponse> {
    try {
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error('Wallet not connected');
        }

        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');

        // Create a new token mint
        const mintAuthority = wallet.publicKey;
        const freezeAuthority = wallet.publicKey;

        // Create the token
        const tokenMint = await createMint(
            connection,
            wallet as unknown as Signer,  // Type assertion for compatibility
            mintAuthority,
            freezeAuthority,
            decimals
        );

        // Get the token account
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet as unknown as Signer,  // Type assertion for compatibility
            tokenMint,
            wallet.publicKey
        );

        // Mint tokens to the token account
        await mintTo(
            connection,
            wallet as unknown as Signer,  // Type assertion for compatibility
            tokenMint,
            tokenAccount.address,
            mintAuthority,
            initialSupply * (10 ** decimals)
        );

        return {
            success: true,
            tokenMint: tokenMint.toBase58(),
            tokenAccount: tokenAccount.address.toBase58(),
            name,
            symbol,
            decimals,
            initialSupply
        };
    } catch (error) {
        console.error('Error creating token:', error);
        return {
            success: false,
            error: (error as Error).message
        };
    }
}

/**
 * Get transaction history for a wallet
 * @param {string} walletAddress - The public key of the wallet
 * @param {number} limit - Maximum number of transactions to return
 * @returns {Promise<TransactionHistoryItem[]>} - Array of transactions
 */
export async function getTransactionHistory(walletAddress: string, limit: number = 10): Promise<TransactionHistoryItem[]> {
    try {
        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
        const publicKey = new PublicKey(walletAddress);

        const signatures = await connection.getSignaturesForAddress(publicKey, { limit });

        const transactions = await Promise.all(
            signatures.map(async (sig) => {
                const tx = await connection.getTransaction(sig.signature);
                return {
                    signature: sig.signature,
                    blockTime: sig.blockTime ?? null,
                    slot: sig.slot,
                    confirmationStatus: sig.confirmationStatus ?? null,
                    memo: tx?.meta?.logMessages?.find((log: string) => log.includes('Program log:')) || '',
                    amount: tx?.meta ? (tx.meta.postBalances[0] - tx.meta.preBalances[0]) : 0,
                };
            })
        );

        return transactions;
    } catch (error) {
        console.error('Error getting transaction history:', error);
        return [];
    }
}

/**
 * Format a public key for display (shortened with ellipsis)
 * @param {string} publicKey - The public key to format
 * @param {number} length - Number of characters to show at start and end
 * @returns {string} - Formatted public key
 */
export function formatPublicKey(publicKey: string | null | undefined, length: number = 4): string {
    if (!publicKey) return '';
    return `${publicKey.slice(0, length)}...${publicKey.slice(-length)}`;
}

/**
 * Format a lamport amount to SOL
 * @param {number} lamports - Lamports amount
 * @returns {string} - Formatted SOL amount
 */
export function formatSol(lamports: number): string {
    return (lamports / LAMPORTS_PER_SOL).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 9,
    });
}