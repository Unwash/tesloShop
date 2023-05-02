import Head from "next/head"
import { FC } from "react";
import { Navbar, SideMenu } from "../ui";

interface Props {
    title:string,
    pageDescription:string;
    imageFullUrl?:string
    children:JSX.Element
}

export const ShopLayout:FC <Props> = ({children,title,pageDescription,imageFullUrl}) => {
  return (
    <>
    <Head>
        <title>
            {title}
        </title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />

        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}


    </Head>
    <nav>
    <Navbar />
    </nav>

    <SideMenu />
    
    <main style={{ margin:"80px auto", maxWidth:"1440px", padding:"0 30px" }}>
        {children}
    </main>

    <footer>

    </footer>

    </>
  )
}
