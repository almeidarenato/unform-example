import React, { useEffect, useRef } from "react";
import { Form } from "@unform/web";
import { Scope, FormHandles } from "@unform/core";
import Input from "./components/Input";
import InputMask from "./components/InputMask";
import { SyntheticEvent } from "react";
import * as Yup from "yup";

interface Cadastro {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: {
    rua: string;
    numero: string;
  };
}

function SignIn() {
  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    try {
      fetch("http://localhost:3000/cadastro")
        .then((response) => {
          return response.json();
        })
        .then((cadastros: Cadastro[]) => {
          formRef.current?.setData({
            nome: cadastros[0].nome,
            email: cadastros[0].email,
            endereco: {
              rua: cadastros[0].endereco.rua,
              numero: cadastros[0].endereco.numero,
            },
          });
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleSubmit = async (data: Cadastro) => {
    console.log(formRef.current?.getData());
    try {
      const schema = Yup.object().shape({
        nome: Yup.string().required("O nome é obrigatório"),
        email: Yup.string()
          .email("Informe um e-mail válido")
          .required("Email obrigatório"),
        telefone: Yup.string().required("Telefone obrigatório"),
        cpf: Yup.string()
          .min(11, "Preencha com um cpf válido")
          .required("cpf é obrigatorio"),
        endereco: Yup.object().shape({
          rua: Yup.string().required("Informe a rua"),
          numero: Yup.string().required("Informe o número"),
        }),
        password: Yup.string()
          .min(5, "Informe pelo menos 5 caracteres para senha")
          .required("A senha é um campo obrigatório"),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      console.log(formRef.current?.getData());
      formRef.current?.setErrors({});
      formRef.current?.reset();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        let errorMessages: { [key in string]: string };
        errorMessages = {};
        error.inner.forEach((error: Yup.ValidationError) => {
          errorMessages[error.path] = error.message;
        });
        formRef.current?.setErrors(errorMessages);
      }
    }
  };
  const handleReset = (evt: SyntheticEvent) => {
    evt.preventDefault();
    formRef.current?.reset();
  };

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <label htmlFor="nome">Nome Completo:</label>
      <Input name="nome" type="text" placeholder="Seu nome" />
      <br />
      <label htmlFor="cpf">CPF:</label>
      <InputMask
        name="cpf"
        type="text"
        placeholder="999.999.999-99"
        mask="999.999.999-99"
      />
      <br />
      <label htmlFor="telefone">Telefone:</label>
      <InputMask
        name="telefone"
        type="text"
        placeholder="(99) 99999-9999"
        mask="(99) 99999-9999"
      />
      <br />
      <label htmlFor="email">E-mail:</label>
      <Input name="email" type="email" placeholder="email@email.com" />
      <br />
      <label htmlFor="password">Senha:</label>
      <Input name="password" type="password" />
      <br />
      <label htmlFor="passwordconfirm">Confirmar a Senha:</label>
      <Input name="passwordconfirm" type="password" />
      <br />
      <Scope path="endereco">
        <label htmlFor="rua">Rua:</label>
        <Input name="rua" type="text" placeholder="Rua xpto" />
        <br />
        <label htmlFor="Numero">Número:</label>
        <Input name="numero" type="number" placeholder="9999" />
        <br />
      </Scope>

      <button type="submit">Enviar</button>
      <button onClick={handleReset}>Limpar</button>
    </Form>
  );
}

export default SignIn;
