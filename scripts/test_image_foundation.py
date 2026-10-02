import os
import shutil
import urllib.request
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw, ImageFont

BRAIN_DIR = r"C:\Users\miana\.gemini\antigravity-ide\brain\f9bade46-351e-483f-888b-fed5d7bbc4d5"
PUBLIC_DIR = r"c:\Users\miana\OneDrive\Desktop\Watches Brand\public\images\products"

def download_image(url, target_path):
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp, open(target_path, 'wb') as f:
        f.write(resp.read())

def square_crop(img):
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    return img.crop((left, top, left + min_dim, top + min_dim)).resize((1200, 1200), Image.Resampling.LANCZOS)

def apply_color_tone(img, r_mult=1.0, g_mult=1.0, b_mult=1.0, contrast=1.1, brightness=1.0):
    img = ImageEnhance.Contrast(img).enhance(contrast)
    img = ImageEnhance.Brightness(img).enhance(brightness)
    
    if r_mult != 1.0 or g_mult != 1.0 or b_mult != 1.0:
        r, g, b = img.split()
        r = r.point(lambda i: min(255, int(i * r_mult)))
        g = g.point(lambda i: min(255, int(i * g_mult)))
        b = b.point(lambda i: min(255, int(i * b_mult)))
        img = Image.merge('RGB', (r, g, b))
    return img

print("Image processing tools ready.")
