"use client"

import { Shield, Zap, Globe, Lock, TrendingUp, Network } from "lucide-react"
import Image from "next/image"

export default function CrossChainProcess() {
  const steps = [
    {
      id: 1,
      title: "Deposit Collateral",
      description: "Deposit your assets as collateral on any supported blockchain",
      icon: Lock,
      color: "bg-blue-500",
      chain: "/chain/avax-logo.png"
    },
    {
      id: 2,
      title: "CCIP Cross-Chain Message",
      description: "Chainlink CCIP securely transmits your collateral data across chains",
      icon: Network,
      color: "bg-purple-500",
      chain: "/chainlink.png"
    },
    {
      id: 3,
      title: "Borrow on Any Chain",
      description: "Borrow assets on a different blockchain using your cross-chain collateral",
      icon: TrendingUp,
      color: "bg-green-500",
      chain: "/chain/arbitrum.png"
    },
    {
      id: 4,
      title: "Secure & Verified",
      description: "All transactions are secured by Chainlink's proven cross-chain infrastructure",
      icon: Shield,
      color: "bg-orange-500",
      chain: "/eth2.jpg"
    }
  ]

  const features = [
    {
      title: "Multi-Chain Support",
      description: "Support for Ethereum, Arbitrum, Base, Optimism, and more",
      icon: Globe,
      chains: ["/chain/base.png", "/chain/arbitrum.png", "/optimism.jpg", "/eth2.jpg"]
    },
    {
      title: "Instant Settlements",
      description: "Fast and efficient cross-chain transactions powered by CCIP",
      icon: Zap,
      chains: ["/chainlink.png"]
    },
    {
      title: "Secure Infrastructure",
      description: "Built on Chainlink's battle-tested cross-chain protocol",
      icon: Shield,
      chains: ["/chainlink.png", "/eth2.jpg"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            How Cross-Chain Lending Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience seamless lending and borrowing across multiple blockchains with 
            <span className="text-blue-600 font-semibold"> Chainlink CCIP</span>
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                  </div>
                )}
                
                {/* Step Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="text-center flex-1 flex flex-col justify-between">
                    {/* Step Number */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {step.id}
                      </div>
                    </div>
                    
                    {/* Chain Logo */}
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <Image 
                        src={step.chain} 
                        alt={`Chain ${step.id}`}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Cross-Chain Lending?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="text-center flex-1 flex flex-col">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">
                        {feature.title}
                      </h4>
                      
                      <p className="text-gray-600 mb-6">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Chain logos */}
                    <div className="flex justify-center space-x-3">
                      {feature.chains.map((chain, chainIndex) => (
                        <div key={chainIndex} className="w-8 h-8 relative">
                          <Image 
                            src={chain} 
                            alt={`Chain ${chainIndex}`}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Start Cross-Chain Lending?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join the future of decentralized finance with secure cross-chain lending
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Start Lending
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
