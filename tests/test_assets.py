"""Run with python3 -m unittest discover -s tests -v (standard library only)."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]


class Resources(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('img', 'script', 'source') and attrs.get('src'):
            self.urls.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.urls.append(attrs['href'])
        if tag == 'img':
            self.images.append(attrs)
            self.urls.extend(item.strip().split()[0] for item in attrs.get('srcset', '').split(',') if item.strip())


class AssetsTest(unittest.TestCase):
    def test_local_resources_and_font_stylesheet_on_every_page(self):
        for page in ROOT.rglob('*.html'):
            parser = Resources()
            parser.feed(page.read_text())
            self.assertTrue(any('assets/css/fonts.css' in u for u in parser.urls), str(page))
            for url in parser.urls:
                parsed = urlsplit(url)
                self.assertNotIn(parsed.hostname, ('fonts.googleapis.com', 'fonts.gstatic.com', 'images.pexels.com'))
                if not parsed.scheme and not parsed.netloc:
                    self.assertTrue((page.parent / unquote(parsed.path)).is_file(), f'{page}: {url}')
            for img in parser.images:
                if img.get('srcset'):
                    self.assertIn('sizes', img)
                    widths = [int(item.split()[-1][:-1]) for item in img['srcset'].split(',')]
                    self.assertEqual(widths, sorted(set(widths)))

    def test_font_binaries(self):
        css = (ROOT / 'assets/css/fonts.css').read_text()
        for url in re.findall(r'url\(([^)]+)\)', css):
            font = ROOT / 'assets/css' / url
            self.assertEqual(font.read_bytes()[:4], b'wOF2')

    def test_gallery_no_longer_fetches_home_page(self):
        html = (ROOT / 'espacios/canvas90-galeria.html').read_text()
        self.assertNotIn('fetch(', html)
        self.assertEqual(html.count('<figure class="shot"'), 3)
        self.assertIn("e.key==='Enter'", html)


if __name__ == '__main__':
    unittest.main()
