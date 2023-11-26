'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import axios, * as others from 'axios'
import Link from 'next/link'
import styles from './page.module.css'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'

export default function Login () {
    const schema = yup.object({
        email: yup.string().email('O e-mail é inválido.').required('Um e-mail precisa ser informado.'),
        password: yup.string().required('Uma senha precisa ser informada.')
    });

    const [msg, setMsg] = useState('');

    const form = useForm({
        resolver: yupResolver(schema)
    });

    const {register, handleSubmit, formState} = form;

    const {errors} = formState;

    const router = useRouter();

    const submit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/login', data);
            
            const token = response.data.token; // extrai o token

            console.log('token: ');
            console.log(token); // remover /!\

            sessionStorage.setItem('token', token);

            if(token)router.push('/session');
        } catch (error) {
            setMsg(error.response.data);
        }
    }
    
    return (
        <main className={styles['outro']}>
            <h2>Entre para acessar os serviços!</h2>

            <form onSubmit={handleSubmit(submit)} noValidate className={styles['login']}>
                <label htmlFor='email'>E-mail</label>
                <input type='text' id='email' {...register('email')} />
                <p className={styles['erro']}>{errors.email?.message}</p>

                <label htmlFor='password'>Senha</label>
                <input type='password' id='password' {...register('password')} />
                <p className={styles['erro']}>{errors.password?.message}</p>

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