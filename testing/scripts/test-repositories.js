#!/usr/bin/env node
/**
 * Repository Analysis Testing Script
 * Validates all 5 key SPARC repositories for accessibility and evolution tracking
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class RepositoryTester {
    constructor() {
        this.repositories = [
            {
                name: 'Original SPARC',
                url: 'https://github.com/ruvnet/sparc',
                type: 'github',
                required: ['README.md', 'package.json', 'src/']
            },
            {
                name: 'SPARC2 Package',
                url: 'https://www.npmjs.com/package/@agentics.org/sparc2',
                type: 'npm',
                required: ['package.json', 'version', 'description']
            },
            {
                name: 'Create-SPARC',
                url: 'https://www.npmjs.com/package/create-sparc',
                type: 'npm',
                required: ['package.json', 'bin', 'version']
            },
            {
                name: 'Claude-Flow NPM',
                url: 'https://www.npmjs.com/package/claude-flow',
                type: 'npm',
                required: ['package.json', 'dependencies', 'version']
            },
            {
                name: 'Claude-Flow Repo',
                url: 'https://github.com/ruvnet/claude-flow',
                type: 'github',
                required: ['README.md', 'package.json', 'src/']
            }
        ];
        
        this.results = {
            total: this.repositories.length,
            passed: 0,
            failed: 0,
            details: []
        };
    }

    async testRepository(repo) {
        console.log(`\n🔍 Testing repository: ${repo.name}`);
        console.log(`   URL: ${repo.url}`);
        
        const result = {
            name: repo.name,
            url: repo.url,
            accessible: false,
            hasRequiredContent: false,
            evolutionData: null,
            errors: []
        };

        try {
            // Test accessibility
            const response = await axios.get(repo.url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'SPARC-Evolution-Tester/1.0'
                }
            });
            
            if (response.status === 200) {
                result.accessible = true;
                console.log(`   ✅ Repository accessible (${response.status})`);
            }

            // Test for required content based on type
            if (repo.type === 'github') {
                await this.testGitHubRepository(repo, result);
            } else if (repo.type === 'npm') {
                await this.testNpmPackage(repo, result);
            }

            // Evolution tracking
            result.evolutionData = await this.extractEvolutionData(repo, response.data);
            
        } catch (error) {
            result.errors.push(`Accessibility test failed: ${error.message}`);
            console.log(`   ❌ Repository inaccessible: ${error.message}`);
        }

        this.results.details.push(result);
        
        if (result.accessible && result.hasRequiredContent) {
            this.results.passed++;
            console.log(`   ✅ ${repo.name} validation PASSED`);
        } else {
            this.results.failed++;
            console.log(`   ❌ ${repo.name} validation FAILED`);
        }

        return result;
    }

    async testGitHubRepository(repo, result) {
        try {
            // Test for README.md
            const readmeUrl = repo.url.replace('github.com', 'raw.githubusercontent.com') + '/main/README.md';
            const readmeResponse = await axios.get(readmeUrl, { timeout: 5000 });
            
            if (readmeResponse.status === 200) {
                console.log(`   ✅ README.md found`);
                result.hasRequiredContent = true;
            }
        } catch (error) {
            result.errors.push(`README.md not found: ${error.message}`);
            console.log(`   ⚠️  README.md not accessible`);
        }

        try {
            // Test for package.json
            const packageUrl = repo.url.replace('github.com', 'raw.githubusercontent.com') + '/main/package.json';
            const packageResponse = await axios.get(packageUrl, { timeout: 5000 });
            
            if (packageResponse.status === 200) {
                console.log(`   ✅ package.json found`);
                const packageData = JSON.parse(packageResponse.data);
                result.packageInfo = {
                    name: packageData.name,
                    version: packageData.version,
                    description: packageData.description
                };
            }
        } catch (error) {
            result.errors.push(`package.json not found: ${error.message}`);
            console.log(`   ⚠️  package.json not accessible`);
        }
    }

    async testNpmPackage(repo, result) {
        try {
            // Extract package name from URL
            const packageName = repo.url.split('/package/')[1];
            const apiUrl = `https://registry.npmjs.org/${packageName}`;
            
            const response = await axios.get(apiUrl, { timeout: 5000 });
            
            if (response.status === 200 && response.data) {
                console.log(`   ✅ NPM package data accessible`);
                result.hasRequiredContent = true;
                result.packageInfo = {
                    name: response.data.name,
                    version: response.data['dist-tags'].latest,
                    description: response.data.description,
                    versions: Object.keys(response.data.versions || {}),
                    lastPublished: response.data.time?.modified
                };
                console.log(`   📦 Latest version: ${result.packageInfo.version}`);
                console.log(`   📝 Description: ${result.packageInfo.description}`);
            }
        } catch (error) {
            result.errors.push(`NPM package data not accessible: ${error.message}`);
            console.log(`   ❌ NPM package data not accessible`);
        }
    }

    async extractEvolutionData(repo, htmlContent) {
        const evolutionData = {
            lastUpdate: null,
            contributorCount: 0,
            releaseCount: 0,
            issueCount: 0,
            hasDocumentation: false
        };

        try {
            if (repo.type === 'github' && htmlContent) {
                // Extract basic evolution metrics from GitHub page
                const lastUpdateMatch = htmlContent.match(/datetime="([^"]+)"/);
                if (lastUpdateMatch) {
                    evolutionData.lastUpdate = lastUpdateMatch[1];
                }

                // Count contributors (rough estimation)
                const contributorMatches = htmlContent.match(/contributors/g);
                evolutionData.contributorCount = contributorMatches ? contributorMatches.length : 0;

                // Check for documentation
                evolutionData.hasDocumentation = htmlContent.includes('README') || 
                                                htmlContent.includes('documentation') ||
                                                htmlContent.includes('docs');
            }
        } catch (error) {
            console.log(`   ⚠️  Could not extract evolution data: ${error.message}`);
        }

        return evolutionData;
    }

    async runAllTests() {
        console.log('🚀 Starting Repository Analysis Testing');
        console.log('=====================================');
        
        const startTime = Date.now();

        for (const repo of this.repositories) {
            await this.testRepository(repo);
        }

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        this.generateReport(duration);
        await this.saveResults();
    }

    generateReport(duration) {
        console.log('\n📊 REPOSITORY TESTING SUMMARY');
        console.log('==============================');
        console.log(`Total repositories tested: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`🕐 Duration: ${duration.toFixed(2)} seconds`);
        console.log(`📈 Success rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

        if (this.results.failed > 0) {
            console.log('\n⚠️  FAILED REPOSITORIES:');
            this.results.details
                .filter(r => !r.accessible || !r.hasRequiredContent)
                .forEach(r => {
                    console.log(`   - ${r.name}: ${r.errors.join(', ')}`);
                });
        }

        // Quality gate
        const successRate = (this.results.passed / this.results.total) * 100;
        if (successRate >= 100) {
            console.log('\n🎉 ALL REPOSITORY TESTS PASSED! Evolution analysis ready.');
        } else if (successRate >= 80) {
            console.log('\n⚠️  MOST REPOSITORY TESTS PASSED. Some repositories may need attention.');
        } else {
            console.log('\n❌ REPOSITORY TESTING FAILED. Critical repositories inaccessible.');
            process.exit(1);
        }
    }

    async saveResults() {
        const resultsDir = path.join(__dirname, '..', 'results');
        await fs.mkdir(resultsDir, { recursive: true });
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const resultsFile = path.join(resultsDir, `repository-test-${timestamp}.json`);
        
        await fs.writeFile(resultsFile, JSON.stringify(this.results, null, 2));
        console.log(`\n💾 Results saved to: ${resultsFile}`);
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new RepositoryTester();
    tester.runAllTests().catch(error => {
        console.error('❌ Repository testing failed:', error);
        process.exit(1);
    });
}

module.exports = RepositoryTester;