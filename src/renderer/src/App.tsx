import { useState } from 'react'
import { Button } from './components/ui/button'

function App(): React.JSX.Element {
  const [card, setCard] = useState<unknown>(null)

  const handleClick = async () => {
    const result = await window.api.getCardById(13839120)
    console.log(result)
    setCard(result)
  }

  return (
    <div>
      <Button onClick={handleClick}>Get card</Button>
      {card && <pre>{JSON.stringify(card, null, 2)}</pre>}
    </div>
  )
}

export default App
