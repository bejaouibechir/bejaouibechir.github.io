"""Resolve @@folder/prefix@@ placeholders in lesson bodies to real captures and write their real width/height."""
import pathlib, re, sys
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[2]; pub=root/"public"/"tutorials"
bad=0
for f in sorted((root/"src"/"_mock").glob("studio-lesson-*.main.html")):
    t=f.read_text(encoding="utf-8"); orig=t
    def fix(m):
        global bad
        folder,prefix=m.group(1).split("/",1)
        cands=sorted((pub/folder).glob(prefix+"-*.png"))
        cands=[c for c in cands if re.fullmatch(re.escape(prefix)+r"-(light|dark|midnight|ocean)\.png",c.name)]
        if not cands: bad+=1; print("MISSING",f.name,m.group(1)); return m.group(0)
        w,h=Image.open(cands[0]).size
        return f'src="/tutorials/{folder}/{cands[0].name}" width="{w}" height="{h}"'
    t=re.sub(r'src="@@([^@"]+)@@" width="0" height="0"',fix,t)
    if t!=orig: f.write_text(t,encoding="utf-8"); print("wired",f.name)
print("missing:",bad)
