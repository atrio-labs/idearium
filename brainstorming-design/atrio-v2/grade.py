#!/usr/bin/env python3
"""Detecta o tamanho do bloco de pixel de uma imagem de "pixel art".

Modelo de imagem nao gera pixel art numa grade exata: gera blocos de tamanho
aproximado, com anti-aliasing nas bordas. Pra reduzir sem destruir a arte, o
fator de reducao tem que ser o periodo real da grade.

Metodo: pega varias linhas horizontais e verticais, acha as posicoes onde a cor
muda de forma significativa, e testa qual periodo p (2..24) melhor explica essas
posicoes (isto e: maximiza a fracao de transicoes que caem perto de um multiplo
de p). Sem dependencia: le raw rgb24 do ffmpeg.
"""
import subprocess, sys, struct
from collections import Counter


def raw(path):
    with open(path, 'rb') as fh:
        w, h = struct.unpack('>II', fh.read(33)[16:24])
    out = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
        capture_output=True, check=True).stdout
    return w, h, out


def transicoes(buf, w, h, y, limiar=26):
    """Posicoes x onde a cor muda mais que o limiar, na linha y."""
    base = y * w * 3
    ps, ant = [], buf[base:base + 3]
    for x in range(1, w):
        cur = buf[base + x * 3: base + x * 3 + 3]
        if sum(abs(a - b) for a, b in zip(cur, ant)) > limiar:
            ps.append(x)
        ant = cur
    return ps


def melhor_periodo(posicoes, pmin=2, pmax=24, tol=0.30):
    """Periodo que melhor explica as posicoes de transicao."""
    if len(posicoes) < 12:
        return None, 0.0
    notas = {}
    for p in range(pmin, pmax + 1):
        # fracao de transicoes que caem a menos de tol*p de um multiplo de p
        bons = 0
        for x in posicoes:
            r = x % p
            d = min(r, p - r)
            if d <= tol * p:
                bons += 1
        # normaliza: periodo pequeno acerta por acaso, penaliza
        acaso = min(1.0, 2 * tol)
        notas[p] = (bons / len(posicoes) - acaso) / (1 - acaso)
    p = max(notas, key=notas.get)
    return p, notas[p]


def analisa(path):
    w, h, buf = raw(path)

    todas = []
    for y in range(h // 6, h - h // 6, max(1, h // 40)):
        todas += transicoes(buf, w, h, y)

    p, conf = melhor_periodo(todas)

    # tamanho de run mais comum, como checagem independente
    runs = Counter()
    for y in range(h // 6, h - h // 6, max(1, h // 40)):
        ts = transicoes(buf, w, h, y)
        for a, b in zip(ts, ts[1:]):
            d = b - a
            if 1 < d <= 24:
                runs[d] += 1
    moda = runs.most_common(4)

    # contagem de cores unicas (indica se ha anti-aliasing pesado)
    cores = len({buf[i:i + 3] for i in range(0, len(buf), 3 * 7)})

    return dict(w=w, h=h, periodo=p, conf=conf, runs=moda, cores_amostradas=cores,
                nativa=(round(w / p), round(h / p)) if p else None)


if __name__ == '__main__':
    for path in sys.argv[1:]:
        r = analisa(path)
        nome = path.split('/')[-1]
        print(f"{nome}")
        print(f"   {r['w']}x{r['h']}  periodo={r['periodo']}px conf={r['conf']:.2f}  "
              f"nativa~{r['nativa'][0]}x{r['nativa'][1]}")
        print(f"   runs mais comuns: {r['runs']}   cores amostradas: {r['cores_amostradas']}")
