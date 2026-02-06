/**
 * Wallet Storage Layer
 *
 * Stores and retrieves per-user wallet data
 * Currently uses file-based storage (can migrate to MongoDB later)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { WalletData } from '@coinbase/coinbase-sdk';

export interface UserWalletRecord {
  userId: string;
  walletData: string;  // JSON-stringified WalletData
  walletAddress: string;
  network: string;
  createdAt: string;
  lastUsedAt: string;
}

const STORAGE_DIR = path.join(process.cwd(), '.wallet-storage');
const STORAGE_FILE = path.join(STORAGE_DIR, 'user-wallets.json');

/**
 * Wallet Storage Manager
 */
export class WalletStorage {
  /**
   * Initialize storage directory
   */
  private async ensureStorageExists(): Promise<void> {
    try {
      await fs.access(STORAGE_DIR);
    } catch {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
      await fs.writeFile(STORAGE_FILE, JSON.stringify({}), 'utf-8');
    }
  }

  /**
   * Load all wallet records
   */
  private async loadRecords(): Promise<Record<string, UserWalletRecord>> {
    await this.ensureStorageExists();

    try {
      const content = await fs.readFile(STORAGE_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  /**
   * Save all wallet records
   */
  private async saveRecords(records: Record<string, UserWalletRecord>): Promise<void> {
    await this.ensureStorageExists();
    await fs.writeFile(STORAGE_FILE, JSON.stringify(records, null, 2), 'utf-8');
  }

  /**
   * Get wallet for a specific user
   */
  async getUserWallet(userId: string): Promise<UserWalletRecord | null> {
    const records = await this.loadRecords();
    return records[userId] || null;
  }

  /**
   * Save wallet for a specific user
   */
  async saveUserWallet(
    userId: string,
    walletData: WalletData,
    walletAddress: string,
    network: string
  ): Promise<void> {
    const records = await this.loadRecords();

    const now = new Date().toISOString();

    records[userId] = {
      userId,
      walletData: JSON.stringify(walletData),
      walletAddress,
      network,
      createdAt: records[userId]?.createdAt || now,
      lastUsedAt: now,
    };

    await this.saveRecords(records);
  }

  /**
   * Update last used timestamp
   */
  async updateLastUsed(userId: string): Promise<void> {
    const records = await this.loadRecords();

    if (records[userId]) {
      records[userId].lastUsedAt = new Date().toISOString();
      await this.saveRecords(records);
    }
  }

  /**
   * Delete user wallet (for testing/cleanup)
   */
  async deleteUserWallet(userId: string): Promise<void> {
    const records = await this.loadRecords();
    delete records[userId];
    await this.saveRecords(records);
  }

  /**
   * List all users with wallets
   */
  async listUsers(): Promise<string[]> {
    const records = await this.loadRecords();
    return Object.keys(records);
  }

  /**
   * Get wallet count
   */
  async getWalletCount(): Promise<number> {
    const records = await this.loadRecords();
    return Object.keys(records).length;
  }
}

/**
 * Singleton instance
 */
export const walletStorage = new WalletStorage();
