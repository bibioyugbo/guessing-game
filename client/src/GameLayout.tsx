import guessBg from "./assets/img/guess-bg.jpg"
import type {ReactNode} from "react";


interface GameLayoutProps{
    children:ReactNode,
    customClass?:string
}
export default function GameLayout({children, customClass}:GameLayoutProps) {

    return (
        <>
            <div style={{display:"flex",alignItems:"center", width:"100%", justifyContent:"center", backgroundImage: `url(${guessBg})`, height:"100vh"}}>
                <div className={customClass??''} style={{alignItems:"center", borderRadius:"8px",padding:"30px",gap:10, justifyContent:"center",zIndex:"99",flexDirection:"column", display:"flex",}}>
                    {children}
                </div>
            </div>

        </>
    )
}

