import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const ChatTypingAnimation = () => {
  const firstDotTranslateY = useRef(new Animated.Value(0)).current;
  const secondDotTranslateY = useRef(new Animated.Value(0)).current;
  const thirdDotTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const animateDots = () => {
      // Complete full animation of first dot before starting second dot
      Animated.sequence([
        // First dot up and down
        Animated.timing(firstDotTranslateY, {
          toValue: -6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(firstDotTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),

        // Second dot up and down
        Animated.timing(secondDotTranslateY, {
          toValue: -6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(secondDotTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),

        // Third dot up and down
        Animated.timing(thirdDotTranslateY, {
          toValue: -6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(thirdDotTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isMounted) {
          // Loop the animation
          animateDots();
        }
      });
    };

    animateDots();

    return () => {
      isMounted = false;
      firstDotTranslateY.setValue(0);
      secondDotTranslateY.setValue(0);
      thirdDotTranslateY.setValue(0);
    };
  }, [firstDotTranslateY, secondDotTranslateY, thirdDotTranslateY]);

  const style = StyleSheet.create({
    typingContainer: {
      flexDirection: "row",
      padding: 10,
      alignItems: "center",
      height: 30,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 3,
      backgroundColor: "white",
    },
  });

  return (
    <View style={style.typingContainer}>
      <Animated.View
        style={[
          style.typingDot,
          { transform: [{ translateY: firstDotTranslateY }] },
        ]}
      />
      <Animated.View
        style={[
          style.typingDot,
          { transform: [{ translateY: secondDotTranslateY }] },
        ]}
      />
      <Animated.View
        style={[
          style.typingDot,
          { transform: [{ translateY: thirdDotTranslateY }] },
        ]}
      />
    </View>
  );
};

export default ChatTypingAnimation;
