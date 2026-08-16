"""Padrão de imagens da Perfumaria Suanne.

Mantém o mesmo fundo (Fundo padrão.jpg - balcão de perfumaria escuro + dourado)
para todas as imagens de produto. O perfume em si NÃO é alterado: apenas o
fundo é removido (rembg ou cutout pronto) e o frasco é composto sobre o fundo
padrão, no mesmo estilo das imagens de referência (frasco grande, centralizado,
base apoiada na parte inferior do canvas).

Como usar (adicionar um novo perfume):
    1. Coloque a foto do perfume em public/perfumes/<slug>.<ext> (qualquer formato).
    2. Rode o script:
       python scripts/process-perfumes.py
    3. A imagem será regravada no mesmo caminho com o fundo padrão.

Requisitos (primeira vez):
    pip install rembg onnxruntime pillow numpy

Detalhes do padrão:
    - Canvas: 1600x1600 (square), fundo = Fundo padrão.jpg (upscaled).
    - O frasco é centralizado, ocupa ~70% da altura e a base fica em ~95% da
      altura do canvas, com sombra projetada para dar profundidade.
    - Se existir um cutout em public/perfumes/cutouts/<slug>.png, ele é usado
      (mais limpo). Caso contrário usa rembg. Imagens que já possuem
      transparência real nos cantos são usadas como estão.
    - As imagens de referência (amber-rouge.png, ana-abiyedh-rouge.png,
      asad.jpg e afeef.png) já estão prontas e não são reprocessadas.
"""

import glob
import os

import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageOps, ImageChops

CANVAS = 1600
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PERFUMES_DIR = os.path.join(SCRIPT_DIR, "..", "public", "perfumes")
CUTOUTS_DIR = os.path.join(PERFUMES_DIR, "cutouts")
FUNDO_FILE = os.path.join(PERFUMES_DIR, "Fundo padrão.jpg")

SKIP = {"amber-rouge.png", "ana-abiyedh-rouge.png", "asad.jpg", "afeef.png"}


def load_background() -> Image.Image:
    """Carrega o Fundo padrão.jpg real e o escala para o canvas."""
    bg = Image.open(FUNDO_FILE).convert("RGB")
    return bg.resize((CANVAS, CANVAS), Image.LANCZOS)


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


def cutout_for(slug: str):
    """Retorna o caminho do cutout pronto, se existir."""
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        p = os.path.join(CUTOUTS_DIR, slug + ext)
        if os.path.isfile(p):
            return p
    return None


def composite(perfume: Image.Image) -> Image.Image:
    """Compoe o frasco (RGBA) sobre o fundo padrão, centralizado, com sombra."""
    bg = load_background().convert("RGBA")
    pw, ph = perfume.size

    # recorta a área não-transparente do frasco (ignora o padding do cutout)
    a = np.array(perfume.getchannel("A"))
    ys, xs = np.where(a > 10)
    if len(xs):
        x0, x1 = xs.min(), xs.max() + 1
        y0, y1 = ys.min(), ys.max() + 1
        perfume = perfume.crop((x0, y0, x1, y1))
    pw, ph = perfume.size

    # altura do frasco ~70% do canvas, largura limitada a ~80%
    target_h = int(CANVAS * 0.70)
    scale = min(target_h / ph, (CANVAS * 0.80) / pw)
    nw, nh = int(pw * scale), int(ph * scale)
    perfume = perfume.resize((nw, nh), Image.LANCZOS)

    # centralizado horizontalmente, base do frasco em ~95% do canvas
    x = (CANVAS - nw) // 2
    base_y = int(CANVAS * 0.955)
    y = base_y - nh

    # sombra projetada no fundo
    alpha = perfume.getchannel("A")
    shadow = ImageOps.invert(alpha.point(lambda p: 255 - p // 3))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    shadow_img = Image.new("RGBA", bg.size, (0, 0, 0, 0))
    shadow_img.paste((0, 0, 0, 180), (x + 18, y + nh + 16), shadow)
    bg = Image.alpha_composite(bg, shadow_img)

    # frasco em si (inalterado) composto sobre o fundo
    bg.paste(perfume, (x, y), perfume)

    return bg


def main() -> None:
    files = sorted(glob.glob(os.path.join(PERFUMES_DIR, "*.*")))
    files = [f for f in files if os.path.isfile(f) and os.path.dirname(f) == PERFUMES_DIR]

    for f in files:
        name = os.path.basename(f)
        ext = os.path.splitext(name)[1].lower()
        if ext not in (".png", ".jpg", ".jpeg", ".webp"):
            print(f"skip (extensão): {name}")
            continue
        if name in SKIP or name.lower() == "fundo padrão.jpg":
            print(f"skip (já pronto / fundo): {name}")
            continue

        slug = os.path.splitext(name)[0]
        cut_path = cutout_for(slug)

        if cut_path:
            cut = Image.open(cut_path).convert("RGBA")
        else:
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
        print(f"ok: {name} -> {out.size} (cutout={bool(cut_path)})")


if __name__ == "__main__":
    main()
