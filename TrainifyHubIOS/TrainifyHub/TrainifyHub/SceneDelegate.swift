import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    static var shared: SceneDelegate?
    var window: UIWindow?
    var webViewController: WebViewController?
    var fcmToken: String?
    var isLoadingScreenFinished = false // 🔥 Flaga blokująca przedwczesne przejście

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        SceneDelegate.shared = self
        self.window = UIWindow(windowScene: windowScene)

        let storyboard = UIStoryboard(name: "LoadingScreen", bundle: nil)
        guard let loadingVC = storyboard.instantiateViewController(withIdentifier: "LoadingViewController") as? LoadingViewController else {
            return
        }
        self.window?.rootViewController = loadingVC
        self.window?.makeKeyAndVisible()

        // ⏳ Zapewnienie minimalnego czasu ładowania ekranu
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.8) {
            self.isLoadingScreenFinished = true
            self.tryToLaunchWebView()
        }
    }

    func launchWebViewController() {
        guard webViewController == nil else {
            print("⚠️ WebViewController już działa, nie przeładowuję ponownie.")
            return
        }

        if let token = fcmToken, isLoadingScreenFinished {
            print("✅ Uruchamiam WebViewController z tokenem: \(token)")
            webViewController = WebViewController()
            webViewController?.fcmToken = token
            transitionToWebView()
        } else {
            print("⏳ Oczekiwanie na FCM token i zakończenie ekranu ładowania...")
        }
    }

    func tryToLaunchWebView() {
        if isLoadingScreenFinished, fcmToken != nil {
            launchWebViewController()
        } else {
            print("⏳ Oczekiwanie na spełnienie warunków do przejścia na WebView...")
        }
    }

    private func transitionToWebView() {
        guard let webVC = self.webViewController, let window = self.window else { return }

        // 🔄 Animacja: płynne przejście bez efektu rozsuwania
        UIView.animate(withDuration: 0.9, animations: {
            window.alpha = 0
        }) { _ in
            window.rootViewController = webVC
            UIView.animate(withDuration: 0.9) {
                window.alpha = 1
            }
        }
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        if #available(iOS 17.0, *) {
            UNUserNotificationCenter.current().setBadgeCount(0)
        } else {
            UIApplication.shared.applicationIconBadgeNumber = 0
        }
    }

    func sceneWillResignActive(_ scene: UIScene) {}
    func sceneWillEnterForeground(_ scene: UIScene) {}
    func sceneDidEnterBackground(_ scene: UIScene) {}
}
