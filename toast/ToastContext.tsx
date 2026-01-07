import Icon from "react-native-vector-icons/MaterialIcons";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  createContext,
  memo,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

type ToastType = "success" | "error" | null;

interface ToastState {
  visible: boolean;
  text: string;
  type: ToastType;
}

interface ToastContextType {
  showSuccessToast: (text: string) => void;
  showFailToast: (text: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const Toast = memo(({ text, type, visible }: ToastState) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const backgroundColor = useThemeColor(
    {
      light: Colors.light.background,
      dark: Colors.dark.secondaryBackground,
    },
    "background"
  );
  const textColor = useThemeColor(
    { light: "#3F414E", dark: "#FFFFFF" },
    "background"
  );

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  if (!visible && fadeAnim._value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          top: 10 + insets.top,
          gap: 8,
        },
      ]}
    >
      {type === "success" ? (
        <Icon name="check-circle-outline" size={24} color={"green"} />
      ) : (
        <Icon name="error-outline" size={28} color={"red"} />
      )}
      <ThemedText>{text}</ThemedText>
    </Animated.View>
  );
});

Toast.displayName = "Toast";

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    text: "",
    type: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = (text: string, type: ToastType) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({
      visible: true,
      text,
      type,
    });

    timeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const showSuccessToast = (text: string) => {
    showToast(text, "success");
  };

  const showFailToast = (text: string) => {
    showToast(text, "error");
  };

  return (
    <ToastContext.Provider value={{ showSuccessToast, showFailToast }}>
      {children}
      <Toast {...toast} />
    </ToastContext.Provider>
  );
};
const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    alignSelf: "center",
    minWidth: 200,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
