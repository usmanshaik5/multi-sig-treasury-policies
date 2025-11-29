"use client"

/**
 * Wallet Connection Button
 * 
 * Displays wallet connection status and allows users to connect/disconnect
 */

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { shortenAddress } from '@/lib/sui-client';

export function WalletButton() {
  const currentAccount = useCurrentAccount();

  if (!currentAccount) {
    return (
      <ConnectButton 
        connectText="Connect Wallet"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          {shortenAddress(currentAccount.address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-mono text-xs">
          {currentAccount.address}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ConnectButton 
          connectText="Disconnect"
          className="w-full"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
