"""
Turns the original PNG/GIF images into small WebP copies for the website.

The originals in Images/ stay as they are (they're the "source" files and the
Docker certificate link still opens the full PNG). The page itself loads the
.webp copies, sized to about 2x how big they show on screen so they stay sharp
on retina phones.

Runs inside Docker so nothing gets installed on my PC:

    docker run --rm -v "$PWD:/app" -w /app --entrypoint python3 \
        ultralytics/ultralytics:latest-cpu tools/optimize-images.py

In short:
    for each image in the list below
        open the original
        shrink it to the target size (never enlarge)
        save it as WebP next to the original
        print old size -> new size
"""

from pathlib import Path

from PIL import Image, ImageSequence

QUALITY = 82  # high enough that text in screenshots stays crisp

# (original file, output file, target height or width)
# heights match the CSS: timeline images are 10rem (160px) tall, so 320px = 2x.
# certificates get two widths so phones and desktops each pick the right one.
#
# raj.png is pixel art, so it keeps its exact size and goes lossless: any
# resizing or lossy compression would smear the hard pixel edges.
JOBS = [
    ("Images/raj.png", "Images/raj.webp", {"width": 9999, "lossless": True}),
    ("Images/projects/shell.png", "Images/projects/shell.webp", {"height": 320}),
    ("Images/projects/sort.gif", "Images/projects/sort.webp", {"height": 320}),
    ("Images/projects/CLI-TODO.png", "Images/projects/CLI-TODO.webp", {"height": 320}),
    ("Images/certificates/Cs50x.png", "Images/certificates/Cs50x-560.webp", {"width": 560}),
    ("Images/certificates/Cs50x.png", "Images/certificates/Cs50x-1100.webp", {"width": 1100}),
    ("Images/certificates/docker.png", "Images/certificates/docker-560.webp", {"width": 560}),
    ("Images/certificates/docker.png", "Images/certificates/docker-1100.webp", {"width": 1100}),
]


def target_size(w, h, want):
    """
    Work out the new size while keeping the shape of the image.

    In short:
        scale = wanted width / width  (or wanted height / height)
        if scale >= 1 -> keep the original size (no blurry upscaling)
        else          -> multiply both sides by scale
    """
    scale = want["width"] / w if "width" in want else want["height"] / h
    if scale >= 1:
        return w, h
    return round(w * scale), round(h * scale)


def convert(src, dst, want):
    """
    Save one image as WebP. Animated GIFs stay animated, frame timing included.

    In short:
        if it has several frames -> resize every frame, keep each duration, loop forever
        else                     -> resize once and save
    """
    with Image.open(src) as im:
        size = target_size(im.width, im.height, want)
        frames = getattr(im, "n_frames", 1)

        if frames > 1:
            resized, durations = [], []
            for frame in ImageSequence.Iterator(im):
                durations.append(frame.info.get("duration", 100))
                resized.append(frame.convert("RGBA").resize(size, Image.LANCZOS))
            resized[0].save(
                dst, "WEBP", save_all=True, append_images=resized[1:],
                duration=durations, loop=0, quality=QUALITY, method=6,
            )
        else:
            mode = "RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB"
            out = im.convert(mode)
            if size != im.size:
                out = out.resize(size, Image.LANCZOS)
            if want.get("lossless"):
                out.save(dst, "WEBP", lossless=True, quality=100, method=6)
            else:
                out.save(dst, "WEBP", quality=QUALITY, method=6)
    return size


def main():
    """
    In short: convert every job and print a little before/after table.
    """
    before = after = 0
    for src, dst, want in JOBS:
        size = convert(src, dst, want)
        a, b = Path(src).stat().st_size, Path(dst).stat().st_size
        before, after = before + a, after + b
        print(f"{src:34} {a/1024:7.1f} KB -> {dst:38} {b/1024:6.1f} KB  {size[0]}x{size[1]}")
    print(f"total written: {after/1024:.1f} KB")


if __name__ == "__main__":
    main()
