import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  BarChart2, 
  Globe, 
  Settings, 
  Cpu, 
  Layers, 
  Copy, 
  Package, 
  Target, 
  PieChart, 
  Download,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import './Dashboard.css';
import './UploadSection.css'; // Reuse landing page upload styles

const DASHBOARD_STEPS = [
  { id: 'upload', label: 'Upload Dataset', icon: Upload },
  { id: 'analyze', label: 'Analyze Dataset', icon: BarChart2 },
  { id: 'languages', label: 'Detect Languages', icon: Globe },
  { id: 'preprocess', label: 'Preprocess Text', icon: Settings },
  { id: 'embeddings', label: 'Generate Embeddings', icon: Cpu },
  { id: 'similarity', label: 'Calculate Similarity', icon: Layers },
  { id: 'duplicates', label: 'Identify Duplicates', icon: Copy },
  { id: 'clusters', label: 'Create Clusters', icon: Package },
  { id: 'confidence', label: 'Confidence Score', icon: Target },
  { id: 'visualize', label: 'Visualize Results', icon: PieChart },
  { id: 'export', label: 'Export Dataset', icon: Download },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('upload');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Upload Logic
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle');
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const processFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      alert("Please upload a CSV file only.");
      return;
    }
    setFileName(file.name);
    setUploadState('uploading');
    setTimeout(() => setUploadState('success'), 2000);
  };

  const activeStepData = DASHBOARD_STEPS.find(s => s.id === activeStep);

  const renderContent = () => {
    const Icon = activeStepData?.icon || FileText;

    switch (activeStep) {
      case 'upload':
        return (
          <div className="dash-main__content-inner">
            <h2 className="dash-main__title">Upload Dataset</h2>
            <p className="dash-main__subtitle">Securely upload your CSV for instant AI deduplication.</p>
            
            <div className="upload__box-wrap" style={{ maxWidth: '100%' }}>
              <div 
                className={`upload__box ${dragActive ? 'upload__box--drag-active' : ''} upload__box--${uploadState}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => uploadState === 'idle' && inputRef.current.click()}
                style={{ cursor: uploadState === 'idle' ? 'pointer' : 'default' }}
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
                      <Upload size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="upload__box-title">Drag & Drop your CSV file here</h3>
                    <p className="upload__box-desc">or click to browse your files (Max size: 50MB)</p>
                    <button className="upload__btn" onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}>
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
                      <button className="upload__btn upload__btn--primary" onClick={(e) => { e.stopPropagation(); setActiveStep('analyze'); }}>
                        Continue to Analysis <span>→</span>
                      </button>
                      <button className="upload__btn--text" onClick={(e) => { e.stopPropagation(); setUploadState('idle'); }}>
                        Upload another file
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="dash-main__content-inner">
            <h2 className="dash-main__title">{activeStepData?.label}</h2>
            <p className="dash-main__subtitle">Operation: {activeStep}</p>
            <div className="dash-placeholder">
               <div className="dash-placeholder__icon">
                  <Icon size={64} strokeWidth={1} />
               </div>
               <h3>Module Ready</h3>
               <p>This module will be activated once a valid dataset is processed through the previous steps.</p>
               <div className="dash-placeholder__loader">
                  <div className="dash-placeholder__loader-bar"></div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`dash-sidebar ${isSidebarOpen ? '' : 'dash-sidebar--closed'}`}>
        <div className="dash-sidebar__header">
          <div className="dash-sidebar__logo">
             <div className="dash-sidebar__logo-icon"></div>
             <span>DupliDetect AI</span>
          </div>
          <button className="dash-sidebar__toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="dash-sidebar__nav">
          {DASHBOARD_STEPS.map((step) => (
            <button
              key={step.id}
              className={`dash-sidebar__item ${activeStep === step.id ? 'dash-sidebar__item--active' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <span className="dash-sidebar__item-icon">
                <step.icon size={18} strokeWidth={activeStep === step.id ? 2.5 : 2} />
              </span>
              <span className="dash-sidebar__item-label">{step.label}</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar__footer">
           <div className="dash-sidebar__user">
              <div className="dash-sidebar__user-avatar">JD</div>
              <div className="dash-sidebar__user-info">
                 <p className="dash-sidebar__user-name">John Doe</p>
                 <p className="dash-sidebar__user-plan">Pro Plan</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="dash-main">
        <header className="dash-main__header">
           <div className="dash-main__breadcrumb">
              <span>Workspace</span> / <span>Dashboard</span> / <span className="active">{activeStepData?.label}</span>
           </div>
           <div className="dash-main__actions">
              <button className="dash-main__btn-icon"><Bell size={18} /></button>
              <button className="dash-main__btn-icon"><Settings size={18} /></button>
              <button className="dash-main__logout" onClick={() => navigate('/')}>
                <LogOut size={14} style={{ marginRight: '8px' }} />
                Logout
              </button>
           </div>
        </header>

        <section className="dash-main__content">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
