/**
 * Must run before react-native-worklets / Reanimated load in Jest (no native JSI).
 * NativeWorklets throws if global.__workletsModuleProxy is missing; importing Reanimated's
 * official mock still evaluates worklets + reanimated index, which calls many proxy methods.
 */
const ref = (value) => ({ __jestWorkletsRef: true, value });

global.__workletsModuleProxy = new Proxy(
  {
    getStaticFeatureFlag: () => false,
    setDynamicFeatureFlag: () => {},
  },
  {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      return (...args) => ref(args[0]);
    },
  }
);
