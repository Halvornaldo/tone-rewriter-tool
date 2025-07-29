class CodeReviewSystem {
    constructor() {
        this.codeInput = document.getElementById('code-input');
        this.analyzeBtn = document.getElementById('analyze-btn');
        this.resultsSection = document.getElementById('results-section');
        this.languageSelect = document.getElementById('language');
        this.loadExampleBtn = document.getElementById('load-example');
        
        this.results = {
            overview: null,
            review: null,
            learning: null,
            documentation: null
        };
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.analyzeBtn.addEventListener('click', () => this.analyzeCode());
        this.loadExampleBtn.addEventListener('click', () => this.loadExample());
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Auto-resize textarea
        this.codeInput.addEventListener('input', () => this.autoResizeTextarea());
    }
    
    autoResizeTextarea() {
        this.codeInput.style.height = 'auto';
        this.codeInput.style.height = Math.max(300, this.codeInput.scrollHeight) + 'px';
    }
    
    loadExample() {
        const exampleCode = `function calculateTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        if (items[i].price && items[i].quantity) {
            total += items[i].price * items[i].quantity;
        }
    }
    return total;
}

// Usage
var cart = [
    { name: "Apple", price: 1.50, quantity: 3 },
    { name: "Banana", price: 0.80, quantity: 5 },
    { name: "Orange", price: 2.00 }  // Missing quantity!
];

console.log("Total: $" + calculateTotal(cart));`;
        
        this.codeInput.value = exampleCode;
        this.languageSelect.value = 'javascript';
        this.autoResizeTextarea();
    }
    
    async analyzeCode() {
        const code = this.codeInput.value.trim();
        if (!code) {
            alert('Please enter some code to analyze');
            return;
        }
        
        const language = this.languageSelect.value;
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate agent coordination - in reality these would be separate API calls
            await this.runAgentAnalysis(code, language);
            
            this.displayResults();
            this.resultsSection.classList.remove('hidden');
            
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Analysis failed. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async runAgentAnalysis(code, language) {
        // Show agent status
        this.showAgentStatus();
        
        // Simulate parallel agent execution
        const agentPromises = [
            this.runOverviewAnalysis(code, language),
            this.runCodeReview(code, language),
            this.runLearningAnalysis(code, language),
            this.runDocumentationGeneration(code, language)
        ];
        
        await Promise.all(agentPromises);
    }
    
    showAgentStatus() {
        const overviewContent = document.querySelector('.overview-content');
        overviewContent.innerHTML = `
            <div class="loading-message">🤖 Agents are analyzing your code...</div>
            <div class="agent-status working">
                <span>📊 General Analysis Agent: Analyzing code structure...</span>
            </div>
            <div class="agent-status working">
                <span>🔍 Code Review Agent: Checking for issues...</span>
            </div>
            <div class="agent-status working">
                <span>📚 Learning Companion: Identifying teaching points...</span>
            </div>
            <div class="agent-status working">
                <span>📝 Documentation Agent: Generating docs...</span>
            </div>
        `;
    }
    
    async runOverviewAnalysis(code, language) {
        // Simulate API delay
        await this.delay(1000);
        
        const lines = code.split('\n').length;
        const functions = (code.match(/function\s+\w+/g) || []).length;
        const comments = (code.match(/\/\/|\/\*|\*/g) || []).length;
        
        this.results.overview = {
            language: language,
            lines: lines,
            functions: functions,
            comments: comments,
            complexity: this.calculateComplexity(code)
        };
    }
    
    async runCodeReview(code, language) {
        // Simulate the code-learning-companion agent review
        await this.delay(1500);
        
        const issues = [];
        
        // Basic static analysis
        if (code.includes('var ')) {
            issues.push({
                type: 'warning',
                title: 'Use of var keyword',
                description: 'Consider using let or const instead of var for better scoping.',
                line: this.findLineNumber(code, 'var'),
                suggestion: 'Replace var with let for variables that change, or const for constants.'
            });
        }
        
        if (code.includes('== ') && !code.includes('=== ')) {
            issues.push({
                type: 'warning',
                title: 'Loose equality comparison',
                description: 'Use strict equality (===) instead of loose equality (==).',
                suggestion: 'Replace == with === for type-safe comparisons.'
            });
        }
        
        if (!code.includes('//') && !code.includes('/*')) {
            issues.push({
                type: 'info',
                title: 'Missing comments',
                description: 'Consider adding comments to improve code readability.',
                suggestion: 'Add comments to explain complex logic or function purposes.'
            });
        }
        
        if (code.includes('console.log')) {
            issues.push({
                type: 'info',
                title: 'Debug statements found',
                description: 'Console.log statements found - consider removing for production.',
                suggestion: 'Use proper logging libraries or remove debug statements.'
            });
        }
        
        this.results.review = issues;
    }
    
    async runLearningAnalysis(code, language) {
        // Simulate the code-learning-companion providing educational insights
        await this.delay(1200);
        
        const learningPoints = [];
        
        if (code.includes('for')) {
            learningPoints.push({
                concept: 'For Loops',
                explanation: 'For loops are used to repeat code a specific number of times. The syntax includes initialization, condition, and increment.',
                example: 'for (let i = 0; i < array.length; i++) { /* code */ }',
                tip: 'Consider using forEach() or for...of loops for cleaner, more readable code.'
            });
        }
        
        if (code.includes('function')) {
            learningPoints.push({
                concept: 'Functions',
                explanation: 'Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.',
                example: 'function myFunction(parameter) { return parameter * 2; }',
                tip: 'Use descriptive function names and consider breaking large functions into smaller ones.'
            });
        }
        
        if (code.includes('if')) {
            learningPoints.push({
                concept: 'Conditional Statements',
                explanation: 'If statements execute code based on whether a condition is true or false.',
                example: 'if (condition) { /* execute this */ } else { /* execute that */ }',
                tip: 'Always consider edge cases and what happens when conditions are false.'
            });
        }
        
        this.results.learning = learningPoints;
    }
    
    async runDocumentationGeneration(code, language) {
        // Simulate general-purpose agent generating documentation
        await this.delay(1800);
        
        const functions = this.extractFunctions(code);
        const documentation = {
            overview: this.generateOverviewDoc(code, language),
            functions: functions.map(func => this.generateFunctionDoc(func)),
            usage: this.generateUsageDoc(code),
            api: this.generateAPIDoc(functions)
        };
        
        this.results.documentation = documentation;
    }
    
    extractFunctions(code) {
        const functionRegex = /function\s+(\w+)\s*\([^)]*\)/g;
        const functions = [];
        let match;
        
        while ((match = functionRegex.exec(code)) !== null) {
            functions.push({
                name: match[1],
                fullDeclaration: match[0],
                startIndex: match.index
            });
        }
        
        return functions;
    }
    
    generateOverviewDoc(code, language) {
        return `# Code Documentation

## Overview
This ${language} code contains ${this.results.overview.functions} function(s) across ${this.results.overview.lines} lines.

## Complexity Analysis
- Cyclomatic Complexity: ${this.results.overview.complexity}
- Functions: ${this.results.overview.functions}
- Comments: ${this.results.overview.comments}`;
    }
    
    generateFunctionDoc(func) {
        return {
            name: func.name,
            signature: func.fullDeclaration,
            description: `Function that performs operations related to ${func.name}.`,
            parameters: 'Parameters extracted from function signature',
            returns: 'Return value depends on function implementation'
        };
    }
    
    generateUsageDoc(code) {
        return `## Usage Example

\`\`\`javascript
${code.split('\n').slice(0, 10).join('\n')}
\`\`\`

This code can be used by calling the main functions with appropriate parameters.`;
    }
    
    generateAPIDoc(functions) {
        return functions.map(func => `
### ${func.name}()
${func.fullDeclaration}

Description: Auto-generated documentation for ${func.name} function.
        `).join('\n');
    }
    
    calculateComplexity(code) {
        // Simple complexity calculation
        const conditions = (code.match(/if|for|while|switch|catch/g) || []).length;
        return Math.max(1, conditions);
    }
    
    findLineNumber(code, searchTerm) {
        const lines = code.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(searchTerm)) {
                return i + 1;
            }
        }
        return null;
    }
    
    displayResults() {
        this.displayOverview();
        this.displayReview();
        this.displayLearning();
        this.displayDocumentation();
    }
    
    displayOverview() {
        const content = document.querySelector('.overview-content');
        const { overview } = this.results;
        
        content.innerHTML = `
            <div class="agent-status complete">
                <span>✅ Analysis Complete - All agents finished successfully!</span>
            </div>
            
            <h4>Code Metrics</h4>
            <div class="metrics">
                <span class="metric">Language: ${overview.language}</span>
                <span class="metric">Lines: ${overview.lines}</span>
                <span class="metric">Functions: ${overview.functions}</span>
                <span class="metric">Comments: ${overview.comments}</span>
                <span class="metric">Complexity: ${overview.complexity}</span>
            </div>
            
            <h4>Summary</h4>
            <p>Your ${overview.language} code has been analyzed by multiple AI agents. Check the other tabs for detailed feedback on code quality, learning opportunities, and generated documentation.</p>
        `;
    }
    
    displayReview() {
        const content = document.querySelector('.review-content');
        const { review } = this.results;
        
        if (review.length === 0) {
            content.innerHTML = '<p>✅ No major issues found! Your code looks good.</p>';
            return;
        }
        
        const reviewHTML = review.map(issue => `
            <div class="review-item ${issue.type}">
                <h4>${issue.title}</h4>
                <p>${issue.description}</p>
                ${issue.line ? `<p><strong>Line:</strong> ${issue.line}</p>` : ''}
                <p><strong>Suggestion:</strong> ${issue.suggestion}</p>
            </div>
        `).join('');
        
        content.innerHTML = reviewHTML;
    }
    
    displayLearning() {
        const content = document.querySelector('.learning-content');
        const { learning } = this.results;
        
        const learningHTML = learning.map(point => `
            <div class="review-item">
                <h4>📚 ${point.concept}</h4>
                <p>${point.explanation}</p>
                <div class="code-snippet">${point.example}</div>
                <p><strong>💡 Tip:</strong> ${point.tip}</p>
            </div>
        `).join('');
        
        content.innerHTML = learningHTML || '<p>No specific learning points identified for this code.</p>';
    }
    
    displayDocumentation() {
        const content = document.querySelector('.documentation-content');
        const { documentation } = this.results;
        
        content.innerHTML = `
            <div class="review-item">
                <h4>📖 Generated Documentation</h4>
                <pre>${documentation.overview}</pre>
                
                <h4>🔧 Functions</h4>
                ${documentation.functions.map(func => `
                    <div class="code-snippet">
                        <strong>${func.name}()</strong><br>
                        ${func.description}
                    </div>
                `).join('')}
                
                <h4>💻 Usage</h4>
                <pre>${documentation.usage}</pre>
            </div>
        `;
    }
    
    switchTab(tabName) {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.analyzeBtn.disabled = true;
            this.analyzeBtn.querySelector('.btn-text').textContent = 'Analyzing...';
            this.analyzeBtn.querySelector('.spinner').classList.remove('hidden');
        } else {
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.querySelector('.btn-text').textContent = 'Analyze Code';
            this.analyzeBtn.querySelector('.spinner').classList.add('hidden');
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CodeReviewSystem();
});