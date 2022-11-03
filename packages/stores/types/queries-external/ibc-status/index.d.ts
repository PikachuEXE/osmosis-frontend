import { KVStore } from "@keplr-wallet/common";
import { HasMapStore } from "@keplr-wallet/stores";
import { DeepReadonly } from "utility-types";
import { ObservableQueryExternalBase } from "../base";
import { IbcMetrics, IbcStatus } from "./types";
export declare class ObservableQueryIbcStatuses {
    protected readonly queryIbcDepositStatuses: DeepReadonly<ObservableQueryIbcDepositStatuses>;
    protected readonly queryIbcWithdrawStatuses: DeepReadonly<ObservableQueryIbcWithdrawStatuses>;
    constructor(kvStore: KVStore, ibcStatusBaseUrl?: string);
    readonly getIbcStatus: (direction: "deposit" | "withdraw", counterpartyChainId: string, sourceChannelId: string) => IbcStatus | undefined;
}
declare class ObservableQueryIbcDepositStatus extends ObservableQueryExternalBase<IbcMetrics> {
    constructor(kvStore: KVStore, baseURL: string, counterPartyChainID: string);
    readonly getIbcStatus: (sourceChannelId: string) => IbcStatus | undefined;
}
declare class ObservableQueryIbcDepositStatuses extends HasMapStore<ObservableQueryIbcDepositStatus> {
    constructor(kvStore: KVStore, ibcStatusBaseUrl?: string);
    get(counterPartyChainID: string): ObservableQueryIbcDepositStatus;
}
declare class ObservableQueryIbcWithdrawStatus extends ObservableQueryExternalBase<IbcMetrics> {
    constructor(kvStore: KVStore, baseURL: string, counterPartyChainID: string);
    readonly getIbcStatus: (counterPartyChainID: string) => IbcStatus | undefined;
}
declare class ObservableQueryIbcWithdrawStatuses extends HasMapStore<ObservableQueryIbcWithdrawStatus> {
    constructor(kvStore: KVStore, ibcStatusBaseUrl?: string);
    get(counterPartyChainID: string): ObservableQueryIbcWithdrawStatus;
}
export * from "./types";
