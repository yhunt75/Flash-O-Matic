import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { updateDeck, readDeck, createDeck } from "../utils/api";
import ErrorMessage from "../Layout/ErrorMessage";

function EditDeck() {
  // initialize
  const { deckId } = useParams();
  const initialState = {
    name: "",
    description: "",
  };
  const [formData, setFormData] = useState({ ...initialState });
  const [error, setError] = useState(undefined);
  const history = useHistory();

  // if deck exists then read deck
  useEffect(() => {
    if (deckId) {
      readDeck(deckId).then(setFormData);
    }
  }, [deckId]);

  // change hendler
  const handleChange = ({ target }) => {
    const value = target.value;
    // set form state
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };
  // reset handler
  const handleReset = (event) => {
    // if deck id exists then read deck and set the form data
    if (deckId) {
      readDeck(deckId).then(setFormData);
    } else {
      // otherwise set form state to the initialized state
      setFormData({ ...initialState });
    }
  };
  // sumbit handler
  const handleSubmit = (event) => {
    event.preventDefault(); // prevent default behavior (ex. page refresh)
    const abortController = new AbortController(); // see prev notes on abort controller
    // if deck exists
    if (deckId) {
      // call update deck function and associate a reference to the abort signal, navigate to deck and catch error
      updateDeck(formData, abortController.signal)
        .then(history.push(`/decks/${formData.id}`))
        .catch(setError);
    } else {
      // otherwise create a deck and associate a reference to the abort signal, navigate to deck and catch error
      createDeck(formData, abortController.signal)
        .then((data) => history.push(`/decks/${data.id}`))
        .catch(setError);
      return () => abortController.abort();
    }
    // if there is an error execute code in ErrorMessage.js
    if (error) {
      return <ErrorMessage error={error} />;
    }
  };
  // if form data exists then return the breadcrumb and form with form elements
  if (formData)
    return (
      <>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">
                <span className="oi oi-home" /> Home
              </a>
            </li>
            <li className="breadcrumb-item">
              {deckId ? (
                <Link to={`/decks/${deckId}`}>{formData.name}</Link>
              ) : null}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {deckId ? "Edit Deck" : "Create Deck"}
            </li>
          </ol>
        </nav>
        <h1>{deckId ? "Edit Deck" : "Create Deck"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <textarea
              className="form-control"
              id="name"
              name="name"
              placeholder="Deck Name"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              placeholder="Description of Deck"
              onChange={handleChange}
              value={formData.description}
            />
          </div>
          <input
            className="btn btn-secondary mr-2"
            type="reset"
            onClick={handleReset}
            value="Reset"
          ></input>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </>
    );
}

export default EditDeck;
