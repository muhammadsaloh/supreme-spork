import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { Pair } from './types';

const storageKey = 'match-columns-v1';

const useMatchColumns = ({
  onChange,
}: {
  onChange?: (pairs: Pair[]) => void;
}) => {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const leftRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rightRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dragState = useRef<{
    fromSide: 'left' | 'right' | null;
    fromId: string | null;
    current: { x: number; y: number } | null;
  }>({ fromSide: null, fromId: null, current: null });

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Pair[];
      setPairs(parsed);
    }
  }, []);

  useEffect(() => {
    onChange?.(pairs);
  }, [pairs, onChange]);

  const getCenter = useCallback((el: HTMLElement | null) => {
    const container = containerRef.current;
    if (!el || !container) return { x: 0, y: 0 };
    const er = el.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    return {
      x: er.left + er.width / 2 - cr.left,
      y: er.top + er.height / 2 - cr.top,
    };
  }, []);

  const createPair = useCallback((leftId: string, rightId: string) => {
    setPairs((prev) => {
      if (prev.some((p) => p.leftId === leftId && p.rightId === rightId))
        return prev;
      return [...prev, { leftId, rightId }];
    });
  }, []);

  const removePair = useCallback((leftId: string, rightId: string) => {
    setPairs((prev) =>
      prev.filter((p) => !(p.leftId === leftId && p.rightId === rightId))
    );
  }, []);

  const onPointerDownItem = useCallback(
    (e: ReactPointerEvent, side: 'left' | 'right', id: string) => {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      dragState.current.fromSide = side;
      dragState.current.fromId = id;
      const container = containerRef.current;
      if (!container) return;
      const cr = container.getBoundingClientRect();
      dragState.current.current = {
        x: e.clientX - cr.left,
        y: e.clientY - cr.top,
      };
      const onPointerMove = (ev: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        dragState.current.current = {
          x: ev.clientX - rect.left,
          y: ev.clientY - rect.top,
        };
        setTick((t) => t + 1);
      };
      const onPointerUp = (ev: PointerEvent) => {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
        const pt = document.elementFromPoint(
          ev.clientX,
          ev.clientY
        ) as HTMLElement | null;
        if (pt) {
          const mapToCheck =
            dragState.current.fromSide === 'left'
              ? rightRefs.current
              : leftRefs.current;
          let foundId: string | null = null;
          for (const [idKey, node] of mapToCheck.entries()) {
            if (node.contains(pt) || node === pt) {
              foundId = idKey;
              break;
            }
          }
          if (foundId && dragState.current.fromId) {
            if (dragState.current.fromSide === 'left') {
              createPair(dragState.current.fromId, foundId);
            } else {
              createPair(foundId, dragState.current.fromId);
            }
          }
        }
        dragState.current.fromSide = null;
        dragState.current.fromId = null;
        dragState.current.current = null;
        setTick((t) => t + 1);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      setTick((t) => t + 1);
    },
    [createPair]
  );

  const [, setTick] = useState(0);

  const lines = useMemo(() => {
    const container = containerRef.current;
    if (!container) return [];
    return pairs.map((p) => {
      const leftNode = leftRefs.current.get(p.leftId) || null;
      const rightNode = rightRefs.current.get(p.rightId) || null;
      const a = getCenter(leftNode);
      const b = getCenter(rightNode);
      return { ...p, x1: a.x, y1: a.y, x2: b.x, y2: b.y };
    });
  }, [pairs, getCenter]);

  const tempLine = useMemo(() => {
    if (
      !dragState.current.fromSide ||
      !dragState.current.fromId ||
      !dragState.current.current
    )
      return null;
    const fromId = dragState.current.fromId;
    const side = dragState.current.fromSide;
    const fromNode =
      side === 'left'
        ? leftRefs.current.get(fromId) || null
        : rightRefs.current.get(fromId) || null;
    const fromCenter = getCenter(fromNode);
    const to = dragState.current.current;
    return { x1: fromCenter.x, y1: fromCenter.y, x2: to.x, y2: to.y };
  }, [getCenter]);

  const saveToStorage = useCallback(() => {
    localStorage.setItem(storageKey, JSON.stringify(pairs));
  }, [pairs]);

  const clearAll = useCallback(() => {
    setPairs([]);
    localStorage.removeItem(storageKey);
  }, []);

  const restore = useCallback(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Pair[];
    setPairs(parsed);
  }, []);

  const registerRef = useCallback(
    (side: 'left' | 'right', id: string) => (el: HTMLDivElement | null) => {
      const map = side === 'left' ? leftRefs.current : rightRefs.current;
      if (el) map.set(id, el);
      else map.delete(id);
    },
    []
  );

  const isPairedLeft = useCallback(
    (id: string) => pairs.some((p) => p.leftId === id),
    [pairs]
  );
  const isPairedRight = useCallback(
    (id: string) => pairs.some((p) => p.rightId === id),
    [pairs]
  );

  const onRemoveClick = useCallback(
    (p: Pair) => {
      removePair(p.leftId, p.rightId);
    },
    [removePair]
  );

  return {
    onPointerDownItem,
    lines,
    tempLine,
    saveToStorage,
    clearAll,
    restore,
    registerRef,
    isPairedLeft,
    isPairedRight,
    onRemoveClick,
    containerRef,
    pairs,
  };
};

export default useMatchColumns;
