export default async function handler(req, res) {

    const cookies = req.headers.cookie || "";


    const tokenCookie = cookies.split("; ").find(row => row.startsWith("token="));

    if (!tokenCookie) {
        return res.status(401).json({ error: "Brak tokena w ciastkach!" });
    }

    const token = tokenCookie.split("=")[1];

    return res.json({
        authToken: token,
    });
}