import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {signIn} from 'next-auth/react'

export default function Home() {
  return (
    <div>
      The First Page!
      <button onClick={() => signIn()}>
        sign in
      </button>
    </div>
  )
}