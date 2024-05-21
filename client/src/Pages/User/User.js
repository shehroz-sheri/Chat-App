import { Modal, message } from 'antd';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/Context';
import axios from 'axios';

export default function User() {
    const [open, setOpen] = useState(false);

    const { user, URL, logout } = useAuth()
    let userName = user?.name.split(' ')
    let userNameAvatar = userName[0].charAt(0) + userName[1].charAt(0)

    const initialState = { first_name: '', last_name: '', email: '', number: '' }
    const [userDetails, setUserDetails] = useState(initialState)

    const handleChange = e => {
        const { name, value } = e.target
        setUserDetails(s => ({ ...s, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()

        userDetails.name = userDetails.first_name.charAt(0).toUpperCase() + userDetails.first_name.slice(1) + ' ' + userDetails.last_name.charAt(0).toUpperCase() + userDetails.last_name.slice(1)
        delete userDetails.first_name
        delete userDetails.last_name

        axios.patch(`${URL}/user/update-user/${user.email}`, userDetails)
            .then((res) => {
                console.log(res)
                // localStorage.setItem('token', res.data.token)
                // localStorage.setItem('user', JSON.stringify(res.data.user))

                message.success('User updated successfully')
            })
            .catch((err) => console.log(err))

    }


    const initialPasswordState = { current_password: '', new_password: '' }
    const [userPassword, setUserPassword] = useState(initialPasswordState)

    const handleChangePassword = e => {
        const { name, value } = e.target
        setUserPassword(s => ({ ...s, [name]: value }))
    }

    const handlePasswordSubmit = e => {
        e.preventDefault()

        console.log(userPassword)

    }





    const handleCancel = () => {
        setOpen(false);
    };
    const handleDeleteAccount = () => {
        const handleOk = async () => {
            try {

            } catch (error) {
                console.error(error)
            }
            setOpen(false);
        };
        const newModalConfirm = async () => {
            // const cityRef = doc(db, 'accounts', values.receiverAccountNo);
            // const docSnap = await getDoc(cityRef);
            {
                Modal.confirm({
                    title: 'Warning!',
                    onOk: handleOk,
                    onCancel: handleCancel,
                    content: `Are you sure you want to delete your account?`,
                    footer: (_, { OkBtn, CancelBtn }) => (
                        <>
                            <CancelBtn />
                            <OkBtn />
                        </>
                    ),
                });
            }
        }
        newModalConfirm()
    }

    return (
        <>
            <div className="flex flex-col min-h-[100dvh]">
                <header id="gnkjxuv86ov" className="bg-gray-950 py-6 px-4 md:px-0 dark:bg-gray-950">
                    <div className="container flex flex-col items-center justify-between px-2 gap-4 md:flex-row">
                        <div className="flex items-center gap-4">
                            <span className="relative flex shrink-0 bg-[#F4F4F5] overflow-hidden rounded-full h-12 w-12">
                                <span className="flex text-gray-950 h-full w-full items-center justify-center rounded-full bg-muted">{userNameAvatar}</span>
                            </span>
                            <div className="grid gap-1">
                                <h1 className="text-xl font-bold text-[#F4F4F5]">{user.name}</h1>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
                                to={'/'}
                            >
                                Home
                            </Link>
                            <button onClick={logout} className="text-[#F4F4F5] bg-[#EF4444] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                                Logout
                            </button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 py-8 px-2">
                    <div className="container grid gap-8">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Edit Profile</h3>
                                    <p className="text-sm text-muted-foreground">Update your personal information and settings.</p>
                                </div>
                                <div className="p-6 grid gap-6">
                                    <div className="grid gap-2">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            htmlFor="first_name"
                                        >
                                            First Name
                                        </label>
                                        <input onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            id="first_name"
                                            name='first_name'
                                            type='text'
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            htmlFor="last_name"
                                        >
                                            Last Name
                                        </label>
                                        <input onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            id="last_name"
                                            name='last_name'
                                            type='text'
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <input onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            id="email"
                                            type="email"
                                            name='email'
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            htmlFor="number"
                                        >
                                            Phone Number
                                        </label>
                                        <input onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            id="number"
                                            name='number'
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center p-6">
                                    <button type='submit' className="text-[#F4F4F5] bg-[#18181B] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ml-auto">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                        <form action="" onSubmit={handlePasswordSubmit}>
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Change Password</h3>
                                    <p className="text-sm text-muted-foreground">Update your account password.</p>
                                </div>
                                <div className="p-6 grid gap-6">
                                    <div className="grid gap-2">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            htmlFor="current-current_password"
                                        >
                                            Current Password
                                        </label>
                                        <input onChange={handleChangePassword}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            id="current-current_password"
                                            name='current_password'
                                            type="password"
                                            minLength={'6'}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            htmlFor="new-new_password"
                                        >
                                            New Password
                                        </label>
                                        <input onChange={handleChangePassword}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            id="new-new_password"
                                            name='new_password'
                                            type="password"
                                            minLength={'6'}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center p-6">
                                    <button type='submit' className="text-[#F4F4F5] bg-[#1e40af] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ml-auto">
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Delete Account</h3>
                                <p className="text-sm text-muted-foreground">Permanently delete your account and all its data.</p>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Deleting your account is a permanent action and cannot be undone. All your data and account information
                                    will be permanently removed.
                                </p>
                            </div>
                            <div className="flex items-center p-6">
                                <button onClick={handleDeleteAccount} className="bg-[#EF4444] text-[#F4F4F5] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 ml-auto">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
