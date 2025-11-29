"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">MultiSig Treasury</span>
            </div>
            <div className="flex gap-4 items-center">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/proposals">
                <Button variant="ghost">Proposals</Button>
              </Link>
              <Link href="/policies">
                <Button variant="ghost">Policies</Button>
              </Link>
              <Link href="/deployment">
                <Button variant="ghost">Deploy</Button>
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Image
            src="/alkimi.png" 
            alt="Sui Blockchain"
            className="mx-auto mb-6 rounded-xl shadow-lg"
            width={150}
            height={150}
          />

          <Badge className="mb-4" variant="secondary">
            Built on Sui Blockchain
          </Badge>

          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Secure Multi-Signature Treasury for DAOs
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Advanced treasury management with programmable spending policies,
            time-locked proposals, and emergency procedures. Built for security,
            flexibility, and efficiency.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                <Shield className="h-5 w-5" />
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/deployment">
              <Button size="lg" variant="outline">
                View Deployment Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multi-Signature Control</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Flexible threshold configurations with multiple signers. Support
                for different approval requirements per category.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Time-Locked Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Configurable time-lock periods with automatic execution. Higher
                locks for larger amounts ensure security.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Spending Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Daily, weekly, monthly limits per category. Global limits,
                per-transaction caps, and automatic tracking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <AlertTriangle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Emergency Procedures</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Higher threshold emergency withdrawals with treasury freeze
                capability and audit trails.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          System Architecture
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Smart Contract Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">Treasury Contract</h4>
                <p className="text-sm text-muted-foreground">
                  Main treasury holding funds and executing approved
                  transactions. Supports multiple coin types and maintains
                  spending history.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold mb-2">Proposal Contract</h4>
                <p className="text-sm text-muted-foreground">
                  Manages spending proposals with multi-sig approval,
                  time-locks, and batch transaction support.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold mb-2">Policy Manager</h4>
                <p className="text-sm text-muted-foreground">
                  Enforces spending policies, validates transactions, and tracks
                  spending across time periods.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold mb-2">Emergency Module</h4>
                <p className="text-sm text-muted-foreground">
                  Handles emergency withdrawals with higher security
                  requirements and cooldown periods.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Policy Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">
                    Spending Limit Policy
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Daily/Weekly/Monthly limits per category
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Whitelist Policy</h4>
                  <p className="text-xs text-muted-foreground">
                    Approved recipients with expiration support
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Category Policy</h4>
                  <p className="text-xs text-muted-foreground">
                    Predefined spending categories with specific thresholds
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Time-Lock Policy</h4>
                  <p className="text-xs text-muted-foreground">
                    Dynamic time-locks based on amount
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">
                    Amount Threshold Policy
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Escalating thresholds for larger amounts
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Approval Policy</h4>
                  <p className="text-xs text-muted-foreground">
                    Required signers and veto power
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Workflows Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Workflows</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Creation & Execution</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>
                    Proposer creates proposal with transaction details
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>System validates against all active policies</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Proposal enters time-lock period</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>Signers review and sign proposal</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    5
                  </span>
                  <span>Execute when threshold + time-lock satisfied</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    6
                  </span>
                  <span>Spending trackers updated automatically</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Withdrawal</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Emergency signer detects critical situation</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Creates emergency proposal with justification</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>
                    Emergency signers provide signatures (higher threshold)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>System validates emergency conditions</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                    5
                  </span>
                  <span>Immediate or shorter time-lock execution</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                    6
                  </span>
                  <span>Emergency audit log created</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">∞</div>
                <div className="text-sm opacity-90">Multiple Treasuries</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-90">
                  Policy Violation Detection
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">&lt;0.05</div>
                <div className="text-sm opacity-90">SUI per Execution</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">80%+</div>
                <div className="text-sm opacity-90">Test Coverage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="border-2 border-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">
              Ready to Secure Your DAO Treasury?
            </CardTitle>
            <CardDescription className="text-lg">
              Deploy your multi-signature treasury on Sui blockchain in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Get Started
                </Button>
              </Link>
              <Link href="/deployment">
                <Button size="lg" variant="outline">
                  Deployment Guide
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>
            Built with security and flexibility in mind. Powered by Sui
            Blockchain.
          </p>
        </div>
      </footer>
    </div>
  );
}
