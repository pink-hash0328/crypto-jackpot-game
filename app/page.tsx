"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Coins,
  Trophy,
  TrendingUp,
  Zap,
  History,
  Volume2,
  VolumeX,
  Star,
  Wallet,
  Users,
  Flame,
  Shield,
  Clock,
  TrendingDown,
  X,
} from "lucide-react"

const SYMBOLS = ["₿", "⟠", "◆", "★", "♦", "●", "◈", "✦"]
const SYMBOL_VALUES = [100, 50, 30, 20, 15, 10, 8, 5]
const SYMBOL_COLORS = [
  "text-yellow-400",
  "text-blue-400",
  "text-purple-400",
  "text-pink-400",
  "text-green-400",
  "text-red-400",
  "text-cyan-400",
  "text-orange-400",
]

interface GameHistory {
  id: number
  reels: number[]
  bet: number
  win: number
  timestamp: Date
}

interface LivePlay {
  id: number
  player: string
  amount: number
  multiplier: number
  timestamp: Date
  isWin: boolean
}

interface LeaderboardEntry {
  rank: number
  player: string
  totalWins: number
  biggestWin: number
  streak: number
}

const MOCK_WALLETS = ["0x1234...5678", "0xabcd...efgh", "0x9876...5432", "0xfedc...ba98"]

const WALLET_TYPES = [
  { name: "MetaMask", icon: "🦊", description: "Connect to your MetaMask wallet" },
  { name: "Phantom", icon: "👻", description: "Connect to your Phantom wallet" },
  { name: "Coinbase Wallet", icon: "🔵", description: "Connect to Coinbase Wallet" },
  { name: "WalletConnect", icon: "🔗", description: "Scan with WalletConnect" },
]

