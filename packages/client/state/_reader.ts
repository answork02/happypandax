import { ImageSize, ItemFit, ReadingDirection } from '../misc/enums';
import { ReaderData } from '../misc/types';
import StateBlock, { defineAtom } from './_base';
import { cookieEffect, localStorageEffect } from './_statehelpers';

export default class _ReaderState extends StateBlock {
  static fit = defineAtom(
    {
      default: ItemFit.Auto,
      effects_UNSTABLE: [localStorageEffect('reader_fit')],
    },
    true
  );

  static page = defineAtom({ default: undefined as ReaderData }, true);

  static pageNumber = defineAtom({ default: 1 }, true);

  static pageCount = defineAtom({ default: 0 }, true);

  static endReached = defineAtom({ default: false }, true);

  static scaling = defineAtom(
    {
      default: 0 as ImageSize,
      effects_UNSTABLE: [localStorageEffect('reader_scaling')],
    },
    true
  );

  static autoNavigateInterval = defineAtom(
    {
      default: 20,
      effects_UNSTABLE: [localStorageEffect('reader_navigate_interval')],
    },
    true
  );

  static autoNavigateCounter = defineAtom({ default: 0 }, true);

  static autoReadNextCountdown = defineAtom(
    {
      default: 15,
      effects_UNSTABLE: [localStorageEffect('reader_read_next_countdown')],
    },
    true
  );

  static autoNavigate = defineAtom(
    {
      default: false,
      effects_UNSTABLE: [localStorageEffect('reader_autonavigate')],
    },
    true
  );

  static stretchFit = defineAtom(
    {
      default: false,
      effects_UNSTABLE: [localStorageEffect('reader_stretch_fit')],
    },
    true
  );

  static wheelZoom = defineAtom(
    { default: false, effects_UNSTABLE: [localStorageEffect('reader_zoom')] },
    true
  );

  static direction = defineAtom(
    {
      default: ReadingDirection.TopToBottom,
      effects_UNSTABLE: [localStorageEffect('reader_direction')],
    },
    true
  );

  static collectionCategories = defineAtom({
    default: [] as string[],
    effects_UNSTABLE: [
      localStorageEffect('collection_categories'),
      cookieEffect('collection_categories'),
    ],
  });

  static pageInfoOpen = defineAtom(
    {
      default: false,
    },
    true
  );
}
