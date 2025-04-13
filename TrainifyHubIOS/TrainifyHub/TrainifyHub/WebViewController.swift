import UIKit
import WebKit

// Rozszerzenie do obsługi kolorów HEX
extension UIColor {
    convenience init(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")

        var rgb: UInt64 = 0
        Scanner(string: hexSanitized).scanHexInt64(&rgb)

        let red = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
        let green = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
        let blue = CGFloat(rgb & 0x0000FF) / 255.0

        self.init(red: red, green: green, blue: blue, alpha: 1.0)
    }
}

class WebViewController: UIViewController, WKUIDelegate, WKScriptMessageHandler, WKNavigationDelegate {
    
    var webView: WKWebView!
    var bottomSafeAreaView: UIView! // Dolny pasek
    var fcmToken: String?

    var isWebViewLoaded = false
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        NotificationCenter.default.addObserver(self, selector: #selector(handlePurchaseSuccess(_:)), name: NSNotification.Name("PurchaseSuccess"), object: nil)
        
        
        view.backgroundColor = UIColor(hex: "#34322E")

        // Ustawienia WebView Configuration
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.allowsInlineMediaPlayback = true
        webConfiguration.allowsPictureInPictureMediaPlayback = false
        webConfiguration.userContentController.add(self, name: "iosBridge")
        webConfiguration.userContentController.add(self, name: "purchaseSuccess")
        if #available(iOS 10.0, *) {
            webConfiguration.mediaTypesRequiringUserActionForPlayback = [] // 🟢 Zapobiega
        }

        // Tworzenie WebView
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.isHidden = true
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)

        let topColor = UIColor(hex: "#34322E") // Kolor górnego paska
        let bottomColor = UIColor.black // Kolor dolnego paska

        view.backgroundColor = topColor
        webView.backgroundColor = topColor
        webView.scrollView.backgroundColor = topColor
        
    
        
    
        
        let baseUrl = "https://www.trainifyhub.com/dashboard"
               let fullUrlString = fcmToken != nil ? "\(baseUrl)?token=\(fcmToken!)" : baseUrl

        if let url = URL(string: fullUrlString) {
                   webView.load(URLRequest(url: url))
               }



        // Wyłączenie efektu bounce (zapobiega przesuwaniu całej aplikacji)
        webView.scrollView.bounces = false

        // Ustawienie Constraints dla WebView (wypełnia ekran)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
        ])
        
        // 🔵 Dodanie dolnego paska
        bottomSafeAreaView = UIView()
        bottomSafeAreaView.backgroundColor = bottomColor
        bottomSafeAreaView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(bottomSafeAreaView)

        // Constraints dla dolnego paska
        NSLayoutConstraint.activate([
            bottomSafeAreaView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            bottomSafeAreaView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            bottomSafeAreaView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            bottomSafeAreaView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
        ])
    }
    


        // ✅ Funkcja do wyświetlenia alertu w aplikacji iOS
        func showAlert(title: String, message: String) {
            DispatchQueue.main.async {
                let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self.present(alert, animated: true, completion: nil)
            }
        }

   
    
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        isWebViewLoaded = true
        webView.isHidden = false
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "iosBridge" {
            print("📩 Otrzymano wiadomość z React: \(message.body)")

            let data: String = String(describing: message.body)

            if data == "buyProduct:ai_custom_plan" {
                Task {
                    PurchaseManager.shared.buyProduct(productID: "ai_custom_plan")
                }
            } else if data == "downloadPrice" {
                fetchAndSendPricesToReact()
            }
        }
        
        if message.name == "purchaseSuccess", let messageBody = message.body as? String {
            
            let data: String = String(describing: message.body)
            
            if data == "Not confirmed Payment" {
                
                print("📩 Otrzymano wiadomość z React: \(message.body)")
                
                showAlert(title: "Płatność nie powiodła się", message: messageBody)
            
            } else if data == "Confirm Payment" {
                
                print("📩 Otrzymano wiadomość Confirm Payment: \(message.body)")
                
                PurchaseManager.shared.completePendingTransaction()
                
                let newURL = URL(string: "https://www.trainifyhub.com/aiTrainingPlan")!
                            webView.load(URLRequest(url: newURL))
                
                showAlert(title: "Done", message: "You have access to AI Custom Plan")
                
            }
            
        
        }
    }
    

    
    
    func fetchAndSendPricesToReact() {
        let products = PurchaseManager.shared.products

        if products.isEmpty {
            print("⚠️ Brak pobranych produktów, pobieram je...")

            // Pobierz produkty i wyślij je do Reacta po załadowaniu
            PurchaseManager.shared.validate(productIdentifiers: ["ai_custom_plan"])
            
            // Ustaw opóźnione sprawdzenie i ponowną próbę wysłania cen
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                self.fetchAndSendPricesToReact()
            }
            return
        }

        // Jeśli produkty są dostępne, przekształcamy je w JSON
        var prices: [[String: String]] = []
        
        for product in products {
            let priceInfo: [String: String] = [
                "id": product.productIdentifier,
                "price": product.price.stringValue,
                "currency": product.priceLocale.currencySymbol ?? ""
            ]
            prices.append(priceInfo)
        }

        // Konwersja do JSON
        if let jsonData = try? JSONSerialization.data(withJSONObject: prices, options: []),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            let script = "window.receiveProductPrices(\(jsonString));"

            DispatchQueue.main.async {
                self.webView.evaluateJavaScript(script) { result, error in
                    if let error = error {
                        print("❌ Błąd wysyłania cen do React: \(error.localizedDescription)")
                    } else {
                        print("✅ Ceny wysłane do Reacta: \(jsonString)")
                    }
                }
            }
        }
    }
    
    @objc func handlePurchaseSuccess(_ notification: Notification) {
        guard let receipt = notification.userInfo?["receipt"] as? String else { return }
        
        let script = "window.receivePurchaseSuccess('\(receipt)');"
        
        DispatchQueue.main.async {
            self.webView.evaluateJavaScript(script) { result, error in
                if let error = error {
                    print("❌ Błąd wysyłania paragonu do React: \(error.localizedDescription)")
                } else {
                    print("✅ Paragon wysłany do Reacta: \(receipt)")
                }
            }
        }
    }
    
}
