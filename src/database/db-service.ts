import * as SQLite from 'expo-sqlite';
import { FoodItem, IngredientItem, FoodIngredientLink } from './mockData';

type SeedPayload = {
  foods: FoodItem[];
  ingredients: IngredientItem[];
  food_ingredients: FoodIngredientLink[];
};

const seedData = require('./initial_seed_ctna.json') as SeedPayload;

let db: SQLite.SQLiteDatabase | null = null;

export const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('luckyfood.db');
  return db;
};

export const initDatabase = async (): Promise<void> => {
  const database = await getDb();

  // SQLite uses UTF-8 by default. Keep pragma explicit for clarity.
  await database.execAsync(`PRAGMA encoding = "UTF-8";`);
  await database.execAsync('PRAGMA foreign_keys = ON;');

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
  } catch {
    // Ignore if column already exists.
  }

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS Food_Ingredients (
      food_id       TEXT NOT NULL,
      ingredient_id TEXT NOT NULL,
      PRIMARY KEY (food_id, ingredient_id),
      FOREIGN KEY (food_id)       REFERENCES Foods(id)       ON DELETE CASCADE,
      FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id) ON DELETE CASCADE
    );
  `);

  await database.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_ingredient_food ON Food_Ingredients(ingredient_id);
  `);
};

export const seedDatabase = async (): Promise<void> => {
  const database = await getDb();

  await database.withTransactionAsync(async () => {
    for (const ing of seedData.ingredients) {
      await database.runAsync(
        'INSERT OR IGNORE INTO Ingredients (id, name, icon, type) VALUES (?, ?, ?, ?);',
        [ing.id, ing.name, ing.icon, ing.type]
      );
      await database.runAsync(
        'UPDATE Ingredients SET type = ? WHERE id = ?;',
        [ing.type, ing.id]
      );
    }

    for (const food of seedData.foods) {
      await database.runAsync(
        `INSERT OR IGNORE INTO Foods
          (id, name, description, imageUrl, category, prepTime)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [food.id, food.name, food.description, food.imageUrl, food.category, food.prepTime]
      );
    }

    for (const link of seedData.food_ingredients) {
      await database.runAsync(
        'INSERT OR IGNORE INTO Food_Ingredients (food_id, ingredient_id) VALUES (?, ?);',
        [link.food_id, link.ingredient_id]
      );
    }
  });
};

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

export const getFoodsByIngredients = async (ingredientIds: string[]): Promise<any[]> => {
  if (!ingredientIds || ingredientIds.length === 0) return [];

  const database = await getDb();
  const placeholders = ingredientIds.map(() => '?').join(',');
  const params = [...ingredientIds, ...ingredientIds];

  const query = `
    SELECT f.*,
           SUM(CASE WHEN i.type IN ('main', 'rare')
                    AND fi.ingredient_id NOT IN (${placeholders}) THEN 1 ELSE 0 END) as missing_critical_count,
           SUM(CASE WHEN fi.ingredient_id IN (${placeholders}) THEN 1 ELSE 0 END) as matched_count,
           (SELECT COUNT(*) FROM Food_Ingredients WHERE food_id = f.id) as total_ingredients
    FROM Foods f
    INNER JOIN Food_Ingredients fi ON f.id = fi.food_id
    INNER JOIN Ingredients i ON fi.ingredient_id = i.id
    GROUP BY f.id
    HAVING matched_count > 0
    ORDER BY missing_critical_count ASC, matched_count DESC, f.name ASC
  `;

  return await database.getAllAsync(query, params);
};
