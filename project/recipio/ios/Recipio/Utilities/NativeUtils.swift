import Foundation

/// Small helpers for native iOS code (bridges, future modules).
enum NativeUtils {
  static var isDebugBuild: Bool {
#if DEBUG
    return true
#else
    return false
#endif
  }

  static var bundleIdentifier: String {
    Bundle.main.bundleIdentifier ?? ""
  }
}
