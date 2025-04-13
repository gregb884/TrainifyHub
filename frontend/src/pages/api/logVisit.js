export default async function handler(req, res) {
    console.log("📌 API /api/logVisit zostało wywołane");

    if (req.method !== "POST") {
        console.log("❌ Błąd: Nieobsługiwana metoda", req.method);
        return res.status(405).json({ error: "Metoda nieobsługiwana" });
    }

    const { page, token } = req.body;

    if (!page || !token) {
        console.log("❌ Błąd: Brak wymaganych danych");
        return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    console.log(`📌 LOG: Użytkownik wszedł na ${page} z tokenem: ${token}`);

    res.status(200).json({ message: "Zalogowano wizytę!" });
}