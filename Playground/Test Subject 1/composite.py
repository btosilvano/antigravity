import sys
try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image

try:
    base_path = r"C:\Users\PAULO.ROBERTO\.gemini\antigravity\brain\4bc023a8-0eb8-49a3-9421-acb1cef68abb\liquid_dashboard_blue_lsvt_1774491356572.png"
    logo_path = r"d:\Dropbox\BRAD\ANTIGRAVITY\Playground\Test Subject 1\images\signin-headerLogo-6796750A-CBF4-8E13-FA4D74594E3CD489.png"
    out_path = r"C:\Users\PAULO.ROBERTO\.gemini\antigravity\brain\4bc023a8-0eb8-49a3-9421-acb1cef68abb\liquid_dashboard_with_real_logo.png"

    base = Image.open(base_path).convert("RGBA")
    logo = Image.open(logo_path).convert("RGBA")

    max_width = int(base.width * 0.4)
    ratio = max_width / float(logo.width)
    new_size = (max_width, int(logo.height * ratio))
    logo = logo.resize(new_size, Image.Resampling.LANCZOS)

    x = (base.width - logo.width) // 2
    y = int(base.height * 0.05)

    # Overlay the logo
    base.paste(logo, (x, y), logo)
    
    # Convert back to RGB to save as PNG normally without issues if base didn't have alpha
    final = Image.new("RGB", base.size, (255, 255, 255))
    final.paste(base, mask=base.split()[3]) # use alpha as mask
    final.save(out_path, format="PNG")

    print("SUCCESS")
except Exception as e:
    print("ERROR:", str(e))
