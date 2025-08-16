import '../../assets/css/App.css'
import { Button } from "@/components/ui/button.tsx"
import GameLayout from "@/GameLayout.tsx";


function App() {

  return (
    <>
    <GameLayout>
                <Button className={"bg-amber-700"}  variant="outline">Play Game</Button>
    </GameLayout>

    </>
  )
}

export default App
