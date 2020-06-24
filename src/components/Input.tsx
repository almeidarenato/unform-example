import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";

// import { Container } from './styles';
interface Props {
  name: string;
}
type InputProps = JSX.IntrinsicElements["input"] & Props;

const Input: React.FC<InputProps> = ({ name, ...rest }) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return (
    <div>
      <input ref={inputRef} defaultValue={defaultValue} {...rest} />
      {error ? <span style={{ color: "#ff0000" }}>{error}</span> : ""}
    </div>
  );
};

export default Input;
