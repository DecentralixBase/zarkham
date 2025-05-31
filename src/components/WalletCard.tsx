'use client'

import React from 'react'
import { api } from '@/services/api'
import { WalletData, TokenData, ProtocolData } from '@/types/wallet'

export default function WalletCard() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await api.getWalletData('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503')
        setWallet(data)
      } catch (error) {
        console.error('Error fetching wallet:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  if (loading) {
    return <div className="animate-pulse bg-background-lighter rounded-xl h-64 p-6" />
  }

  if (!wallet) {
    return <div className="bg-background-lighter rounded-xl p-6">Failed to load wallet data</div>
  }

  return (
    <div className="bg-background-lighter rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">
            {`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
          </h3>
          <p className="text-2xl font-bold text-primary">
            ${wallet.netWorth.toLocaleString()}
          </p>
        </div>
        <button
          className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
        >
          Track
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-400">Balance</p>
          <p className="text-2xl font-bold">{wallet.balance.toFixed(2)} ETH</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Net Worth</p>
          <p className="text-2xl font-bold">${wallet.netWorth.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Top Tokens</h4>
        <div className="space-y-2">
          {wallet.tokens.slice(0, 5).map((token: TokenData) => (
            <div key={token.symbol} className="flex justify-between items-center">
              <span className="text-sm">{token.symbol}</span>
              <span className="text-sm text-gray-200">
                ${token.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-3">Active Protocols</h4>
        <div className="flex flex-wrap gap-2">
          {wallet.protocols.map((protocol: ProtocolData) => (
            <span
              key={protocol.name}
              className="px-3 py-1 bg-primary/10 rounded-full text-xs text-primary"
            >
              {protocol.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
} 