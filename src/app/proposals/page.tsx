"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Shield, ArrowLeft, Plus, Clock, CheckCircle, XCircle, AlertTriangle, Users } from "lucide-react"
import Link from "next/link"

const mockProposals = [
  {
    id: "1",
    title: "Marketing Campaign Budget",
    description: "Allocate funds for Q2 marketing initiatives",
    amount: "5,000 SUI",
    category: "Marketing",
    recipient: "0x1234...5678",
    signatures: 2,
    required: 3,
    status: "pending",
    timelock: 18,
    createdBy: "0xabcd...ef01",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Developer Grant",
    description: "Grant for protocol development work",
    amount: "15,000 SUI",
    category: "Development",
    recipient: "0x8765...4321",
    signatures: 3,
    required: 3,
    status: "ready",
    timelock: 0,
    createdBy: "0xabcd...ef01",
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    title: "Operations Expenses",
    description: "Monthly operational costs",
    amount: "3,500 SUI",
    category: "Operations",
    recipient: "0x9999...8888",
    signatures: 3,
    required: 3,
    status: "executed",
    timelock: 0,
    createdBy: "0xdef0...1234",
    createdAt: "2024-01-05"
  }
]

export default function ProposalsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<typeof mockProposals[0] | null>(null)
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    amount: "",
    category: "",
    recipient: "",
    treasury: ""
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "ready":
        return "bg-green-500"
      case "executed":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "ready":
        return <CheckCircle className="h-4 w-4" />
      case "executed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
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
                <span className="text-xl font-bold">Proposal Management</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/policies">
                <Button variant="ghost">Policies</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Proposals</h1>
            <p className="text-muted-foreground">Create and manage spending proposals</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Proposal</DialogTitle>
                <DialogDescription>
                  Submit a new spending proposal for multi-sig approval
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="treasury">Select Treasury</Label>
                  <Select value={newProposal.treasury} onValueChange={(value) => setNewProposal({ ...newProposal, treasury: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select treasury" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main DAO Treasury</SelectItem>
                      <SelectItem value="marketing">Marketing Fund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Proposal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Marketing Campaign Budget"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed justification for this proposal..."
                    rows={4}
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (SUI)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newProposal.amount}
                      onChange={(e) => setNewProposal({ ...newProposal, amount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newProposal.category} onValueChange={(value) => setNewProposal({ ...newProposal, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={newProposal.recipient}
                    onChange={(e) => setNewProposal({ ...newProposal, recipient: e.target.value })}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Policy Validation
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Within daily spending limit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Category budget available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Time-lock: 24 hours (based on amount)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Required signatures: 3 of 5</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setIsCreateDialogOpen(false)}>
                  Submit Proposal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ready to Execute</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Executed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">13</div>
            </CardContent>
          </Card>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {mockProposals.map((proposal) => (
            <Card key={proposal.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setSelectedProposal(proposal)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{proposal.title}</CardTitle>
                      <Badge className={`${getStatusColor(proposal.status)} text-white`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(proposal.status)}
                          {proposal.status}
                        </span>
                      </Badge>
                      <Badge variant="outline">{proposal.category}</Badge>
                    </div>
                    <CardDescription>{proposal.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{proposal.amount}</div>
                    <div className="text-sm text-muted-foreground">{proposal.createdAt}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Recipient</Label>
                      <div className="font-mono">{proposal.recipient}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Created By</Label>
                      <div className="font-mono">{proposal.createdBy}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Time-lock</Label>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {proposal.timelock > 0 ? `${proposal.timelock}h remaining` : "Complete"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Label>Signatures</Label>
                      <span className="font-semibold">{proposal.signatures} / {proposal.required}</span>
                    </div>
                    <Progress value={(proposal.signatures / proposal.required) * 100} />
                  </div>

                  {proposal.status === "pending" && (
                    <div className="flex gap-2">
                      <Button className="flex-1">Sign Proposal</Button>
                      <Button variant="outline">View Details</Button>
                    </div>
                  )}
                  {proposal.status === "ready" && (
                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Execute Proposal
                      </Button>
                      <Button variant="outline">View Details</Button>
                    </div>
                  )}
                  {proposal.status === "executed" && (
                    <Button variant="outline" className="w-full">View Transaction</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Proposal Details Dialog */}
        <Dialog open={!!selectedProposal} onOpenChange={(open) => !open && setSelectedProposal(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedProposal?.title}</DialogTitle>
              <DialogDescription>Proposal ID: {selectedProposal?.id}</DialogDescription>
            </DialogHeader>
            {selectedProposal && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <div className="text-2xl font-bold">{selectedProposal.amount}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div>
                      <Badge className={`${getStatusColor(selectedProposal.status)} text-white mt-1`}>
                        {selectedProposal.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedProposal.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <div className="mt-1">{selectedProposal.category}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Recipient</Label>
                    <div className="mt-1 font-mono text-sm">{selectedProposal.recipient}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground mb-2 block">Signature Progress</Label>
                  <Progress value={(selectedProposal.signatures / selectedProposal.required) * 100} className="mb-2" />
                  <div className="text-sm text-muted-foreground">
                    {selectedProposal.signatures} of {selectedProposal.required} signatures collected
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Signers</Label>
                  <div className="space-y-2">
                    {[...Array(selectedProposal.required)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${i < selectedProposal.signatures ? 'bg-green-500' : 'bg-muted'}`}>
                            {i < selectedProposal.signatures ? (
                              <CheckCircle className="h-4 w-4 text-white" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div className="font-mono text-sm">0x{Math.random().toString(36).substring(2, 15)}...</div>
                        </div>
                        {i < selectedProposal.signatures ? (
                          <Badge variant="secondary">Signed</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedProposal.timelock > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <Clock className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Time-lock Active</div>
                        <div className="text-sm">{selectedProposal.timelock} hours remaining until execution is possible</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedProposal.status === "pending" && (
                    <>
                      <Button className="flex-1">Sign Proposal</Button>
                      <Button variant="destructive">Cancel Proposal</Button>
                    </>
                  )}
                  {selectedProposal.status === "ready" && (
                    <Button className="flex-1 gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Execute Proposal
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
