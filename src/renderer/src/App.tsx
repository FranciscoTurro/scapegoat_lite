import { Button } from './components/ui/button'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div>
      <div>many such cases.</div>
      <div>get the cat.</div>
      <Button>aaaaaaaaaaaaaaaaaa</Button>
    </div>
  )
}

export default App
