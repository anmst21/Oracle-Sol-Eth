export const pendingTxEx = {
  id: "0xa18f428835f4f442dd9c885d9387c50be741b15ce734c12d1e043decfead430d",
  status: "pending",
  user: "0xcce2e59a3884d876e7bfe282e3b39fee8d601835",
  recipient: "0xCce2e59a3884D876e7BFe282E3b39feE8d601835",
  data: {
    slippageTolerance: "445",
    failReason: "N/A",
    fees: {
      gas: "57956636278800",
      fixed: "7385933489668",
      price: "26246418231",
    },
    feesUsd: {
      gas: "155499",
      fixed: "19816",
      price: "70",
    },
    inTxs: [
      {
        fee: "13496469051",
        data: {
          to: "0xa5f565650890fba1824ee0f21ebbbf660a179934",
          data: "0xa18f428835f4f442dd9c885d9387c50be741b15ce734c12d1e043decfead430d",
          from: "0xcce2e59a3884d876e7bfe282e3b39fee8d601835",
          value: "213000000000000",
        },
        stateChanges: [
          {
            change: {
              data: {
                tokenKind: "ft",
                tokenAddress: "0x0000000000000000000000000000000000000000",
              },
              kind: "token",
              balanceDiff: "-213000000000000",
            },
            address: "0xcce2e59a3884d876e7bfe282e3b39fee8d601835",
          },
          {
            change: {
              data: {
                tokenKind: "ft",
                tokenAddress: "0x0000000000000000000000000000000000000000",
              },
              kind: "token",
              balanceDiff: "213000000000000",
            },
            address: "0xf70da97812cb96acdf810712aa562db8dfa3dbef",
          },
        ],
        hash: "0x4b44fb557f49817b5a853e8654a19c130beb670d235d2d2684462aceb2b421f9",
        block: 136959983,
        type: "onchain",
        chainId: 10,
        timestamp: 1749518743,
      },
    ],
    currency: "eth",
    currencyObject: {},
    feeCurrency: "eth",
    feeCurrencyObject: {
      chainId: 10,
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ether",
      decimals: 18,
      metadata: {
        logoURI: "https://assets.relay.link/icons/1/light.png",
        verified: true,
      },
    },
    appFees: [],
    metadata: {
      sender: "0xCce2e59a3884D876e7BFe282E3b39feE8d601835",
      recipient: "0xCce2e59a3884D876e7BFe282E3b39feE8d601835",
      currencyIn: {
        currency: {
          chainId: 10,
          address: "0x0000000000000000000000000000000000000000",
          symbol: "ETH",
          name: "Ether",
          decimals: 18,
          metadata: {
            logoURI: "https://assets.relay.link/icons/1/light.png",
            verified: true,
          },
        },
        amount: "213000000000000",
        amountFormatted: "0.000213",
        amountUsd: "0.578061",
        amountUsdCurrent: "0.578082",
        minimumAmount: "213000000000000",
      },
      currencyOut: {
        currency: {
          chainId: 1,
          address: "0x0000000000000000000000000000000000000000",
          symbol: "ETH",
          name: "Ether",
          decimals: 18,
          metadata: {
            logoURI: "https://assets.relay.link/icons/1/light.png",
            verified: true,
          },
        },
        amount: "131232091158098",
        amountFormatted: "0.000131232091158098",
        amountUsd: "0.356151",
        amountUsdCurrent: "0.356164",
        minimumAmount: "131232091158098",
      },
      rate: "0.6161131040286292",
    },
    price: "131232091158098",
    usesExternalLiquidity: false,
    timeEstimate: 15,
    outTxs: [
      {
        chainId: 1,
      },
    ],
  },
  createdAt: "2025-06-10T01:25:43.949Z",
  updatedAt: "2025-06-10T01:25:44.535Z",
};
