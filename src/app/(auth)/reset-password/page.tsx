"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
	const [isResetSuccess, setIsResetSuccess] = useState(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsResetSuccess(true);
	};

	const handleGoToLogin = () => {
		globalThis.location.assign("/login");
	};

	return (
		<div className="w-full">
			<div className="mb-10 mt-8 sm:mb-8 text-center md:text-left">
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary">
					Reset password
				</h1>
				<p className="mt-2 text-sm sm:text-lg text-muted-foreground">
					Please enter your new password
				</p>
			</div>

			<form className="space-y-6" onSubmit={handleSubmit}>
				<label htmlFor="password" className="sr-only">
					Password
				</label>
				<input
					id="password"
					type="password"
					placeholder="Password"
					className="w-full h-12 rounded-lg border bg-white px-4 text-md sm:text-md outline-none focus:ring-2 focus:ring-primary/30"
					disabled={isResetSuccess}
					required
					minLength={8}
				/>

				<label htmlFor="confirm-password" className="sr-only">
					Password (confirm)
				</label>
				<input
					id="confirm-password"
					type="password"
					placeholder="Password (confirm)"
					className="w-full h-12 rounded-lg border bg-white px-4 text-md sm:text-md outline-none focus:ring-2 focus:ring-primary/30"
					disabled={isResetSuccess}
					required
					minLength={8}
				/>

				{isResetSuccess ? (
					<div className="rounded-md border-l-4 border-[#0d3b66] bg-[#E7EAD8] px-4 py-4 text-left text-[#3a3d2e]">
						<p className="text-sm sm:text-base leading-6">
							Password was changed successfully. You can now log in with your new password.
						</p>
					</div>
				) : (
					<p className="text-sm sm:text-base text-muted-foreground/80">
						A strong password is at least 8 characters long and does not contain personal data.
					</p>
				)}

				{isResetSuccess ? (
					<button
						type="button"
						onClick={handleGoToLogin}
						className="btn-primary w-full h-12 sm:h-13 text-md font-semibold rounded-lg"
					>
						Login
					</button>
				) : (
					<button type="submit" className="btn-primary w-full h-12 sm:h-13 text-md font-semibold rounded-lg">
						Reset password
					</button>
				)}
			</form>
		</div>
	);
}
