import React from 'react';
import Button from '@mui/material/Button';
import '../Css/DeleteConfirmation.css'

const DeleteConfirmation = ({ handleDelete, setDeleteConfirmation }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>Are you sure you want to delete this blog?</p>
        <div className='delete-popup-btns'>
          <Button onClick={handleDelete} variant="contained" style={{ backgroundColor: '#26653e', color: '#fff' }}>Yes</Button>
          <Button variant="outlined" onClick={() => setDeleteConfirmation(null)} style={{ color: '#26653e', borderColor: '#26653e' }}>No</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
