package com.masterfabric.recipio.util

import com.masterfabric.recipio.BuildConfig

/**
 * Small helpers for native Android code (bridges, future modules).
 */
object NativeUtils {

  fun isDebugBuild(): Boolean = BuildConfig.DEBUG

  fun applicationId(): String = BuildConfig.APPLICATION_ID

  fun buildType(): String = BuildConfig.BUILD_TYPE
}
