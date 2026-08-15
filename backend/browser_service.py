import os
import re
import json
import base64
import urllib.request
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")
BROWSERLESS_API_KEY = os.getenv("BROWSERLESS_API_KEY")


class BrowserControlService:
    """
    Advanced Multi-Provider Autonomous Web Research & Data Extraction Engine.
    Supports Firecrawl REST API, Browserless.io Cloud WebSockets, and Playwright Chromium.
    Handles deep web scraping, LLM markdown extraction, table data parsing, contact discovery,
    infinite-scroll rendering, full-page screenshots, and multi-page research swarms.
    """

    @classmethod
    async def scrape_url(cls, target_url: str, scroll_depth: int = 1) -> Dict[str, Any]:
        """
        Scrapes target_url using automated multi-provider router:
        1. Firecrawl REST API (If FIRECRAWL_API_KEY set - 100% Vercel Serverless Ready)
        2. Browserless.io Cloud WebSockets (If BROWSERLESS_API_KEY set)
        3. Local Playwright Chromium Engine (Local development)
        """
        if not target_url.startswith("http://") and not target_url.startswith("https://"):
            target_url = "https://" + target_url

        # 1. Attempt Firecrawl REST API (LLM Markdown Engine)
        if FIRECRAWL_API_KEY:
            fc_res = cls._scrape_firecrawl(target_url)
            if fc_res.get("status") == "SUCCESS":
                return fc_res

        # 2. Attempt Playwright (Local or Browserless.io Cloud WebSocket)
        if PLAYWRIGHT_AVAILABLE:
            return await cls._scrape_playwright(target_url, scroll_depth)

        return {
            "status": "ERROR",
            "message": "No browser scraping engine configured. Set FIRECRAWL_API_KEY or BROWSERLESS_API_KEY in backend/.env"
        }

    @classmethod
    def _scrape_firecrawl(cls, target_url: str) -> Dict[str, Any]:
        """
        Executes lightweight HTTP REST scrape via Firecrawl API (https://api.firecrawl.dev).
        Converts webpage DOM into clean Markdown, extracts metadata, headings, and contacts.
        """
        url = "https://api.firecrawl.dev/v1/scrape"
        payload = {
            "url": target_url,
            "formats": ["markdown", "html"]
        }

        try:
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={
                    "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=15) as resp:
                res_json = json.loads(resp.read().decode("utf-8"))
                data = res_json.get("data", {})
                markdown = data.get("markdown", "")
                metadata = data.get("metadata", {})

                # Extract contacts from Firecrawl markdown
                emails = list(set(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', markdown)))
                phone_numbers = list(set(re.findall(r'\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}', markdown)))

                return {
                    "status": "SUCCESS",
                    "url": target_url,
                    "title": metadata.get("title", target_url),
                    "meta_description": metadata.get("description", ""),
                    "markdown_content": markdown[:3000],
                    "body_summary": markdown[:800],
                    "contacts_discovered": {
                        "emails": emails[:10],
                        "phone_numbers": phone_numbers[:10],
                        "social_profiles": []
                    },
                    "engine": "Firecrawl LLM Markdown REST API (Vercel Serverless)"
                }
        except Exception as err:
            return {
                "status": "ERROR",
                "message": f"Firecrawl API Exception: {str(err)}"
            }

    @classmethod
    async def _scrape_playwright(cls, target_url: str, scroll_depth: int = 1) -> Dict[str, Any]:
        """
        Executes Playwright browser navigation (via Browserless.io WebSocket or local Chromium).
        """
        try:
            async with async_playwright() as p:
                if BROWSERLESS_API_KEY:
                    ws_endpoint = f"wss://chrome.browserless.io?token={BROWSERLESS_API_KEY}"
                    browser = await p.chromium.connect_over_cdp(ws_endpoint)
                    engine_name = "Browserless.io Cloud Playwright WebSocket"
                else:
                    browser = await p.chromium.launch(headless=True)
                    engine_name = "Local Playwright Chromium"

                page = await browser.new_page(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                )

                await page.goto(target_url, wait_until="domcontentloaded", timeout=20000)

                for _ in range(scroll_depth):
                    await page.evaluate("window.scrollBy(0, window.innerHeight)")
                    await page.wait_for_timeout(400)

                title = await page.title()
                
                meta_desc = ""
                try:
                    meta_desc = await page.get_attribute("meta[name='description']", "content", timeout=2000) or ""
                except Exception:
                    meta_desc = ""

                text_content = await page.inner_text("body")
                clean_lines = [line.strip() for line in text_content.split("\n") if line.strip()]
                body_text = "\n".join(clean_lines)
                body_summary = " ".join(clean_lines[:25])[:1000]

                emails = list(set(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', body_text)))
                phone_numbers = list(set(re.findall(r'\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}', body_text)))

                headings = await page.eval_on_selector_all(
                    "h1, h2, h3", 
                    "elements => elements.map(e => (e.innerText || e.textContent || '').trim()).filter(Boolean)"
                )
                
                tables_data = await page.eval_on_selector_all(
                    "table",
                    """elements => elements.map(table => {
                        const rows = Array.from(table.querySelectorAll('tr'));
                        return rows.map(row => {
                            const cells = Array.from(row.querySelectorAll('th, td'));
                            return cells.map(c => (c.innerText || c.textContent || '').trim());
                        }).filter(r => r.length > 0);
                    })"""
                )

                raw_links = await page.eval_on_selector_all(
                    "a[href]", 
                    "elements => elements.map(e => ({ text: (e.innerText || e.textContent || '').trim(), href: e.href })).filter(e => e.href.startsWith('http'))"
                )

                social_links = []
                for link in raw_links:
                    href = link["href"].lower()
                    if any(domain in href for domain in ["linkedin.com", "twitter.com", "x.com", "github.com", "facebook.com", "instagram.com"]):
                        social_links.append(link)

                await browser.close()

                return {
                    "status": "SUCCESS",
                    "url": target_url,
                    "title": title,
                    "meta_description": meta_desc,
                    "headings": headings[:15],
                    "body_summary": body_summary,
                    "full_text_length": len(body_text),
                    "contacts_discovered": {
                        "emails": emails[:10],
                        "phone_numbers": phone_numbers[:10],
                        "social_profiles": social_links[:10]
                    },
                    "tables_extracted": tables_data[:5],
                    "total_links_found": len(raw_links),
                    "scraped_links_sample": raw_links[:10],
                    "engine": engine_name
                }
        except Exception as err:
            return {
                "status": "ERROR",
                "url": target_url,
                "message": f"Playwright Scraping Exception: {str(err)}"
            }

    @classmethod
    async def perform_web_research(cls, query_or_urls: str, max_pages: int = 3) -> Dict[str, Any]:
        """
        Conducts multi-provider autonomous research across web URLs or search queries.
        """
        url_matches = re.findall(r'https?://[^\s]+', query_or_urls)
        target_urls = url_matches if url_matches else [
            f"https://html.duckduckgo.com/html/?q={query_or_urls.replace(' ', '+')}"
        ]

        research_results = []
        all_emails = set()
        all_tables = []

        for url in target_urls[:max_pages]:
            scrape_res = await cls.scrape_url(url, scroll_depth=2)
            if scrape_res.get("status") == "SUCCESS":
                research_results.append({
                    "url": url,
                    "title": scrape_res.get("title"),
                    "summary": scrape_res.get("body_summary"),
                    "headings": scrape_res.get("headings", [])[:5]
                })
                contacts = scrape_res.get("contacts_discovered", {})
                all_emails.update(contacts.get("emails", []))
                all_tables.extend(scrape_res.get("tables_extracted", []))

        return {
            "status": "SUCCESS",
            "research_query": query_or_urls,
            "pages_analyzed": len(research_results),
            "consolidated_emails": list(all_emails)[:15],
            "extracted_tables_count": len(all_tables),
            "research_dossier": research_results,
            "engine": "Kaiso Multi-Provider Autonomous Web Research Swarm"
        }

    @classmethod
    async def take_screenshot(cls, target_url: str) -> Dict[str, Any]:
        """
        Captures full-page PNG screenshot using Browserless.io or local Playwright.
        """
        if not target_url.startswith("http://") and not target_url.startswith("https://"):
            target_url = "https://" + target_url

        try:
            async with async_playwright() as p:
                if BROWSERLESS_API_KEY:
                    ws_endpoint = f"wss://chrome.browserless.io?token={BROWSERLESS_API_KEY}"
                    browser = await p.chromium.connect_over_cdp(ws_endpoint)
                else:
                    browser = await p.chromium.launch(headless=True)

                page = await browser.new_page(viewport={"width": 1280, "height": 800})
                await page.goto(target_url, wait_until="domcontentloaded", timeout=15000)
                
                screenshot_bytes = await page.screenshot(full_page=True)
                b64_img = base64.b64encode(screenshot_bytes).decode("utf-8")

                await browser.close()

                return {
                    "status": "SUCCESS",
                    "url": target_url,
                    "image_format": "png",
                    "base64_length": len(b64_img),
                    "base64_sample": f"data:image/png;base64,{b64_img[:100]}..."
                }
        except Exception as err:
            return {
                "status": "ERROR",
                "url": target_url,
                "message": f"Screenshot Exception: {str(err)}"
            }
