import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function useLoadingDotsAnimation() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }),
        ])
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 150);
    const a3 = animate(dot3, 300);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  const scale1 = useMemo(
    () =>
      dot1.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1.2],
      }),
    [dot1]
  );
  const scale2 = useMemo(
    () =>
      dot2.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1.2],
      }),
    [dot2]
  );
  const scale3 = useMemo(
    () =>
      dot3.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1.2],
      }),
    [dot3]
  );
  const opacity1 = useMemo(
    () =>
      dot1.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 1],
      }),
    [dot1]
  );
  const opacity2 = useMemo(
    () =>
      dot2.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 1],
      }),
    [dot2]
  );
  const opacity3 = useMemo(
    () =>
      dot3.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 1],
      }),
    [dot3]
  );

  return { scale1, scale2, scale3, opacity1, opacity2, opacity3 };
}
