import { useEffect, useState } from 'react'
import axios from 'axios'
import './FileList.css'
import { MdDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { FaFileAlt } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";

function FileList() {
  const [files, setFiles] = useState([])
  const [showFiles, setShowFiles] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchFiles = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('http://localhost:8000/files')
      setFiles(response.data.files)
    } catch (error) {
      alert('Error fetching files: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/files/download/${filename}`,
        { responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Download failed: ' + error.message)
    }
  }

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:8000/files/${filename}`)
      alert('File deleted successfully!')
      fetchFiles()
    } catch (error) {
      alert('Delete failed: ' + error.message)
    }
  }

  const handleShowFiles = () => {
    setShowFiles(true)
    fetchFiles()
  }

  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="file-list">
      <h2>Your Files</h2>
      
      <div className="file-controls">
        {!showFiles ? (
          <button 
            className="show-files-button"
            onClick={handleShowFiles}
          >
            Show All Files
          </button>
        ) : (
          <div className="search-container">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button 
              className="refresh-button"
              onClick={fetchFiles}
              title="Refresh files"
            >
              <LuRefreshCcw />
            </button>
          </div>
        )}
      </div>

      {showFiles && (
        <div className="files-container">
          {isLoading ? (
            <div className="loading">Loading files...</div>
          ) : filteredFiles.length === 0 ? (
            <div className="no-files">
              {searchTerm ? (
                <>
                  <i className="empty-icon"><CiSearch/></i>
                  <p>No files match your search</p>
                </>
              ) : (
                <>
                  <i className="empty-icon"><FaFolder/></i>
                  <p>No files uploaded yet</p>
                </>
              )}
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div key={file} className="file-item">
                <div className="file-info">
                  <i className="file-icon"><FaFileAlt/></i>
                  <span className="file-name">{file}</span>
                </div>
                <div className="file-actions">
                  <button 
                    onClick={() => handleDownload(file)}
                    className="action-button download-button"
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                  <button 
                    onClick={() => handleDelete(file)}
                    className="action-button delete-button"
                    title="Delete"
                    
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default FileList 