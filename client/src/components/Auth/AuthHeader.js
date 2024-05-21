import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthHeader() {
    return (
        <>
            <header className="flex h-16 items-center justify-between border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-950 md:px-6">
                <div className="flex items-center gap-4">
                    <Link to={'#'} className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <path d="M17 6.1H3"></path>
                            <path d="M21 12.1H3"></path>
                            <path d="M15.1 18H3"></path>
                        </svg>
                        <span className="font-semibold">Chatter</span>
                    </Link>
                </div>

            </header>
        </>
    )
}
