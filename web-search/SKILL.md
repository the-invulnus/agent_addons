---
name: web-search
description: "Web search capability to retrieve the latest information from the internet. Use when you need to search for current information, recent events, or specific topics on the web. Returns search results with summaries and snippets from relevant webpages."
---

# Web Search

## Overview

This skill provides web search capabilities to retrieve the latest information from the internet. It uses the MetaSo search API to find relevant webpages and returns results with summaries and snippets.

## Quick Start

### Dependencies

Node.js (v14 or higher) - no additional packages required.

## Core Capabilities

### 1. Web Search

Search the web to get the latest information with optional result count.

**Basic usage:**

```bash
node scripts/web_search.js --query "人工智能" --n 5
```

**Parameters:**
- `--query`: The search query (required)
- `--n`: Number of results to return (default: 5)

**Common scenarios:**

- Search for recent news and events
- Research specific topics
- Find current information on any subject
- Get summaries and snippets from webpages

**Output format:** JSON array of webpages with the following structure:
```json
[
  {
    "title": "Page Title",
    "url": "https://example.com",
    "snippet": "Brief description...",
    "summary": "Detailed summary of the page content..."
  }
]
```

## Working with Scripts

### Direct Execution

The script is standalone and can be run directly:

```bash
# Search for information
node scripts/web_search.js --query "Your search query" --n 5
```

### Integration into Workflows

The script can be integrated into larger Node.js workflows:

```javascript
const { execSync } = require('child_process');

// Execute search
const result = execSync(
  'node scripts/web_search.js --query "artificial intelligence" --n 5',
  { encoding: 'utf-8' }
);
const webpages = JSON.parse(result);
```

### Error Handling

The script outputs errors to stderr and exits with code 1 on failure:

- Network connectivity issues
- API failures
- Invalid parameters
- Missing required arguments

Check stderr output for detailed error messages.

## Best Practices

### Search Queries

1. **Be specific in queries**: More specific queries yield better results
   - Good: `"artificial intelligence applications in healthcare 2024"`
   - Less effective: `"AI"`

2. **Use appropriate result count**: Request more results for comprehensive research, fewer for quick answers

3. **Leverage summaries**: Each result includes a summary that provides context before visiting the full page

4. **Filter results by relevance**: Results are ordered by relevance to the query

## Troubleshooting

**Search fails with API error:**
- Check network connectivity
- Verify API key is valid
- Ensure query doesn't violate content policies

**No results returned:**
- Try rephrasing the query
- Check if the search service is available
- Verify the query is not too restrictive

**Script execution errors:**
- Ensure Node.js is installed (v14 or higher)
- Check script has execute permissions
- Verify all required parameters are provided
