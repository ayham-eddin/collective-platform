import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, saveAdminSession } from "../../../services/auth.service";

export const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await loginAdmin({
        email,
        password,
      });

      saveAdminSession(data);
      navigate("/admin");
    } catch {
      setErrorMessage("Login failed. Please check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b10] px-6 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
          Admin CMS
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight">Login</h1>

        <p className="mt-3 text-zinc-400">
          Manage events, gallery, videos, team members and admins.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-zinc-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-zinc-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400"
              required
            />
          </div>

          {errorMessage && (
            <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-violet-600 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
};
