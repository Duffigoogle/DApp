import type detectEthereumProvider from '@metamask/detect-provider'
import type {
  Actions,
  AddEthereumChainParameter,
  Provider,
  ProviderConnectInfo,
  ProviderRpcError,
} from '@web3-react/types'
import { Connector } from '@web3-react/types'

export class NoMetaMaskError extends Error {
  public constructor() {
    super('MetaMask not installed')
    this.name = NoMetaMaskError.name
    Object.setPrototypeOf(this, NoMetaMaskError.prototype)
  }
}

function parseChainId(chainId: string) {
  return Number.parseInt(chainId, 16)
}

export class MetaMask extends Connector {
  private readonly options?: Parameters<typeof detectEthereumProvider>[0]
  private eagerConnection?: Promise<void>

  /**
   * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
   * @param options - Options to pass to `@metamask/detect-provider`
   */
  constructor(actions: Actions, connectEagerly = true, options?: Parameters<typeof detectEthereumProvider>[0]) {
    super(actions)
    this.options = options

    if (connectEagerly) {
      this.eagerConnection = this.initialize(true)
    }
  }

  private async initialize(connectEagerly: boolean): Promise<void> {
    let cancelActivation: () => void
    if (connectEagerly) {
      cancelActivation = this.actions.startActivation()
    }

    return import('@metamask/detect-provider')
      .then((m) => m.default(this.options))
      .then((provider) => {
        this.provider = (provider as Provider) ?? undefined

        if (this.provider) {
          this.provider.on('connect', ({ chainId }: ProviderConnectInfo): void => {
            this.actions.update({ chainId: parseChainId(chainId) })
          })
          this.provider.on('disconnect', (error: ProviderRpcError): void => {
            this.actions.reportError(error)
          })
          this.provider.on('chainChanged', (chainId: string): void => {
            this.actions.update({ chainId: parseChainId(chainId) })
          })
          this.provider.on('accountsChanged', (accounts: string[]): void => {
            if (accounts.length === 0) {
              // handle this edge case by disconnecting
              this.actions.reportError(undefined)
            } else {
              this.actions.update({ accounts })
            }
          })

          if (connectEagerly) {
            return Promise.all([
              this.provider.request({ method: 'eth_chainId' }) as Promise<string>,
              this.provider.request({ method: 'eth_accounts' }) as Promise<string[]>,
            ])
              .then(([chainId, accounts]) => {
                if (accounts.length) {
                  this.actions.update({ chainId: parseChainId(chainId), accounts })
                } else {
                  throw new Error('No accounts returned')
                }
              })
              .catch((error) => {
                console.debug('Could not connect eagerly', error)
                cancelActivation()
              })
          }
        } else if (connectEagerly) {
          cancelActivation()
        }
      })
  }

  /**
   * Initiates a connection.
   *
   * @param desiredChainIdOrChainParameters - If defined, indicates the desired chain to connect to. If the user is
   * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
   * to the chain, if one of two conditions is met: either they already have it added in their extension, or the
   * argument is of type AddEthereumChainParameter, in which case the user will be prompted to add the chain with the
   * specified parameters first, before being prompted to switch.
   */
  public async activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter): Promise<void> {
    const desiredChainId =
      typeof desiredChainIdOrChainParameters === 'number'
        ? desiredChainIdOrChainParameters
        : desiredChainIdOrChainParameters?.chainId

    this.actions.startActivation()

    if (!this.eagerConnection) {
      this.eagerConnection = this.initialize(false)
    }
    await this.eagerConnection

    if (!this.provider) {
      return this.actions.reportError(new NoMetaMaskError())
    }

    return Promise.all([
      this.provider.request({ method: 'eth_chainId' }) as Promise<string>,
      this.provider.request({ method: 'eth_requestAccounts' }) as Promise<string[]>,
    ])
      .then(([chainId, accounts]) => {
        const receivedChainId = parseChainId(chainId)

        // if there's no desired chain, or it's equal to the received, update
        if (!desiredChainId || receivedChainId === desiredChainId) {
          return this.actions.update({ chainId: receivedChainId, accounts })
        }

        // if we're here, we can try to switch networks
        const desiredChainIdHex = `0x${desiredChainId.toString(16)}`
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.provider!.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: desiredChainIdHex }],
        })
          .catch((error: ProviderRpcError) => {
            if (error.code === 4902 && typeof desiredChainIdOrChainParameters !== 'number') {
              // if we're here, we can try to add a new network
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return this.provider!.request({
                method: 'wallet_addEthereumChain',
                params: [{ ...desiredChainIdOrChainParameters, chainId: desiredChainIdHex }],
              })
            } else {
              throw error
            }
          })
          .then(() => this.activate(desiredChainId))
      })
      .catch((error: ProviderRpcError) => {
        this.actions.reportError(error)
      })
  }
}