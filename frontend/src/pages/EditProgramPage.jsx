import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CurrentUserContext from '../contexts/current-user-context';
import { deleteProgram, getProgramById, updateProgram } from '../adapters/program-adapter';
import "./EditProgramPage.css"

export default function EditProgramPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [confirm, setConfirm] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);
  const [program, setProgram] = useState(null);
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [about, setAbout] = useState('');
  const [borough, setBorough] = useState('');
  const [url, setUrl] = useState('');
  
  const boroughs = [
    "Bronx",
    "Brooklyn",
    "Manhattan",
    "Queens",
    "Staten Island",
  ];

  useEffect(() => {
    const fetchProgram = async () => {
      const [fetchedProgram] = await getProgramById(id);
      if (fetchedProgram === null) navigate('/opportunities')
      setProgram(fetchedProgram);
      setName(fetchedProgram.name);
      setPicture(fetchedProgram.imgUrl);
      setAbout(fetchedProgram.bio);
      setBorough(fetchedProgram.borough);
      setUrl(fetchedProgram.websiteUrl);
    };

    fetchProgram();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProgram = {
      id,
      name,
      img_url : picture,
      bio: about,
      borough,
      website_url : url,
      organization_id : currentUser.id
    };
    await updateProgram(updatedProgram);
    navigate(`/opportunities`);
  };

  const handleDelete = async () => {
    const organization = await deleteProgram(id);
    return navigate('/opportunities')
  }

  if (!program) {
    return <div>Loading...</div>;
  }

  return (
    <section className="section edit-program-wrapper">
      <div className="container edit-program-container">
        <h1 className="title">Edit Program</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name" className="label">
              Name
            </label>
            <div className="control">
              <input
                id="name"
                className="input"
                type="text"
                placeholder="Enter program name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="picture" className="label">
              Picture
            </label>
            <div className="control">
              <input
                id="picture"
                className="input"
                type="text"
                placeholder="Enter picture URL"
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="about" className="label">
              About
            </label>
            <div className="control">
              <textarea
                id="about"
                className="textarea"
                placeholder="Enter program description"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="field">
            <label htmlFor="borough" className="label">
              Borough
            </label>
            <div className="control">
              <div className="select">
                <select
                  id="borough"
                  value={borough}
                  onChange={(e) => setBorough(e.target.value)}
                >
                  <option value="">Select a borough</option>
                  {boroughs.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="url" className="label">
              URL
            </label>
            <div className="control">
              <input
                id="url"
                className="input"
                type="text"
                placeholder="Enter program URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button type="submit" className="button is-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
        <div id="delete-container">
        <button id="program-delete" onClick={handleDelete}>DELETE PROGRAM</button>
        </div>
      </div>
    </section>
  );
}
