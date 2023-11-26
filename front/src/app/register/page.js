'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import axios, * as others from 'axios'
import Link from 'next/link'
import styles from './page.module.css'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'

export default function Register () {
    const schema = yup.object({
        username: yup.string().required('Um nome de usuário precisa ser informado.'),
        email: yup.string().email('O e-mail é inválido.').required('Um e-mail precisa ser informado.'),
        password: yup.string().min(4, 'A senha é insegura.').required('Uma senha precisa ser informada.'),
        confirmPassword: yup.string().required('Confirme sua senha!').oneOf([yup.ref('password')], 'As senhas não coincidem!')
    });

    const [msg, setMsg] = useState('');
    const [ok, setOk] = useState(false); // booleano para exibir o "fazer login?"

    const form = useForm({
        resolver: yupResolver(schema)
    });

    const {register, handleSubmit, formState} = form;

    const {errors} = formState;

    const submit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/register', data);
            setMsg(response.data);
            if(response.data.includes('sucesso'))setOk(true); // a fim de apresentar o convite para login
        } catch (error) {
            setMsg(error.response.data);
        }
    }
    
    return (
        <main className={styles['outro']}>
            <h2>Cadastre-se para acessar os serviços!</h2>

            <form onSubmit={handleSubmit(submit)} noValidate className={styles['cadastro']}>
                <label htmlFor='username'>Apelido</label>
                <input type='text' id='username' {...register('username')} />
                <p className={styles['erro']}>{errors.username?.message}</p>

                <label htmlFor='email'>E-mail</label>
                <input type='text' id='email' {...register('email')} />
                <p className={styles['erro']}>{errors.email?.message}</p>

                <label htmlFor='password'>Senha</label>
                <input type='password' id='password' {...register('password')} />
                <p className={styles['erro']}>{errors.password?.message}</p>

                <label htmlFor='confirmPassword'>Confirme a senha</label>
                <input type='password' id='confirmPassword' {...register('confirmPassword')} />
                <p className={styles['erro']}>{errors.confirmPassword?.message}</p>

                <button className={styles['botao']}>Cadastrar</button>
            </form>

            <p>{msg}</p>

            <div className={styles['login']} style={{visibility : ok ? 'visible' : 'hidden' }}>
                <p>Faça</p>
                <Link href='/login' className={styles['ancora']}>Login</Link>
            </div>
        </main>
    )
}