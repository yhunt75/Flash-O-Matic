import React, { useEffect, useState } from "react";
import { createCard, readDeck } from "../utils/api";
import ErrorMessage from "../Layout/ErrorMessage";
import { useParams, useHistory } from "react-router-dom";
import CardForm from "./CardForm";

function CreateCard() {
  //initialize
  const initialState = {
    front: "",
    back: "",
  };
  const { deckId } = useParams();
  const [formData, setFormData] = useState({ ...initialState });
  const [error, setError] = useState(undefined);
  const [deck, setDeck] = useState([]);
  const history = useHistory();

  //read deck by deck id and then set deck state
  useEffect(() => {
    readDeck(deckId).then(setDeck);
  }, [deckId]);

  // handle change
  const handleChange = ({ target }) => {
    const value = target.value;
    // set form
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };
  // reset
  const handleReset = (event) => {
    setFormData({ ...initialState });
  };
  // hendle submit
  const handleSubmit = (event) => {
    event.preventDefault(); // disable default behavior
    const abortController = new AbortController(); // create contrller
    // create card
    createCard(deckId, formData, abortController.signal) // grab a reference to controller using abortController.signal
      .then((data) => setFormData(data))
      .catch(setError);

    return () => abortController.abort(); // abort fetch request
  };
  // deck data by deck id (dependent on form id)
  useEffect(() => {
    if (formData.id) {
      history.push(`/decks/${deckId}`);
    }
  }, [formData.id, history, deckId]);

  if (error) {
    // if there is an error return message from ErrorMessage.js
    return <ErrorMessage error={error} />;
  }
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">
              <span className="oi oi-home" />
              Home
            </a>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            <a href={`/decks/${deckId}`}>{deck.name}</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <span className="oi oi-plus" /> Add Card
          </li>
        </ol>
      </nav>
      <h1>{deck.name}: Add Card</h1>
      <CardForm
        formData={formData}
        handleChange={handleChange}
        handleReset={handleReset}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default CreateCard;
