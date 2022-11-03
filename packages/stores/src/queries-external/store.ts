import { KVStore } from "@keplr-wallet/common";
import { DeepReadonly } from "utility-types";
import { IPriceStore } from "../price";
import { ObservableQueryIbcStatuses } from "./ibc-status";
import { ObservableQueryPoolFeesMetrics } from "./pool-fees";
import { ObservableQueryAccountsPoolRewards } from "./pool-rewards";

/** Root store for queries external to any chain. */
export class QueriesExternalStore {
  public readonly queryGammPoolFeeMetrics: DeepReadonly<ObservableQueryPoolFeesMetrics>;
  public readonly queryAccountsPoolRewards: DeepReadonly<ObservableQueryAccountsPoolRewards>;
  public readonly queryIbcDepositStatuses: DeepReadonly<ObservableQueryIbcStatuses>;

  constructor(
    kvStore: KVStore,
    priceStore: IPriceStore,
    feeMetricsBaseURL = "https://api-osmosis.imperator.co",
    poolRewardsBaseUrl = "https://api-osmosis-chain.imperator.co",
    ibcStatusBaseUrl = "https://api-osmosis-chain.imperator.co"
  ) {
    this.queryGammPoolFeeMetrics = new ObservableQueryPoolFeesMetrics(
      kvStore,
      feeMetricsBaseURL
    );
    this.queryAccountsPoolRewards = new ObservableQueryAccountsPoolRewards(
      kvStore,
      priceStore,
      poolRewardsBaseUrl
    );
    this.queryIbcDepositStatuses = new ObservableQueryIbcStatuses(
      kvStore,
      ibcStatusBaseUrl
    );
  }
}
