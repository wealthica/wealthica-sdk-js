#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
//#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"WealthicaConnectExample";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

//- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *, id> *) options {
//  if ([self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url]) {
//    return YES;
//  }
//  return [RCTLinkingManager application:app openURL:url options:options];
//}
//
//- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
//   if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
//     if (self.authorizationFlowManagerDelegate) {
//       BOOL resumableAuth = [self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:userActivity.webpageURL];
//       if (resumableAuth) {
//         return YES;
//       }
//     }
//   }
//
//  return [super application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
//}
@end
