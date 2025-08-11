#!/usr/bin/env tsx
/**
 * Data integrity checking script for broker data
 * 
 * This script validates all broker data and generates comprehensive reports
 * about data quality, consistency, and integrity issues.
 * 
 * Usage:
 *   npm run validate-data
 *   or
 *   npx tsx scripts/validateBrokerData.ts
 * 
 * @fileoverview Standalone data integrity validation script
 * @version 1.0.0
 * @since 2025-01-10
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { 
  validateDataIntegrity, 
  validateBrokerArray, 
  validateBroker,
  type DataIntegrityReport,
  type ValidationResult
} from '../src/utils/brokerValidation.js';
import { brokers } from '../src/data/brokers/brokerData.js';
import { brokerRatings } from '../src/data/brokers/brokerRatings.js';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Print colored console output
 */
function printColored(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section header
 */
function printHeader(title: string): void {
  console.log('\n' + '='.repeat(60));
  printColored(title, 'bright');
  console.log('='.repeat(60));
}

/**
 * Print validation result
 */
function printValidationResult(result: ValidationResult, context: string): void {
  if (result.isValid) {
    printColored(`✓ ${context}: VALID`, 'green');
  } else {
    printColored(`✗ ${context}: INVALID`, 'red');
    result.errors.forEach(error => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      printColored(`  Error: ${errorMessage}`, 'red');
      if (error instanceof Error && error.stack) {
        printColored(`  Stack: ${error.stack}`, 'yellow');
      }
    });
  }
  
  if (result.warnings.length > 0) {
    result.warnings.forEach(warning => {
      printColored(`  Warning: ${warning}`, 'yellow');
    });
  }
}

/**
 * Print data integrity report
 */
function printIntegrityReport(report: DataIntegrityReport): void {
  printHeader('DATA INTEGRITY REPORT');
  
  // Overall statistics
  console.log('\nOverall Statistics:');
  console.log(`  Total Brokers: ${report.totalBrokers}`);
  printColored(`  Valid Brokers: ${report.validBrokers}`, 'green');
  
  if (report.invalidBrokers > 0) {
    printColored(`  Invalid Brokers: ${report.invalidBrokers}`, 'red');
  }
  
  if (report.missingRatings > 0) {
    printColored(`  Missing Ratings: ${report.missingRatings}`, 'yellow');
  }
  
  // Health status
  console.log('\nOverall Health:');
  const healthColor = {
    excellent: 'green',
    good: 'green',
    fair: 'yellow',
    poor: 'red'
  }[report.overallHealth] as keyof typeof colors;
  
  printColored(`  Status: ${report.overallHealth.toUpperCase()}`, healthColor);
  
  // Issues
  if (report.duplicateIds.length > 0) {
    console.log('\nDuplicate IDs:');
    report.duplicateIds.forEach(id => {
      printColored(`  - ${id}`, 'red');
    });
  }
  
  if (report.orphanedRatings.length > 0) {
    console.log('\nOrphaned Ratings:');
    report.orphanedRatings.forEach(id => {
      printColored(`  - ${id}`, 'yellow');
    });
  }
  
  if (report.inconsistentData.length > 0) {
    console.log('\nData Inconsistencies:');
    report.inconsistentData.forEach(issue => {
      const color = issue.severity === 'error' ? 'red' : 'yellow';
      printColored(`  ${issue.brokerId}: ${issue.issue}`, color);
    });
  }
}

/**
 * Generate detailed validation report
 */
