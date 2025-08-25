#!/usr/bin/env node

/**
 * Production Setup Script
 * Run this script to prepare the application for production deployment
 */

import { execSync } from "child_process"
import { existsSync, writeFileSync } from "fs"
import path from "path"

const REQUIRED_ENV_VARS = ["NEXT_PUBLIC_SITE_URL"]

function checkEnvironmentVariables() {
  console.log("🔍 Checking environment variables...")

  const missing = REQUIRED_ENV_VARS.filter((envVar) => !process.env[envVar])

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:")
    missing.forEach((envVar) => console.error(`   - ${envVar}`))
    console.error("\nPlease set these variables before deploying to production.")
    return false
  }

  console.log("✅ All required environment variables are set")
  return true
}

function runBuildChecks() {
  console.log("🏗️  Running build checks...")

  try {
    // Type checking
    console.log("   - Type checking...")
    execSync("npm run type-check", { stdio: "pipe" })

    // Linting
    console.log("   - Linting...")
    execSync("npm run lint", { stdio: "pipe" })

    // Build
    console.log("   - Building application...")
    execSync("npm run build", { stdio: "pipe" })

    console.log("✅ All build checks passed")
    return true
  } catch (error) {
    console.error("❌ Build checks failed:", error)
    return false
  }
}

function generateProductionFiles() {
  console.log("📝 Generating production files...")

  // Generate robots.txt if it doesn't exist
  const robotsPath = path.join(process.cwd(), "public", "robots.txt")
  if (!existsSync(robotsPath)) {
    const robotsContent = `User-agent: *
Allow: /

# Important pages
Allow: /about
Allow: /services
Allow: /repertoire
Allow: /gallery
Allow: /contact

# Block access to admin areas and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Sitemap location
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`

    writeFileSync(robotsPath, robotsContent)
    console.log("   - Generated robots.txt")
  }

  console.log("✅ Production files generated")
}

function main() {
  console.log("🚀 Preparing Allan Palmer Violinist website for production...\n")

  const envCheck = checkEnvironmentVariables()
  const buildCheck = runBuildChecks()

  if (envCheck && buildCheck) {
    generateProductionFiles()
    console.log("\n🎉 Production setup complete!")
    console.log("\n📋 Next steps:")
    console.log("   1. Deploy to your hosting platform")
    console.log("   2. Set up domain and SSL")
    console.log("   3. Configure monitoring")
    console.log("   4. Test all functionality")
  } else {
    console.log("\n❌ Production setup failed. Please fix the issues above.")
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
