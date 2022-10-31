import { KVStore } from "@keplr-wallet/common";
import { DeepReadonly } from "utility-types";
import { IPriceStore } from "../price";
import { ObservableQueryPoolFeesMetrics } from "./pool-fees";
<<<<<<< HEAD
import { ObservableQueryAccountsPoolRewards } from "./pool-rewards";
=======
import Axios from "axios";
import { makeObservable } from "mobx";
import { computedFn } from "mobx-utils";
import { IbcStatus } from "./ibc-status/types";
>>>>>>> 64142d6c (use ibc/v1/all path and search for channel with correct chain ID)

/** Root store for queries external to any chain. */
export class QueriesExternalStore {
  public readonly queryGammPoolFeeMetrics: DeepReadonly<ObservableQueryPoolFeesMetrics>;
  public readonly queryAccountsPoolRewards: DeepReadonly<ObservableQueryAccountsPoolRewards>;

  constructor(
    kvStore: KVStore,
    priceStore: IPriceStore,
    feeMetricsBaseURL = "https://api-osmosis.imperator.co",
    poolRewardsBaseUrl = "https://api-osmosis-chain.imperator.co"
  ) {
    this.queryGammPoolFeeMetrics = new ObservableQueryPoolFeesMetrics(
      kvStore,
      feeMetricsBaseURL
    );
    this.queryAccountsPoolRewards = new ObservableQueryAccountsPoolRewards(
      kvStore,
<<<<<<< HEAD
      priceStore,
      poolRewardsBaseUrl
=======
      ibcStatusBaseUrl
    );
  }
}

export class ObservableQueryExternalBase<
  T = unknown,
  E = unknown
> extends ObservableQuery<T, E> {
  constructor(kvStore: KVStore, baseURL: string, urlPath: string) {
    const instance = Axios.create({ baseURL });

    super(kvStore, instance, urlPath);
  }
}

export class ObservableQueryIbcStatus extends ObservableQueryExternalBase<IbcStatus> {
  constructor(kvStore: KVStore, baseURL: string, _counterPartyChainID: string) {
    super(kvStore, baseURL, `/ibc/v1/all`);
    makeObservable(this);
  }

  readonly getIbcStatus = computedFn((counterPartyChainID: string): string => {
    const ibcRaw = this.response?.data.data.find(
      (statusMetric) => statusMetric.channel_id === counterPartyChainID
    );
    if (!ibcRaw) {
      return "Congested";
    }

    // TODO: figure out what metrics constitute congested or not
    if (ibcRaw.size_queue > 1_000) {
      return "Congested";
    } else {
      return "OK";
    }
  });
}

export class ObservableQueryIbcStatuses extends HasMapStore<ObservableQueryIbcStatus> {
  constructor(kvStore: KVStore, baseUrl: string) {
    super(
      (counterPartyChainID) =>
        new ObservableQueryIbcStatus(kvStore, baseUrl, counterPartyChainID)
>>>>>>> 64142d6c (use ibc/v1/all path and search for channel with correct chain ID)
    );
  }

  get(counterPartyChainID: string): ObservableQueryIbcStatus {
    return super.get(counterPartyChainID);
  }
}
