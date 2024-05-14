import posthog from "posthog-js";

type Property = unknown;
type Properties = Record<string, Property>;

interface EventData {
  [key: string]: string | number | boolean;
}

type EventName =
  "open-drop-notification" | "disable-drop-notification" | "enable-drop-notification" |
  "login" | "logout" |
  "connect-button" | "connect-wallet" |
  "buy-nft" | "buy-nft-error" | "sell-nft" | "sell-nft-error" | "allow-sell-nft" | "allow-sell-nft-error" |
  "open-buy-dialog" | "open-sell-dialog" |
  "select-cover" | "remove-cover" | "select-avatar" | "open-edit-profile" | "close-edit-profile" | "discard-profile-changes" | "save-profile" | "save-profile-error" |
  "withdraw-royalties" | "withdraw-royalties-error" |
  "player-play" | "player-pause" | "player-toggle-play" | "player-next" | "player-prev" | "player-seek-to" | "player-checkpoint"

export function useAppEvent(event_name: EventName, properties?: Properties | null | undefined) {
  if (event_name === "login") {
    posthog.identify(properties?.address as string);

    // isDev
    // posthog.register({ isDev: true })
  }

  posthog.capture(event_name, properties);

  if (event_name === "logout") {
    posthog.reset();
  }

  // TODO: we will remove umami after we have a better way to track the user's actions
  umTrackEvent(event_name, properties as EventData)
}