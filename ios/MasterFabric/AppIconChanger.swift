import UIKit
import React

@objc(AppIconChanger)
class AppIconChanger: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func supportsAlternateIcons(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let supports = UIApplication.shared.supportsAlternateIcons
      resolve(supports)
    }
  }
  
  @objc
  func getAlternateIconName(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let iconName = UIApplication.shared.alternateIconName
      resolve(iconName)
    }
  }
  
  @objc
  func setAlternateIconName(_ iconName: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard UIApplication.shared.supportsAlternateIcons else {
        reject("NOT_SUPPORTED", "Alternate icons are not supported on this device", nil)
        return
      }
      
      let currentIconName = UIApplication.shared.alternateIconName
      
      // If trying to set the same icon, resolve immediately
      if currentIconName == iconName {
        resolve(nil)
        return
      }
      
      UIApplication.shared.setAlternateIconName(iconName) { error in
        if let error = error {
          reject("ICON_CHANGE_FAILED", error.localizedDescription, error)
        } else {
          resolve(nil)
        }
      }
    }
  }
}