function generateDetailedReport(): string {
  const timestamp = new Date().toISOString();
  const report = validateDataIntegrity(brokers, brokerRatings);
  const brokerValidation = validateBrokerArray(brokers);
  
  let output = `# Broker Data Validation Report\n`;
  output += `Generated: ${timestamp}\n\n`;
  
  // Executive Summary
  output += `## Executive Summary\n\n`;
  output += `- **Total Brokers**: ${report.totalBrokers}\n`;
  output += `- **Valid Brokers**: ${report.validBrokers}\n`;
  output += `- **Invalid Brokers**: ${report.invalidBrokers}\n`;
  output += `- **Missing Ratings**: ${report.missingRatings}\n`;
  output += `- **Overall Health**: ${report.overallHealth}\n\n`;
  
  // Validation Results
  output += `## Validation Results\n\n`;
  output += `### Broker Array Validation\n`;
  output += `- **Status**: ${brokerValidation.isValid ? 'VALID' : 'INVALID'}\n`;
  output += `- **Errors**: ${brokerValidation.errors.length}\n`;
  output += `- **Warnings**: ${brokerValidation.warnings.length}\n\n`;
  
  if (brokerValidation.errors.length > 0) {
    output += `#### Errors:\n`;
    brokerValidation.errors.forEach(error => {
      output += `- ${error}\n`;
    });
    output += `\n`;
  }
  
  if (brokerValidation.warnings.length > 0) {
    output += `#### Warnings:\n`;
    brokerValidation.warnings.forEach(warning => {
      output += `- ${warning}\n`;
    });
    output += `\n`;
  }
  
  // Data Issues
  if (report.duplicateIds.length > 0) {
    output += `### Duplicate IDs\n\n`;
    report.duplicateIds.forEach(id => {
      output += `- ${id}\n`;
    });
    output += `\n`;
  }
  
  if (report.orphanedRatings.length > 0) {
    output += `### Orphaned Ratings\n\n`;
    report.orphanedRatings.forEach(id => {
      output += `- ${id}\n`;
    });
    output += `\n`;
  }
  
  if (report.inconsistentData.length > 0) {
    output += `### Data Inconsistencies\n\n`;
    report.inconsistentData.forEach(issue => {
      output += `- **${issue.brokerId}** (${issue.severity}): ${issue.issue}\n`;
    });
    output += `\n`;
  }
  
  // Individual Broker Validation
  output += `## Individual Broker Validation\n\n`;
  brokers.forEach(broker => {
    const validation = validateBroker(broker);
    
    output += `### ${broker.name} (${broker.id})\n`;
    output += `- **Validation**: ${validation.isValid ? 'VALID' : 'INVALID'}\n`;
    
    if (validation.errors.length > 0) {
      output += `- **Errors**: ${validation.errors.join(', ')}\n`;
    }
    
    if (validation.warnings.length > 0) {
      output += `- **Warnings**: ${validation.warnings.join(', ')}\n`;
    }
    
    output += `\n`;
  });
  
  // Recommendations
  output += `## Recommendations\n\n`;
  
  if (report.overallHealth === 'poor') {
    output += `- **URGENT**: Address critical data integrity issues immediately\n`;
  }
  
  if (report.invalidBrokers > 0) {
    output += `- Fix validation errors for ${report.invalidBrokers} invalid brokers\n`;
  }
  
  if (report.missingRatings > 0) {
    output += `- Add rating data for ${report.missingRatings} brokers\n`;
  }
  
  if (report.duplicateIds.length > 0) {
    output += `- Resolve duplicate broker IDs\n`;
  }
  
  if (report.orphanedRatings.length > 0) {
    output += `- Remove or link orphaned rating data\n`;
  }
  
  if (report.inconsistentData.length > 0) {
    output += `- Review and fix data inconsistencies\n`;
  }
  
  return output;
}

/**
 * Save report to file
 */
function saveReport(content: string, filename: string): void {
  const reportsDir = join(process.cwd(), 'reports');
  
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }
  
  const filepath = join(reportsDir, filename);
  writeFileSync(filepath, content, 'utf8');
  
  printColored(`\n📄 Report saved to: ${filepath}`, 'cyan');
}

/**
 * Main validation function
 */
async function main(): Promise<void> {
  try {
    printHeader('BROKER DATA VALIDATION');
    
    // Basic validation
    console.log('\nRunning basic validation...');
    console.log(`Number of brokers to validate: ${brokers.length}`);
    console.log('First broker sample:', brokers[0]);
    const brokerValidation = validateBrokerArray(brokers);
    console.log('Broker validation result:', brokerValidation);
    printValidationResult(brokerValidation, 'Broker Array');
    
    // Data integrity check
    console.log('\nRunning data integrity check...');
    const integrityReport = validateDataIntegrity(brokers, brokerRatings);
    printIntegrityReport(integrityReport);
    
    // Individual broker checks
    printHeader('INDIVIDUAL BROKER VALIDATION');
    
    const invalidBrokers: any[] = [];
    const validBrokers: any[] = [];
    
    brokers.forEach(broker => {
      console.log(`\nValidating broker: ${broker.name}`);
      const validation = validateBroker(broker);
      console.log(`Validation result:`, validation);
      
      if (validation.isValid) {
        validBrokers.push(broker);
        console.log(`✓ ${broker.name} is valid`);
      } else {
        invalidBrokers.push({ broker, validation });
        console.log(`✗ ${broker.name} failed validation:`);
        console.log(`  Errors: ${validation.errors.join('; ')}`);
        if (validation.warnings.length > 0) {
          console.log(`  Warnings: ${validation.warnings.join('; ')}`);
        }
      }
    });
    
    if (invalidBrokers.length === 0) {
      printColored('\n✓ All brokers passed individual validation!', 'green');
    } else {
      printColored(`\n✗ ${invalidBrokers.length} brokers failed validation`, 'red');
    }
    
    // Generate and save detailed report
    console.log('\nGenerating detailed report...');
    const detailedReport = generateDetailedReport();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveReport(detailedReport, `broker-validation-${timestamp}.md`);
    
    // Summary
    printHeader('VALIDATION SUMMARY');
    
    const totalIssues = brokerValidation.errors.length + integrityReport.invalidBrokers + 
                       integrityReport.duplicateIds.length;
    const totalWarnings = brokerValidation.warnings.length + integrityReport.missingRatings + 
                         integrityReport.orphanedRatings.length;
    
    if (totalIssues === 0 && totalWarnings === 0) {
      printColored('\n🎉 All validation checks passed! Data integrity is excellent.', 'green');
    } else if (totalIssues === 0) {
      printColored(`\n⚠️  Validation passed with ${totalWarnings} warnings.`, 'yellow');
    } else {
      printColored(`\n❌ Validation failed with ${totalIssues} errors and ${totalWarnings} warnings.`, 'red');
      process.exit(1);
    }
    
  } catch (error) {
    printColored(`\n💥 Validation script failed: ${error}`, 'red');
    process.exit(1);
  }
}

// Run the validation
main().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
});

export { main as validateBrokerData };