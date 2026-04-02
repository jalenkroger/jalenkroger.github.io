import requests
from bs4 import BeautifulSoup
import re
from collections import Counter
import json

def get_text_from_url(url):
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        soup = BeautifulSoup(response.text, 'html.parser')
        paragraphs = soup.find_all('p')
        return " ".join([p.get_text() for p in paragraphs])
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def process_text():
    # Initial search page
    search_url = "https://news.unmc.edu/?s=Jeffrey+Gold"
    response = requests.get(search_url, headers={'User-Agent': 'Mozilla/5.0'})
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract article links
    links = set()
    for a in soup.find_all('a', href=True):
        if 'unmc.edu/' in a['href'] and ('2026' in a['href'] or '2025' in a['href'] or '2024' in a['href']):
            links.add(a['href'])
            
    print(f"Found {len(links)} links. Fetching text...")
    
    # Fetch text
    full_text = ""
    for idx, link in enumerate(list(links)[:15]):  # limit to 15 articles
        print(f"Fetching {idx+1}: {link}")
        full_text += get_text_from_url(link) + " "
        
    print(f"Total characters fetched: {len(full_text)}")
    
    # Process words
    words = re.findall(r'\b[a-zA-Z]{3,}\b', full_text.lower())
    
    # Basic stop words to filter out
    stop_words = set([
        'the', 'and', 'that', 'for', 'with', 'was', 'this', 'are', 'from', 'has', 'have', 
        'his', 'can', 'not', 'but', 'will', 'about', 'who', 'which', 'our', 'all', 'there', 
        'their', 'what', 'some', 'they', 'would', 'been', 'more', 'also', 'said', 'has', 
        'well', 'one', 'out', 'into', 'just', 'now', 'its', 'other', 'than', 'could', 'how',
        'because', 'these', 'those', 'when', 'where', 'why', 'very', 'much', 'many', 'over',
        'during', 'before', 'after', 'while', 'through', 'between', 'under', 'above', 'below',
        'down', 'should', 'would', 'could', 'might', 'must', 'can', 'may', 'do', 'does', 'did',
        'doing', 'done', 'is', 'am', 'are', 'was', 'were', 'be', 'being', 'been', 'have', 'has',
        'had', 'having', 'make', 'made', 'making', 'take', 'took', 'taking', 'get', 'getting',
        'got', 'know', 'knew', 'knowing', 'think', 'thought', 'thinking', 'see', 'saw', 'seeing',
        'look', 'looked', 'looking', 'come', 'came', 'coming', 'go', 'went', 'going', 'say', 
        'said', 'saying', 'tell', 'told', 'telling', 'new', 'year', 'two', 'first', 'we', 'you',
        'too', 'then', 'up', 'down', 'only', 'so', 'if', 'by', 'as', 'at', 'it', 'on', 'in', 'to',
        'of', 'gold', 'jeffrey', 'president', 'chancellor', 'university', 'nebraska', 'unmc',
        'he', 'she', 'dr', 'medical', 'center'
    ])
    
    filtered_words = [w for w in words if w not in stop_words and len(w) > 3]
    word_counts = Counter(filtered_words)
    
    top_words = [{'word': word, 'count': count} for word, count in word_counts.most_common(100)]
    
    with open('data.js', 'w') as f:
         f.write(f"const wordData = {json.dumps(top_words, indent=2)};\n")
    print("Saved to data.js")

if __name__ == "__main__":
    process_text()
