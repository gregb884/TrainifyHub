import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const authOptions = {

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.idToken = token.idToken;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: `${process.env.NEXTAUTH_URL}/api/auth/signin`,
        signOut: `${process.env.NEXTAUTH_URL}/api/auth/signout`,
        error: `${process.env.NEXTAUTH_URL}/api/auth/error`,
    },
};

export default NextAuth(authOptions);