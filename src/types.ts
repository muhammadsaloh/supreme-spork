export type Item = { id: string; label: string };
export type Pair = { leftId: string; rightId: string };

export type Props = {
  left: Item[];
  right: Item[];
  storageKey?: string;
  onChange?: (pairs: Pair[]) => void;
};