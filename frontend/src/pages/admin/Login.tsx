import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { login } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");
  const [error, setError] = useState("");
  const [mengirim, setMengirim] = useState(false);
  const [tampilkanSandi, setTampilkanSandi] = useState(false);

  // Halaman yang tadi ingin dibuka sebelum dialihkan ke login (diisi AdminGuard)
  const tujuan = (location.state as { dari?: string } | null)?.dari ?? "/admin";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !sandi.trim()) {
      setError("Email dan sandi wajib diisi.");
      return;
    }

    setMengirim(true);
    setError("");
    try {
      await login(email, sandi);
      navigate(tujuan, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
      setMengirim(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-sawah max-[600px]:items-start max-[600px]:py-8">
      <div className="flex flex-col rounded-xl bg-abu shadow-lg max-[600px]:w-75 max-[600px]:h-auto lg:flex-row h-150 lg:mb-0">
        <div className="flex flex-col items-end bg-abu rounded-xl lg:w-75 lg:h-full lg:roundedn-l-xl lg:rounded-tr-none">
          <Link to="/">
            <p className="flex bg-sawah hover:bg-tambak mr-3 mt-3 w-7 h-7 lg:hidden text-white justify-center rounded-4xl hover:cursor-pointer">
              X
            </p>
          </Link>
          <div className="flex flex-col items-center">
            <img src={logo} className="w-30 h-33"></img>
            <h1 className="font-bold text-white text-2xl">
              Kelurahan Sidoharjo
            </h1>
            <p className="text-sm px-9 pb-5 text-white text-center">
              Jl. Pahlawan, Kauman, Kel. Sidoharjo, Kec. Lamongan, Kab.
              Lamongan, Jawa Timur<br></br>(62217)
            </p>
          </div>
        </div>
        <div className="bg-garis rounded-xl lg:w-120 lg:h-full lg:rounded-r-xl lg:rounded-bl-none">
          <div className="flex justify-center lg:justify-between p-7">
            <h1 className="text-2xl font-semibold text-tinta">
              Silahkan login di bawah
            </h1>
            <Link to="/">
              <p className="hidden lg:flex hover:bg-tambak bg-sawah w-7 h-7 text-white justify-center items-center rounded-4xl hover:cursor-pointer">
                X
              </p>
            </Link>
          </div>
          <form
            className="flex flex-col items-center"
            onSubmit={(e) => void submit(e)}
          >
            <div className="flex flex-col font-medium">
              <label className="text-xl">Email</label>
              <input
                type="email"
                value={email}
                autoComplete="username"
                disabled={mengirim}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg bg-white w-60 py-2 lg:w-105 lg:py-3 lg:px-5 mb-3 border border-abu disabled:opacity-60"
              ></input>
            </div>
            <div className="flex flex-col font-medium">
              <label className="text-xl">Sandi</label>
              <input
                type={tampilkanSandi ? "text" : "password"}
                value={sandi}
                autoComplete="current-password"
                disabled={mengirim}
                onChange={(e) => setSandi(e.target.value)}
                className="rounded-lg bg-white w-60 py-2 lg:w-105 lg:py-3 lg:px-5 border border-abu disabled:opacity-60"
              ></input>
              <label className="mt-2 flex items-center gap-2 text-sm font-normal cursor-pointer">
                <input
                  type="checkbox"
                  checked={tampilkanSandi}
                  disabled={mengirim}
                  onChange={(e) => setTampilkanSandi(e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                Tampilkan sandi
              </label>
            </div>
            {error && (
              <p className="w-105 mt-3 text-sm text-[#b3261e]">{error}</p>
            )}
            <div className="mt-3 py-5 lg:pb-0">
              <button
                type="submit"
                disabled={mengirim}
                className="bg-tambak w-25 py-2 rounded-lg text-white hover:bg-blue-800 hover:cursor-pointer disabled:cursor-wait disabled:opacity-60"
              >
                {mengirim ? "Masuk…" : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
