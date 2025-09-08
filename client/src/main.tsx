import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import  "./assets/css/App.css"
import GameLanding from "@/components/pages/GameLanding.tsx";
import GameSession from "@/components/pages/GameSession.tsx";
import React from "react";

//
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//
//           <GameLanding/>
//   </StrictMode>,
// )

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<GameLanding/>} />

                <Route path="/game" element={<GameSession />} />

                {/* Catch all unmatched routes */}
                {/*<Route path="*" element={<NotFound />} />*/}
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
