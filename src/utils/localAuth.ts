export type AccountRole = 'user' | 'admin';

export interface LocalAuthAccount {
  id: string;
  displayName: string;
  email: string;
  password: string;
  role: AccountRole;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const accounts = new Map<string, LocalAuthAccount>([
  [
    'lequangkhanh295@gmail.com',
    {
      id: 'admin-001',
      displayName: 'Admin',
      email: 'lequangkhanh295@gmail.com',
      password: 'zney295',
      role: 'admin',
    },
  ],
  [
    'linhnguyenhq04@gmail.com',
    {
      id: 'user-001',
      displayName: 'linhnguyenhq04',
      email: 'linhnguyenhq04@gmail.com',
      password: 'zney295',
      role: 'user',
    },
  ],
]);

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const isValidEmail = (value: string) => EMAIL_PATTERN.test(normalizeEmail(value));

export const loginLocalAccount = (email: string, password: string): LocalAuthAccount | null => {
  const normalizedEmail = normalizeEmail(email);
  const account = accounts.get(normalizedEmail);
  if (!account || account.password !== password) {
    return null;
  }
  return account;
};

export const registerLocalAccount = ({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}): { ok: true; account: LocalAuthAccount } | { ok: false; message: string } => {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, message: 'Email không hợp lệ.' };
  }

  if (password.length < 6) {
    return { ok: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
  }

  if (accounts.has(normalizedEmail)) {
    return { ok: false, message: 'Email này đã được đăng ký.' };
  }

  const account: LocalAuthAccount = {
    id: `user-${Date.now()}`,
    displayName: displayName.trim() || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    password,
    role: 'user',
  };

  accounts.set(normalizedEmail, account);

  return { ok: true, account };
};

export const getDemoAccounts = () =>
  Array.from(accounts.values()).map((account) => ({
    role: account.role,
    email: account.email,
    password: account.password,
  }));
