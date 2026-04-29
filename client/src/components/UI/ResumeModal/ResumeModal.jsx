import React from 'react';
import './ResumeModal.css';

const formatTime = (seconds) => {
  if (!seconds) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const ResumeModal = ({ watchedDuration, percentWatched, onResume, onRestart, onClose }) => {
  return (
    <div className="resume-modal__overlay">
      <div className="resume-modal">
        <h2>Tiếp tục xem phim?</h2>
        <p>Bạn đã xem phim này đến phút <strong>{formatTime(watchedDuration)}</strong> ({percentWatched}%).</p>
        
        <div className="resume-modal__options">
          <button 
            className="resume-modal__btn resume-modal__btn--resume" 
            onClick={onResume}
          >
            Tiếp tục xem
          </button>
          <button 
            className="resume-modal__btn resume-modal__btn--restart" 
            onClick={onRestart}
          >
            Xem từ đầu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal; 