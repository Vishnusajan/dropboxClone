import FileUpload from './components/FileUpload'
import FileList from './components/FileList'
import './App.css'

function App() {
  return (
    <div className="container">
      <h1>Dropbox Clone</h1>
      <div className="split-layout">
        <div className="left-panel">
          <FileList />
        </div>
        <div className="right-panel">
          <FileUpload />
        </div>
      </div>
    </div>
  )
}

export default App
