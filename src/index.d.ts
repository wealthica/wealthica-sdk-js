import { ApisauceInstance } from "apisauce";

export = Wealthica

declare var Wealthica: {
  init(config: APIConfig): APIInterface;
};

interface APIInterface {
  constructor(config: APIConfig)
  __init(): APIInterface
  login(loginName?: string): APIUserInterface
  getToken(options: TokenOptions): Promise<string>
  fetchToken(): Promise<string>
  authApi: ApisauceInstance
  api: ApisauceInstance
  getTeam(): string;
  getConnectData(options: ConnectDataOptions): Promise<ConnectData>
  connect(options?: ConnectDataOptions): APIInterface
  reconnect(institutionId: string, options: ConnectDataOptions): APIUserInterface
  onConnection(callback: Function): APIInterface
  onError(callback: Function): APIInterface
  onEvent(callback: Function): APIInterface
  providers: ProvidersInterface
  teams: TeamsInterface
}

interface ProvidersInterface {
  constructor(api: APIInterface)
  getList(): Promise<Provider[]>
  getOne(id: string): Promise<Provider>
}

interface TeamsInterface {
  constructor(api: APIInterface)
  info(): Promise<{}>
}

interface APIUserInterface extends APIInterface {
  userApi: ApisauceInstance
  institutions: InstitutionsInterface
  history: HistoryInterface
  transactions: TransactionsInterface
}

interface InstitutionsInterface {
  constructor(api: APIUserInterface)
  getList(): Promise<Institution[]> | Promise<never>
  getOne(id: string, params?: {}): Promise<Institution> | Promise<never>
  sync(id): Promise<Institution> | Promise<never>
  remove(id): Promise<void> | Promise<never>
}

interface HistoryInterface {
  constructor(api: APIUserInterface)
  getList(options: HistoryListOptions): Promise<BalanceHistory[]> | Promise<never>
}

interface TransactionsInterface {
  constructor(api: APIUserInterface)
  getList(options: TransactionsOptions): Promise<Transactions[]> | Promise<never>
  getOne(options: TransactionOptions): Promise<Transactions> | Promise<never>
}

type APIConfig = {
  clientId: string;
  secret?: string;
  baseURL?: string;
  connectURL?: string;
  redirectURI?: string;
  loginName?: string | null;
  authEndpoint?: string;
  auth?: {
    headers?: object;
    params?: object;
  },
  authorizer?(callback: Function): void | Promise<void>;
}

type TokenOptions = {
  minimumLifetime: number;
}

type ConnectDataOptions = {
  provider: string;
  institutionId: string;
  state: string;
  origin: string | undefined;
  lang: string;
  redirectURI: string;
  providers: Array<string> | undefined;
  providerGroups: Array<string> | undefined;
}

type ConnectData = {
  url: string;
  token: string;
}

type TransactionsOptions = {
  institutionId: string;
  from?: string;
  to?: string;
  investments?: string;
  last?: string;
  limit?: number;
}

type TransactionOptions = {
  institutionId: string;
  txId: string;
}

type Part = {
  direction: string;
  ticker: string;
  provider_ticker: string;
  amount: string;
  asset_is_verified?: boolean | null;
  fiat_asset_is_verified?: boolean | null;
  other_parties: any[];
}

type Fee = {
  type?: string | null;
  ticker: string;
  provider_ticker: string;
  amount: string;
  asset_is_verified?: boolean | null;
  fiat_asset_is_verified?: boolean | null;
  resource_type: string;
}

type Transactions = {
  id: string;
  status?: string | null;
  transaction_type: string;
  parts: Part[];
  fees: Fee[];
  misc: any[];
  fiat_calculated_at: number;
  initiated_at: number;
  confirmed_at: number;
  resource_type: string;
}

type HistoryListOptions = {
  institutionId: string;
  from?: string;
  to?: string;
  investments?: string;
}

type BalanceHistory = {
  id: string;
  date: number;
  investment: string;
}

type Provider = {
  name: string;
  display_name: string;
  logo: string;
  auth_type: string;
  available_scopes: any[];
  available_currencies?: any;
  resource_type: string;
  status?: any;
  is_beta: boolean;
  connect_notice: string;
  credentials: string[];
}

type InstitutionProvider = {
  name: string;
  display_name: string;
  logo: string;
  type: string;
  scopes: any[];
  resource_type: string;
}

type Balance = {
  ticker: string;
  provider_ticker: string;
  name: string;
  asset_is_verified?: any;
  asset_type: string;
  amount: string;
  decimals: number;
  fiat_asset_is_verified?: any;
  logo: string;
  updated_at: number;
  misc?: any;
  resource_type: string;
}

type Institution = {
  id: string;
  provider: InstitutionProvider;
  balances: Balance[];
  blockchain?: any;
  created_at: number;
  updated_at: number;
  resource_type: string;
}
