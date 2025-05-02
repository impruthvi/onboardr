import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    Signer,
    TransactionConfirmationStatus,
    clusterApiUrl,
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
interface BaseResponse {
    success: boolean;
    error?: string;
}

interface AirdropResponse extends BaseResponse {
    signature?: string;
    amount?: number;
    newBalance?: number;
}

interface TransactionResponse extends BaseResponse {
    signature?: string;
    amount?: number;
}

interface TokenResponse extends BaseResponse {
    tokenMint?: string;
    tokenAccount?: string;
    name?: string;
    symbol?: string;
    decimals?: number;
    initialSupply?: number;
}

interface TransactionHistoryItem {
    signature: string;
    blockTime: number | null;
    slot: number;
    confirmationStatus: TransactionConfirmationStatus | null;
    memo: string;
    amount: number;
}

// Create a singleton connection to reuse
const getConnection = (() => {
    let connection: Connection | null = null;
    return () => {
        if (!connection) {
            // Use environment variable if available, fallback to devnet
            const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet');

            // Create connection with extended timeout config
            connection = new Connection(rpcUrl, {
                commitment: 'confirmed',
                confirmTransactionInitialTimeout: 60000, // 60 seconds initial timeout
            });

            console.log(`Solana connection created with RPC URL: ${rpcUrl}`);
        }
        return connection;
    };
})();

/**
 * Request an airdrop of SOL to a wallet address with improved error handling and retry logic
 * @param {string} walletAddress - The public key of the wallet
 * @param {number} amount - Amount of SOL to request (default: 0.05)
 * @returns {Promise<AirdropResponse>} - Transaction details
 */
export async function requestAirdrop(walletAddress: string, amount: number = 0.05): Promise<AirdropResponse> {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);
    const lamports = amount * LAMPORTS_PER_SOL;

    // Increase timeout for confirmation
    const MAX_RETRIES = 1;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Requesting airdrop attempt ${attempt}/${MAX_RETRIES}...`);

            // Request the airdrop
            const signature = await connection.requestAirdrop(publicKey, lamports);

            // Use the correct confirmation strategy format
            const confirmationResponse = await connection.confirmTransaction(
                signature,
                'confirmed'
            );

            if (confirmationResponse.value.err) {
                throw new Error(`Transaction failed: ${confirmationResponse.value.err}`);
            }

            console.log(`Airdrop successful! Signature: ${signature}`);

            // Verify balance increase to be extra sure
            await new Promise(resolve => setTimeout(resolve, 2000)); // Short delay
            const balance = await connection.getBalance(publicKey);

            return {
                success: true,
                signature,
                amount,
                newBalance: balance / LAMPORTS_PER_SOL
            };
        } catch (error) {
            console.warn(`Airdrop attempt ${attempt} failed:`, error);

            if (attempt === MAX_RETRIES) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : String(error)
                };
            }

            // Wait before retrying with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
    }

    // This should never be reached due to the return in the catch block on final attempt
    return {
        success: false,
        error: "Failed to complete airdrop after all retry attempts"
    };
}


/**
 * Get the SOL balance of a wallet
 * @param {string} walletAddress - The public key of the wallet
 * @returns {Promise<number>} - Balance in SOL
 */
export async function getWalletBalance(walletAddress: string): Promise<number> {
    try {
        const connection = getConnection();
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
    if (!wallet.publicKey || !wallet.signTransaction) {
        return {
            success: false,
            error: 'Wallet not connected'
        };
    }

    try {
        const connection = getConnection();
        const recipient = new PublicKey(toAddress);
        const lamports = amount * LAMPORTS_PER_SOL;

        // Create a transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: recipient,
                lamports,
            })
        );

        // Get the latest blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;

        // Sign and send the transaction
        const signedTransaction = await wallet.signTransaction(transaction);
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
            error: error instanceof Error ? error.message : String(error)
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
    if (!wallet.publicKey || !wallet.signTransaction) {
        return {
            success: false,
            error: 'Wallet not connected'
        };
    }

    try {
        const connection = getConnection();
        const walletAsSigner = wallet as unknown as Signer;  // Type assertion for compatibility

        // Create a new token mint
        const tokenMint = await createMint(
            connection,
            walletAsSigner,
            wallet.publicKey,  // mintAuthority
            wallet.publicKey,  // freezeAuthority
            decimals
        );

        // Get the token account
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            walletAsSigner,
            tokenMint,
            wallet.publicKey
        );

        // Mint tokens to the token account
        await mintTo(
            connection,
            walletAsSigner,
            tokenMint,
            tokenAccount.address,
            wallet.publicKey,
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
            error: error instanceof Error ? error.message : String(error)
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
        const connection = getConnection();
        const publicKey = new PublicKey(walletAddress);

        const signatures = await connection.getSignaturesForAddress(publicKey, { limit });

        if (signatures.length === 0) return [];

        // Batch process transactions
        const transactions = await Promise.all(
            signatures.map(async (sig) => {
                const tx = await connection.getTransaction(sig.signature);
                const amount = tx?.meta ?
                    (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / LAMPORTS_PER_SOL :
                    0;

                return {
                    signature: sig.signature,
                    blockTime: sig.blockTime ?? null,
                    slot: sig.slot,
                    confirmationStatus: sig.confirmationStatus ?? null,
                    memo: tx?.meta?.logMessages?.find((log: string) => log.includes('Program log:')) || '',
                    amount,
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
    if (!publicKey || publicKey.length < (length * 2)) return '';
    return `${publicKey.slice(0, length)}...${publicKey.slice(-length)}`;
}

/**
 * Format a SOL amount with appropriate precision
 * @param {number} sol - SOL amount
 * @returns {string} - Formatted SOL amount
 */
export function formatSol(sol: number): string {
    return sol.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 9,
    });
}