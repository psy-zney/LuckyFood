import * as SQLite from 'expo-sqlite';
import {
  MOCK_FOODS,
  MOCK_INGREDIENTS,
  MOCK_FOOD_INGREDIENTS,
} from './mockData';

// ─── Singleton DB ─────────────────────────────────────────────────────────────
let db: SQLite.SQLiteDatabase | null = null;

export const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('luckyfood.db');
  return db;
};

// ─── Khởi tạo các bảng ───────────────────────────────────────────────────────
export const initDatabase = async (): Promise<void> => {
  const database = await getDb();

  // Kích hoạt khóa ngoại
  await database.execAsync('PRAGMA foreign_keys = ON;');

  // Bảng Foods
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS Foods (
      id          TEXT    PRIMARY KEY NOT NULL,
      name        TEXT    NOT NULL,
      description TEXT,
      imageUrl    TEXT,
      category    TEXT,
      prepTime    INTEGER
    );
  `);

  // Bảng Ingredients
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS Ingredients (
      id   TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon TEXT
    );
  `);

  // Bảng trung gian Food_Ingredients (many-to-many)
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS Food_Ingredients (
      food_id       TEXT NOT NULL,
      ingredient_id TEXT NOT NULL,
      PRIMARY KEY (food_id, ingredient_id),
      FOREIGN KEY (food_id)       REFERENCES Foods(id)       ON DELETE CASCADE,
      FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id) ON DELETE CASCADE
    );
  `);

  console.log('[DB] Tables created / already exist.');
};

// ─── Seed Mock Data ───────────────────────────────────────────────────────────
/**
 * Nạp dữ liệu mẫu vào SQLite.
 * Sử dụng INSERT OR IGNORE để không bị lỗi nếu chạy lại nhiều lần.
 */
export const seedDatabase = async (): Promise<void> => {
  const database = await getDb();

  await database.withTransactionAsync(async () => {
    // Seed Ingredients
    for (const ing of MOCK_INGREDIENTS) {
      await database.runAsync(
        'INSERT OR IGNORE INTO Ingredients (id, name, icon) VALUES (?, ?, ?);',
        [ing.id, ing.name, ing.icon]
      );
    }

    // Seed Foods
    for (const food of MOCK_FOODS) {
      await database.runAsync(
        `INSERT OR IGNORE INTO Foods
          (id, name, description, imageUrl, category, prepTime)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [food.id, food.name, food.description, food.imageUrl, food.category, food.prepTime]
      );
    }

    // Seed Food_Ingredients
    for (const link of MOCK_FOOD_INGREDIENTS) {
      await database.runAsync(
        'INSERT OR IGNORE INTO Food_Ingredients (food_id, ingredient_id) VALUES (?, ?);',
        [link.food_id, link.ingredient_id]
      );
    }
  });

  console.log('[DB] Seed data loaded successfully.');
};

// ─── Bootstrap (gọi 1 lần từ App.tsx) ───────────────────────────────────────
/**
 * Hàm duy nhất cần gọi khi app khởi động.
 * Nếu isFirstLaunch = true thì sẽ seed mock data sau khi init.
 */
export const bootstrapDatabase = async (isFirstLaunch: boolean): Promise<void> => {
  try {
    await initDatabase();
    if (isFirstLaunch) {
      await seedDatabase();
    }
  } catch (error) {
    console.error('[DB] Bootstrap failed:', error);
    throw error;
  }
};
