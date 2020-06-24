import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";
import ReactInputMask, { Props as InputProps } from "react-input-mask";

// import { Container } from './styles';
interface Props extends InputProps {
  name: string;
}

const InputMask: React.FC<Props> = ({ name, ...rest }) => {
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
      <ReactInputMask ref={inputRef} defaultValue={defaultValue} {...rest} />
      {error ? <span style={{ color: "#ff0000" }}>{error}</span> : ""}
    </div>
  );
};

export default InputMask;
