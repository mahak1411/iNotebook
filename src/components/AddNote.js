import React, { useState , useContext } from 'react'
import NoteContext from '../context/notes/NoteContext'


const AddNote = (props) => {
    const context = useContext(NoteContext);
    const [note,setNote] = useState({title:"" , description : "" , tag : "default"})
  const {addNote} = context;

  const handleClick = (e)=>{
    e.preventDefault();
    addNote(note.title , note.description , note.tag);
    props.showAlert("Note added Successfully","success")
    setNote({title:"" , description : "" , tag : "default"})

  }

  const handleOnChange = (e)=>{
    setNote({...note , [e.target.name] : e.target.value})
  }
  return (
    <div className="container my-3">
        <h1>Add A Note</h1>

        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" name='title' id="title" aria-describedby="emailHelp" onChange={handleOnChange} value={note.title} required />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" name='description' onChange={handleOnChange} required value={note.description} />
          </div>
          <div className="mb-3 ">
          <label className="form-label" htmlFor="tag">Tag</label>
            <input type="text" className="form-control" id="tag" onChange={handleOnChange} value={note.tag} name='tag'/>
          </div>
          <button disabled={note.title.length < 3  || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add a Note</button>
        </form>
      </div>
  )
}

export default AddNote
