export interface IToken {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  companies: string[];
  supportedRouterVersions: number[];
  type: 'erc20' | 'erc721' | 'erc1155' | 'erc20_minecart' | 'erc20_nt_minecart';
  isActive: boolean;
  _comment?: string;
  doppelgangers?: {chainId: number; address: string}[];
}
