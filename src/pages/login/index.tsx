import {
  Modal, Form, Input, Title, Button, Paragraph,
} from 'components';
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from 'services/firebase';
import { Login, User } from 'types';
import {
  checkUserOnDatabase,
  createUserOnDatabase,
} from 'services/firebase/firestore';
import { useRecoilState } from 'recoil';
import { userState } from 'recoil/user/atoms';
import { RegisterModalProps } from './types';

function RegisterModal({ openModal, setOpenModal } : RegisterModalProps) {
  const [, setUser] = useRecoilState(userState);
  const createAccount = (e: React.FormEvent, type: 'google' | 'email') => {
    const form = document.getElementById('register-form') as HTMLFormElement;
    const [name, surname, email, password] = Object.values(
      form.getElementsByTagName('input'),
    );

    e.preventDefault();

    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((authUser) => {
        const registerUser: Login = {
          type,
          name: name.value,
          surname: surname.value,
          email: email.value,
          password: password.value,
        };

        const userAuth : User = {
          email: authUser.user.email,
          uid: authUser.user.uid,
          displayName: `${name.value} ${surname.value}`,
          emailVerified: authUser.user.emailVerified,
        };

        setUser(userAuth);
        createUserOnDatabase(registerUser);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Modal>
      <button type="button" onClick={() => setOpenModal(!openModal)}>X</button>
      <Form id="register-form">
        <Title level={1}>Criar conta</Title>
        <Paragraph>
          Tenha acesso a uma grande variedade de entretenimento em qualquer
          lugar, a qualquer momento.
        </Paragraph>
        <Input type="text" placeholder="Nome" name="name" />
        <Input type="text" placeholder="Sobrenome" name="surname" />
        <Input type="email" placeholder="Endereço de e-mail" name="email" />
        <Input
          type="password"
          placeholder="Senha"
          info="A senha deve ter pelo menos 8 caracteres e incluir um número ou caractere especial."
          name="password"
        />
        <Button type="submit" onClick={(e) => createAccount(e, 'email')}>
          Criar Conta
        </Button>
      </Form>
    </Modal>
  );
}

export function LoginPage() {
  const [, setUser] = useRecoilState(userState);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const loginAccount = (e: React.FormEvent, type: 'google' | 'email') => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const [email, password] = Object.values(form.getElementsByTagName('input'));

    e.preventDefault();

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((authUser) => {
        const userAuth : User = {
          email: authUser.user.email,
          uid: authUser.user.uid,
          displayName: authUser.user.displayName,
          emailVerified: authUser.user.emailVerified,
        };

        setUser(userAuth);

        checkUserOnDatabase(authUser.user);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <>
      {openModal && <RegisterModal openModal={openModal} setOpenModal={setOpenModal} />}
      <Form id="login-form">
        <Input type="email" placeholder="E-mail" name="email" />
        <Input type="password" placeholder="Senha" name="password" />
        <Button type="submit" onClick={(e) => loginAccount(e, 'email')}>
          Entrar
        </Button>
      </Form>
      <button type="button">Entrar com Google</button>
      <button type="button" onClick={() => setOpenModal(!openModal)}>Cadastrar</button>
    </>
  );
}
