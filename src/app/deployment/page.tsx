"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ArrowLeft, Upload, CheckCircle, Copy, ExternalLink, Video, FileText } from "lucide-react"
import Link from "next/link"

export default function DeploymentPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [deploymentData, setDeploymentData] = useState({
    packageId: "",
    treasuryObjectId: "",
    proposalObjectId: "",
    policyObjectId: "",
    emergencyObjectId: "",
    transactionHash: "",
    network: "testnet"
  })

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      // Simulate upload
      setTimeout(() => {
        setVideoUrl("https://example.com/video/" + file.name)
      }, 1000)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Deployment Guide</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deployment & Documentation</h1>
          <p className="text-muted-foreground">Deploy your treasury and submit project documentation</p>
        </div>

        <Tabs defaultValue="guide" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guide">Deployment Guide</TabsTrigger>
            <TabsTrigger value="submit">Submit Deployment</TabsTrigger>
            <TabsTrigger value="video">Video Walkthrough</TabsTrigger>
          </TabsList>

          {/* Deployment Guide */}
          <TabsContent value="guide">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Sui CLI Installed</h4>
                      <p className="text-sm text-muted-foreground">Install Sui CLI: <code className="bg-muted px-2 py-1 rounded">cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui</code></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Sui Wallet with Testnet SUI</h4>
                      <p className="text-sm text-muted-foreground">Get testnet tokens from the <a href="https://discord.gg/sui" className="text-primary hover:underline">Sui Discord</a></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Smart Contract Code Ready</h4>
                      <p className="text-sm text-muted-foreground">Ensure all treasury, proposal, policy, and emergency modules are implemented</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Build the Package</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div># Navigate to your project directory</div>
                    <div>cd multisig-treasury</div>
                    <div className="mt-2"># Build the package</div>
                    <div>sui move build</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This compiles your Move modules and checks for errors. Ensure all tests pass before deployment.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Run Tests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div># Run unit tests</div>
                    <div>sui move test</div>
                    <div className="mt-2"># Run specific test</div>
                    <div>sui move test test_create_treasury</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verify all tests pass with &gt; 80% coverage. Pay special attention to policy enforcement and multi-sig validation tests.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Deploy to Testnet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div># Deploy package</div>
                    <div>sui client publish --gas-budget 100000000</div>
                    <div className="mt-2"># Note the Package ID from output</div>
                    <div className="text-green-400">Package ID: 0x1234...5678</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Save the Package ID - you'll need it for interacting with the treasury.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 4: Initialize Treasury</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div># Create a new treasury</div>
                    <div>sui client call \</div>
                    <div>  --package 0xPACKAGE_ID \</div>
                    <div>  --module treasury \</div>
                    <div>  --function create_treasury \</div>
                    <div>  --args &quot;[0xSIGNER1, 0xSIGNER2, 0xSIGNER3]&quot; 2 \</div>
                    <div>  --gas-budget 10000000</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This creates a new treasury with the specified signers and threshold. Save the Treasury Object ID.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 5: Configure Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div># Set spending limits</div>
                    <div>sui client call \</div>
                    <div>  --package 0xPACKAGE_ID \</div>
                    <div>  --module policy_manager \</div>
                    <div>  --function set_spending_limit \</div>
                    <div>  --args 0xTREASURY_ID 10000 &quot;daily&quot; \</div>
                    <div>  --gas-budget 10000000</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure spending limits, whitelist, categories, and other policies as needed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 6: Test Proposal Flow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div># Create a test proposal</div>
                    <div>sui client call \</div>
                    <div>  --package 0xPACKAGE_ID \</div>
                    <div>  --module proposal \</div>
                    <div>  --function create_proposal \</div>
                    <div>  --args 0xTREASURY_ID 1000 0xRECIPIENT &quot;Test proposal&quot; \</div>
                    <div>  --gas-budget 10000000</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Test the complete flow: create proposal → collect signatures → wait for time-lock → execute.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary">
                <CardHeader>
                  <CardTitle>Verification Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className="text-sm">All smart contracts deployed successfully</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className="text-sm">Treasury initialized with correct signers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className="text-sm">Policies configured and validated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className="text-sm">Test proposal executed successfully</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className="text-sm">Emergency procedures tested</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className="text-sm">All test cases passing (&gt; 80% coverage)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Submit Deployment */}
          <TabsContent value="submit">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Information</CardTitle>
                  <CardDescription>
                    Enter your deployed contract details for verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="network">Network</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={deploymentData.network === "testnet" ? "default" : "outline"}
                        onClick={() => setDeploymentData({ ...deploymentData, network: "testnet" })}
                      >
                        Testnet
                      </Button>
                      <Button
                        variant={deploymentData.network === "mainnet" ? "default" : "outline"}
                        onClick={() => setDeploymentData({ ...deploymentData, network: "mainnet" })}
                      >
                        Mainnet
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageId">Package ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="packageId"
                        placeholder="0x..."
                        value={deploymentData.packageId}
                        onChange={(e) => setDeploymentData({ ...deploymentData, packageId: e.target.value })}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(deploymentData.packageId)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="treasuryObjectId">Treasury Object ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="treasuryObjectId"
                        placeholder="0x..."
                        value={deploymentData.treasuryObjectId}
                        onChange={(e) => setDeploymentData({ ...deploymentData, treasuryObjectId: e.target.value })}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(deploymentData.treasuryObjectId)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proposalObjectId">Proposal Object ID</Label>
                    <Input
                      id="proposalObjectId"
                      placeholder="0x..."
                      value={deploymentData.proposalObjectId}
                      onChange={(e) => setDeploymentData({ ...deploymentData, proposalObjectId: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyObjectId">Policy Manager Object ID</Label>
                    <Input
                      id="policyObjectId"
                      placeholder="0x..."
                      value={deploymentData.policyObjectId}
                      onChange={(e) => setDeploymentData({ ...deploymentData, policyObjectId: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyObjectId">Emergency Module Object ID</Label>
                    <Input
                      id="emergencyObjectId"
                      placeholder="0x..."
                      value={deploymentData.emergencyObjectId}
                      onChange={(e) => setDeploymentData({ ...deploymentData, emergencyObjectId: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionHash">Deployment Transaction Hash</Label>
                    <div className="flex gap-2">
                      <Input
                        id="transactionHash"
                        placeholder="Transaction hash from deployment"
                        value={deploymentData.transactionHash}
                        onChange={(e) => setDeploymentData({ ...deploymentData, transactionHash: e.target.value })}
                      />
                      {deploymentData.transactionHash && (
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={`https://suiexplorer.com/txblock/${deploymentData.transactionHash}?network=${deploymentData.network}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <Button className="w-full">
                    Verify Deployment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>
                    Paste your test output showing coverage and results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste test results here..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="text-sm">Estimated Test Coverage</span>
                    <Badge variant="secondary" className="text-lg">85%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GitHub Repository (Optional)</CardTitle>
                  <CardDescription>
                    Link to your public repository for code review
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="https://github.com/username/multisig-treasury" />
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Verify Repository
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Video Walkthrough */}
          <TabsContent value="video">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Demonstration
                  </CardTitle>
                  <CardDescription>
                    Record and upload a video walkthrough of your multi-sig treasury system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted p-6 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h4 className="font-semibold mb-2">Upload Video Walkthrough</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        MP4, MOV, or WebM (max 100MB)
                      </p>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="max-w-xs mx-auto"
                      />
                      {videoFile && (
                        <div className="mt-4 p-3 bg-background rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{videoFile.name}</span>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Or provide a video URL</Label>
                    <Input
                      placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>

                  <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        What to Include in Your Video
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Treasury creation with multiple signers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Policy configuration (spending limits, time-locks, categories)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Creating and signing a proposal</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Time-lock visualization and execution</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Policy enforcement demonstration (rejecting invalid proposals)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Emergency withdrawal procedure (optional)</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Button className="w-full" disabled={!videoFile && !videoUrl}>
                    Submit Video
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Architecture Diagram (Optional)</Label>
                    <Input type="file" accept="image/*" />
                  </div>
                  <div className="space-y-2">
                    <Label>README / Documentation Link</Label>
                    <Input placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      placeholder="Any additional information about your implementation, design decisions, or unique features..."
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
