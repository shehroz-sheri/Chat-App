import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthHeader from '../../components/Auth/AuthHeader'
import { useAuth } from '../../context/Context'


const initialState = { username: '', password: '' }

export default function Login() {
  const [user, setUser] = useState(initialState)
  const { userLogin } = useAuth()

  const handleChange = e => {
    const { name, value } = e.target
    setUser(s => ({ ...s, [name]: value }))
  }


  const handleSubmit = async e => {
    e.preventDefault()
    await userLogin(user)
  }

  return (
    <>
      <AuthHeader />
      <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
        <div className="space-y-8 rounded-lg border bg-white bg-card text-card-foreground shadow-sm w-full max-w-md px-2 md:px-8 pb-14 pt-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Login to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-400"
                to={'/auth/register'}
              >
                Register a new account
              </Link>
            </p>
          </div>
          <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
            <div>
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                htmlFor="username"
              >
                Username
              </label>
              <input onChange={handleChange}
                className="h-10 bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:placeholder-gray-400"
                id="username"
                autoComplete="username"
                required
                placeholder="Username (email / number)"
                type="text"
                name="username"
              />
            </div>
            <div>
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                htmlFor="password"
              >
                Password
              </label>
              <input onChange={handleChange}
                className="h-10 bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:placeholder-gray-400"
                id="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                type="password"
                name="password"
                minLength={'6'}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center"></div>
              <div className="text-sm">
                <Link
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"

                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div>
              <button
                className="inline-flex bg-gray-900 p-3 text-gray-50 dark:bg-gray-50 dark:text-gray-900 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                type="submit"
              >
                Log in
              </button>
            </div>
            <hr />
            <div>
              <p className='p-0 m-0 text-center'>
                <span className='text-base'>Or</span> <br />
                <Link to={'/'} className='underline text-sm text-indigo-600 hover:text-indigo-500'>Click Here to Login as a Guest</Link> <br />
                <span className='text-sm'>(for testing purpose only)</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
