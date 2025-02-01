import { useState } from 'react'
import axios from 'axios'
import './FileUpload.css'
import { MdOutlineDriveFolderUpload } from "react-icons/md";
function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  
  const allowedExtensions = ['pdf', 'xlsx', 'xls', 'doc', 'docx', 'csv', 'txt', 'jpg', 'jpeg', 'png', 'json']

 
  const isFileAllowed = (file) => {
    const extension = file.name.split('.').pop().toLowerCase()
    return allowedExtensions.includes(extension)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && !isFileAllowed(file)) {
      alert('Invalid file format')
      event.target.value = ''
      return
    }
    setSelectedFile(file)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    
    if (!isFileAllowed(file)) {
      alert('Invalid file format')
      return
    }
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      await axios.post('http://localhost:8000/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('File uploaded successfully!')
      setSelectedFile(null)
      document.getElementById('fileInput').value = ''
     // window.location.reload()
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.detail || error.message))
      console.error('Error details:', error.response || error)
    }
  }

  return (
    <div className="upload-section">
      <h2>Upload Files</h2>
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-zone-content">
          <i className="upload-icon"> <MdOutlineDriveFolderUpload /></i>
          <p><b>Drag & Drop files here</b><br/>
          Accepted formats: .pdf, .xlsx, .xls, .doc, .docx, .csv, .txt, .jpg, .jpeg, .png, .json
          </p>
          <p>or</p>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileSelect}
            className="file-input"
            accept=".pdf,.xlsx,.xls,.doc,.docx,.csv,.txt,.jpg,.jpeg,.png,.json"
          />
          <label htmlFor="fileInput" className="file-input-label">
            Choose File
          </label>
        </div>
      </div>
      {selectedFile && (
        <div className="selected-file">
          <p>Selected: {selectedFile.name}</p>
        </div>
      )}
      <button 
        onClick={handleUpload}
        disabled={!selectedFile}
        className="upload-button"
      >
        Upload File
      </button>
    </div>
  )
}

export default FileUpload 