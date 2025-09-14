import React from 'react';
import {
  Anchor,
  Btn,
  Col,
  ColumnsRow,
  Controls,
  ItemBox,
  Small,
  SvgOverlay,
  Wrapper,
} from './style';
import type { Props } from './types';
import useMatchColumns from './useMatchColumns';

export const MatchColumns: React.FC<Props> = ({ left, right, onChange }) => {
  const {
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
  } = useMatchColumns({ onChange });

  return (
    <Wrapper>
      <Controls>
        <Btn onClick={saveToStorage} title='Save to localStorage'>
          Save
        </Btn>
        <Btn onClick={restore} title='Restore from localStorage'>
          Restore
        </Btn>
        <Btn onClick={clearAll} title='Clear pairs'>
          Clear
        </Btn>
        <Small>
          Drag from any item to connect to an opposite column item. Click pairs
          to remove.
        </Small>
      </Controls>

      <div style={{ position: 'relative' }} ref={containerRef}>
        <ColumnsRow>
          <Col>
            {left.map((it) => (
              <ItemBox
                key={it.id}
                active={isPairedLeft(it.id)}
                ref={registerRef('left', it.id)}
                onPointerDown={(e) => onPointerDownItem(e, 'left', it.id)}
                data-side='left'
                role='button'
                aria-label={`left-${it.label}`}
              >
                <span>{it.label}</span>
                <Anchor visible={isPairedLeft(it.id)} />
              </ItemBox>
            ))}
          </Col>

          <Col>
            {right.map((it) => (
              <ItemBox
                key={it.id}
                active={isPairedRight(it.id)}
                ref={registerRef('right', it.id)}
                onPointerDown={(e) => onPointerDownItem(e, 'right', it.id)}
                data-side='right'
                role='button'
                aria-label={`right-${it.label}`}
              >
                <span>{it.label}</span>
                <Anchor visible={isPairedRight(it.id)} />
              </ItemBox>
            ))}
          </Col>

          <SvgOverlay width='100%' height='100%'>
            {lines.map((ln) => {
              const path = `M ${ln.x1} ${ln.y1} C ${ln.x1 + 80} ${ln.y1} ${
                ln.x2 - 80
              } ${ln.y2} ${ln.x2} ${ln.y2}`;
              return (
                <g key={`${ln.leftId}-${ln.rightId}`}>
                  <path
                    d={path}
                    stroke='#2f8f3a'
                    strokeWidth={4}
                    fill='none'
                    strokeLinecap='round'
                  />
                  <circle
                    cx={(ln.x1 + ln.x2) / 2}
                    cy={(ln.y1 + ln.y2) / 2}
                    r={10}
                    fill='#2f8f3a'
                    style={{ cursor: 'pointer', pointerEvents: 'all' }}
                    onClick={() =>
                      onRemoveClick({ leftId: ln.leftId, rightId: ln.rightId })
                    }
                  />
                </g>
              );
            })}

            {tempLine && (
              <>
                <path
                  d={`M ${tempLine.x1} ${tempLine.y1} C ${tempLine.x1 + 80} ${
                    tempLine.y1
                  } ${tempLine.x2 - 80} ${tempLine.y2} ${tempLine.x2} ${
                    tempLine.y2
                  }`}
                  stroke='#2f8f3a'
                  strokeWidth={3}
                  strokeDasharray='6 6'
                  fill='none'
                  strokeLinecap='round'
                />
                <circle
                  cx={tempLine.x2}
                  cy={tempLine.y2}
                  r={6}
                  fill='#2f8f3a'
                />
              </>
            )}
          </SvgOverlay>
        </ColumnsRow>
      </div>
    </Wrapper>
  );
};

export default MatchColumns;
