import os
import glob

def bundle_react():
    build_dir = "build"
    index_file = os.path.join(build_dir, "index.html")
    
    with open(index_file, "r", encoding="utf-8") as f:
        html = f.read()

    css_files = glob.glob(os.path.join(build_dir, "static/css/*.css"))
    for css_file in css_files:
        with open(css_file, "r", encoding="utf-8") as f:
            css_content = f.read()
        css_name = os.path.basename(css_file)
        # Find where it's linked
        link_tag = f'<link href="/static/css/{css_name}" rel="stylesheet">'
        html = html.replace(link_tag, f"<style>\n{css_content}\n</style>")

    js_files = glob.glob(os.path.join(build_dir, "static/js/*.js"))
    for js_file in js_files:
        with open(js_file, "r", encoding="utf-8") as f:
            js_content = f.read()
        js_name = os.path.basename(js_file)
        script_tag = f'<script defer="defer" src="/static/js/{js_name}"></script>'
        html = html.replace(script_tag, f"<script>\n{js_content}\n</script>")

    with open("bundle.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Bundle created at bundle.html")

if __name__ == "__main__":
    bundle_react()
