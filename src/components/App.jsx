import { useCallback, useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import ImagePopup from "./popups/ImagePopup";
import { useUser } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./popups/EditProfilePopup";
import AddPlacePopup from "./popups/AddPlacePopup";
import EditAvatarPopup from "./popups/EditAvatarPopup";
import Api from "../utils/Api";
import PopupWithForm from "./popups/PopupWithForm";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [deletedCard, setDeletedCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useUser();

  useEffect(() => {
    Api.getCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => console.error(err.message));
  }, []);

  const closeAllPopups = useCallback(() => {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setDeletedCard(null);
    setSelectedCard(null);
  }, []);

  const handleCardLike = useCallback(
    (card) => {
      const isLiked = card.likes.some((i) => i._id === currentUser._id);

      Api.setLikeStatus(card._id, !isLiked)
        .then((newCard) => {
          const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
          setCards(newCards);
        })
        .catch((err) => console.error(err.message));
    },
    [cards, currentUser]
  );

  const handleCardDelete = useCallback(() => {
    return Api.removeCard(deletedCard._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== deletedCard._id);
        setCards(newCards);
        setDeletedCard(null);
      })
      .catch((err) => console.error(err.message));
  }, [deletedCard, cards]);

  const handleUpdateAvatar = useCallback(
    (data) => {
      return Api.setAvatar(data)
        .then((user) => {
          closeAllPopups();
          setCurrentUser(user);
        })
        .catch((err) => console.error(err.message));
    },
    [closeAllPopups, setCurrentUser]
  );

  const handleUpdateUser = useCallback(
    (data) => {
      return Api.patchUser(data)
        .then((user) => {
          setCurrentUser(user);
          closeAllPopups();
        })
        .catch((err) => console.error(err.message));
    },
    [closeAllPopups, setCurrentUser]
  );

  const handleAddCard = useCallback(
    (data) => {
      return Api.addCard(data)
        .then((newCard) => {
          setCards((prev) => [newCard, ...prev]);
          closeAllPopups();
        })
        .catch((err) => console.error(err.message));
    },
    [closeAllPopups]
  );

  return (
    <>
      <div className="wrapper">
        <Header />
        <Main
          onEditProfile={() => setEditProfilePopupOpen(true)}
          onAddPlace={() => setAddPlacePopupOpen(true)}
          onEditAvatar={() => setEditAvatarPopupOpen(true)}
          onCardClick={(card) => setSelectedCard(card)}
          onCardLike={handleCardLike}
          onCardDelete={setDeletedCard}
          cards={cards}
        />
        <Footer />
      </div>

      <ImagePopup onClose={closeAllPopups} card={selectedCard} />

      <EditProfilePopup
        onClose={closeAllPopups}
        isOpen={isEditProfilePopupOpen}
        onSubmit={handleUpdateUser}
      />

      <AddPlacePopup
        onClose={closeAllPopups}
        isOpen={isAddPlacePopupOpen}
        onSubmit={handleAddCard}
      />

      <EditAvatarPopup
        onClose={closeAllPopups}
        isOpen={isEditAvatarPopupOpen}
        onSubmit={handleUpdateAvatar}
      />

      <PopupWithForm
        onClose={closeAllPopups}
        isOpen={deletedCard}
        name="confirm"
        title="Вы уверены?"
        buttonText="Да"
        onSubmit={handleCardDelete}
      />
    </>
  );
}

export default App;
