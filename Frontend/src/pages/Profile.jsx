import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { applyForAuthor } from "../services/authorService";

function Profile() {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const initial = (user?.username?.trim().charAt(0) || "U").toUpperCase();
  const apply = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await applyForAuthor(reason.trim());
      setMessage(response.data.message);
      setReason("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 p-7 text-white sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-gray-900">
              {initial}
            </div>
            <div>
              <p className="text-sm text-gray-300">Account profile</p>
              <h1 className="text-3xl font-bold">{user?.username}</h1>
              <p className="mt-1 text-gray-300">{user?.email}</p>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm capitalize sm:ml-auto">
              {user?.role}
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Account details</h2>
            <dl className="mt-5 divide-y divide-gray-100">
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium">{user?.username}</dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-gray-500">Email</dt>
                <dd className="break-all font-medium">{user?.email}</dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-gray-500">Role</dt>
                <dd className="font-medium capitalize">{user?.role}</dd>
              </div>
            </dl>
          </section>
          {user?.role === "user" ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Become an author</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Tell us why you want to write. An admin will review your
                application.
              </p>
              <form onSubmit={apply} className="mt-5 space-y-3">
                <textarea
                  required
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setError("");
                  }}
                  rows="5"
                  placeholder="Why would you like to become an author?"
                  className="w-full rounded border border-gray-300 p-3 text-sm"
                />
                {message && (
                  <p className="rounded bg-green-50 p-3 text-sm text-green-700">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="rounded bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <button
                  disabled={loading}
                  className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send application"}
                </button>
              </form>
            </section>
          ) : (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Your workspace</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Use the dashboard to manage your blogs and activity.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
export default Profile;