export default function CryptoJackpot() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const [showWalletModal, setShowWalletModal] = useState(false)

  const [balance, setBalance] = useState(10000)
  const [bet, setBet] = useState(100)
  const [reels, setReels] = useState([0, 1, 2])
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWin, setLastWin] = useState(0)
  const [totalWins, setTotalWins] = useState(0)
  const [jackpot, setJackpot] = useState(500000)
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [spinCount, setSpinCount] = useState(0)
  const [winStreak, setWinStreak] = useState(0)
  const [showWinAnimation, setShowWinAnimation] = useState(false)
  const [autoSpin, setAutoSpin] = useState(false)
  const autoSpinRef = useRef<NodeJS.Timeout | null>(null)

  const [livePlays, setLivePlays] = useState<LivePlay[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, player: "0xCryp...to01", totalWins: 125000, biggestWin: 50000, streak: 12 },
    { rank: 2, player: "0xWhale...2024", totalWins: 98000, biggestWin: 45000, streak: 8 },
    { rank: 3, player: "0xLucky...7777", totalWins: 87500, biggestWin: 40000, streak: 15 },
    { rank: 4, player: "0xGamer...9999", totalWins: 76000, biggestWin: 35000, streak: 6 },
    { rank: 5, player: "0xPro...Play", totalWins: 65000, biggestWin: 30000, streak: 10 },
  ])
  const [fairnessHash, setFairnessHash] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPlayer = MOCK_WALLETS[Math.floor(Math.random() * MOCK_WALLETS.length)]
      const randomBet = [50, 100, 200, 500][Math.floor(Math.random() * 4)]
      const isWin = Math.random() > 0.6
      const multiplier = isWin ? Math.floor(Math.random() * 50) + 2 : 0

      const newPlay: LivePlay = {
        id: Date.now() + Math.random(),
        player: randomPlayer,
        amount: randomBet,
        multiplier,
        timestamp: new Date(),
        isWin,
      }

      setLivePlays((prev) => [newPlay, ...prev.slice(0, 19)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot((prev) => prev + Math.floor(Math.random() * 50) + 10)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (autoSpin && !isSpinning && balance >= bet && walletConnected) {
      autoSpinRef.current = setTimeout(() => {
        spin()
      }, 1500)
    }
    return () => {
      if (autoSpinRef.current) clearTimeout(autoSpinRef.current)
    }
  }, [autoSpin, isSpinning, balance, bet, walletConnected])

  const openWalletModal = () => {
    setShowWalletModal(true)
  }

  const connectWallet = (walletType: string) => {
    // Simulate wallet connection delay
    setTimeout(() => {
      const mockAddress = MOCK_WALLETS[Math.floor(Math.random() * MOCK_WALLETS.length)]
      setWalletAddress(mockAddress)
      setWalletConnected(true)
      setShowWalletModal(false)
    }, 1000)
  }

  const disconnectWallet = () => {
    setWalletAddress("")
    setWalletConnected(false)
    setAutoSpin(false)
  }

  const spin = () => {
    if (isSpinning || balance < bet || !walletConnected) return

    setIsSpinning(true)
    setBalance((prev) => prev - bet)
    setLastWin(0)
    setShowWinAnimation(false)
    setSpinCount((prev) => prev + 1)

    setFairnessHash(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))

    const spinDurations = [2000, 2500, 3000]
    const finalReels: number[] = []

    spinDurations.forEach((duration, index) => {
      let reelSpinCount = 0
      const reelInterval = setInterval(() => {
        setReels((prev) => {
          const newReels = [...prev]
          newReels[index] = Math.floor(Math.random() * SYMBOLS.length)
          return newReels
        })
        reelSpinCount++
      }, 50)

      setTimeout(() => {
        clearInterval(reelInterval)
        const random = Math.random()
        let symbolIndex = 0
        if (random < 0.05) symbolIndex = 0
        else if (random < 0.15) symbolIndex = 1
        else if (random < 0.3) symbolIndex = 2
        else if (random < 0.5) symbolIndex = 3
        else if (random < 0.7) symbolIndex = 4
        else if (random < 0.85) symbolIndex = 5
        else if (random < 0.95) symbolIndex = 6
        else symbolIndex = 7

        finalReels[index] = symbolIndex
        setReels((prev) => {
          const newReels = [...prev]
          newReels[index] = symbolIndex
          return newReels
        })

        if (index === spinDurations.length - 1) {
          setTimeout(() => {
            checkWin(finalReels)
            setIsSpinning(false)
          }, 300)
        }
      }, duration)
    })
  }

  const checkWin = (finalReels: number[]) => {
    let winAmount = 0
    let isWin = false

    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      winAmount = bet * SYMBOL_VALUES[finalReels[0]]
      isWin = true

      if (finalReels[0] === 0) {
        winAmount = jackpot
        setJackpot(500000)
      }
    } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
      const matchedSymbol =
        finalReels[0] === finalReels[1]
          ? finalReels[0]
          : finalReels[1] === finalReels[2]
            ? finalReels[1]
            : finalReels[0]
      winAmount = bet * Math.ceil(SYMBOL_VALUES[matchedSymbol] / 5)
      isWin = true
    }

    if (isWin) {
      setBalance((prev) => prev + winAmount)
      setLastWin(winAmount)
      setTotalWins((prev) => prev + winAmount)
      setWinStreak((prev) => prev + 1)
      setShowWinAnimation(true)

      if (winAmount >= bet * 50) {
        triggerConfetti()
      }
    } else {
      setWinStreak(0)
    }

    setGameHistory((prev) => [
      {
        id: Date.now(),
        reels: finalReels,
        bet,
        win: winAmount,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ])
  }

  const triggerConfetti = () => {
    console.log("[v0] Big win! Confetti triggered")
  }

  const adjustBet = (amount: number) => {
    const newBet = bet + amount
    if (newBet >= 10 && newBet <= balance && newBet <= 1000) {
      setBet(newBet)
    }
  }

  const setBetAmount = (amount: number) => {
    if (amount >= 10 && amount <= balance && amount <= 1000) {
      setBet(amount)
    }
  }

  const toggleAutoSpin = () => {
    setAutoSpin((prev) => !prev)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Night sky background with stars and moon */}
      <div className="fixed inset-0 z-0">
        {/* Night sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950" />

        {/* Moon */}
        <div className="absolute top-20 right-[15%] w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-50 to-gray-100 shadow-[0_0_60px_rgba(251,191,36,0.6),0_0_100px_rgba(251,191,36,0.4)] opacity-90" />

        {/* Stars */}
        <div className="absolute inset-0 opacity-70">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Shooting stars */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full shooting-star"
              style={{
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="relative w-full max-w-md border-primary/30 bg-card p-6 shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={() => setShowWalletModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="mb-6 text-center">
              <div className="mb-3 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                  <Wallet className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Connect Wallet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Choose your wallet to connect and start playing</p>
            </div>

            <div className="space-y-3">
              {WALLET_TYPES.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => connectWallet(wallet.name)}
                  className="w-full rounded-xl border border-primary/30 bg-muted/50 p-4 text-left transition-all hover:scale-[1.02] hover:border-primary hover:bg-muted hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{wallet.icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{wallet.name}</p>
                      <p className="text-xs text-muted-foreground">{wallet.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-muted/50 p-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <Shield className="mb-1 inline h-3 w-3 text-primary" /> By connecting your wallet, you agree to our
                terms of service. Your wallet will be used for placing bets and receiving winnings.
              </p>
            </div>
          </Card>
        </div>
      )}

      <div className="relative z-10 p-3 md:p-6 lg:p-8">
        <div className="relative mx-auto max-w-[1800px]">
          <header className="mb-4 flex flex-col items-stretch gap-3 md:mb-6 md:flex-row md:items-center md:justify-between lg:gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-secondary shadow-lg shadow-primary/40 md:h-14 md:w-14">
                <Zap className="h-6 w-6 text-primary-foreground md:h-7 md:w-7" />
              </div>
              <div>
                <h1 className="text-balance text-2xl font-bold text-foreground md:text-3xl">Crypto Jackpot</h1>
                <p className="text-xs text-muted-foreground md:text-sm">Provably Fair Gaming</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:gap-3">
              {!walletConnected ? (
                <Button
                  onClick={openWalletModal}
                  size="lg"
                  className="col-span-2 h-11 gap-2 font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:via-emerald-200 hover:to-emerald-300 text-gray-900 shadow-lg hover:shadow-xl transition-all hover:scale-105 md:h-12"
                >
                  <Wallet className="h-4 w-4 md:h-5 md:w-5" />
                  Connect Wallet
                </Button>
              ) : (
                <Card className="col-span-2 flex items-center gap-2 border-primary/30 bg-card px-3 py-2 shadow-lg md:gap-3 md:px-4 md:py-2.5">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="flex-1 truncate font-mono text-xs font-bold text-foreground md:text-sm">
                    {walletAddress}
                  </span>
                  <Button variant="ghost" size="sm" onClick={disconnectWallet} className="h-7 text-xs">
                    Disconnect
                  </Button>
                </Card>
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-transparent"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <VolumeX className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </Button>

              <Card className="border-primary/30 bg-card px-3 py-2 shadow-lg md:px-4 md:py-2.5">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-secondary md:h-5 md:w-5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="text-base font-bold text-foreground md:text-lg">{balance.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="border-primary/30 bg-card px-3 py-2 shadow-lg md:px-4 md:py-2.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary md:h-5 md:w-5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Wins</p>
                    <p className="text-base font-bold text-primary md:text-lg">{totalWins.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>
          </header>

          <Card className="relative mb-4 overflow-hidden border-2 border-secondary/50 bg-gradient-to-r from-card via-secondary/20 to-card p-4 text-center shadow-xl md:mb-6 md:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(52,211,153,0.3),transparent_70%)]" />
            <div className="relative flex flex-col items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-xs font-bold shadow-md md:px-4 md:text-sm">
                <Trophy className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                PROGRESSIVE JACKPOT
              </Badge>
              <div className="text-4xl font-bold text-secondary sm:text-5xl md:text-6xl lg:text-7xl">
                {jackpot.toLocaleString()}
              </div>
              <p className="text-xs font-medium text-muted-foreground md:text-sm">
                Crypto Tokens • Match 3x ₿ to Win • Live Feed Below
              </p>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[320px_1fr_320px] xl:grid-cols-[360px_1fr_360px] xl:gap-6">
            {/* LEFT SIDEBAR - Live Feed & Leaderboard */}
            <div className="order-2 space-y-4 lg:order-1">
              <Card className="border-primary/30 bg-card p-4 shadow-lg md:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-primary md:h-5 md:w-5" />
                    <h3 className="text-base font-bold text-foreground md:text-lg">Live Feed</h3>
                  </div>
                  <Badge variant="outline" className="animate-pulse text-xs">
                    <div className="mr-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    Live
                  </Badge>
                </div>

                <div className="max-h-[280px] space-y-2 overflow-y-auto lg:max-h-[350px]">
                  {livePlays.slice(0, 10).map((play) => (
                    <div
                      key={play.id}
                      className={`flex items-center justify-between rounded-lg p-2 transition-all md:p-2.5 hover:scale-[1.02] hover:shadow-md ${
                        play.isWin ? "border border-primary/30 bg-primary/20" : "bg-muted/50"
                      }`}
                      style={{
                        animationDelay: `${Math.random() * 0.3}s`,
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs text-foreground">{play.player}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{play.amount} tokens</span>
                          {play.isWin && (
                            <>
                              <span>•</span>
                              <span className="font-bold text-primary">{play.multiplier}x</span>
                            </>
                          )}
                        </div>
                      </div>
                      {play.isWin ? (
                        <TrendingUp className="ml-2 h-4 w-4 flex-shrink-0 text-primary" />
                      ) : (
                        <TrendingDown className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-primary/30 bg-card p-4 shadow-lg md:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-secondary md:h-5 md:w-5" />
                  <h3 className="text-base font-bold text-foreground md:text-lg">Leaderboard</h3>
                </div>

                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-2 md:p-2.5 transition-all hover:bg-muted/70"
                      style={{
                        transform: `perspective(800px) translateZ(${entry.rank * 2}px)`,
                      }}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold md:h-7 md:w-7 ${
                            entry.rank === 1
                              ? "bg-yellow-500/20 text-yellow-500"
                              : entry.rank === 2
                                ? "bg-gray-400/20 text-gray-400"
                                : entry.rank === 3
                                  ? "bg-orange-600/20 text-orange-600"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-mono text-xs text-foreground">{entry.player}</p>
                          <p className="text-xs text-muted-foreground">{entry.totalWins.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-primary" />
                        <span className="text-xs font-bold text-primary">{entry.streak}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* CENTER - Main Game Board */}
            <div className="order-1 space-y-4 md:space-y-6 lg:order-2">
              <Card className="border-primary/30 bg-card p-4 shadow-xl md:p-6 lg:p-8">
                <div className="mb-4 md:mb-6">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-foreground md:text-2xl">Slot Reels</h2>
                    {winStreak > 1 && (
                      <Badge variant="default" className="animate-pulse self-start">
                        <Star className="mr-1 h-3 w-3" />
                        {winStreak}x Streak
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground md:text-sm">Connect wallet to start playing</p>
                </div>

                <div className="relative mb-6 md:mb-8">
                  <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
                    {reels.map((symbolIndex, reelIndex) => (
                      <div key={reelIndex} className="relative">
                        <div
                          className={`relative flex h-32 w-24 items-center justify-center overflow-hidden rounded-2xl border-3 border-primary/60 bg-gradient-to-b from-muted to-muted/70 shadow-xl sm:h-36 sm:w-28 md:h-40 md:w-32 md:rounded-3xl md:border-4 lg:h-48 lg:w-40 transition-all duration-500 ${
                            isSpinning ? "reel-spin" : "hover:scale-105"
                          }`}
                        >
                          {isSpinning && (
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
                          )}

                          <div
                            className={`text-5xl font-bold transition-all duration-500 sm:text-6xl md:text-7xl lg:text-8xl ${
                              SYMBOL_COLORS[symbolIndex]
                            } ${isSpinning ? "scale-75 blur-sm" : "scale-100"}`}
                          >
                            {SYMBOLS[symbolIndex]}
                          </div>

                          <div className="absolute bottom-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-muted/80 text-xs font-bold text-foreground md:bottom-2 md:left-2 md:h-6 md:w-6">
                            {reelIndex + 1}
                          </div>
                        </div>

                        {!isSpinning && lastWin > 0 && (
                          <div className="absolute -inset-2 -z-10 rounded-2xl bg-primary/20 blur-lg md:rounded-3xl" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/70 to-transparent md:h-1 shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
                </div>

                {showWinAnimation && lastWin > 0 && (
                  <div className="mb-4 md:mb-6 win-pop">
                    <Card className="relative overflow-hidden border-2 border-primary bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 p-4 text-center shadow-xl md:p-6">
                      <p className="relative mb-2 text-xs font-bold uppercase tracking-wider text-primary md:text-sm">
                        {lastWin >= bet * 50
                          ? "🎉 MEGA WIN! 🎉"
                          : lastWin >= bet * 20
                            ? "🌟 Big Win! 🌟"
                            : "✨ Winner! ✨"}
                      </p>
                      <p className="relative text-3xl font-bold text-primary md:text-5xl">
                        +{lastWin.toLocaleString()}
                      </p>
                      <p className="relative mt-1 text-xs text-muted-foreground">
                        {Math.floor(lastWin / bet)}x multiplier
                      </p>
                    </Card>
                  </div>
                )}

                {fairnessHash && (
                  <div className="mb-4 rounded-lg bg-muted/50 p-2.5 md:mb-6 md:p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 text-primary md:h-4 md:w-4" />
                      <span className="font-bold text-foreground">Provably Fair:</span>
                      <span className="truncate font-mono">{fairnessHash.substring(0, 16)}...</span>
                    </div>
                  </div>
                )}

                <div className="grid gap-2 sm:grid-cols-2 md:gap-3">
                  <Button
                    onClick={spin}
                    disabled={isSpinning || balance < bet || autoSpin || !walletConnected}
                    size="lg"
                    className="h-14 text-lg font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:via-emerald-200 hover:to-emerald-300 text-gray-900 shadow-lg hover:shadow-xl transition-all hover:scale-105 md:h-16 md:text-xl disabled:opacity-50"
                    style={{
                      transform: "perspective(1000px) translateZ(15px)",
                    }}
                  >
                    {!walletConnected ? (
                      "Connect Wallet"
                    ) : isSpinning ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent md:h-5 md:w-5" />
                        Spinning...
                      </span>
                    ) : (
                      `SPIN (${bet.toLocaleString()})`
                    )}
                  </Button>

                  <Button
                    onClick={toggleAutoSpin}
                    disabled={isSpinning || balance < bet || !walletConnected}
                    size="lg"
                    variant={autoSpin ? "destructive" : "outline"}
                    className="h-14 text-lg font-bold transition-all hover:scale-105 md:h-16 md:text-xl"
                    style={{
                      transform: "perspective(1000px) translateZ(15px)",
                    }}
                  >
                    {autoSpin ? "STOP AUTO" : "AUTO SPIN"}
                  </Button>
                </div>
              </Card>

              <Card className="border-primary/30 bg-card p-4 shadow-lg md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <History className="h-4 w-4 text-primary md:h-5 md:w-5" />
                  <h3 className="text-base font-bold text-foreground md:text-lg">Your Recent Games</h3>
                </div>

                {gameHistory.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground md:py-8">No games played yet</p>
                ) : (
                  <div className="max-h-[300px] space-y-2 overflow-y-auto">
                    {gameHistory.map((game, index) => (
                      <div
                        key={game.id}
                        className="flex items-center justify-between rounded-lg bg-muted/70 p-2.5 transition-all hover:bg-muted/90 md:p-3"
                        style={{
                          transform: `perspective(800px) translateZ(${index * 2}px)`,
                        }}
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <Clock className="h-3 w-3 flex-shrink-0 text-muted-foreground md:h-4 md:w-4" />
                          <div className="flex gap-0.5 md:gap-1">
                            {game.reels.map((symbolIdx, idx) => (
                              <span key={idx} className={`text-lg md:text-xl ${SYMBOL_COLORS[symbolIdx]}`}>
                                {SYMBOLS[symbolIdx]}
                              </span>
                            ))}
                          </div>
                          <span className="hidden text-xs text-muted-foreground sm:inline">Bet: {game.bet}</span>
                        </div>
                        <div className="text-right">
                          {game.win > 0 ? (
                            <div>
                              <span className="text-sm font-bold text-primary md:text-base">
                                +{game.win.toLocaleString()}
                              </span>
                              <p className="text-xs text-muted-foreground">{Math.floor(game.win / game.bet)}x</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* RIGHT SIDEBAR - Bet Controls & Stats */}
            <div className="order-3 space-y-4">
              <Card className="border-primary/30 bg-card p-4 shadow-lg md:p-5">
                <h3 className="mb-4 text-lg font-bold text-foreground md:mb-5 md:text-xl">Bet Amount</h3>

                <div className="mb-5 text-center md:mb-6">
                  <p className="text-3xl font-bold text-primary md:text-4xl">{bet.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Tokens per spin</p>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-9 bg-transparent text-xs font-bold md:h-10"
                    onClick={() => setBetAmount(10)}
                    disabled={balance < 10 || !walletConnected}
                  >
                    10
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 bg-transparent text-xs font-bold md:h-10"
                    onClick={() => setBetAmount(50)}
                    disabled={balance < 50 || !walletConnected}
                  >
                    50
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 bg-transparent text-xs font-bold md:h-10"
                    onClick={() => setBetAmount(100)}
                    disabled={balance < 100 || !walletConnected}
                  >
                    100
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 bg-transparent text-xs font-bold md:h-10"
                    onClick={() => setBetAmount(500)}
                    disabled={balance < 500 || !walletConnected}
                  >
                    500
                  </Button>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => adjustBet(-50)}
                    disabled={bet <= 10 || !walletConnected}
                    className="h-9 font-bold md:h-10"
                  >
                    -50
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => adjustBet(50)}
                    disabled={bet + 50 > balance || bet >= 1000 || !walletConnected}
                    className="h-9 font-bold md:h-10"
                  >
                    +50
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount(10)}
                    disabled={balance < 10 || !walletConnected}
                    className="h-9 md:h-10"
                  >
                    Min
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount(Math.min(1000, balance))}
                    disabled={balance < 100 || !walletConnected}
                    className="h-9 md:h-10"
                  >
                    Max
                  </Button>
                </div>
              </Card>

              <Card className="border-primary/30 bg-card p-4 shadow-lg md:p-5">
                <h3 className="mb-4 text-base font-bold text-foreground md:text-lg">Paytable</h3>
                <div className="space-y-2">
                  {SYMBOLS.slice(0, 5).map((symbol, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-muted/70 p-2 md:p-2.5 hover:bg-muted/90 transition-all"
                      style={{
                        transform: `perspective(800px) translateZ(${idx * 3}px)`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5 md:gap-1">
                          <span className={`text-lg md:text-xl ${SYMBOL_COLORS[idx]}`}>{symbol}</span>
                          <span className={`text-lg md:text-xl ${SYMBOL_COLORS[idx]}`}>{symbol}</span>
                          <span className={`text-lg md:text-xl ${SYMBOL_COLORS[idx]}`}>{symbol}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-secondary md:text-base">{SYMBOL_VALUES[idx]}x</span>
                    </div>
                  ))}

                  <div className="mt-3 rounded-lg bg-primary/20 p-2 md:p-2.5">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      <strong className="text-primary">3 matching:</strong> Full multiplier
                      <br />
                      <strong className="text-primary">2 matching:</strong> 20% multiplier
                      <br />
                      <strong className="text-secondary">3x ₿:</strong> Jackpot!
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-primary/30 bg-card p-4 shadow-lg md:p-5">
                <h3 className="mb-4 text-base font-bold text-foreground md:text-lg">Your Stats</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="text-xl font-bold text-foreground md:text-2xl">
                      {spinCount > 0
                        ? ((gameHistory.filter((g) => g.win > 0).length / spinCount) * 100).toFixed(1)
                        : "0.0"}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Games Played</p>
                    <p className="text-xl font-bold text-foreground md:text-2xl">{spinCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Biggest Win</p>
                    <p className="text-xl font-bold text-primary md:text-2xl">
                      {gameHistory.length > 0 ? Math.max(...gameHistory.map((g) => g.win)).toLocaleString() : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Win Streak</p>
                    <p className="text-xl font-bold text-secondary md:text-2xl">{winStreak}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            <Card className="border-primary/30 bg-card p-4 shadow-xl">
              <h3 className="mb-4 text-lg font-bold text-foreground">Bet Amount</h3>

              <div className="mb-5 text-center">
                <p className="text-3xl font-bold text-primary">{bet.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">Tokens per spin</p>
              </div>

              <div className="mb-3 grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  className="h-10 bg-transparent text-xs font-bold"
                  onClick={() => setBetAmount(10)}
                  disabled={balance < 10 || !walletConnected}
                >
                  10
                </Button>
                <Button
                  variant="outline"
                  className="h-10 bg-transparent text-xs font-bold"
                  onClick={() => setBetAmount(50)}
                  disabled={balance < 50 || !walletConnected}
                >
                  50
                </Button>
                <Button
                  variant="outline"
                  className="h-10 bg-transparent text-xs font-bold"
                  onClick={() => setBetAmount(100)}
                  disabled={balance < 100 || !walletConnected}
                >
                  100
                </Button>
                <Button
                  variant="outline"
                  className="h-10 bg-transparent text-xs font-bold"
                  onClick={() => setBetAmount(500)}
                  disabled={balance < 500 || !walletConnected}
                >
                  500
                </Button>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => adjustBet(-50)}
                  disabled={bet <= 10 || !walletConnected}
                  className="h-10 font-bold"
                >
                  -50
                </Button>
                <Button
                  variant="outline"
                  onClick={() => adjustBet(50)}
                  disabled={bet + 50 > balance || bet >= 1000 || !walletConnected}
                  className="h-10 font-bold"
                >
                  +50
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBetAmount(10)}
                  disabled={balance < 10 || !walletConnected}
                  className="h-10"
                >
                  Min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBetAmount(Math.min(1000, balance))}
                  disabled={balance < 100 || !walletConnected}
                  className="h-10"
                >
                  Max
                </Button>
              </div>
            </Card>

            <Card className="border-primary/30 bg-card p-4 shadow-xl">
              <h3 className="mb-4 text-lg font-bold text-foreground">Your Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="text-xl font-bold text-foreground">
                    {spinCount > 0
                      ? ((gameHistory.filter((g) => g.win > 0).length / spinCount) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Games Played</p>
                  <p className="text-xl font-bold text-foreground">{spinCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Biggest Win</p>
                  <p className="text-xl font-bold text-primary">
                    {gameHistory.length > 0 ? Math.max(...gameHistory.map((g) => g.win)).toLocaleString() : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Win Streak</p>
                  <p className="text-xl font-bold text-secondary">{winStreak}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
