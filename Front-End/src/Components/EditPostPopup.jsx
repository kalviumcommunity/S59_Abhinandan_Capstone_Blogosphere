import React from 'react';
import Button from '@mui/material/Button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Css/EditPostPopup.css'

const EditPostPopup = ({ editedTitle, editedDescription, editedContent, handleUpdate, handleCancelEdit, setEditedTitle, setEditedDescription, setEditedContent }) => {
  return (
    <div className="edit-post-popup">
      <div className="edit-post-popup-content">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type='text'
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Description"
        />
        <ReactQuill
          value={editedContent}
          onChange={(content) => setEditedContent(content)}
          placeholder="Content"
          modules={{
            toolbar: [
              [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
              [{ 'size': [] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' },
              { 'indent': '-1' }, { 'indent': '+1' }],
              ['clean']
            ],
          }}
        />
        <div>
          <Button onClick={handleUpdate} variant="contained" style={{ backgroundColor: '#26653e', color: '#fff', marginRight: '10px' }}>Update</Button>
          <Button onClick={handleCancelEdit} variant="outlined" style={{ color: '#26653e', borderColor: '#26653e' }}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default EditPostPopup;
