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
      icon TEXT,
      type TEXT DEFAULT 'main'
    );
  `);
  
  try {
    await database.execAsync(`ALTER TABLE Ingredients ADD COLUMN type TEXT DEFAULT 'main';`);
  } catch (e) {
    // Bỏ qua nếu cột type đã tồn tại
  }

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

  // B-Tree Index (Inverted Index) cho tìm kiếm ngược từ ingredient -> food siêu nhanh
  await database.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_ingredient_food ON Food_Ingredients(ingredient_id);
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
        'INSERT OR IGNORE INTO Ingredients (id, name, icon, type) VALUES (?, ?, ?, ?);',
        [ing.id, ing.name, ing.icon, ing.type]
      );
      // Cập nhật lại type cho các record đã tồn tại
      await database.runAsync(
        'UPDATE Ingredients SET type = ? WHERE id = ?;',
        [ing.type, ing.id]
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

// ─── Truy vấn dữ liệu Tủ Lạnh (B-Tree Optimized) ──────────────────────────────
/**
 * Lấy danh sách đồ ăn dựa trên danh sách nguyên liệu đã chọn.
 * Logic: Ưu tiên các món có chứa nhiều nguyên liệu trùng khớp nhất lên đầu.
 */
export const getFoodsByIngredients = async (ingredientIds: string[]): Promise<any[]> => {
  if (!ingredientIds || ingredientIds.length === 0) return [];
  
  const db = await getDb();
  
  // Tạo mảng params gấp đôi vì ta dùng placeholder 2 lần trong câu SQL
  const placeholders = ingredientIds.map(() => '?').join(',');
  const params = [...ingredientIds, ...ingredientIds];
  
  // Thuật toán đếm giao thoa linh hoạt bỏ qua gia vị
  const query = `
    SELECT f.*,
           -- Đếm số nguyên liệu thiết yếu/đặc thù (main, rare) bị thiếu
           SUM(CASE WHEN i.type IN ('main', 'rare') 
                    AND fi.ingredient_id NOT IN (${placeholders}) THEN 1 ELSE 0 END) as missing_critical_count,
           
           -- Đếm tổng số nguyên liệu user đang có trùng với món ăn
           SUM(CASE WHEN fi.ingredient_id IN (${placeholders}) THEN 1 ELSE 0 END) as matched_count,
           
           (SELECT COUNT(*) FROM Food_Ingredients WHERE food_id = f.id) as total_ingredients
           
    FROM Foods f
    INNER JOIN Food_Ingredients fi ON f.id = fi.food_id
    INNER JOIN Ingredients i ON fi.ingredient_id = i.id
    GROUP BY f.id
    HAVING matched_count > 0 
    ORDER BY missing_critical_count ASC, matched_count DESC, f.name ASC
  `;
  
  return await db.getAllAsync(query, params);
};
