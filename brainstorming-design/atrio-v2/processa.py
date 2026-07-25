#!/usr/bin/env python3
"""Processa as pixel arts do ChatGPT pros tamanhos exatos do layout.

Por que area + quantizacao (e nao nearest neighbor):
  A medicao (grade.py) mostrou que nao existe grade de pixel consistente nas
  fontes: confianca 0.32-0.37 e 10-18 mil cores unicas. Nearest PRESERVA uma
  grade existente; como aqui nao ha grade, nearest amostraria pixels ao acaso e
  produziria ruido. Reduzir por media de area preserva a informacao, e a
  quantizacao de paleta cria a grade limpa no tamanho final.

Por que dither bayer:
  E o mesmo algoritmo do canvas do materia.html. Assim a arte dos labs e o dado
  ditherizado das RFCs ficam no mesmo idioma visual.

O crop e calculado aqui em numeros concretos porque o parser de filtro do
ffmpeg trata a virgula de min(a,b) como separador de filtro.
"""
import subprocess, struct, os, glob

SRC = "/home/gnixd/Workstation/idearium/brainstorming-design/atrio-v2/images"
OUT = os.path.join(SRC, "processadas")

# nome semantico -> (largura, altura, n_cores). A ordem cronologica dos
# arquivos corresponde a ordem dos pedidos em prompt-chatgpt.md.
ALVOS = [
    ("atrio",          480, 160, 12),   # faixa da abertura, 3:1
    ("lab-educacao",   168,  54,  8),   # fita de lab
    ("lab-cidades",    168,  54,  8),
    ("lab-saude",      168,  54,  8),
    ("lab-cultura",    168,  54,  8),
    ("lab-civica",     168,  54,  8),
    ("lab-solidaria",  168,  54,  8),
]


def dim(path):
    with open(path, "rb") as fh:
        return struct.unpack(">II", fh.read(33)[16:24])


def cores(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True, check=True).stdout
    return len({raw[i:i + 3] for i in range(0, len(raw), 3)})


def processa(entrada, saida, larg, alt, ncores):
    w, h = dim(entrada)
    # faixa horizontal central na proporcao alvo
    ch = min(h, round(w * alt / larg))
    cy = (h - ch) // 2
    vf = (f"crop={w}:{ch}:0:{cy},"
          f"scale={larg}:{alt}:flags=area,"
          f"split[a][b];[a]palettegen=max_colors={ncores}:stats_mode=full[p];"
          f"[b][p]paletteuse=dither=bayer:bayer_scale=1")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", entrada, "-vf", vf, saida], check=True)
    return f"crop {w}x{ch}+0+{cy}"


os.makedirs(OUT, exist_ok=True)
arquivos = sorted(glob.glob(os.path.join(SRC, "*.png")), key=os.path.getmtime)

assert len(arquivos) == len(ALVOS), f"esperava {len(ALVOS)} imagens, achei {len(arquivos)}"

print(f"{'saida':18} {'tamanho':10} {'cores':6} {'KB':>6}   recorte na fonte")
for src, (nome, larg, alt, nc) in zip(arquivos, ALVOS):
    dst = os.path.join(OUT, nome + ".png")
    info = processa(src, dst, larg, alt, nc)
    print(f"{nome + '.png':18} {larg}x{alt:<6} {cores(dst):<6} "
          f"{os.path.getsize(dst) / 1024:5.1f}   {info}")
