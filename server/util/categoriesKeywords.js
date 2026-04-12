const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const categoryKeywords = {

  // EXPENSE CATEGORIES

  "Food & Dining": [
    "restaurant",
    "cafe",
    "food",
    "pizza",
    "burger",
    "coffee",
    "dining"
  ],

  "Transport": [
    "uber",
    "taxi",
    "ride",
    "fuel",
    "petrol",
    "diesel",
    "transport"
  ],

  "Groceries": [
    "grocery",
    "supermarket",
    "mart",
    "market"
  ],

  "Utilities": [
    "electric",
    "electricity",
    "gas",
    "water",
    "internet",
    "broadband",
    "mobile",
    "phone",
    "utility"
  ],

  "Rent": [
    "rent",
    "lease"
  ],

  "Shopping": [
    "store",
    "shop",
    "purchase",
    "order"
  ],

  "Entertainment": [
    "movie",
    "cinema",
    "entertainment",
    "stream"
  ],

  "Healthcare": [
    "hospital",
    "clinic",
    "pharmacy",
    "medical"
  ],

  "Education": [
    "school",
    "college",
    "university",
    "education",
    "tuition"
  ],

  "Subscriptions": [
    "subscription",
    "monthly"
  ],

  "Taxes": [
    "tax",
    "government"
  ],

  "Insurance": [
    "insurance"
  ],

  "Travel": [
    "hotel",
    "airline",
    "flight",
    "booking"
  ],

  "Cash Withdrawal": [
    "atm",
    "withdrawal"
  ],

  "Bank Fees": [
    "fee",
    "charge"
  ],

  // INCOME

  "Salary": [
    "salary",
    "payroll",
    "wage"
  ],

  "Freelance": [
    "freelance",
    "gig"
  ],

  "Refund": [
    "refund",
    "reversal"
  ],

  "Investment": [
    "dividend",
    "interest",
    "profit"
  ],

  "Business Income": [
    "payment received",
    "invoice payment"
  ]

};




// Step 1: Try keyword match (free, instant)
function categorizeByKeyword(description) {
  const lower = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return category;
    }
  }
  
  return null; // no match → needs AI
}

// Step 2: AI only for unmatched (batched to save tokens)
  async function categorizeWithAI(descriptions) {
  const categoryList = [
    "Food & Dining", "Transport", "Groceries", "Utilities", "Rent",
    "Shopping", "Entertainment", "Healthcare", "Education", "Subscriptions",
    "Taxes", "Insurance", "Travel", "Cash Withdrawal", "Bank Fees",
    "Salary", "Freelance", "Refund", "Investment", "Business Income", "Other"
  ];

  const prompt = `You are a bank transaction categorizer.

RULES:
- Return ONLY a JSON array with exactly ${descriptions.length} items
- Each item MUST be one of these exact strings: ${categoryList.join(', ')}
- NEVER return the transaction text itself
- If unsure, return "Other"

EXAMPLES:
"Money Transferred to JOHN JazzCash" → "Other"
"Raast P2P Fund transfer to AHMED" → "Other"  
"Online Cash Deposit 123456" → "Other"
"ATM Withdrawal" → "Cash Withdrawal"
"ZELLBURY POS Transaction" → "Shopping"

Categorize these ${descriptions.length} transactions:
${descriptions.map((d, i) => `${i + 1}. ${d}`).join('\n')}`;

  const response = await groq.chat.completions.create({
    // model: 'llama-3.1-8b-instant',
    model: 'llama-3.3-70b-versatile', 
    max_tokens: 150 + (descriptions.length * 20),
    temperature: 0,
    messages: [
      { role: 'system', content: 'Return ONLY a valid JSON array of category strings. Example: ["Salary","Food & Dining","Transport"]' },
      { role: 'user', content: prompt },
    ],
  });

  const text = response.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean); // ["Salary", "Food & Dining", ...]
}

// Step 3: Main function that combines both
async function categorizeTransactions(transactions) {
  const unmatched = []; // { index, description }

  // First pass: keyword match everything
  const results = transactions.map((tx, index) => {
    const category = categorizeByKeyword(tx.description);
    if (category) {
      console.log(`✅ Keyword match: "${tx.description}" → ${category}`);
      return { ...tx, aiCategory: category, aiConfidence: 1.0, isAiReviewed: false };
    } else {
      console.log(`❓ No match: "${tx.description}" → needs AI`);
      unmatched.push({ index, description: tx.description });
      return tx; // placeholder
    }
  });

  console.log(`📊 Keyword matched: ${transactions.length - unmatched.length}/${transactions.length}`);
  console.log(`🤖 Sending ${unmatched.length} to AI...`);

  // Second pass: batch AI for unmatched only
  if (unmatched.length > 0) {
    const aiCategories = await categorizeWithAI(unmatched.map(u => u.description));
    
    unmatched.forEach(({ index }, i) => {
      results[index] = {
        ...results[index],
        aiCategory: aiCategories[i] || 'Other',
        aiConfidence: 0.7,
        isAiReviewed: true,
      };
    });
  }

  return results;
}

module.exports = {
  categorizeTransactions,
};