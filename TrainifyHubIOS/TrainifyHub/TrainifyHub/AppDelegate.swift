import UIKit
import Firebase
import UserNotifications
import AVFoundation
import StoreKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    var window: UIWindow?
    var fcmToken: String?
    var audioPlayer: AVAudioPlayer?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        
        FirebaseApp.configure()
        
        PurchaseManager.shared.startObserving()
        
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            }
        }
        
        Messaging.messaging().delegate = self
    
        

        
        return true
    }
    
    

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken

        Messaging.messaging().token { token, error in
            if let error = error {
                print("❌ Błąd pobierania tokena FCM: \(error.localizedDescription)")
            } else if let token = token {
                print("✅ Token FCM uzyskany: \(token)")
                self.fcmToken = token
                
                // Przekazujemy token do SceneDelegate
                DispatchQueue.main.async {
                    if let sceneDelegate = UIApplication.shared.connectedScenes.first?.delegate as? SceneDelegate {
                        sceneDelegate.fcmToken = token
                        sceneDelegate.launchWebViewController()
                    }
                }
            }
        }
    }

    func applicationWillEnterForeground(_ application: UIApplication) {}

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {}
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    
        if let channelId = notification.request.content.userInfo["channelId"] as? String {
               switch channelId {
               case "default_channel_id":
                   print("🔊 Odtwarzam dźwięk dla default_channel_id")
                   playSound(named: "notification", fileType: "wav")
                   
               case "chat_notification":
                   print("🔊 Odtwarzam dźwięk dla chat_notification")
                   playSound(named: "messenger")
                   
               default:
                   print("🔕 Nieznany kanał powiadomień - brak dodatkowego dźwięku.")
               }
           }
    
    }
    
    func playSound(named soundName: String, fileType: String = "mp3") {
        guard let soundPath = Bundle.main.path(forResource: soundName, ofType: fileType) else {
            print("❌ Nie znaleziono pliku dźwiękowego: \(soundName).\(fileType)")
            return
        }
        
        let soundURL = URL(fileURLWithPath: soundPath)
        
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: soundURL)
            audioPlayer?.play()
            print("🎵 Odtwarzam dźwięk: \(soundName).\(fileType)")
        } catch {
            print("❌ Błąd odtwarzania dźwięku: \(error.localizedDescription)")
        }
    }
    
}



extension AppDelegate: MessagingDelegate {
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        if let token = fcmToken {
            print("📩 Nowy token FCM: \(token)")
            self.fcmToken = token

            DispatchQueue.main.async {
                if let sceneDelegate = UIApplication.shared.connectedScenes.first?.delegate as? SceneDelegate {
                    sceneDelegate.fcmToken = token
                }
            }
        }
    }
}
