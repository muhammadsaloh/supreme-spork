import MatchColumns from './MatchColumns';
import type { Item } from './types';

const left: Item[] = [
  { id: 'l1', label: 'Свойство 1' },
  { id: 'l2', label: 'Свойство 2' },
  { id: 'l3', label: 'Свойство 3' },
  { id: 'l4', label: 'Свойство 4' },
  { id: 'l5', label: 'Свойство 5' },
];

const right: Item[] = [
  { id: 'r1', label: 'Опция 1' },
  { id: 'r2', label: 'Опция 2' },
  { id: 'r3', label: 'Опция 3' },
  { id: 'r4', label: 'Опция 4' },
  { id: 'r5', label: 'Опция 5' },
];

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Matcher Demo</h2>
      <MatchColumns
        left={left}
        right={right}
        onChange={(pairs) => console.log('pairs:', pairs)}
      />
    </div>
  );
}
