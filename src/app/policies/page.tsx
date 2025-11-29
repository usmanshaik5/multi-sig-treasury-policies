"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ArrowLeft, Plus, TrendingUp, Lock, Clock, DollarSign, Users, X } from "lucide-react"
import Link from "next/link"

export default function PoliciesPage() {
  const [spendingLimits, setSpendingLimits] = useState({
    daily: "10000",
    weekly: "50000",
    monthly: "150000",
    perTransaction: "25000"
  })

  const [whitelist, setWhitelist] = useState([
    { address: "0x1234...5678", label: "Development Team", expiry: "2024-12-31" },
    { address: "0x8765...4321", label: "Marketing Agency", expiry: "2024-06-30" }
  ])

  const [categoryLimits, setCategoryLimits] = useState([
    { name: "Operations", daily: "5000", monthly: "50000", threshold: 2 },
    { name: "Marketing", daily: "3000", monthly: "30000", threshold: 2 },
    { name: "Development", daily: "7000", monthly: "70000", threshold: 3 }
  ])

  const [timeLockConfig, setTimeLockConfig] = useState({
    baseHours: "24",
    amountFactor: "1000",
    maxHours: "168"
  })

  const [thresholdRanges, setThresholdRanges] = useState([
    { min: "0", max: "1000", required: 2, total: 5 },
    { min: "1000", max: "10000", required: 3, total: 5 },
    { min: "10000", max: "999999999", required: 4, total: 5 }
  ])

  const [newWhitelistAddress, setNewWhitelistAddress] = useState("")
  const [newWhitelistLabel, setNewWhitelistLabel] = useState("")
  const [newWhitelistExpiry, setNewWhitelistExpiry] = useState("")

  const handleAddWhitelist = () => {
    if (newWhitelistAddress && newWhitelistLabel) {
      setWhitelist([...whitelist, {
        address: newWhitelistAddress,
        label: newWhitelistLabel,
        expiry: newWhitelistExpiry || "No expiry"
      }])
      setNewWhitelistAddress("")
      setNewWhitelistLabel("")
      setNewWhitelistExpiry("")
    }
  }

  const handleRemoveWhitelist = (index: number) => {
    setWhitelist(whitelist.filter((_, i) => i !== index))
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
                <span className="text-xl font-bold">Policy Management</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/proposals">
                <Button variant="ghost">Proposals</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Policy Configuration</h1>
          <p className="text-muted-foreground">Configure spending policies and approval rules</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Daily Limit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10,000 SUI</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Whitelisted Addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{whitelist.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Min Time-lock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24h</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="spending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="spending">Spending Limits</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="timelock">Time-Lock</TabsTrigger>
            <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          </TabsList>

          {/* Spending Limits Tab */}
          <TabsContent value="spending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Spending Limit Policy
                </CardTitle>
                <CardDescription>
                  Set maximum spending limits across different time periods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Spending Limits</Label>
                    <p className="text-sm text-muted-foreground">Enforce maximum spending per period</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="daily-limit">Daily Limit (SUI)</Label>
                    <Input
                      id="daily-limit"
                      type="number"
                      value={spendingLimits.daily}
                      onChange={(e) => setSpendingLimits({ ...spendingLimits, daily: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Maximum spending per 24-hour period</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weekly-limit">Weekly Limit (SUI)</Label>
                    <Input
                      id="weekly-limit"
                      type="number"
                      value={spendingLimits.weekly}
                      onChange={(e) => setSpendingLimits({ ...spendingLimits, weekly: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Maximum spending per 7-day period</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly-limit">Monthly Limit (SUI)</Label>
                    <Input
                      id="monthly-limit"
                      type="number"
                      value={spendingLimits.monthly}
                      onChange={(e) => setSpendingLimits({ ...spendingLimits, monthly: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Maximum spending per 30-day period</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tx-limit">Per-Transaction Cap (SUI)</Label>
                    <Input
                      id="tx-limit"
                      type="number"
                      value={spendingLimits.perTransaction}
                      onChange={(e) => setSpendingLimits({ ...spendingLimits, perTransaction: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Maximum amount per single transaction</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Current Usage</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Daily (2,450 / 10,000 SUI)</span>
                        <span>24.5%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "24.5%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly (18,900 / 50,000 SUI)</span>
                        <span>37.8%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "37.8%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Monthly (65,200 / 150,000 SUI)</span>
                        <span>43.5%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "43.5%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Spending Limits</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Whitelist Policy
                </CardTitle>
                <CardDescription>
                  Manage approved recipient addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Whitelist</Label>
                    <p className="text-sm text-muted-foreground">Only allow transfers to whitelisted addresses</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-4">
                  <Label>Add New Address</Label>
                  <div className="grid md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Address (0x...)"
                      value={newWhitelistAddress}
                      onChange={(e) => setNewWhitelistAddress(e.target.value)}
                    />
                    <Input
                      placeholder="Label"
                      value={newWhitelistLabel}
                      onChange={(e) => setNewWhitelistLabel(e.target.value)}
                    />
                    <Input
                      type="date"
                      placeholder="Expiry (optional)"
                      value={newWhitelistExpiry}
                      onChange={(e) => setNewWhitelistExpiry(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddWhitelist} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add to Whitelist
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Whitelisted Addresses</Label>
                  {whitelist.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-sm text-muted-foreground font-mono">{item.address}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Expires: {item.expiry}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveWhitelist(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Category Policy
                </CardTitle>
                <CardDescription>
                  Configure spending categories and their limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Category Assignment</Label>
                    <p className="text-sm text-muted-foreground">All proposals must be assigned to a category</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-4">
                  {categoryLimits.map((category, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Daily Limit (SUI)</Label>
                            <Input
                              type="number"
                              value={category.daily}
                              onChange={(e) => {
                                const updated = [...categoryLimits]
                                updated[index].daily = e.target.value
                                setCategoryLimits(updated)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Monthly Limit (SUI)</Label>
                            <Input
                              type="number"
                              value={category.monthly}
                              onChange={(e) => {
                                const updated = [...categoryLimits]
                                updated[index].monthly = e.target.value
                                setCategoryLimits(updated)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Required Signatures</Label>
                            <Input
                              type="number"
                              value={category.threshold}
                              onChange={(e) => {
                                const updated = [...categoryLimits]
                                updated[index].threshold = parseInt(e.target.value)
                                setCategoryLimits(updated)
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="w-full">Save Category Limits</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time-Lock Tab */}
          <TabsContent value="timelock">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time-Lock Policy
                </CardTitle>
                <CardDescription>
                  Configure time-lock duration based on proposal amount
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Dynamic Time-Lock</Label>
                    <p className="text-sm text-muted-foreground">Higher amounts require longer time-locks</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="base-hours">Base Time-Lock (hours)</Label>
                    <Input
                      id="base-hours"
                      type="number"
                      value={timeLockConfig.baseHours}
                      onChange={(e) => setTimeLockConfig({ ...timeLockConfig, baseHours: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Minimum time-lock for all proposals</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount-factor">Amount Factor (SUI)</Label>
                    <Input
                      id="amount-factor"
                      type="number"
                      value={timeLockConfig.amountFactor}
                      onChange={(e) => setTimeLockConfig({ ...timeLockConfig, amountFactor: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Add 1 hour for every X SUI</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-hours">Maximum Time-Lock (hours)</Label>
                    <Input
                      id="max-hours"
                      type="number"
                      value={timeLockConfig.maxHours}
                      onChange={(e) => setTimeLockConfig({ ...timeLockConfig, maxHours: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Cap on maximum time-lock duration</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Formula</h4>
                  <code className="text-sm">
                    time_lock = min(base + (amount / factor), max)
                  </code>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1,000 SUI:</span>
                      <span className="font-semibold">25 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>5,000 SUI:</span>
                      <span className="font-semibold">29 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>50,000 SUI:</span>
                      <span className="font-semibold">74 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>200,000 SUI:</span>
                      <span className="font-semibold">168 hours (max)</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Time-Lock Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Thresholds Tab */}
          <TabsContent value="thresholds">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Amount Threshold Policy
                </CardTitle>
                <CardDescription>
                  Configure signature requirements based on amount ranges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Amount-Based Thresholds</Label>
                    <p className="text-sm text-muted-foreground">Require more signatures for larger amounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-4">
                  {thresholdRanges.map((range, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Range {index + 1}: {range.min} - {range.max === "999999999" ? "∞" : range.max} SUI
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Min Amount (SUI)</Label>
                            <Input
                              type="number"
                              value={range.min}
                              onChange={(e) => {
                                const updated = [...thresholdRanges]
                                updated[index].min = e.target.value
                                setThresholdRanges(updated)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Max Amount (SUI)</Label>
                            <Input
                              type="number"
                              value={range.max}
                              onChange={(e) => {
                                const updated = [...thresholdRanges]
                                updated[index].max = e.target.value
                                setThresholdRanges(updated)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Required Signatures</Label>
                            <Input
                              type="number"
                              value={range.required}
                              onChange={(e) => {
                                const updated = [...thresholdRanges]
                                updated[index].required = parseInt(e.target.value)
                                setThresholdRanges(updated)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Total Signers</Label>
                            <Input
                              type="number"
                              value={range.total}
                              onChange={(e) => {
                                const updated = [...thresholdRanges]
                                updated[index].total = parseInt(e.target.value)
                                setThresholdRanges(updated)
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                          Requires <strong>{range.required} of {range.total}</strong> signatures ({Math.round(range.required / range.total * 100)}%)
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="w-full">Save Threshold Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
