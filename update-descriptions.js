const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Real Vietnamese descriptions for foods
const foodDescriptions = {
  "food-001": "Thịt kho nước dừa là món ăn truyền thống miền Nam, thịt ba chỉ kho mềm ngọt, nước dừa tạo nên hương vị đậm đà đặc trưng.",
  "food-002": "Cua rang me chua - cua đồng tươi ngon rang với me chua, tạo nên vị chua ngọt hài hòa, thịt cua chắc, thơm.",
  "food-003": "Cá cuốn thịt nấm - cá lóc tươi cuốn với thịt heo và nấm hương, chấm nước mắm gừng, vị thanh mát.",
  "food-004": "Gỏi mít tôm thịt - mít non giòn dai kết hợp với tôm, thịt heo, rau thơm, chấm nước mắm me.",
  "food-005": "Thịt đông - món ăn truyền thống dịp Tết, thịt heo, mộc nhĩ, trứng gà đông lại thành thạch trong veo, vị ngọt thanh.",
  "food-006": "Cua bảy xào gừng hành - cua đồng xào với gừng tươi và hành tây, thơm nồng, vị cay nhẹ.",
  "food-007": "Nem hải sản - vỏ bánh giòn rụm nhân tôm, cua, thịt heo, rau thơm, chấm nước mắm ớt.",
  "food-008": "Cơm thập cẩm - cơm dẻo ăn kèm nhiều loại topping: thịt kho, trứng, chả, rau củ, đầy đủ dinh dưỡng.",
  "food-009": "Nem cá - cá lóc xay nhuyễn trộn với thịt heo, bún, rau thơm, cuốn bánh tráng chiên giòn.",
  "food-010": "Ốc len xào dừa - ốc xào với nước dừa, dừa khô, sả, ớt, vị cay ngọt, thịt ốc giòn.",
  "food-011": "Lẩu hải sản - nước dùng thanh ngọt từ xương ống, ăn kèm tôm, cua, cá, mực, rau củ tươi.",
  "food-012": "Canh gà chiên nước mắm - gà chiên vàng nấu với nước mắm, đường, tạo vị mặn ngọt đậm đà.",
  "food-013": "Cá bốn tôm rượu bò lồ - cá đồng kho với rượu bò lồ, vị thơm nồng, thịt cá chắc.",
  "food-014": "Cá nấu dầm - cá đồng nấu với cà chua, dứa, khế chua, vị chua ngọt thanh mát.",
  "food-015": "Bò cuốn lá cải - thịt bò mềm cuốn với lá cải xanh, chấm nước mắm gừng, vị thanh mát.",
  "food-016": "Canh sườn chua - sườn heo hầm với khế chua, cà chua, dứa, vị chua ngọt thanh.",
  "food-017": "Cá sốt hấp trứng - cá đồng hấp với trứng gà, sốt cà chua, vị ngọt béo.",
  "food-018": "Chả cá - cá lóc xay nhuyễn trộn với gia vị, chiên vàng, ăn kèm bún, rau thơm.",
  "food-019": "Tổ chim - món ăn quý hiếm, tổ yến hầm với đường phèn, bổ dưỡng, vị ngọt thanh.",
  "food-020": "Cơm chay - cơm ăn kèm các món chay: đậu hũ, rau củ, nấm, thanh mát, tốt cho sức khỏe.",
  "food-021": "Tôm chiên khoai - tôm tươi chiên với khoai lang, vị ngọt béo, tôm giòn, khoai mềm.",
  "food-022": "Ngô xào tôm - ngô non xào với tôm, cà rốt, đậu que, vị ngọt thanh, giòn.",
  "food-023": "Canh hen nấu chua - hen xào nấu chua với cà chua, khế, vị chua ngọt, thanh mát.",
  "food-024": "Bò sốt gan - thịt bò mềm nấu với gan heo, sốt đậm đà, vị béo ngọt.",
  "food-025": "Kim tiền kê - món ăn truyền thống, thịt heo, trứng, rau củ nấu chung, vị ngọt thanh.",
  "food-026": "Thịt bò xào củ sen - thịt bò mềm xào với củ sen giòn, vị ngọt thanh, giòn.",
  "food-027": "Bò ngũ vị - thịt bò nấu với 5 loại gia vị: mắm, đường, dấm, rượu, ớt, vị đậm đà.",
  "food-028": "Chả giò mini - chả giò nhỏ, nhân thịt, bún, rau thơm, chiên giòn, chấm nước mắm.",
  "food-029": "Cá bao xoài tẩm bột rán - cá đồng tẩm bột chiên giòn, ăn kèm xoài chua, vị chua ngọt.",
  "food-030": "Mực hấp gừng - mực tươi hấp với gừng, hành tây, vị ngọt thanh, thơm.",
  "food-031": "Mực chiên giòn - mực tẩm bột chiên giòn, ăn kèm nước mắm ớt, vị đậm đà.",
  "food-032": "Khoai tây chiên giòn - khoai tây cắt lát chiên vàng, giòn, ăn kèm muối ớt.",
  "food-033": "Mực trộn bông cải - mực luộc trộn với bông cải, rau thơm, nước mắm me, vị thanh mát.",
  "food-034": "Cá mú chung kỳ lân - cá mú nấu với kỳ lân, vị ngọt thanh, thịt cá chắc.",
  "food-035": "Tôm tẩm bột - tôm tươi tẩm bột chiên giòn, ăn kèm nước mắm ớt.",
  "food-036": "Mực xào sả ớt - mực xào với sả, ớt, vị cay nồng, thơm.",
  "food-037": "Tôm hùm luộc - tôm hùm tươi luộc, ăn kèm nước mắm gừng, vị ngọt thanh.",
  "food-038": "Mực ngũ vị - mực nấu với 5 loại gia vị, vị đậm đà, thơm.",
  "food-039": "Cá hồi sốt chua ngọt - cá hồi nấu với sốt chua ngọt, vị chua ngọt, thịt cá mềm.",
  "food-040": "Mực nướng tỏi ớt - mực nướng với tỏi, ớt, vị cay nồng, thơm.",
  "food-041": "Mực hoa cúc - mực cắt hoa cúc chiên giòn, vị giòn, thơm.",
  "food-042": "Thịt ba rọi cuốn cá hồi nướng - thịt ba rọi cuốn với cá hồi nướng, vị béo ngọt.",
  "food-043": "Trứng cút bao quan - trứng cút luộc, bóc vỏ, ăn kèm nước mắm gừng.",
  "food-044": "Hoa ngư sắc - món ăn truyền thống, vị ngọt thanh, bổ dưỡng.",
  "food-045": "Cá hồi nhồi khoai tây - cá hồi nhồi khoai tây, nướng, vị béo ngọt.",
  "food-046": "Gỏi bưởi chay - bưởi tươi trộn với rau củ, đậu hũ, nước mắm me, vị thanh mát.",
  "food-047": "Rau xào thập cẩm - nhiều loại rau xào với thịt, tôm, vị ngọt thanh.",
  "food-048": "Cá hồi xào cải thìa - cá hồi xào với cải thìa, vị ngọt thanh.",
  "food-049": "Mì xào giòn - mì tôm chiên giòn, ăn kèm rau củ, vị giòn, thơm.",
  "food-050": "Sake chiên giòn - cá hồi tẩm bột chiên giòn, vị giòn, thơm.",
  "food-051": "Rau sốt cay - rau củ nấu với sốt cay, vị cay nồng.",
  "food-052": "Chả nướng chay - chả làm từ đậu hũ, nấm, rau củ, nướng, vị thanh mát.",
  "food-053": "Cá tím chiên - cá tím chiên vàng, ăn kèm nước mắm ớt.",
  "food-054": "Bún xào chay - bún xào với rau củ, đậu hũ, vị thanh mát.",
  "food-055": "Chuối bọc tàu hũ ky - chuối bọc tàu hũ ky chiên, vị ngọt, giòn.",
  "food-056": "Lươn chiên giòn - lươn tẩm bột chiên giòn, ăn kèm nước mắm ớt.",
  "food-057": "Lươn xào sả ớt - lươn xào với sả, ớt, vị cay nồng.",
  "food-058": "Bò câu quay da giòn - bò câu quay da giòn, thịt mềm, vị béo ngọt.",
  "food-059": "Chả lươn - lươn xay nhuyễn làm chả, chiên, vị đậm đà.",
  "food-060": "Vạn thạnh chiên giòn - vạn thạnh tẩm bột chiên giòn, ăn kèm nước mắm.",
  "food-061": "Chuối hấp mật dừa - chuối hấp với mật dừa, vị ngọt béo.",
  "food-062": "Xôi nướng cuốn - xôi nướng cuốn với rau thơm, chấm nước mắm.",
  "food-063": "Cá nục hấp - cá nục hấp với gừng, hành, vị ngọt thanh.",
  "food-064": "Dừa chuối chặt - dừa chuối chặt miếng, ăn kèm nước cốt dừa.",
  "food-065": "Tôm kho danh - tôm kho với nước dừa, vị ngọt đậm đà.",
  "food-066": "Cuốn diếp - rau diếp cuốn với thịt, tôm, chấm nước mắm.",
  "food-067": "Ốc nhồi nấu chuối - ốc nhồi thịt nấu với chuối, vị ngọt béo.",
  "food-068": "Chuối sốt caramen - chuối nấu với sốt caramen, vị ngọt béo.",
  "food-069": "Thịt luộc giam tương - thịt heo luộc, giam tương, vị mặn ngọt.",
  "food-070": "Canh chua bông sợi dừa cá rô đồng - canh chua với cá rô đồng, bông sợi dừa, vị chua ngọt.",
  "food-071": "Ếch xào lá cà - ếch xào với lá cà, vị đắng nhẹ, thơm.",
  "food-072": "Cá tai tượng chiên xu - cá tai tượng chiên xu, ăn kèm nước mắm.",
  "food-073": "Gỏi bầu cá lóc nướng - bầu tươi trộn với cá lóc nướng, vị thanh mát.",
  "food-074": "Vịt nấu chao - vịt nấu với chao, vị béo, thơm.",
  "food-075": "Cá cuốn bún - cá cuốn với bún, rau thơm, chấm nước mắm.",
  "food-076": "Bún kho xào giòn - bún kho xào giòn, ăn kèm rau thơm.",
  "food-077": "Lưỡi vịt rang muối - lưỡi vịt rang muối, vị mặn, giòn.",
  "food-078": "Cút tiêm ngũ quả - cút tiêm với 5 loại quả, vị ngọt thanh.",
  "food-079": "Vịt quay trọn măng - vịt quay với măng, vị béo ngọt.",
  "food-080": "Tôm rang ngũ vị - tôm rang với 5 loại gia vị, vị đậm đà.",
  "food-081": "Cá hô kho bồi - cá hô kho với nước dừa, vị ngọt đậm đà.",
  "food-082": "Chân gà nướng ngũ vị - chân gà nướng với 5 loại gia vị, vị đậm đà.",
  "food-083": "Bông cải bọc chả - bông cải bọc chả, chiên, vị giòn, thơm.",
  "food-084": "Mì ruối cà chua sốt - mì ruối nấu với sốt cà chua, vị chua ngọt.",
  "food-085": "Mì xào tôm - mì xào với tôm, rau củ, vị ngọt thanh.",
  "food-086": "Mắm lốc - mắm lốc ăn kèm cơm, vị mặn, thơm.",
  "food-087": "Mì xào thịt gà hạt điều - mì xào với thịt gà, hạt điều, vị béo ngọt.",
  "food-088": "Lẩu rau - lẩu ăn kèm nhiều loại rau, vị thanh mát.",
  "food-089": "Dừa kho cà chua - dừa kho với cà chua, vị ngọt chua.",
  "food-090": "Mắm đu đủ - mắm đu đủ ăn kèm cơm, vị mặn, thơm.",
  "food-091": "Lẩu dê - lẩu dê ăn kèm rau, vị béo, thơm.",
  "food-092": "Nem gà kiểu Trung Hoa - nem gà chiên giòn, vị đậm đà.",
  "food-093": "Canh gà chiên bò - gà chiên nấu với thịt bò, vị béo ngọt.",
  "food-094": "Hoa bí nở - món ăn truyền thống, vị ngọt thanh.",
  "food-095": "Cơm thái cúc - cơm ăn kèm nhiều món, đầy đủ dinh dưỡng.",
  "food-096": "Canh măng nấu chân gà - măng nấu với chân gà, vị ngọt thanh.",
  "food-097": "Gà nấu đông - gà nấu đông lại, vị ngọt thanh.",
  "food-098": "Mướp đắng nhồi thịt - mướp đắng nhồi thịt, nấu, vị đắng nhẹ, ngọt.",
  "food-099": "Tai lợn ngâm giam - tai lợn ngâm giam tương, vị mặn, giòn.",
  "food-100": "Bún riêu cua - bún riêu với cua, vị chua ngọt, thanh mát.",
  "food-101": "Gà chiên lá dứa - gà chiên với lá dứa, vị thơm, ngọt.",
  "food-102": "Lẩu thịt bò - lẩu bò ăn kèm rau, vị béo, thơm.",
  "food-103": "Hoa kim châm xào - hoa kim châm xào, vị ngọt thanh.",
  "food-104": "Chả giò uyên ương - chả giò nhân tôm, thịt, chiên giòn.",
  "food-105": "Bò nướng chanh vả - bò nướng với chanh vả, vị chua ngọt.",
  "food-106": "Hoa cài xào nấm chao - hoa cài xào với nấm chao, vị béo, thơm.",
  "food-107": "Bông hẹ xào sò lụa - bông hẹ xào với sò lụa, vị ngọt thanh.",
  "food-108": "Lẩu cá quả - lẩu cá quả ăn kèm rau, vị ngọt thanh.",
  "food-109": "Mắm Huế xào thịt - mắm Huế xào với thịt, vị mặn, thơm.",
  "food-110": "Nộm mướp đắng - mướp đắng trộn với rau thơm, vị đắng nhẹ, thanh.",
  "food-111": "Đậu phụ mắm tôm - đậu phụ nấu với mắm tôm, vị mặn, thơm.",
  "food-112": "Mắm cá cơm trộn dừa - mắm cá cơm trộn với dừa, vị mặn, béo.",
  "food-113": "Lẩu mắm - lẩu mắm ăn kèm rau, vị mặn, thơm.",
  "food-114": "Hoa ly xào thịt bò - hoa ly xào với thịt bò, vị ngọt thanh.",
  "food-115": "Hoa bí xào nghêu - hoa bí xào với nghêu, vị ngọt thanh.",
  "food-116": "Cơm nồi đôi Đà Nẵng - cơm nồi đôi đặc sản Đà Nẵng, vị dẻo, thơm.",
  "food-117": "Ngũ cốc dinh dưỡng - ngũ cốc ăn kèm sữa, bổ dưỡng.",
  "food-118": "Cơm chay nồi đôi - cơm chay nồi đôi, thanh mát.",
  "food-119": "Cháo cơ bản - cháo trắng ăn kèm đồ mặn, vị ngọt thanh.",
  "food-120": "Súp rau củ - súp làm từ rau củ, vị ngọt thanh.",
  "food-121": "Cháo đặc thịt bằm - cháo đặc với thịt bằm, vị ngọt béo.",
  "food-122": "Món hấp tổng hợp - nhiều món hấp cùng nhau, vị ngọt thanh.",
  "food-123": "Món hầm bò đường - thịt bò hầm với đường, vị ngọt béo.",
  "food-124": "Làm bánh tại nhà - hướng dẫn làm bánh tại nhà.",
  "food-125": "Món chiên giòn nhanh - các món chiên giòn nhanh chóng.",
  "food-126": "Sữa chua nhà làm - sữa chua làm tại nhà, vị chua ngọt.",
  "food-127": "Món thủ công sáng tạo - các món ăn sáng tạo thủ công."
};

async function updateFoodDescriptions() {
  console.log('Updating food descriptions...');

  try {
    const batch = db.batch();
    const foodsCollection = db.collection('foods');

    for (const [foodId, description] of Object.entries(foodDescriptions)) {
      const docRef = foodsCollection.doc(foodId);
      batch.update(docRef, { description });
    }

    await batch.commit();
    console.log(`Updated ${Object.keys(foodDescriptions).length} food descriptions!`);
  } catch (error) {
    console.error('Error updating descriptions:', error);
    process.exit(1);
  }
}

updateFoodDescriptions().then(() => {
  process.exit(0);
});
