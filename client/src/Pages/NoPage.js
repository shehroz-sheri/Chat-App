import React from 'react'
import { Link } from 'react-router-dom'

export default function NoPage() {
  return (
    <>
      <div className="flex h-[100dvh] flex-col items-center justify-center space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-9xl font-bold tracking-tighter">404</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">Oops, the page you were looking for was not found.</p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          to={'/'}
        >
          Go to Home
        </Link>
      </div>
    </>
  )
}
