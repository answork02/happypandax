import classNames from 'classnames';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Divider, Popup, Segment } from 'semantic-ui-react';

import { ItemType } from '../../misc/enums';
import t from '../../misc/lang';
import {
  FieldPath,
  ItemSize,
  ServerGallery,
  ServerGrouping,
} from '../../misc/types';
import { maskText } from '../../misc/utility';
import { AppState } from '../../state';
import { FavoriteLabel, GalleryCountLabel } from '../dataview/Common';
import GroupingDataTable from '../dataview/GroupingData';
import CardView from '../view/CardView';
import ListView from '../view/ListView';
import {
  ActivityLabel,
  ItemCard,
  ItemCardImage,
  ItemLabel,
  ItemMenuLabel,
  ItemMenuLabelItem,
} from './';
import GalleryCard, { galleryCardDataFields } from './Gallery';
import {
  AddToQueueButton,
  InboxIconLabel,
  ItemCardActionContent,
  ItemCardActionContentItem,
  ItemCardContent,
  QueueIconLabel,
  TranslucentLabel,
} from './index';

export type GroupingCardData = DeepPick<
  ServerGrouping,
  'id' | 'name' | 'profile' | 'gallery_count' | 'galleries'
>;

export const groupingCardDataFields: FieldPath<ServerGrouping>[] = [
  'name',
  'profile',
  'gallery_count',
  ...(galleryCardDataFields.map((f) => 'galleries.' + f) as any),
];

function GroupingMenu({}: { hasProgress: boolean; read: boolean }) {
  return (
    <ItemMenuLabel>
      <ItemMenuLabelItem icon="plus">{t`Add to queue`}</ItemMenuLabelItem>
      <ItemMenuLabelItem icon="pencil">{t`Edit`}</ItemMenuLabelItem>
      <ItemMenuLabelItem icon="trash">{t`Delete`}</ItemMenuLabelItem>
    </ItemMenuLabel>
  );
}

function GroupingContent({
  data,
  horizontal,
}: {
  data: GroupingCardData;
  horizontal?: boolean;
}) {
  const onItemKey = useCallback((item: ServerGallery) => item.id, []);

  const View = horizontal ? ListView : CardView;

  return (
    <Segment basic>
      <GroupingDataTable data={data} className="no-margins" />
      <Divider />
      <View
        dynamicRowHeight
        className="no-padding-segment"
        items={data?.galleries}
        size={horizontal ? 'tiny' : 'small'}
        onItemKey={onItemKey}
        itemRender={GalleryCard}
      />
    </Segment>
  );
}

export function GroupingCard({
  size,
  data,
  fluid,
  draggable,
  disableModal,
  actionContent,
  horizontal,
}: {
  size?: ItemSize;
  data: GroupingCardData;
  fluid?: boolean;
  draggable?: boolean;
  actionContent?: React.ComponentProps<typeof ItemCard>['actionContent'];

  disableModal?: boolean;
  horizontal?: boolean;
}) {
  const blur = useRecoilValue(AppState.blur);
  const readingQueue = useRecoilValue(AppState.readingQueue);

  const is_series = (data?.gallery_count ?? 0) > 1;

  const is_gallery = !is_series && data?.galleries?.[0];

  const actions = useCallback(
    () => (
      <ItemCardActionContent>
        {(horizontal ||
          !(['tiny', 'small', 'mini'] as ItemSize[]).includes(size)) && (
          <ItemCardActionContentItem>
            <AddToQueueButton itemType={ItemType.Grouping} data={data} />
          </ItemCardActionContentItem>
        )}
      </ItemCardActionContent>
    ),
    [data, size, horizontal]
  );

  const labels = useMemo(
    () =>
      is_gallery
        ? []
        : [
            <ItemLabel key="fav" x="left" y="top">
              <FavoriteLabel
                defaultRating={
                  data?.galleries?.every((d) => d?.metatags?.favorite) ? 1 : 0
                }
              />
            </ItemLabel>,
            <ItemLabel key="icons" x="right" y="top">
              {data?.galleries?.every?.((g) => readingQueue.includes(g.id)) && (
                <QueueIconLabel />
              )}
              {!!data?.galleries?.every((d) => d?.metatags?.inbox) && (
                <InboxIconLabel />
              )}
              <ActivityLabel />
            </ItemLabel>,
            <ItemLabel key="menu" x="right" y="bottom">
              {horizontal && (
                <GalleryCountLabel as={TranslucentLabel}>
                  {data?.gallery_count}
                </GalleryCountLabel>
              )}
              {!horizontal && (
                <TranslucentLabel circular>
                  {data?.gallery_count}
                </TranslucentLabel>
              )}
              <GroupingMenu />
            </ItemLabel>,
          ],
    [horizontal, data, readingQueue]
  );

  const image = useCallback(
    ({ children }: { children?: React.ReactNode }) => (
      <ItemCardImage src={data?.profile}>{children}</ItemCardImage>
    ),
    [data.profile]
  );

  if (is_gallery) {
    return (
      <GalleryCard
        size={size}
        data={data.galleries[0]}
        fluid={fluid}
        draggable={draggable}
        disableModal={disableModal}
        horizontal={horizontal}
      />
    );
  }

  const artists = _.sortedUniqBy(
    data?.galleries?.flatMap?.((g) => g?.artists ?? []) ?? [],
    (a) => a?.preferred_name?.name?.toLowerCase()
  );

  return (
    <Popup
      on="click"
      flowing
      as={Segment}
      color="teal"
      wide="very"
      position="bottom left"
      className="no-padding-segment modal"
      trigger={
        <ItemCard
          type={ItemType.Grouping}
          dragData={data}
          draggable={false}
          centered
          className={classNames({
            stacked: is_series,
            teal: is_series,
          })}
          link
          fluid={fluid}
          horizontal={horizontal}
          size={size}
          disableModal={true}
          actionContent={actionContent ?? actions}
          labels={labels}
          image={image}>
          <ItemCardContent
            title={data?.name ?? ''}
            subtitle={artists.map((a) => (
              <span key={a.id}>
                {blur ? maskText(a.preferred_name.name) : a.preferred_name.name}
              </span>
            ))}></ItemCardContent>
        </ItemCard>
      }>
      <GroupingContent horizontal={horizontal} data={data} />
    </Popup>
  );
}

export default GroupingCard;
