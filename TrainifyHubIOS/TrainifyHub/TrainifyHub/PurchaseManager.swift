import StoreKit
import os.log

class PurchaseManager: NSObject, SKProductsRequestDelegate, SKPaymentTransactionObserver {
    
    static let shared = PurchaseManager()
    private override init() {}

    var request: SKProductsRequest?
    var products = [SKProduct]()
    var pendingPurchase: String?
    var pendingTransaction: SKPaymentTransaction?

    // ✅ **Rejestracja obserwatora płatności**
    func startObserving() {
        SKPaymentQueue.default().add(self)
        print("👀 Obserwowanie kolejki płatności...")
        finishUnfinishedTransactions() // Sprawdzenie czy są stare transakcje
    }

    // ✅ **Sprawdzanie i czyszczenie starych transakcji**
    private func finishUnfinishedTransactions() {
        let queue = SKPaymentQueue.default()
        let transactions = queue.transactions
        
        if !transactions.isEmpty {
            print("🔎 Zaległe transakcje do zamknięcia...")
        }
        
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased, .failed, .restored:
                print("🛑 Zamykam transakcję: \(transaction.payment.productIdentifier) - Status: \(transaction.transactionState.rawValue)")
                queue.finishTransaction(transaction)
            default:
                break
            }
        }
    }

    // ✅ **Pobieranie produktów z App Store**
    func validate(productIdentifiers: [String]) {
        print("🔄 Rozpoczęto pobieranie produktów z App Store...")
        let productSet = Set(productIdentifiers)
        request = SKProductsRequest(productIdentifiers: productSet)
        request?.delegate = self
        request?.start()
    }

    // ✅ **Obsługa odpowiedzi z App Store**
    func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        if !response.products.isEmpty {
            products = response.products
            print("✅ Produkty pobrane: \(products.map { $0.localizedTitle })")

            // Jeśli było oczekujące żądanie zakupu, uruchom go teraz
            if let pendingProductID = pendingPurchase {
                pendingPurchase = nil
                buyProduct(productID: pendingProductID)
            }
        } else {
            print("❌ Nie znaleziono żadnych produktów!")
        }

        for invalidIdentifier in response.invalidProductIdentifiers {
            print("⚠️ Niepoprawny identyfikator produktu: \(invalidIdentifier)")
        }
    }

    // ✅ **Zakup produktu**
    func buyProduct(productID: String) {
        // Jeśli produkty nie zostały pobrane → pobierz je najpierw
        if products.isEmpty {
            print("⏳ Produkty jeszcze nie są dostępne! Pobieram...")
            pendingPurchase = productID
            validate(productIdentifiers: [productID])
            return
        }

        // Wyszukaj produkt na podstawie ID
        guard let product = products.first(where: { $0.productIdentifier == productID }) else {
            os_log("❌ Produkt %@ nie został znaleziony!", productID)
            return
        }

        if SKPaymentQueue.canMakePayments() {
            let payment = SKPayment(product: product)
            SKPaymentQueue.default().add(payment)
            print("🛒 Rozpoczęcie zakupu: \(product.localizedTitle)")
        } else {
            print("⚠️ Płatności są wyłączone na tym urządzeniu.")
        }
    }
    


    // ✅ **Obsługa transakcji**
    func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
            for transaction in transactions {
                switch transaction.transactionState {
                case .purchased:
                    print("✅ Zakup zakończony sukcesem!")

                    if let receipt = getReceiptData() {
                        
                        pendingTransaction = transaction
                                                           
                        
                        DispatchQueue.main.async {
                                    NotificationCenter.default.post(name: NSNotification.Name("PurchaseSuccess"), object: nil, userInfo: ["receipt": receipt])
                                }
                        
                        
                                }

                case .failed:
                    print("❌ Zakup nieudany: \(transaction.error?.localizedDescription ?? "Brak informacji o błędzie")")
                    SKPaymentQueue.default().finishTransaction(transaction)

                case .restored:
                    print("✅ Zakup przywrócony.")
                    SKPaymentQueue.default().finishTransaction(transaction)

                default:
                    break
                }
            }
        }
    
    func completePendingTransaction() {
        guard let transaction = pendingTransaction else {
            print("⚠️ Brak oczekującej transakcji do zamknięcia.")
            return
        }
        
        print("🔒 Zamykam transakcję po potwierdzeniu!")
        SKPaymentQueue.default().finishTransaction(transaction)
        pendingTransaction = nil
    }
    
    func getReceiptData() -> String? {
        guard let url = Bundle.main.appStoreReceiptURL else {
            print("❌ Brak paragonu transakcji.")
            return nil
        }
        do {
            let receiptData = try Data(contentsOf: url)
            return receiptData.base64EncodedString()
        } catch {
            print("❌ Błąd pobierania paragonu: \(error.localizedDescription)")
            return nil
        }
    }
}
