import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type MouseEvent as SyntheticMouseEvent,
  type RefObject,
} from 'react';
import type { DataRow } from '../DataTable.types';

export type Position = { rowIndex: number; colIndex: number };

export type Selection = {
  from: Position;
  to: Position;
};

export const normalize = (selection: Selection): Selection => {
  const { from, to } = selection;

  return {
    from: {
      rowIndex: Math.min(from.rowIndex, to.rowIndex),
      colIndex: Math.min(from.colIndex, to.colIndex),
    },
    to: {
      rowIndex: Math.max(from.rowIndex, to.rowIndex),
      colIndex: Math.max(from.colIndex, to.colIndex),
    },
  };
};

export const isPositionInSelection = (
  position: Position,
  selection: Selection | null
): boolean => {
  if (!selection) {
    return false;
  }

  const { from, to } = selection;

  return (
    position.rowIndex >= from.rowIndex &&
    position.rowIndex <= to.rowIndex &&
    position.colIndex >= from.colIndex &&
    position.colIndex <= to.colIndex
  );
};

export type UseSelectionOptions = {
  containerRef: RefObject<HTMLElement | null>;
  rows: DataRow[];
};

export type UseSelectionResult = {
  selection: Selection | null;
  isSelected: (position: Position) => boolean;
  handleCellMouseDown: (
    event: SyntheticMouseEvent,
    position: Position
  ) => void;
  handleCellMouseEnter: (position: Position) => void;
};

export const useSelection = ({
  containerRef,
  rows,
}: UseSelectionOptions): UseSelectionResult => {
  const anchorRef = useRef<Position | null>(null);

  const [selection, setSelection] = useState<Selection | null>(null);

  const handleCellMouseDown = useCallback(
    (event: SyntheticMouseEvent, position: Position) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();

      anchorRef.current = position;

      setSelection({ from: position, to: position });
    },
    []
  );

  const handleCellMouseEnter = useCallback((position: Position) => {
    if (!anchorRef.current) {
      return;
    }

    setSelection(normalize({ from: anchorRef.current, to: position }));
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      anchorRef.current = null;
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      if (!container.contains(event.target as Node)) {
        setSelection(null);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [containerRef]);

  useEffect(() => {
    const handleCopy = (event: ClipboardEvent) => {
      if (!selection) {
        return;
      }

      event.preventDefault();

      const { from, to } = selection;
      const lines: string[][] = [];

      for (let ri = from.rowIndex; ri <= to.rowIndex; ri++) {
        const row = rows[ri];
        const line: string[] = [];

        for (let ci = from.colIndex; ci <= to.colIndex; ci++) {
          const cell = row[ci];

          // date should be formatted while rates goes raw numbers
          const value =
            ci === 0 ? cell.displayValue : `${cell.value || ''}`;

          line.push(value);
        }

        lines.push(line);
      }

      const text: string = lines
        .map((line) => line.join('\t'))
        .join('\n');

      event.clipboardData?.setData('text/plain', text);
    };

    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('copy', handleCopy);
    };
  }, [selection, rows]);

  const isSelected = useCallback(
    (position: Position) => {
      return isPositionInSelection(position, selection);
    },
    [selection]
  );

  return {
    selection,
    isSelected,
    handleCellMouseDown,
    handleCellMouseEnter,
  };
};
