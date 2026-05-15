const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const seedData = require('./src/database/initial_seed_ctna.json');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadToFirebase() {
  console.log('Starting upload to Firebase...');

  try {
    // Upload foods
    console.log(`Uploading ${seedData.foods.length} foods...`);
    const foodsBatch = db.batch();
    const foodsCollection = db.collection('foods');

    for (const food of seedData.foods) {
      const docRef = foodsCollection.doc(food.id);
      foodsBatch.set(docRef, food);
    }

    await foodsBatch.commit();
    console.log('Foods uploaded successfully!');

    // Upload ingredients
    console.log(`Uploading ${seedData.ingredients.length} ingredients...`);
    const ingredientsBatch = db.batch();
    const ingredientsCollection = db.collection('ingredients');

    for (const ingredient of seedData.ingredients) {
      const docRef = ingredientsCollection.doc(ingredient.id);
      ingredientsBatch.set(docRef, ingredient);
    }

    await ingredientsBatch.commit();
    console.log('Ingredients uploaded successfully!');

    // Upload food_ingredients
    console.log(`Uploading ${seedData.food_ingredients.length} food-ingredient links...`);
    const linksBatch = db.batch();
    const linksCollection = db.collection('food_ingredients');

    for (const link of seedData.food_ingredients) {
      const docRef = linksCollection.doc(`${link.food_id}_${link.ingredient_id}`);
      linksBatch.set(docRef, link);
    }

    await linksBatch.commit();
    console.log('Food-ingredient links uploaded successfully!');

    console.log('All data uploaded to Firebase successfully!');
  } catch (error) {
    console.error('Error uploading to Firebase:', error);
    process.exit(1);
  }
}

uploadToFirebase().then(() => {
  process.exit(0);
});
