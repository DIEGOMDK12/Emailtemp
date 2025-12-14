import { type Email, type InsertEmail, type TempAddress } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createTempAddress(): TempAddress;
  getTempAddress(address: string): TempAddress | undefined;
  isAddressValid(address: string): boolean;
  addEmail(email: InsertEmail): Email;
  getEmails(address: string): Email[];
  getEmail(address: string, id: string): Email | undefined;
  markAsRead(address: string, id: string): Email | undefined;
  deleteEmail(address: string, id: string): boolean;
  cleanupExpired(): void;
}

const EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export class MemStorage implements IStorage {
  private addresses: Map<string, TempAddress>;
  private emails: Map<string, Email[]>;

  constructor() {
    this.addresses = new Map();
    this.emails = new Map();

    setInterval(() => this.cleanupExpired(), 60000);
  }

  createTempAddress(): TempAddress {
    const address = `${generateRandomString(10)}@tempmail.io`;
    const now = new Date();
    const tempAddress: TempAddress = {
      address,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + EXPIRATION_TIME).toISOString(),
    };
    this.addresses.set(address, tempAddress);
    this.emails.set(address, []);
    return tempAddress;
  }

  getTempAddress(address: string): TempAddress | undefined {
    return this.addresses.get(address);
  }

  isAddressValid(address: string): boolean {
    const tempAddress = this.addresses.get(address);
    if (!tempAddress) return false;
    return new Date(tempAddress.expiresAt) > new Date();
  }

  addEmail(email: InsertEmail): Email {
    const newEmail: Email = {
      ...email,
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    const existingEmails = this.emails.get(email.to) || [];
    existingEmails.unshift(newEmail);
    this.emails.set(email.to, existingEmails);

    return newEmail;
  }

  getEmails(address: string): Email[] {
    return this.emails.get(address) || [];
  }

  getEmail(address: string, id: string): Email | undefined {
    const emails = this.emails.get(address) || [];
    return emails.find((e) => e.id === id);
  }

  markAsRead(address: string, id: string): Email | undefined {
    const emails = this.emails.get(address) || [];
    const email = emails.find((e) => e.id === id);
    if (email) {
      email.isRead = true;
    }
    return email;
  }

  deleteEmail(address: string, id: string): boolean {
    const emails = this.emails.get(address) || [];
    const index = emails.findIndex((e) => e.id === id);
    if (index !== -1) {
      emails.splice(index, 1);
      return true;
    }
    return false;
  }

  cleanupExpired(): void {
    const now = new Date();
    for (const [address, tempAddress] of this.addresses.entries()) {
      if (new Date(tempAddress.expiresAt) <= now) {
        this.addresses.delete(address);
        this.emails.delete(address);
      }
    }
  }
}

export const storage = new MemStorage();
