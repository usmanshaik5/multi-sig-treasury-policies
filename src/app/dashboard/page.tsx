"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Shield, Plus, Wallet, Users, TrendingUp, ArrowLeft, Check, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const mockTreasuries = [
  {
    id: "1",
    name: "Main DAO Treasury",
    balance: "125,450.00 SUI",
    signers: 5,
    threshold: 3,
    proposals: 12,
    status: "active"
  },
  {
    id: "2",
    name: "Marketing Fund",
    balance: "35,200.00 SUI",
    signers: 3,
    threshold: 2,
    proposals: 8,
    status: "active"
  }
]

const spendingData = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 19000 },
  { month: "Mar", amount: 15000 },
  { month: "Apr", amount: 25000 },
  { month: "May", amount: 22000 },
  { month: "Jun", amount: 28000 }
]

const categoryData = [
  { name: "Operations", value: 35, color: "#3b82f6" },
  { name: "Marketing", value: 25, color: "#10b981" },
  { name: "Development", value: 30, color: "#f59e0b" },
  { name: "Other", value: 10, color: "#6b7280" }
]

export default function DashboardPage() {
  const [selectedTreasury, setSelectedTreasury] = useState(mockTreasuries[0])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAddSignerDialogOpen, setIsAddSignerDialogOpen] = useState(false)
  
  const [newTreasury, setNewTreasury] = useState({
    name: "",
    signers: [""],
    threshold: 2
  })

  const handleAddSigner = () => {
    setNewTreasury({
      ...newTreasury,
      signers: [...newTreasury.signers, ""]
    })
  }

  const handleSignerChange = (index: number, value: string) => {
    const updatedSigners = [...newTreasury.signers]
    updatedSigners[index] = value
    setNewTreasury({ ...newTreasury, signers: updatedSigners })
  }

  const handleRemoveSigner = (index: number) => {
    const updatedSigners = newTreasury.signers.filter((_, i) => i !== index)
    setNewTreasury({ ...newTreasury, signers: updatedSigners })
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
                <span className="text-xl font-bold">Treasury Dashboard</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/proposals">
                <Button variant="ghost">Proposals</Button>
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
            <h1 className="text-3xl font-bold mb-2">Treasury Management</h1>
            <p className="text-muted-foreground">Monitor and manage your DAO treasuries</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Treasury
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Treasury</DialogTitle>
                <DialogDescription>
                  Set up a new multi-signature treasury with custom configuration
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="treasury-name">Treasury Name</Label>
                  <Input
                    id="treasury-name"
                    placeholder="e.g., Main DAO Treasury"
                    value={newTreasury.name}
                    onChange={(e) => setNewTreasury({ ...newTreasury, name: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Signers</Label>
                    <Button size="sm" variant="outline" onClick={handleAddSigner}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Signer
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newTreasury.signers.map((signer, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Signer ${index + 1} Address (0x...)`}
                          value={signer}
                          onChange={(e) => handleSignerChange(index, e.target.value)}
                        />
                        {newTreasury.signers.length > 1 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveSigner(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold">Approval Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="1"
                    max={newTreasury.signers.length}
                    value={newTreasury.threshold}
                    onChange={(e) => setNewTreasury({ ...newTreasury, threshold: parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of signatures required to approve proposals ({newTreasury.threshold} of {newTreasury.signers.length})
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Default Policies
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The following policies will be enabled by default:
                  </p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      24-hour minimum time-lock
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      Daily spending limit: 10,000 SUI
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      Category-based tracking
                    </li>
                  </ul>
                </div>

                <Button className="w-full" onClick={() => setIsCreateDialogOpen(false)}>
                  Create Treasury
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Treasury Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">160,650.00 SUI</div>
              <p className="text-xs text-muted-foreground mt-1">Across all treasuries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20</div>
              <p className="text-xs text-muted-foreground mt-1">Pending signatures</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Signers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Across all treasuries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Monthly Spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28,000 SUI</div>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Treasuries */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Treasuries</CardTitle>
                <CardDescription>Select a treasury to view details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockTreasuries.map((treasury) => (
                  <button
                    key={treasury.id}
                    onClick={() => setSelectedTreasury(treasury)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedTreasury.id === treasury.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{treasury.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {treasury.status}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">{treasury.balance}</div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {treasury.threshold}/{treasury.signers}
                      </span>
                      <span>{treasury.proposals} proposals</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Treasury Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedTreasury.name}</CardTitle>
                <CardDescription>Treasury configuration and management</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="signers">Signers</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Balance</Label>
                        <div className="text-2xl font-bold">{selectedTreasury.balance}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Approval Threshold</Label>
                        <div className="text-2xl font-bold">
                          {selectedTreasury.threshold} of {selectedTreasury.signers}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-4">Quick Actions</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <Link href="/proposals">
                          <Button variant="outline" className="w-full gap-2">
                            <Plus className="h-4 w-4" />
                            Create Proposal
                          </Button>
                        </Link>
                        <Dialog open={isAddSignerDialogOpen} onOpenChange={setIsAddSignerDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full gap-2">
                              <Users className="h-4 w-4" />
                              Add Signer
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Signer</DialogTitle>
                              <DialogDescription>
                                Add a new signer to {selectedTreasury.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Signer Address</Label>
                                <Input placeholder="0x..." />
                              </div>
                              <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                  Adding a new signer requires approval from existing signers and will trigger a proposal.
                                </p>
                              </div>
                              <Button className="w-full">Submit Proposal</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" className="w-full gap-2">
                          <Wallet className="h-4 w-4" />
                          Deposit Funds
                        </Button>
                        <Link href="/policies">
                          <Button variant="outline" className="w-full gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Configure Policies
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signers" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {[...Array(selectedTreasury.signers)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold">Signer {i + 1}</div>
                              <div className="text-sm text-muted-foreground">0x{Math.random().toString(36).substring(2, 15)}...</div>
                            </div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-semibold mb-4">Spending Trends</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={spendingData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4">Spending by Category</h4>
                      <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {categoryData.map((cat) => (
                          <div key={cat.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-sm">{cat.name} ({cat.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Treasury Name</Label>
                        <Input value={selectedTreasury.name} />
                      </div>
                      <div className="space-y-2">
                        <Label>Approval Threshold</Label>
                        <Input type="number" value={selectedTreasury.threshold} />
                        <p className="text-sm text-muted-foreground">
                          Changing threshold requires multi-sig approval
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Emergency Threshold</Label>
                        <Input type="number" value={selectedTreasury.signers - 1} />
                        <p className="text-sm text-muted-foreground">
                          Higher threshold for emergency operations
                        </p>
                      </div>
                      <Button variant="destructive" className="w-full">
                        Freeze Treasury (Emergency)
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
