import React, { useState, useEffect } from 'react';
import { PUB_UPLOAD_URL, PUBS_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useResearchInfoContext } from '../../hooks/useResearchInfoContext';
import { useNavigate } from "react-router-dom";
import './pubupload.css';

function PubUpload() {
  const navigate = useNavigate()

  const { user, userDispatch } = useAuthContext()
  const { pubs, researchInfoDispatch } = useResearchInfoContext()

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const [title, setTitle] = useState('')
  const [authors, setAuthors] = useState('')
  const [publication_year, setPublicationYear] = useState('')
  const [isbn, setISBN] = useState('')

  const pubupload = async (e) => {
    e.preventDefault()

    const response = await fetch(PUB_UPLOAD_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: title,
        authors: authors,
        publication_year: publication_year,
        isbn: isbn,
      })
    })

    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      if (json.empty_fields)
        setEmptyFields(json.empty_fields)
    }

    if (response.ok) {
      setError(null)
      setEmptyFields([])
      setTitle('')
      setAuthors('')
      setPublicationYear('')
      setISBN('')
      
      // Fetch pubs if not already fetched
      if (!pubs) {
        const fetchPubs = async () => {
          const response = await fetch(PUBS_URL, {
            method: 'GET',
            credentials: 'include'
          })
    
          const data = await response.json()
          console.log(data)
          if (response.ok) {
            researchInfoDispatch({type: 'SET_PUBS', payload: data})
          }
        }
        fetchPubs()
      }
      else {
        // Update pubs
        researchInfoDispatch({ type: 'UPDATE_PUBS', payload: json })
      }
      // Navigate To Publications Page
      navigate('/research-info?page=publications', { state: { mssg: 'Publication Uploaded Successfully', status: 'ok' }})
    }
  };

  return (
    <>
      <h1 className="pubUploadPageHeader">Upload Publication Form</h1>
      <section className="pubUploadCard">
        <h1>Publication Information</h1>
        <form className="pubUpload" onSubmit={ pubupload }>
            <input 
              type="text" 
              onChange={(e) => setTitle(e.target.value)} 
              value={ title } 
              placeholder="Title"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <input 
              type="text" 
              onChange={(e) => setAuthors(e.target.value)} 
              value={ authors } 
              placeholder="Authors (Separate Each Author By A ,)"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <input 
              type="number" 
              onChange={(e) => setPublicationYear(e.target.value)} 
              value={ publication_year } 
              placeholder="Publication Year"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <input 
              type="text" 
              onChange={(e) => setISBN(e.target.value)} 
              value={ isbn } 
              placeholder="ISBN (Optional)"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <button>Add</button>
            {error && <div className="errorField">{ error }</div>}
        </form>
      </section>
    </>
  );


}

export default PubUpload;
