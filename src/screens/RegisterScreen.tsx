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
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../utils/ThemeProvider';
import { useAppStore } from '../store';
import { isValidEmail, normalizeEmail, registerLocalAccount } from '../utils/localAuth';

type Props = {
  navigation: any;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const { setUser } = useAppStore();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailTrimmed = normalizeEmail(email);
  const formValid = useMemo(
    () => displayName.trim() && emailTrimmed && password && confirmPassword && acceptTerms,
    [displayName, emailTrimmed, password, confirmPassword, acceptTerms]
  );

  const closeAuthFlow = () => {
    const parent = navigation.getParent?.();
    if (parent?.canGoBack?.()) {
      parent.goBack();
      return;
    }
    navigation.goBack();
  };

  const handleRegister = async () => {
    if (isSubmitting) return;

    if (!formValid) {
      setError('Vui lòng nhập đầy đủ thông tin và chấp nhận điều khoản.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!isValidEmail(emailTrimmed)) {
      setError('Email không hợp lệ.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    await sleep(350);
    const result = registerLocalAccount({
      displayName,
      email: emailTrimmed,
      password,
    });

    if (!result.ok) {
      setIsSubmitting(false);
      setError(result.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setUser({
      uid: result.account.id,
      displayName: result.account.displayName,
      email: result.account.email,
      avatarUrl: null,
      role: result.account.role,
      currentStreak: 0,
      highestStreak: 0,
      lastCookedDate: null,
      favoriteFoodIds: [],
    });

    setIsSubmitting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Đăng ký thành công', 'Tài khoản đã được tạo và đăng nhập tự động.');
    closeAuthFlow();
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <MaterialIcons name="person-add" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Tạo tài khoản để đồng bộ dữ liệu nấu ăn của bạn.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Tên hiển thị</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="person" size={20} color={theme.colors.textSecondary} />
              <TextInput
                value={displayName}
                onChangeText={(value) => {
                  setDisplayName(value);
                  if (error) setError(null);
                }}
                style={styles.input}
                placeholder="Ví dụ: Linh Nguyen"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

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
                placeholder="Ít nhất 6 ký tự"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="lock-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  if (error) setError(null);
                }}
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)} hitSlop={8}>
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => {
                setAcceptTerms((prev) => !prev);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={acceptTerms ? 'check-box' : 'check-box-outline-blank'}
                size={20}
                color={acceptTerms ? theme.colors.primary : theme.colors.textSecondary}
              />
              <Text style={styles.termsText}>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.submitButton, (!formValid || isSubmitting) && styles.submitDisabled]}
              onPress={handleRegister}
              disabled={!formValid || isSubmitting}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>{isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}</Text>
              {!isSubmitting && <MaterialIcons name="arrow-forward" size={18} color={theme.colors.surface} />}
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} hitSlop={8}>
                <Text style={styles.switchLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
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
    termsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    termsText: {
      flex: 1,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      lineHeight: 20,
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
  });
