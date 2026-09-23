import { useState } from 'react';

const UpdateRecommendations = () => {
  const [recommendation, setRecommendation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Reset form fields
    // setRecommendation('');
  };

  return (
    <>
      <form id="class" onSubmit={handleSubmit}>
        <input type="radio" id="yes" name="fav_language" value="HTML"/>
        <label htmlFor="yes">HTML</label><br/>
        <input type="radio" id="no" name="fav_language" value="CSS"/>
        <label htmlFor="no">CSS</label><br/>
      </form>
    </>
  )
};

export default UpdateRecommendations;
