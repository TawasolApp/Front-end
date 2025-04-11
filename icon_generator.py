

svg_content = """
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 15H80V30H58V85H42V30H20V15Z" fill="#1572D3"/>
</svg>
"""
svg_path = "./public/tawasol.svg"

with open(svg_path, "w") as f:
    f.write(svg_content)
svg_path