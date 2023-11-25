'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import axios, * as others from 'axios'
import Link from 'next/link'
import styles from './page.module.css'

export default function Register () {
    const [msg, setMsg] = useState('');
    const [ok, setOk] = useState(false); // booleano para exibir o "fazer login?"

    const form = useForm();

    const {register, handleSubmit, formState} = form;

    const submit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/register', data);
            setMsg(response.data);
            if(response.data.includes('sucesso'))setOk(true);
        } catch (error) {
            setMsg(error.response.data);
        }
    }
    
    return (
        <main className={styles['outro']}>
            <h2>Cadastre-se para acessar os serviços!</h2>

            <form onSubmit={handleSubmit(submit)} noValidate className={styles['cadastro']}>
                <label htmlFor='username'>Apelido</label>
                <input type='text' id='username' {...register('username')} className={styles['entrada']} />

                <label htmlFor='email'>E-mail</label>
                <input type='text' id='email' {...register('email')} className={styles['entrada']} />

                <label htmlFor='password'>Senha</label>
                <input type='password' id='password' {...register('password')} className={styles['entrada']} />

                <button className={styles['botao']}>Entrar</button>
            </form>

            <p>{msg}</p>

            <div className={styles['login']} style={{visibility : ok ? 'visible' : 'hidden' }}>
                <p>Faça</p>
                <Link href='/login' className={styles['ancora']}>Login</Link>
            </div>
        </main>
    )
}