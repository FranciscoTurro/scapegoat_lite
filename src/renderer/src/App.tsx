function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div>
      <div>many such cases.</div>
      <div>get the cat.</div>
    </div>
  )
}

export default App
