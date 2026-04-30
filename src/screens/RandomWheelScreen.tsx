import React, { useState, useCallback, useRef, Suspense } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar, Animated, Easing } from 'react-native';
import { getDb } from '../database/db-service';
import { theme } from '../utils/theme';
import { FoodItem } from '../database/mockData';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation/AppNavigator';
import { Canvas } from '@react-three/fiber';
import Dice3D from '../components/Dice3D';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'RandomWheel'>;
};

export default function RandomWheelScreen({ navigation }: Props) {
  const [result, setResult] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [rollTrigger, setRollTrigger] = useState(0);

  const spin = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setResult(null); 
    if (!show3D) setShow3D(true);
    setRollTrigger(prev => prev + 1);
  }, [loading, show3D]);

  const handleRollComplete = useCallback(async () => {
    try {
      const db = await getDb();
      const food = await db.getFirstAsync<FoodItem>('SELECT * FROM Foods ORDER BY RANDOM() LIMIT 1;');
      setResult(food ?? null);
      setLoading(false);
    } catch (err) {
      console.error('[RandomWheel] Error:', err);
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Xúc Xắc</Text>
      </View>

      <View style={styles.mainCanvas}>
        
        {/* Interactive Element */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={spin} 
          disabled={loading || !!result} 
          style={styles.touchableGroup}
        >
          <View style={styles.diceContainer}>
            {!show3D ? (
              <Image 
                source={require('../assets/images/xuc_xac-removebg-preview.png')}
                style={styles.diceImage}
                resizeMode="contain"
              />
            ) : (
            <Canvas
              style={styles.canvasContainer}
              camera={{ position: [0, 0, 4.5], fov: 50 }}
            >
              <ambientLight intensity={1.0} />
              <directionalLight position={[5, 8, 5]} intensity={2} castShadow />
              <directionalLight position={[-5, -3, -5]} intensity={0.4} />
              <Suspense fallback={null}>
                <Dice3D rollTrigger={rollTrigger} onComplete={handleRollComplete} />
              </Suspense>
            </Canvas>
            )}
          </View>
          <Text style={[styles.tapText, { opacity: result ? 0 : 0.9 }]}>Chạm để tung</Text>
        </TouchableOpacity>

        {/* Result Area */}
        <View style={styles.resultContainer}>
          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultName}>{result.name}</Text>
              <Text style={styles.resultDesc} numberOfLines={2}>{result.description}</Text>
              <Text style={styles.resultMeta}>⏱ {result.prepTime} phút</Text>
              <TouchableOpacity style={styles.cookedBtn} onPress={() => setResult(null)}>
                <Text style={styles.cookedBtnText}>Thử Lại</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background, zIndex: 50,
  },
  headerTitle: { fontFamily: theme.typography.families.display, fontSize: 24, fontStyle: 'italic', color: '#5A4D4D' },
  
  mainCanvas: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: theme.spacing.lg, 
    paddingBottom: 80 
  },
  
  touchableGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    marginTop: -80, 
  },
  diceContainer: {
    width: 260,
    height: 260,
    marginBottom: theme.spacing.xl,
  },
  diceImage: {
    width: '100%',
    height: '100%',
  },
  canvasContainer: {
    width: '100%',
    height: '100%',
  },
  tapText: { 
    fontFamily: theme.typography.families.display, 
    fontSize: 32, 
    color: '#5A4D4D', 
  },

  resultContainer: { 
    position: 'absolute', 
    bottom: 40, 
    width: '100%', 
    alignItems: 'center',
    zIndex: 30 
  },
  resultCard: { backgroundColor: theme.colors.surface, padding: theme.spacing.xl, borderRadius: theme.borderRadius.lg, alignItems: 'center', width: '90%', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  resultName: { fontFamily: theme.typography.families.display, fontSize: theme.typography.sizes.xxl, color: theme.colors.text, marginBottom: theme.spacing.xs, textAlign: 'center' },
  resultDesc: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.md, textAlign: 'center' },
  resultMeta: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.sm, color: theme.colors.primary, marginBottom: theme.spacing.lg },
  cookedBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: theme.borderRadius.round },
  cookedBtnText: { fontFamily: theme.typography.families.body, color: theme.colors.surface, fontWeight: theme.typography.weights.bold, fontSize: 16 },
});
