import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../utils/ThemeProvider';
import { useAppStore } from '../store';
import { getDemoAccounts, isValidEmail, loginLocalAccount, normalizeEmail } from '../utils/localAuth';
import { useAuth } from '../utils/AuthProvider';

type Props = {
  navigation: any;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const { setUser } = useAppStore();
  const { loginWithGoogle, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = useMemo(() => getDemoAccounts(), []);
  const emailTrimmed = normalizeEmail(email);
  const formValid = emailTrimmed.length > 0 && password.length > 0;

  const closeAuthFlow = () => {
    const role = useAppStore.getState().user.role;
    if (role === 'admin') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminDashboard' }],
      });
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
    });
  };

  const applyDemoAccount = (account: { email: string; password: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  };

  const handleLogin = async () => {
    if (isSubmitting) return;

    if (!formValid) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!isValidEmail(emailTrimmed)) {
      setError('Email không hợp lệ.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    await sleep(300);
    const account = loginLocalAccount(emailTrimmed, password);

    if (!account) {
      setIsSubmitting(false);
      setError('Email hoặc mật khẩu không đúng.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setUser({
      uid: account.id,
      displayName: account.displayName,
      email: account.email,
      avatarUrl: null,
      role: account.role,
      currentStreak: 0,
      highestStreak: 0,
      lastCookedDate: null,
      favoriteFoodIds: [],
    });

    setIsSubmitting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Đăng nhập thành công', `Xin chào ${account.displayName}!`);
    closeAuthFlow();
  };

  const handleGoogleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    await loginWithGoogle();
    if (useAppStore.getState().user.uid) {
      closeAuthFlow();
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <MaterialIcons name="restaurant-menu" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>Đăng nhập LuckyFood</Text>
            <Text style={styles.subtitle}>Đăng nhập để lưu món yêu thích và lịch sử nấu ăn.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="email" size={20} color={theme.colors.textSecondary} />
              <TextInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError(null);
                }}
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="lock" size={20} color={theme.colors.textSecondary} />
              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (error) setError(null);
                }}
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.submitButton, (!formValid || isSubmitting) && styles.submitDisabled]}
              onPress={handleLogin}
              disabled={!formValid || isSubmitting}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
              {!isSubmitting && <MaterialIcons name="arrow-forward" size={18} color={theme.colors.surface} />}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>HOẶC</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, authLoading && styles.submitDisabled]}
              onPress={handleGoogleLogin}
              disabled={authLoading}
              activeOpacity={0.85}
            >
              <View style={styles.googleIconContainer}>
                <FontAwesome name="google" size={20} color="#EA4335" />
              </View>
              <Text style={styles.googleButtonText}>{authLoading ? 'Đang kết nối...' : 'Tiếp tục với Google'}</Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Chưa có tài khoản?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} hitSlop={8}>
                <Text style={styles.switchLink}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Tài khoản demo</Text>
            {demoAccounts.map((account) => (
              <TouchableOpacity
                key={`${account.role}-${account.email}`}
                style={styles.demoItem}
                onPress={() => applyDemoAccount(account)}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={styles.demoRole}>{account.role === 'admin' ? 'ADMIN' : 'USER'}</Text>
                  <Text style={styles.demoValue}>{account.email}</Text>
                </View>
                <Text style={styles.demoPass}>{account.password}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.lg,
    },
    header: {
      gap: theme.spacing.sm,
    },
    logo: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryContainer,
    },
    title: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    subtitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    form: {
      gap: theme.spacing.sm,
    },
    label: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.medium,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
    },
    input: {
      flex: 1,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
    },
    errorText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.error,
      fontSize: theme.typography.sizes.sm,
    },
    submitButton: {
      marginTop: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: 14,
    },
    submitDisabled: {
      opacity: 0.55,
    },
    submitText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.surface,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.sm,
      gap: theme.spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.borderSubtle,
    },
    dividerText: {
      fontFamily: theme.typography.families.body,
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      letterSpacing: 1,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: 12,
      gap: theme.spacing.md,
    },
    googleIconContainer: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    googleButtonText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.text,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semiBold,
    },
    switchRow: {
      marginTop: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
    switchText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
    },
    switchLink: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.primary,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.bold,
    },
    demoSection: {
      gap: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderSubtle,
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    demoTitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weights.medium,
    },
    demoItem: {
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    demoRole: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.bold,
      textTransform: 'uppercase',
    },
    demoValue: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
    },
    demoPass: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
  });
