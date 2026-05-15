const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Ingredient icons with emojis
const ingredientIcons = {
  "ing-1": "🐷",
  "ing-2": "🐄",
  "ing-3": "🐔",
  "ing-4": "🥚",
  "ing-5": "🦐",
  "ing-6": "🐟",
  "ing-7": "🥬",
  "ing-8": "🥕",
  "ing-9": "🥔",
  "ing-10": "🍄",
  "ing-11": "🧈",
  "ing-12": "🍜",
  "ing-13": "🍚",
  "ing-14": "🍝",
  "ing-15": "🧄",
  "ing-16": "🧅",
  "ing-17": "🫚",
  "ing-18": "🌶️"
};

async function updateIngredientIcons() {
  console.log('Updating ingredient icons...');

  try {
    const batch = db.batch();
    const ingredientsCollection = db.collection('ingredients');

    for (const [ingredientId, icon] of Object.entries(ingredientIcons)) {
      const docRef = ingredientsCollection.doc(ingredientId);
      batch.update(docRef, { icon });
    }

    await batch.commit();
    console.log(`Updated ${Object.keys(ingredientIcons).length} ingredient icons!`);
  } catch (error) {
    console.error('Error updating icons:', error);
    process.exit(1);
  }
}

updateIngredientIcons().then(() => {
  process.exit(0);
});
