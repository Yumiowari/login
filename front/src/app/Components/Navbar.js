import styles from './styles/Navbar.module.css'
import Link from 'next/link'

export default function Navbar () {
    return (
        <ul className={styles['lista']}>
            <li className={styles['opcao']}>
                <Link href='/' className={styles['ancora']}>Home</Link>
            </li>

            <li className={styles['opcao']}>
                <Link href='/' className={styles['ancora']}>Login</Link>
            </li>

            <li className={styles['opcao']}>
                <Link href='/' className={styles['ancora']}>Cadastro</Link>
            </li>
        </ul>
    );
}