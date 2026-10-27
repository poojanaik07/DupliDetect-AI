import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './UploadSection.css';

const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const processFile = (file) => {
    setFileName(file.name);
    setUploadState('uploading');
    
    // Simulate upload progress
    setTimeout(() => {
      setUploadState('success');
    }, 2500);
  };

  return (
    <section className="upload-section" id="upload">
      <div className="upload__container">
        <div className="upload__header">
          <span className="upload__label">Try It Out</span>
          <h2 className="upload__title">Analyze Your Dataset Now</h2>
          <p className="upload__subtitle">Securely upload your CSV for instant AI deduplication.</p>
        </div>

        <div className="upload__box-wrap">
          <div 
            className={`upload__box ${dragActive ? 'upload__box--drag-active' : ''} upload__box--${uploadState}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              ref={inputRef} 
              type="file" 
              accept=".csv" 
              onChange={handleChange} 
              className="upload__input" 
            />

            {uploadState === 'idle' && (
              <div className="upload__content">
                <div className="upload__icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                </div>
                <h3 className="upload__box-title">Drag & Drop your CSV file here</h3>
                <p className="upload__box-desc">or click to browse your files (Max size: 50MB)</p>
                <button className="upload__btn" onClick={onButtonClick}>
                  Upload Dataset
                </button>
              </div>
            )}

            {uploadState === 'uploading' && (
              <div className="upload__content upload__content--loading">
                <div className="upload__spinner">
                  <div className="upload__spinner-ring"></div>
                  <div className="upload__spinner-core"></div>
                </div>
                <h3 className="upload__box-title">Scanning '{fileName}'...</h3>
                <p className="upload__box-desc">Our AI is parsing the columns</p>
              </div>
            )}

            {uploadState === 'success' && (
              <div className="upload__content upload__content--success">
                <div className="upload__icon upload__icon--success">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="upload__box-title">Ready for deduplication!</h3>
                <p className="upload__box-desc"><strong>{fileName}</strong> successfully loaded.</p>
                <div className="upload__success-actions">
                  <Link to="/auth" className="upload__btn upload__btn--primary" style={{ textDecoration: 'none' }}>
                    Start AI Scan <span>→</span>
                  </Link>
                  <button className="upload__btn" onClick={(e) => { e.stopPropagation(); window.parent.postMessage('goto:dashboard', '*'); }}>
                    Open AI Dashboard <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
