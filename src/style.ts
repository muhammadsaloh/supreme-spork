import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 16px auto;
  background: #fafafa;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 0 0 1px #f0f0f0 inset;

  @media (max-width: 600px) {
    padding: 12px;
  }
`;

export const ColumnsRow = styled.div`
  display: flex;
  gap: 20px;
  position: relative;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Col = styled.div`
  flex: 1;
  min-width: 240px;

  @media (max-width: 768px) {
    width: 100%; /* take full width on mobile */
    min-width: unset;
  }
`;

export const ItemBox = styled.div<{ active?: boolean }>`
  background: ${(p) => (p.active ? '#e9f6ea' : '#f3f3f3')};
  border-radius: 12px;
  padding: 18px;
  margin: 12px 8px;
  user-select: none;
  font-weight: 600;
  box-shadow: ${(p) => (p.active ? '0 0 0 3px rgba(36,128,60,0.12)' : 'none')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: grab;
  word-break: break-word;
`;

export const Anchor = styled.div<{ visible?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2f8f3a;
  box-shadow: 0 0 0 3px rgba(47, 143, 58, 0.08);
  margin-left: 12px;
  visibility: ${(p) => (p.visible ? 'visible' : 'hidden')};
`;

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
`;

export const Btn = styled.button`
  background: #2f8f3a;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const Small = styled.span`
  font-size: 13px;
  color: #666;
`;

export const SvgOverlay = styled.svg`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;
