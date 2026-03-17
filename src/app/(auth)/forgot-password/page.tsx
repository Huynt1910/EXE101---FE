"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildAuthUrl, normalizeCallbackUrl } from "@/lib/callback-url";

export default function ForgotPasswordPage() {
	const sp = useSearchParams();
	const [submitted, setSubmitted] = useState(false);

	const callbackUrl = normalizeCallbackUrl(sp.get("callbackUrl"), "/");
	const loginUrl = buildAuthUrl("/login", callbackUrl);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmitted(true);
	};

	return (
		<div className="w-full">
			<div className="mb-10 sm:mb-8 text-center md:text-left">
				<h1 className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary">
					Forgot password?
				</h1>
				<p className="mt-2 text-sm sm:text-lg text-muted-foreground">
					No worries, we&apos;ll send you reset instructions
				</p>
			</div>

			<form className="space-y-6" onSubmit={handleSubmit}>
				<label htmlFor="email" className="sr-only">
					Email
				</label>
				<input
					id="email"
					type="email"
					placeholder="Email"
					className="w-full h-12 rounded-lg border bg-white px-4 text-md sm:text-md outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-90"
					disabled={submitted}
					required
				/>

				{submitted ? (
					<div className="rounded-md border-l-4 border-[#0d3b66] bg-[#E7EAD8] px-4 py-4 text-left text-[#3a3d2e]">
						<p className="text-sm sm:text-[1.75ch] leading-6">
							In case the entered email address is known to us, we have sent you an email with
							instructions on how to reset your password.
						</p>
					</div>
				) : (
					<button
						type="submit"
						className="btn-primary w-full h-12 sm:h-13 text-md font-semibold rounded-lg"
					>
						Reset password
					</button>
				)}
			</form>

			<div className="mt-8 text-center">
				<p className="text-sm text-muted-foreground">
					Remembered your password?{" "}
					<Link href={loginUrl} className="text-primary font-semibold hover:underline">
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}
