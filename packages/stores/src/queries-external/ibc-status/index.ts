import { KVStore } from "@keplr-wallet/common";
import { HasMapStore } from "@keplr-wallet/stores";
import { makeObservable } from "mobx";
import { computedFn } from "mobx-utils";
import { DeepReadonly } from "utility-types";
import { ObservableQueryExternalBase } from "../base";
import { IbcMetrics, IbcStatus } from "./types";

export class ObservableQueryIbcStatuses {
  protected readonly queryIbcDepositStatuses: DeepReadonly<ObservableQueryIbcDepositStatuses>;
  protected readonly queryIbcWithdrawStatuses: DeepReadonly<ObservableQueryIbcWithdrawStatuses>;

  constructor(
    kvStore: KVStore,
    ibcStatusBaseUrl = "https://api-osmosis-chain.imperator.co"
  ) {
    this.queryIbcDepositStatuses = new ObservableQueryIbcDepositStatuses(
      kvStore,
      ibcStatusBaseUrl
    );
    this.queryIbcWithdrawStatuses = new ObservableQueryIbcWithdrawStatuses(
      kvStore,
      ibcStatusBaseUrl
    );
  }

  readonly getIbcStatus = computedFn(
    (
      direction: "deposit" | "withdraw",
      counterpartyChainId: string,
      sourceChannelId: string
    ) => {
      if (direction === "deposit") {
        return this.queryIbcDepositStatuses
          .get(counterpartyChainId)
          .getIbcStatus(sourceChannelId);
      } else if (direction === "withdraw") {
        return this.queryIbcWithdrawStatuses
          .get(counterpartyChainId)
          .getIbcStatus(sourceChannelId);
      }
    }
  );
}

class ObservableQueryIbcDepositStatus extends ObservableQueryExternalBase<IbcMetrics> {
  constructor(kvStore: KVStore, baseURL: string, counterPartyChainID: string) {
    // If we are depositing, destination is osmosis
    super(
      kvStore,
      baseURL,
      `/ibc/v1/source/${counterPartyChainID}/destinationosmosis?minutes_trigger=-1`
    );
    makeObservable(this);
  }

  readonly getIbcStatus = computedFn(
    (sourceChannelId: string): IbcStatus | undefined => {
      const ibcRaw = this.response?.data.data.find(
        (statusMetric) => statusMetric.channel_id === sourceChannelId
      );
      if (!ibcRaw) {
        return;
      }

      // TODO: figure out what metrics constitute congested or not
      if (ibcRaw.size_queue > 1_000) {
        return IbcStatus.Congested;
      } else {
        return IbcStatus.OK;
      }
    }
  );
}

class ObservableQueryIbcDepositStatuses extends HasMapStore<ObservableQueryIbcDepositStatus> {
  constructor(
    kvStore: KVStore,
    ibcStatusBaseUrl = "https://api-osmosis-chain.imperator.co"
  ) {
    super(
      (counterPartyChainID) =>
        new ObservableQueryIbcDepositStatus(
          kvStore,
          ibcStatusBaseUrl,
          counterPartyChainID
        )
    );
  }

  get(counterPartyChainID: string) {
    return super.get(counterPartyChainID) as ObservableQueryIbcDepositStatus;
  }
}

class ObservableQueryIbcWithdrawStatus extends ObservableQueryExternalBase<IbcMetrics> {
  constructor(kvStore: KVStore, baseURL: string, counterPartyChainID: string) {
    // If we are withdrawing, destination is counterPartyChainID
    super(
      kvStore,
      baseURL,
      `/ibc/v1/source/osmosis/destination${counterPartyChainID}?minutes_trigger=-1`
    );
    makeObservable(this);
  }

  readonly getIbcStatus = computedFn(
    (counterPartyChainID: string): IbcStatus | undefined => {
      const ibcRaw = this.response?.data.data.find(
        (statusMetric) => statusMetric.channel_id === counterPartyChainID
      );
      if (!ibcRaw) {
        return;
      }

      // TODO: figure out what metrics constitute congested or not
      if (ibcRaw.size_queue > 1_000) {
        return IbcStatus.Congested;
      } else {
        return IbcStatus.OK;
      }
    }
  );
}

class ObservableQueryIbcWithdrawStatuses extends HasMapStore<ObservableQueryIbcWithdrawStatus> {
  constructor(
    kvStore: KVStore,
    ibcStatusBaseUrl = "https://api-osmosis-chain.imperator.co"
  ) {
    super(
      (counterPartyChainID) =>
        new ObservableQueryIbcWithdrawStatus(
          kvStore,
          ibcStatusBaseUrl,
          counterPartyChainID
        )
    );
  }

  get(counterPartyChainID: string) {
    return super.get(counterPartyChainID) as ObservableQueryIbcWithdrawStatus;
  }
}

export * from "./types";
