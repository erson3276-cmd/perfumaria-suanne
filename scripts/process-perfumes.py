"""Padrão de imagens da Perfumaria Suanne.

Mantém o mesmo fundo (balcão de perfumaria, escuro + dourado, no estilo da logo)
para todas as imagens de produto. O perfume em si NÃO é alterado: apenas o
fundo é removido (rembg) e o frasco é composto sobre o fundo padrão.

Como usar (adicionar um novo perfume):
    1. Coloque a foto do perfume em public/perfumes/<slug>.<ext> (qualquer formato).
    2. Rode o script:
       python scripts/process-perfumes.py [diretorio_opcional]
    3. A imagem será regravada no mesmo caminho com o fundo padrão.
    (Se informar um diretório, processa os arquivos dele em vez do padrão.)

Requisitos (primeira vez):
    pip install rembg onnxruntime pillow numpy

Detalhes do padrão:
    - Canvas: 1600x1600 (square).
    - Fundo: parede escura com brilho dourado, balcão na parte inferior e
      filete dourado, refletindo a paleta da logo (preto-esverdeado + dourado).
    - O frasco é centralizado, ocupa ~76% da altura e "assenta" sobre o balcão,
      com sombra projetada para dar profundidade.
    - Imagens que já possuem transparência real nos cantos são usadas como
      estão (sem passar pelo rembg), preservando o corte original.
"""

import glob
import os

import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageOps, ImageChops

CANVAS = 1600
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PERFUMES_DIR = os.path.join(SCRIPT_DIR, "..", "public", "perfumes")


def make_background(size: int = CANVAS) -> Image.Image:
    """Gera o fundo padrão: balcão de perfumaria escuro com dourado."""
    w = h = size
    # parede: gradiente vertical quente (topo um pouco mais claro)
    top = np.array([30, 25, 18])
    mid = np.array([20, 16, 11])
    bottom = np.array([13, 11, 8])
    base = np.zeros((h, w, 3), dtype=np.float32)
    for i in range(h):
        t = i / (h - 1)
        if t < 0.55:
            f = t / 0.55
            base[i] = top * (1 - f) + mid * f
        else:
            f = (t - 0.55) / 0.45
            base[i] = mid * (1 - f) + bottom * f

    # brilho dourado radial no centro (luz de vitrine)
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = w / 2, h * 0.42
    r = np.sqrt((xx - cx) ** 2 + ((yy - cy) * 1.1) ** 2)
    glow = np.clip(1 - r / (w * 0.62), 0, 1) ** 2
    gold = np.array([201, 168, 78], dtype=np.float32)
    base = base + glow[..., None] * gold * 0.14

    # balcão: superfície mais clara com textura sutil de mármore escuro
    counter_top = int(h * 0.78)
    counter = np.linspace(0, 1, h - counter_top)[:, None]
    ct = np.array([48, 40, 28], dtype=np.float32)
    cb = np.array([26, 22, 16], dtype=np.float32)
    for i in range(counter_top, h):
        f = (i - counter_top) / (h - counter_top - 1)
        base[i] = ct * (1 - f) + cb * f

    # leve ruído para quebrar a uniformidade
    rng = np.random.default_rng(42)
    noise = rng.normal(0, 2.2, (h, w, 1)).astype(np.float32)
    base = np.clip(base + noise, 0, 255).astype(np.uint8)

    img = Image.fromarray(base, "RGB")

    # filete dourado no topo do balcão
    draw = ImageDraw.Draw(img)
    for x in range(0, w, 8):
        draw.line([(x, counter_top - 2), (x + 8, counter_top - 2)], fill=(201, 168, 78), width=2)
    return img


def needs_rembg(img: Image.Image) -> bool:
    """True se a imagem tem cantos opacos (fundo visível)."""
    w, h = img.size
    if img.mode in ("RGBA", "LA"):
        a = img.getchannel("A")
        pts = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3)]
        return not all(a.getpixel(p) < 128 for p in pts)
    if img.mode == "P":
        rgba = img.convert("RGBA")
        return needs_rembg(rgba)
    return True


def composite(perfume: Image.Image) -> Image.Image:
    """Compoe o frasco (RGBA) sobre o fundo padrão, centralizado, com sombra."""
    bg = make_background()
    pw, ph = perfume.size
    target_h = int(CANVAS * 0.76)
    scale = target_h / ph
    nw, nh = int(pw * scale), target_h
    perfume = perfume.resize((nw, nh), Image.LANCZOS)

    # posição: centralizado horizontalmente, "assentado" no balcão
    x = (CANVAS - nw) // 2
    counter_top = int(CANVAS * 0.78)
    y = counter_top - nh

    bg = bg.convert("RGBA")

    # sombra projetada no balcão
    alpha = perfume.getchannel("A")
    shadow = ImageOps.invert(alpha.point(lambda p: 255 - p // 3))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    shadow_img = Image.new("RGBA", bg.size, (0, 0, 0, 0))
    shadow_img.paste((0, 0, 0, 180), (x + 18, y + nh + 14), shadow)
    bg = Image.alpha_composite(bg, shadow_img)

    # frasco em si (inalterado) composto sobre o fundo
    bg.paste(perfume, (x, y), perfume)

    # halo de luz AO REDOR do frasco (nunca atrás dele), destaca frascos escuros
    halo = Image.new("RGBA", bg.size, (0, 0, 0, 0))
    halo_draw = ImageDraw.Draw(halo)
    halo_cx = x + nw // 2
    halo_cy = y + nh // 2
    halo_r = max(nw, nh)
    halo_draw.ellipse(
        [halo_cx - halo_r, halo_cy - halo_r * 0.9, halo_cx + halo_r, halo_cy + halo_r * 0.9],
        fill=(231, 215, 174, 46),
    )
    halo = halo.filter(ImageFilter.GaussianBlur(halo_r // 7))
    # remove o halo onde o frasco está (evita lavar vidros transparentes)
    mask = Image.new("L", bg.size, 255)
    frasc = Image.new("L", bg.size, 0)
    frasc.paste(255, (x, y), alpha)
    frasc = frasc.filter(ImageFilter.GaussianBlur(18))
    halo.putalpha(ImageChops.multiply(halo.getchannel("A"), ImageOps.invert(frasc)))
    bg = Image.alpha_composite(bg, halo)

    return bg


def main() -> None:
    import sys

    target_dir = sys.argv[1] if len(sys.argv) > 1 else PERFUMES_DIR
    files = sorted(glob.glob(os.path.join(target_dir, "*")))
    files = [f for f in files if os.path.isfile(f)]

    for f in files:
        name = os.path.basename(f)
        ext = os.path.splitext(name)[1].lower()
        if ext not in (".png", ".jpg", ".jpeg", ".webp"):
            print(f"skip (extensão): {name}")
            continue

        im = Image.open(f).convert("RGBA")

        if needs_rembg(im):
            from rembg import remove, new_session

            session = new_session("u2net")
            cut = remove(im, session=session).convert("RGBA")
        else:
            cut = im

        out = composite(cut)

        if ext in (".jpg", ".jpeg"):
            out.convert("RGB").save(f, quality=92, optimize=True)
        else:
            out.save(f, optimize=True)
        print(f"ok: {name} -> {out.size}")


if __name__ == "__main__":
    main()
