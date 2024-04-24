import React from 'react'
import Navbar from '../Components/Navbar'
import './../Css/CreatePost.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

function CreatePost() {

  return (
    <>
      <Navbar/>
      <div className="pageContainer">
        <div className='heading' >Add Your Own Blog!</div>

        <div className='inputArea'>
          <div><input type="text" className='topInputs' placeholder='Add a Title'/></div>
          <div><input type="text" className='topInputs' placeholder='Add a Description'/></div>
          
          <div className='imageAndCategory'>
            <div><input type="text" className='belowInputs' placeholder='Select an image'/></div>
            <select name="category" id="category">
              <option value="" selected>Select a category</option>
              <option value="education">Education</option>
              <option value="technology">Technology</option>
              <option value="travel">Travel</option>
              <option value="health">Health</option>
            </select>
          </div>

          <div className='quillDiv'>
          <ReactQuill 
            theme="snow" 
            className='Editor'
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'size': [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, 
                {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean']
              ],
            }}
          />
          </div>

        </div>

      </div>
    </>
  )
}

export default CreatePost