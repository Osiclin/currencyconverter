import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home({ data }) {
  const firstCurrency = Object.keys(data.rates)[0]
  const currencyOptions = [...Object.keys(data.rates)]
  const [from, setFrom] = useState(data.base)
  const [to, setTo] = useState(firstCurrency)
  const date = data.date
  const [exchange, setExchange] = useState(data.rates[firstCurrency])
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  
  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchange
  } else {
    toAmount = amount
    fromAmount = amount / exchange
  }

  useEffect(() => {
    if (from != null && to != null) {
      const getData = async () => {
        const res = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
        const data = await res.json()
        setExchange(data.rates[to])
      }
      getData()
    }
  }, [from, to])

  const handleChangeFrom = (e) => {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  const handleChangeTo = (e) => {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Currency Converter</title>
        <meta name="currency converter" content="currency converter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Currency Converter
        </h1>

        <p className={styles.description}>
          <code className={styles.code}>Live Exchange Rates</code>
        </p>

        <p>
          <code className={styles.code}>{date}</code>
        </p>

        <div className={styles.grid}>
          <form className={styles.form}>
            <div>
              <label>FROM</label>
              <select name="from" defaultValue={from} onChange={e => setFrom(e.target.value)}>
                {
                  currencyOptions.map(option => <option key={option} value={option}>{option}</option>)
                }
              </select>
              <input type='number' value={fromAmount} onChange={(e) => handleChangeFrom(e)} />
            </div>
            <div>
              <label>TO</label>
              <select name="from" defaultValue={to} onChange={e => setTo(e.target.value)}>
                {
                  currencyOptions.map(option => <option key={option} value={option}>{option}</option>)
                }
              </select>
              <input type='number' value={toAmount} onChange={(e) => handleChangeTo(e)} />
            </div>
          </form>
          
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('https://api.exchangerate.host/latest')
  const data = await res.json()
  
  return {
    props: { data }
  }
}