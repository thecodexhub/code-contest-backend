import { $Enums } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export class User {
  id?: string;

  username: string;
  email: string;

  @Exclude()
  password: string;

  name?: string;
  role: $Enums.Role;

  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;

  @Exclude()
  isActive: boolean;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  async hashPassword(): Promise<void> {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(this.password, salt, 32)) as Buffer;
    this.password = salt + '.' + hash.toString('hex');
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    const [salt, storedHash] = this.password.split('.');
    const hash = (await scrypt(plainPassword, salt, 32)) as Buffer;
    return storedHash === hash.toString('hex');
  }
}
