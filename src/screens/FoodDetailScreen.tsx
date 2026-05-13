import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Share,
  Alert,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../utils/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { FoodItem } from '../database/mockData';
import { useAppStore } from '../store';

type Props = {
  navigation: any;
  route: {
    params: {
      food: FoodItem;
    };
  };
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FoodDetailScreen({ route, navigation }: Props) {
  const { food } = route.params;
  const theme = useTheme();
  const { favourites, addFavourite, removeFavourite, addMeal } = useAppStore();

  const [isFavourite, setIsFavourite] = useState(false);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const favScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsFavourite(favourites.some(f => f.id === food.id));
  }, [favourites, food.id]);

  // Content fade-in animation
  useEffect(() => {
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Parallax effect for image
  const imageScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const toggleFavourite = () => {
    if (isFavourite) {
      removeFavourite(food.id);
      setIsFavourite(false);
    } else {
      addFavourite(food);
      setIsFavourite(true);
    }

    // Heart animation
    Animated.sequence([
      Animated.spring(favScale, {
        toValue: 1.3,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(favScale, {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleShare = async () => {
    try {
      const message = `🍽️ ${food.name}\n\n${food.description}\n\n⏱️ Thời gian chuẩn bị: ${food.prepTime} phút\n\n📱 Tải LuckyFood để khám phá thêm nhiều món ăn ngon!`;
      await Share.share({
        message,
        title: food.name,
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chia sẻ món ăn này');
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi Tiết Món Ăn</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <MaterialIcons name="share" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: favScale }] }}>
            <TouchableOpacity
              style={styles.favButton}
              onPress={toggleFavourite}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={isFavourite ? 'favorite' : 'favorite-border'}
                size={28}
                color={isFavourite ? theme.colors.heart : theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Food Image with Parallax */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="restaurant" size={64} color={theme.colors.textSecondary} />
          </View>
        </Animated.View>

        {/* Food Info with Staggered Fade-in */}
        <Animated.View
          style={[
            styles.foodInfo,
            {
              opacity: contentAnim,
              transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{getCategoryLabel(food.category)}</Text>
          </View>

          {/* Name */}
          <Text style={styles.foodName}>{food.name}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={18} color={theme.colors.primary} />
              <Text style={styles.metaText}>{food.prepTime} phút</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="category" size={18} color={theme.colors.secondary} />
              <Text style={styles.metaText}>{getCategoryLabel(food.category)}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Mô tả</Text>
            <Text style={styles.description}>{food.description}</Text>
          </View>

          {/* Ingredients */}
          <View style={styles.ingredientsContainer}>
            <Text style={styles.ingredientsTitle}>Nguyên liệu</Text>
            <View style={styles.ingredientsList}>
              {getIngredients(food.category).map((ing, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientIcon}>{ing.icon}</Text>
                  <Text style={styles.ingredientName}>{ing.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Cách làm</Text>
            <View style={styles.instructionsList}>
              {getInstructions(food.category).map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Nutrition Info */}
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionTitle}>Thông tin dinh dưỡng</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>350</Text>
                <Text style={styles.nutritionLabel}>Calo</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>15g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>45g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>12g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>



      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => {
            addMeal(food.id, 'lunch');
            Alert.alert('Đã lưu', 'Món ăn đã được thêm vào lịch hôm nay!');
          }}
          activeOpacity={0.8}
        >
          <MaterialIcons name="calendar-month" size={20} color={theme.colors.surface} />
          <Text style={styles.calendarButtonText}>Lưu Lịch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cookButton} activeOpacity={0.8}>
          <MaterialIcons name="restaurant" size={20} color={theme.colors.surface} />
          <Text style={styles.cookButtonText}>Nấu món này</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'com': return 'Cơm';
    case 'bun-pho': return 'Bún/Phở';
    case 'banh': return 'Bánh';
    case 'chay': return 'Chay';
    case 'nuoc': return 'Nước';
    default: return category;
  }
};

const getIngredients = (category: string) => {
  const ingredients: { icon: string; name: string }[] = [];
  switch (category) {
    case 'com':
      ingredients.push({ icon: '🍚', name: 'Cơm trắng' });
      ingredients.push({ icon: '🥩', name: 'Thịt heo' });
      ingredients.push({ icon: '🥚', name: 'Trứng' });
      break;
    case 'bun-pho':
      ingredients.push({ icon: '🍜', name: 'Bún tươi' });
      ingredients.push({ icon: '🥩', name: 'Thịt bò' });
      ingredients.push({ icon: '🌿', name: 'Hành ngò' });
      break;
    case 'banh':
      ingredients.push({ icon: '🥖', name: 'Bánh mì' });
      ingredients.push({ icon: '🥩', name: 'Thịt' });
      ingredients.push({ icon: '🥒', name: 'Dưa leo' });
      break;
    case 'chay':
      ingredients.push({ icon: '🫘', name: 'Đậu hũ' });
      ingredients.push({ icon: '🥬', name: 'Rau xanh' });
      ingredients.push({ icon: '🍅', name: 'Cà chua' });
      break;
    case 'nuoc':
      ingredients.push({ icon: '🥤', name: 'Tôm' });
      ingredients.push({ icon: '🍋', name: 'Chanh' });
      ingredients.push({ icon: '🍊', name: 'Cam' });
      break;
    default:
      ingredients.push({ icon: '🍽', name: 'Nguyên liệu' });
  }
  return ingredients;
};

const getInstructions = (category: string) => {
  const instructions: string[] = [];
  switch (category) {
    case 'com':
      instructions.push('Vo gạo và vo sạch');
      instructions.push('Luộc thịt heo và thái miếng');
      instructions.push('Xào thịt với gia vị');
      instructions.push('Trộn cơm với thịt và đồ ăn kèm');
      break;
    case 'bun-pho':
      instructions.push('Hầm xương để lấy nước dùng');
      instructions.push('Luộc bún tươi');
      instructions.push('Thái thịt bò mỏng');
      instructions.push('Trình bày và ăn kèm rau thơm');
      break;
    case 'banh':
      instructions.push('Nướng bánh mì cho giòn');
      instructions.push('Chuẩn bị nhân thịt');
      instructions.push('Phết sốt và rau');
      instructions.push('Nhét nhân vào bánh');
      break;
    case 'chay':
      instructions.push('Chiên đậu hũ vàng');
      instructions.push('Làm sốt cà chua');
      instructions.push('Xào đậu với sốt cà chua');
      instructions.push('Trình bày và ăn kèm cơm');
      break;
    case 'nuoc':
      instructions.push('Sơ chế tôm tươi');
      instructions.push('Vắt chanh và cam lấy nước');
      instructions.push('Pha trà chanh cam');
      instructions.push('Thưởng thức khi mát');
      break;
    default:
      instructions.push('Chuẩn bị nguyên liệu');
      instructions.push('Trình bày theo công thức');
  }
  return instructions;
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    backButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.round,
    },
    headerTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      letterSpacing: -0.5,
    },
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    shareButton: {
      padding: theme.spacing.sm,
    },
    favButton: {
      padding: theme.spacing.sm,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    imageContainer: {
      width: SCREEN_WIDTH,
      height: 250,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imagePlaceholder: {
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    foodInfo: {
      padding: theme.spacing.lg,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
      marginBottom: theme.spacing.sm,
    },
    categoryText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.bold,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.colors.primary,
    },
    foodName: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxxl,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
      letterSpacing: -0.5,
    },
    metaRow: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    metaText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weights.medium,
    },
    descriptionContainer: {
      marginBottom: theme.spacing.xl,
    },
    descriptionTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.semiBold,
      marginBottom: theme.spacing.sm,
    },
    description: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    ingredientsContainer: {
      marginBottom: theme.spacing.xl,
    },
    ingredientsTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.semiBold,
      marginBottom: theme.spacing.sm,
    },
    ingredientsList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    ingredientItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.lg,
    },
    ingredientIcon: {
      fontSize: 18,
    },
    ingredientName: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
    },
    instructionsContainer: {
      marginBottom: theme.spacing.xl,
    },
    instructionsTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.semiBold,
      marginBottom: theme.spacing.sm,
    },
    instructionsList: {
      gap: theme.spacing.md,
    },
    instructionItem: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    instructionNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    instructionNumberText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.surface,
      fontWeight: theme.typography.weights.bold,
    },
    instructionText: {
      flex: 1,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    nutritionContainer: {
      marginBottom: theme.spacing.xl,
    },
    nutritionTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.semiBold,
      marginBottom: theme.spacing.sm,
    },
    nutritionGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    nutritionItem: {
      alignItems: 'center',
    },
    nutritionValue: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.bold,
    },
    nutritionLabel: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    bottomAction: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderSubtle,
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    calendarButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.secondary,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.medium,
    },
    calendarButtonText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
      letterSpacing: 0.3,
    },
    cookButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.medium,
    },
    cookButtonText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
      letterSpacing: 0.3,
    },
  });
