import UIKit
import Lottie

class LoadingViewController: UIViewController {
    
    private var animationView: LottieAnimationView!
    
    override func viewDidLoad() {
            super.viewDidLoad()
            animationView = LottieAnimationView(name: "loadingAnimation")
            animationView.frame = CGRect(x: 0, y: 0, width: 100, height: 100)
            animationView.center = CGPoint(x: view.center.x, y: view.center.y + 100)
            animationView.contentMode = .scaleAspectFit
            animationView.loopMode = .loop
            animationView.play()
            
            view.addSubview(animationView)
        }
}
