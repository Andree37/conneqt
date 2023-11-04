"use client"
import Link from 'next/link'

import {AuthLayout} from '@/components/AuthLayout'
import {Button} from '@/components/Button'
import {TextField} from '@/components/Fields'
import {useCallback, useState} from "react";
import {setCookie} from 'cookies-next';
import {useRouter} from "next/navigation";


type Form = {
    email: string
    password: string
}

export default function Login() {
    const [form, setForm] = useState<Form>({email: '', password: ''});
    const router = useRouter()

    const submit = useCallback(async (form: Form) => {
        const res = await fetch('/api/auth-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })

        if (res.ok) {
            return await res.json();
        }

    }, [])

    return (
        <AuthLayout
            title="Sign in to account"
            subtitle={
                <>
                    Don’t have an account?{' '}
                    <Link href="mailto:info@info.com" className="text-cyan-600">
                        Contact Us
                    </Link>{' '}
                    for a free trial.
                </>
            }
        >
            <form method='post' onSubmit={async (e) => {
                e.preventDefault()
                const response = await submit(form);
                console.log(response)
                if (response?._id) {
                    setCookie('userID', response._id, {sameSite: 'strict'});
                    router.replace('/dashboard')
                }
            }}>
                <div className="space-y-6">
                    <TextField
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        label="Email address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                    />
                    <TextField
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        label="Password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                    />
                </div>
                <Button type="submit" color="cyan" className="mt-8 w-full">
                    Sign in to account
                </Button>
            </form>
        </AuthLayout>
    )
}
