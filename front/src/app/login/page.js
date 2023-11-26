'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import axios, * as others from 'axios'
import Link from 'next/link'
import styles from './page.module.css'

export default function Login () {
    const [msg, setMsg] = useState('');

    const form = useForm();

    const {register, handleSubmit, formState} = form;

    const submit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/login', data);
            
            const token = response.data.token; // extrai o token

            sessionStorage.setItem('token', token);

            if(token)setMsg('Login autenticado!'); // troque para router.push('/session');
        } catch (error) {
            setMsg(error.response.data);
        }
    }
    
    return (
        <main className={styles['outro']}>
            <h2>Entre para acessar os serviços!</h2>

            <form onSubmit={handleSubmit(submit)} noValidate className={styles['login']}>
                <label htmlFor='email'>E-mail</label>
                <input type='text' id='email' {...register('email')} className={styles['entrada']} />

                <label htmlFor='password'>Senha</label>
                <input type='password' id='password' {...register('password')} className={styles['entrada']} />

                <button className={styles['botao']}>Entrar</button>
            </form>

            <p>{msg}</p>

            <div className={styles['cadastro']}>
                <p>Não possui conta?</p>
                <Link href='/register' className={styles['ancora']}>Cadastro</Link>
            </div>
        </main>
    )
}