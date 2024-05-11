import posthog from "posthog-js";

type Property = unknown;
type Properties = Record<string, Property>;

interface EventData {
  [key: string]: string | number | boolean;
}

export function useAppEvent(event_name: string, properties?: Properties | null | undefined) {
  posthog.capture(event_name, properties);
  umTrackEvent(event_name, properties as EventData)
}