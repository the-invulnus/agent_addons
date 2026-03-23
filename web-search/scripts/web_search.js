#!/usr/bin/env node

/**
 * Web Search Script
 *
 * This script searches the web using the MetaSo API and returns relevant results
 * with summaries and snippets.
 */

const https = require('https');

// API Configuration
const METASO_API_KEY = process.env.METASO_API_KEY;
const METASO_SEARCH_URL = 'metaso.cn';
const METASO_SEARCH_PATH = '/api/v1/search';

// Validate API key
if (!METASO_API_KEY) {
    console.error('❌ Error: METASO_API_KEY environment variable is not set');
    process.exit(1);
}

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const params = {};

    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].substring(2);
            const value = args[i + 1];
            params[key] = value;
            i++;
        }
    }

    return params;
}

// Validate required parameters
function validateParams(params) {
    if (!params.query) {
        console.error('❌ Missing required parameter: --query');
        process.exit(1);
    }

    // Set default value for n if not provided
    if (!params.n) {
        params.n = '5';
    }

    // Validate n is a positive integer
    const n = parseInt(params.n);
    if (isNaN(n) || n <= 0) {
        console.error('❌ Parameter --n must be a positive integer');
        process.exit(1);
    }
}

// Perform web search
async function webSearch(query, n) {
    const payload = JSON.stringify({
        q: query,
        scope: 'webpage',
        includeSummary: true,
        size: n,
        includeRawContent: false,
        conciseSnippet: false
    });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: METASO_SEARCH_URL,
            port: 443,
            path: METASO_SEARCH_PATH,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${METASO_API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 30000
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                } else {
                    try {
                        const result = JSON.parse(data);
                        resolve(result);
                    } catch (e) {
                        reject(new Error(`Failed to parse response: ${e.message}`));
                    }
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.write(payload);
        req.end();
    });
}

// Main function
async function main() {
    const params = parseArgs();
    validateParams(params);

    const query = params.query;
    const n = parseInt(params.n);

    try {
        // Perform search
        const result = await webSearch(query, n);

        // Extract webpages
        const webpages = result.webpages || [];

        // Output as JSON
        console.log(JSON.stringify(webpages, null, 2));
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Execute main function
main();
