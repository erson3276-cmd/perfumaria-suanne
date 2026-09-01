"""Otimiza imagens do site: comprime JPEGs e converte PNGs fotográficos.

Uso:
    python scripts/optimize-images.py          # analisa e comprime
    python scripts/optimize-images.py --dry-run # apenas mostra o que faria

Requisitos:
    pip install Pillow

Otimizações aplicadas:
- JPEG: qualidade 82, otimizado, converts para RGB
- PNG fotográfico (>500KB): converte para JPEG quality 82
- Banners: redimensiona para max-width 2400px antes de comprimir
- Cutouts PNG: comprime com otimização (mantém PNG por transparência)
- Backup automático antes de sobrescrever
"""

import os
import sys
import shutil
from pathlib import Path
from PIL import Image

DRY_RUN = "--dry-run" in sys.argv
ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
PERFUMES = PUBLIC / "perfumes"
BANNERS = PUBLIC / "banners"
CUTOUTS = PERFUMES / "cutouts"
BACKUP = ROOT / ".img-backup"

MAX_SIZE_BYTES = 200_000  # 200 KB target
JPEG_QUALITY = 82
BANNER_MAX_WIDTH = 2400


def size_kb(path: Path) -> float:
    return path.stat().st_size / 1024


def is_photo_png(path: Path) -> bool:
    """Heurística: PNGs fotográficos grandes (>500KB) devem ser JPEG."""
    if path.suffix.lower() != ".png":
        return False
    if str(CUTOUTS) in str(path):
        return False  # cutouts precisam de transparência
    return size_kb(path) > 500


def compress_jpeg(path: Path) -> tuple[int, int]:
    """Comprime JPEG, retorna (original_kb, new_kb)."""
    orig = size_kb(path)
    img = Image.open(path)
    if img.mode != "RGB":
        img = img.convert("RGB")
    img.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True)
    return int(orig), int(size_kb(path))


INK_BG = (16, 12, 9)  # cor --color-ink do tema, fundo onde as imagens são exibidas


def convert_png_to_jpeg(path: Path) -> tuple[int, int]:
    """Converte PNG fotográfico para JPEG, retorna (original_kb, new_kb).

    PNGs semi-transparentes são compostos sobre o fundo escuro do tema para
    evitar halo branco nas bordas do frasco.
    """
    orig = size_kb(path)
    img = Image.open(path)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        base = Image.new("RGBA", img.size, INK_BG + (255,))
        img = Image.alpha_composite(base, img)
    elif img.mode != "RGB":
        img = img.convert("RGB")
    new_path = path.with_suffix(".jpg")
    img.convert("RGB").save(new_path, "JPEG", quality=JPEG_QUALITY, optimize=True)
    path.unlink()  # remove o PNG original
    return int(orig), int(size_kb(new_path))


def compress_banner(path: Path) -> tuple[int, int]:
    """Redimensiona banner para max 2400px e comprime."""
    orig = size_kb(path)
    img = Image.open(path)
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    if w > BANNER_MAX_WIDTH:
        ratio = BANNER_MAX_WIDTH / w
        img = img.resize((BANNER_MAX_WIDTH, int(h * ratio)), Image.LANCZOS)
    img.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True)
    return int(orig), int(size_kb(path))


def optimize_cutout(path: Path) -> tuple[int, int]:
    """Comprime cutout PNG mantendo transparência."""
    orig = size_kb(path)
    img = Image.open(path)
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    img.save(path, "PNG", optimize=True)
    return int(orig), int(size_kb(path))


def backup_file(path: Path):
    """Cria backup antes de modificar."""
    rel = path.relative_to(ROOT)
    dest = BACKUP / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        shutil.copy2(path, dest)


def main():
    changes = []

    # 1. Otimizar JPEGs de produto > 200KB
    for f in sorted(PERFUMES.glob("*.jpg")):
        if f.name.lower() == "fundo padrão.jpg":
            continue
        kb = size_kb(f)
        if kb > 200:
            changes.append(("JPEG compress", f, kb))

    # 2. Converter PNGs fotográficos para JPEG
    for f in sorted(PERFUMES.glob("*.png")):
        if is_photo_png(f):
            changes.append(("PNG->JPEG", f, size_kb(f)))

    # 3. Comprimir cutouts PNG grandes
    for f in sorted(CUTOUTS.glob("*.png")):
        kb = size_kb(f)
        if kb > 200:
            changes.append(("Cutout compress", f, kb))

    # 4. Comprimir banners
    for f in sorted(BANNERS.glob("*.jpg")):
        kb = size_kb(f)
        if kb > 200:
            changes.append(("Banner optimize", f, kb))

    # 5. Comprimir logo.jpg se existir
    logo = PUBLIC / "logo.jpg"
    if logo.exists() and size_kb(logo) > 100:
        changes.append(("Logo compress", logo, size_kb(logo)))

    if not changes:
        print("Nenhuma imagem precisa de otimização.")
        return

    print(f"\n{'[DRY RUN] ' if DRY_RUN else ''}Plano de otimização:\n")
    total_before = 0
    for action, path, kb in changes:
        print(f"  {action:20s}  {path.name:40s}  {kb:>7.0f} KB")
        total_before += kb
    print(f"\n  Total antes: {total_before:,.0f} KB ({total_before/1024:.1f} MB)")

    if DRY_RUN:
        print("\n[DRY RUN] Nenhuma alteração foi feita.")
        return

    # Backup
    print(f"\nCriando backup em {BACKUP.relative_to(ROOT)}...")
    for _, path, _ in changes:
        backup_file(path)

    # Executar otimizações
    total_after = 0
    for action, path, kb_before in changes:
        try:
            if action == "JPEG compress":
                _, new_kb = compress_jpeg(path)
                total_after += new_kb
                print(f"  OK {path.name}: {kb_before} -> {new_kb} KB ({(1-new_kb/kb_before)*100:.0f}% redução)")
            elif action == "PNG->JPEG":
                _, new_kb = convert_png_to_jpeg(path)
                total_after += new_kb
                print(f"  OK {path.name}: {kb_before} -> {new_kb} KB (convertido para JPEG)")
            elif action == "Cutout compress":
                _, new_kb = optimize_cutout(path)
                total_after += new_kb
                print(f"  OK {path.name}: {kb_before} -> {new_kb} KB")
            elif action == "Banner optimize":
                _, new_kb = compress_banner(path)
                total_after += new_kb
                print(f"  OK {path.name}: {kb_before} -> {new_kb} KB")
            elif action == "Logo compress":
                _, new_kb = compress_jpeg(path)
                total_after += new_kb
                print(f"  OK {path.name}: {kb_before} -> {new_kb} KB")
        except Exception as e:
            print(f"  ERRO {path.name}: {e}")
            total_after += kb_before

    print(f"\n  Total antes:  {total_before:,.0f} KB ({total_before/1024:.1f} MB)")
    print(f"  Total depois: {total_after:,.0f} KB ({total_after/1024:.1f} MB)")
    print(f"  Economia:     {total_before - total_after:,.0f} KB ({(1-total_after/total_before)*100:.0f}%)")
    print(f"\nBackup salvo em: {BACKUP.relative_to(ROOT)}")
    print("Se algo deu errado, copie os arquivos de volta do backup.")


if __name__ == "__main__":
    main()
