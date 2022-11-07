import { SourceChain } from "./types";

export function waitBySourceChain(sourceChain: SourceChain) {
  switch (sourceChain) {
    case "ethereum":
    case "polygon":
      return "15 minutes";
    default:
      return "3 minutes";
  }
}
