import { useField } from "formik";
import classNames from "classnames";

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="form__group">
      <input
        className={classNames("form__input", {
          invalid: meta.touched && meta.error,
          valid: meta.touched && !meta.error,
          filled: meta.value,
        })}
        {...field}
        {...props}
      />
      <label className="form__label" htmlFor={props.id || props.name}>
        {label}
      </label>
      {meta.touched && meta.error ? (
        <p className="form__error">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default TextInput;
