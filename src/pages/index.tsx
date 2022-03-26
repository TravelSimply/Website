import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {signIn} from 'next-auth/react'
import {Button, Box} from '@mui/material'
import {signOut} from '../utils/auth'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      The First Page!
      <Link href="/auth/signin">
        <a>
          <button>
            sign in
          </button>
        </a>
      </Link>
      <button onClick={() => signOut()}>
        sign out
      </button>
    </div>
  )
}