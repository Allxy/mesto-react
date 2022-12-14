import { memo, useEffect } from "react";
import { useUser } from "../../contexts/CurrentUserContext";
import useForm from "../../hooks/useForm";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup({ onClose, isOpen, onSubmit }) {
  const { values, errors, isValid, onChange, resetForm } = useForm({
    name: "",
    about: "",
  });
  const [currentUser] = useUser();

  useEffect(() => {
    if (isOpen) {
      resetForm({ name: currentUser.name, about: currentUser.about });
    }
  }, [isOpen, resetForm, currentUser]);

  function handleSubmit() {
    return onSubmit(values)
  }

  const inputErrorClass = (error) =>
    "popup__input-error" + (error ? " popup__input-error_active" : "");

  return (
    <PopupWithForm
      onClose={onClose}
      isOpen={isOpen}
      name="edit"
      title="Редактировать профиль"
      onSubmit={handleSubmit}
      isValid={isValid}
    >
      <input
        className="popup__input popup__input_type_name"
        placeholder="Имя"
        type="text"
        name="name"
        required
        minLength="2"
        maxLength="40"
        autoComplete="off"
        id="edit-name-input"
        value={values.name}
        onChange={onChange}
      />
      <span className={inputErrorClass(errors.name)} id="edit-name-input-error">
        {errors.name}
      </span>
      <input
        className="popup__input popup__input_type_about"
        placeholder="О себе"
        type="text"
        name="about"
        required
        minLength="2"
        maxLength="200"
        autoComplete="off"
        id="edit-about-input"
        value={values.about}
        onChange={onChange}
      />
      <span
        className={inputErrorClass(errors.about)}
        id="edit-about-input-error"
      >
        {errors.about}
      </span>
    </PopupWithForm>
  );
}

export default memo(EditProfilePopup);
