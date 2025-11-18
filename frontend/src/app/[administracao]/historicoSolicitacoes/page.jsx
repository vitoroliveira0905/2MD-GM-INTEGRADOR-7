"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";



export default function HistoricoSolicitacoes() {
  const router = useRouter();
  const [solicitacoes, setSolicitacoes] = useState([]);}

