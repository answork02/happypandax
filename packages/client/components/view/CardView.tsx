import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { List } from 'react-virtualized';

import { ItemSize } from '../../misc/types';
import { PlaceholderItemCard } from '../item/index';
import styles from './CardView.module.css';
import { PaginatedView, ViewAutoSizer, ViewBase } from './index';

type ItemRender<T> = React.ComponentType<{ data: T; size?: ItemSize }>;

interface CardViewProps<T> {
  items: T[];
  onItemKey: (T) => any;
  itemRender: ItemRender<T>;
  loading?: boolean;
  itemsPerPage?: number;
  size?: ItemSize;
  dynamicRowHeight?: boolean;
}

function CardViewGrid<T>({
  width: initialWidth,
  height,
  items,
  dynamicRowHeight,
  itemRender: ItemRender,
  loading,
  itemsPerPage,
  isScrolling,
  onScroll,
  scrollTop,
  autoHeight,
  onItemKey,
  size,
}: {
  width: number;
  height: number;
  isScrolling?: any;
  onScroll?: any;
  scrollTop?: any;
  autoHeight?: any;
} & CardViewProps<T>) {
  const itemRef = useRef<HTMLDivElement>();
  const [width, setWidth] = useState(initialWidth);
  const [itemWidth, setItemWidth] = useState(250);
  const [rowHeight, setRowHeight] = useState(420);
  const [dims, setDims] = useState(false);

  const itemsPerRow = Math.max(Math.floor(width / itemWidth), 1);
  const rowCount = Math.ceil(
    ((items?.length ?? 0) + (loading ? itemsPerPage : 0)) / itemsPerRow
  );

  const resize = useCallback(() => {
    if (itemRef.current) {
      if (dynamicRowHeight) {
        const margin = size === 'small' ? 10 : 35;
        setItemWidth(itemRef.current.children[0].offsetWidth);
        setRowHeight(itemRef.current.children[0].offsetHeight + margin);
      } else {
        setItemWidth(itemRef.current.offsetWidth);
        setRowHeight(itemRef.current.offsetHeight);
      }
    }
  }, [dynamicRowHeight]);

  useEffect(() => {
    resize();
  }, [dims, resize]);

  useEffect(() => {
    if (dynamicRowHeight && itemRef.current) {
      const el = itemRef.current.querySelector('img');
      if (el) {
        const f = () => setTimeout(resize, 150);
        el.addEventListener('load', resize);
        el.addEventListener('error', f);
        return () => {
          el?.removeEventListener('load', resize);
          el?.removeEventListener('error', f);
        };
      }
    }
  }, [dynamicRowHeight, resize, items, dims]);

  useEffect(() => {
    if (initialWidth) {
      setWidth(initialWidth);
    }
  }, [initialWidth]);

  return (
    <List
      className={classNames('galleryview')}
      autoHeight={autoHeight}
      isScrolling={isScrolling}
      scrollTop={scrollTop}
      onScroll={onScroll}
      width={width}
      height={height}
      rowCount={rowCount}
      rowHeight={rowHeight}
      overscanRowCount={2}
      rowRenderer={useCallback(
        ({ index, key, style }) => {
          const cols = [];
          if (items?.length) {
            const fromIndex = index * itemsPerRow;
            const toIndex = fromIndex + itemsPerRow;

            for (let i = fromIndex; i < toIndex; i++) {
              if (i >= items.length) {
                if (loading) {
                  cols.push(
                    <div
                      ref={itemRef}
                      key={`loading-${i}`}
                      className={styles.item}>
                      <PlaceholderItemCard size={size} />
                    </div>
                  );
                }
                continue;
              }

              cols.push(
                <div
                  ref={itemRef}
                  key={onItemKey(items[i])}
                  className={styles.item}>
                  <ItemRender data={items[i]} size={size} />
                </div>
              );
            }

            setDims(true);
          }

          return (
            <div className={styles.row} key={key} style={style}>
              {cols}
            </div>
          );
        },
        [items, itemsPerRow, ItemRender, loading, itemsPerPage]
      )}
    />
  );
}

export default function CardView<T>({
  disableWindowScroll,
  items,
  itemRender,
  dynamicRowHeight,
  size,
  onItemKey,
  arrayContext,
  ...props
}: {
  disableWindowScroll?: boolean;
} & CardViewProps<T> &
  React.ComponentProps<typeof ViewBase> &
  Omit<React.ComponentProps<typeof PaginatedView>, 'children' | 'itemCount'>) {
  return (
    <ViewBase arrayContext={arrayContext} items={items}>
      <PaginatedView {...props} itemCount={items?.length}>
        <ViewAutoSizer
          items={items}
          size={size}
          loading={props.loading}
          itemsPerPage={props.itemsPerPage}
          itemRender={itemRender}
          dynamicRowHeight={dynamicRowHeight}
          onItemKey={onItemKey}
          disableWindowScroll={disableWindowScroll}
          view={CardViewGrid}
        />
      </PaginatedView>
    </ViewBase>
  );
}
