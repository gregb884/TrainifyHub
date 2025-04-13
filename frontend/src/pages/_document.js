import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps, pathname: ctx.pathname }; // Przekazujemy pathname
    }

    render() {
        const { pathname } = this.props; // Odbieramy pathname z getInitialProps()

        // Dynamiczne ustawienie atrybutu lang na podstawie pathname
        const getLang = () => {
            if (pathname === '/') return 'pl'; // Strona główna
            if (pathname.startsWith('/de')) return 'de'; // Niemieckie strony
            if (pathname.startsWith('/fr')) return 'fr'; // Francuskie strony
            return 'en'; // Domyślny język
        };

        return (
            <Html lang={getLang()}>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900&family=Russo+One&display=swap"
                        rel="stylesheet"/>
                    <link rel="manifest" href="/manifest.json"/>
                    <link rel="alternate" href="https://trainifyhub.com/" hrefLang="en"/>
                    <link rel="alternate" href="https://trainifyhub.com/pl" hrefLang="pl"/>
                    <link rel="alternate" href="https://trainifyhub.com/de" hrefLang="de"/>
                    <link rel="alternate" href="https://trainifyhub.com/" hrefLang="x-default"/>
                    <meta name="apple-mobile-web-app-capable" content="yes"/>
                    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;