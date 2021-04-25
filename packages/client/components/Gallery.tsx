import { Button, Icon } from 'semantic-ui-react';
import { useCallback } from 'react';
import {
  ReadingIconLabel,
  UnreadIconLabel,
  ReadLaterIconLabel,
  ItemCardImageContent,
  ItemCardImageContentItem,
  InboxIconLabel,
  ItemLabel,
  ItemCard,
  ItemCardContent,
  ItemCardImage,
  HeartIconLabel,
  TranslucentLabel,
  ItemMenuLabelItem,
  ItemMenuLabel,
  ProgressLabel,
} from './Item';
import t from '../misc/lang';
import { ItemSize } from '../misc/types';

function ReadButton() {
  return (
    <Button primary size="tiny">
      <Icon name="envelope open outline" />
      {t`Read`}
    </Button>
  );
}

function SaveForLaterButton() {
  return (
    <Button size="tiny">
      <Icon name="bookmark outline" />
      {t`Save for later`}
    </Button>
  );
}

function GalleryMenuItems() {
  return (
    <>
      <ItemMenuLabelItem icon="envelope open outline">{t`Read`}</ItemMenuLabelItem>
      <ItemMenuLabelItem icon="play">{t`Continue reading`}</ItemMenuLabelItem>
    </>
  );
}

function GalleryCardMenu() {
  return (
    <ItemMenuLabel>
      <ItemMenuLabelItem icon="envelope open outline">{t`Read`}</ItemMenuLabelItem>
      <ItemMenuLabelItem icon="play">{t`Continue reading`}</ItemMenuLabelItem>
    </ItemMenuLabel>
  );
}

export function GalleryCard({ size, data }: { size?: ItemSize; data: any }) {
  return (
    <ItemCard
      centered
      link
      size={size}
      labels={[
        <ItemLabel x="left" y="top">
          <HeartIconLabel />
          <ProgressLabel />
        </ItemLabel>,
        <ItemLabel x="right" y="top">
          <InboxIconLabel />
          <ReadingIconLabel />
          <UnreadIconLabel />
          <ReadLaterIconLabel />
        </ItemLabel>,
        <ItemLabel x="right" y="bottom">
          <TranslucentLabel circular>{23}</TranslucentLabel>
          <GalleryCardMenu />
        </ItemLabel>,
      ]}
      image={useCallback(
        () => (
          <ItemCardImage>
            <ItemCardImageContent>
              <ItemCardImageContentItem>
                <ReadButton />
              </ItemCardImageContentItem>
              <ItemCardImageContentItem>
                <SaveForLaterButton />
              </ItemCardImageContentItem>
            </ItemCardImageContent>
          </ItemCardImage>
        ),
        []
      )}>
      <ItemCardContent
        title={data?.title ?? ''}
        subtitle={[data?.artist].map((a) => (
          <span>{a}</span>
        ))}
      />
    </ItemCard>
  );
}

export default GalleryCard;
