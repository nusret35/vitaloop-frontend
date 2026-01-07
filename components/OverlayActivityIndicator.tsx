import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, StyleSheet } from "react-native";

const OverlayActivityIndicator = ({ isVisible }: { isVisible: boolean }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(opacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, opacity]);

  return (
    <Animated.View style={[style.container, { opacity }]}>
      <ActivityIndicator size="large" />
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: "black",
    opacity: 0.5,
    position: "absolute",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
  },
});

export default OverlayActivityIndicator;
