"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function realizarLogin(e) {
    e.preventDefault();
    setErro(""); // limpa erro anterior

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          senha: senha
        })
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("token", data.dados.token)
        router.push("/")
      }
      else {
        setErro("Email ou senha incorretos!");
      }
      
    } catch (error) {
      console.error(error);
      setErro("Erro de conexão com o servidor.");
    }
  }

  return (
    <section className="vh-100 d-flex align-items-center">
      <div className="row w-100 h-100 m-0">

        <div className="col-md-6 order-md-2 d-flex flex-column justify-content-center align-items-center text-black px-4">
          <div className="px-5 d-flex justify-content-center mb-4 p-5">

            <Image
              src="/img/gm.svg"
              alt="Login image"
              className="img-fluid"
              width={100}
              height={1}
              style={{ objectFit: "cover", objectPosition: "start" }}
            />
          </div>
          <form onSubmit={realizarLogin}
            style={{ width: "23rem" }}

            className="shadow-sm p-4 rounded bg-white"
          >
            <h3 className="fw-bold mb-3 text-center" style={{ letterSpacing: 1 }}>
              Login
            </h3>

            <div className="form-outline mb-4">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-outline mb-3">
              <label className="form-label fw-semibold">Senha</label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            

            {erro && <p className="text-danger mb-3 text-center">{erro}</p>}

            <div className="d-grid mb-4">
              <button
                className="btn btn-lg"
                type="submit"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Entrar
              </button>
            </div>

            <div className="text-center">
              <p className="small mb-2">
                <a className="text-muted" href="#!">
                  Esqueceu a senha?
                </a>
              </p>
              <p className="mb-0">
                Não tem uma conta?{" "}
                <a href="#!" className="link-primary">
                  Cadastre-se aqui
                </a>
              </p>
            </div>
          </form>
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
              className="img-fluid "
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
