import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

const RC_API_KEY_ANDROID = "sk_dtgZWIKsKfxdmigywkGPTKyulDuLG";

export const initRevenueCat = async (userId) => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Purchases.setLogLevel({ level: "DEBUG" });
    await Purchases.configure({ 
      apiKey: RC_API_KEY_ANDROID,
      appUserID: userId 
    });
    console.log("RevenueCat configured for user:", userId);
  } catch (error) {
    console.error("Failed to configure RevenueCat:", error);
  }
};

export const fetchOfferings = async () => {
  if (!Capacitor.isNativePlatform()) return [];
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      // Return the available packages
      return offerings.current.availablePackages;
    }
  } catch (error) {
    console.error("Failed to fetch RevenueCat offerings:", error);
  }
  return [];
};

export const purchasePackage = async (rcPackage) => {
  if (!Capacitor.isNativePlatform()) return { success: false, reason: "Web testing not supported" };
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: rcPackage });
    
    // Check if the user successfully unlocked the entitlement
    if (typeof customerInfo.entitlements.active['laya_premium'] !== "undefined") {
      return { success: true, customerInfo };
    }
    return { success: false, reason: "Entitlement not active" };
  } catch (error) {
    console.error("Purchase failed:", error);
    return { success: false, error };
  }
};

export const checkSubscriptionStatus = async () => {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    if (typeof customerInfo.entitlements.active['laya_premium'] !== "undefined") {
      return true;
    }
  } catch (error) {
    console.error("Failed to check subscription:", error);
  }
  return false;
};
