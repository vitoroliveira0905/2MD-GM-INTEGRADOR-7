"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [gmin, setGmin] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gmin) {
      setUsuario(null);
      setErro("");
      return;
    }

    const fetchUsuario = async () => {
      try {
        const resp = await fetch("http://localhost:3001/api/auth/login-gmin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gmin }),
        });
        const data = await resp.json();

        if (resp.ok) {
          setUsuario(data.usuario);
          setErro("");
        } else {
          setUsuario(null);
          setErro("");
        }
      } catch {
        setUsuario(null);
        setErro("");
      }
    };

    fetchUsuario();
  }, [gmin]);

  async function realizarLogin() {
    if (!gmin) {
      setErro("Digite seu GMIN");
      return;
    }

    if (!usuario) {
      setErro("Usuário não encontrado");
      return;
    }

    setErro("");
    setLoading(true);

    try {
      const respLogin = await fetch("http://localhost:3001/api/auth/login-gmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmin }),
      });

      const loginData = await respLogin.json();

      if (!respLogin.ok) {
        setErro(loginData.erro || "Erro no login");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "dadosUsuario",
        JSON.stringify({ usuario: loginData.usuario, token: loginData.token })
      );

      router.push(
        loginData.usuario.tipo === "admin"
          ? "/administracao/dashboard"
          : "/"
      );

    } catch (error) {
      console.error(error);
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="vh-100 d-flex align-items-center">
      <div className="row w-100 h-100 m-0">

        <div className="col-md-6 order-md-2 d-flex flex-column justify-content-center align-items-center text-black px-4">
          <div className="mb-4 p-4 d-flex flex-column align-items-center">
            <Image src="/img/gm.svg" alt="Logo" width={110} height={100} className="img-fluid" />
            <h2 className="fw-bold mt-2">Sistema GM</h2>
            <p className="text-muted">Acesso exclusivo</p>
          </div>

          <div
            className="shadow-sm p-4 rounded bg-white"
            style={{
              width: "25rem",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <h4 className="fw-bold mb-3 text-center">Identifique-se</h4>

            <div className="form-outline mb-4">
              <label className="form-label fw-semibold">GMIN</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={gmin}
                onChange={(e) => setGmin(e.target.value)}
                placeholder="Ex: 123456"
                onKeyDown={(e) => e.key === "Enter" && realizarLogin()}
              />
            </div>

            {erro && <p className="text-danger text-center">{erro}</p>}
            {loading && <p className="text-center">Carregando...</p>}

            {usuario && (
              <div className="text-center mb-3 user-anim">

                <Image
                  src={`/img/usuarios/${usuario.imagem}`}
                  alt="Foto do usuário"
                  width={120}
                  height={120}
                  className="rounded-circle mb-2 shadow-sm"
                  style={{ objectFit: "cover" }}
                />
                <h5 className="fw-bold">{usuario.nome}</h5>
                <span className="badge text-bg-primary px-3 py-2">
                  {usuario.tipo.toUpperCase()}
                </span>
              </div>
            )}

            <div className="d-grid mt-4">
              <button
                className="btn btn-lg"
                type="button"
                onClick={realizarLogin}
                disabled={loading}
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  fontWeight: 600,
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                  borderRadius: "12px",
                }}
              >
                Entrar
              </button>
            </div>

          </div>
        </div>

        <div
          className="col-md-6 order-md-1 px-0 d-none d-md-flex align-items-center justify-content-center"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div style={{ width: "85%", maxWidth: "600px" }}>
            <Image
              src="/img/imagem-login.png"
              alt="Imagem de login"
              width={20000}
              height={20000}
              className="img-fluid"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
